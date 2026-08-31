import { getInstallationOctokit } from "./app";

export type ActivityDay = {
  date: string;
  opened: number;
  merged: number;
};

export type CommitDay = {
  date: string;
  count: number;
};

export type RepoActivity = {
  repo: string;
  prCount: number;
  commitCount: number;
  total: number;
};

export type CycleTimeSample = {
  label: string;
  hours: number;
};

export type OpenPRAge = {
  label: string;
  repo: string;
  days: number;
};

export type GithubDashboardMetrics = {
  openPRCount: number;
  mergedThisWeek: number;
  commitCount30d: number;
  reviewRatePct: number | null;
  activity: ActivityDay[];
  hasActivity: boolean;
  commitActivity: CommitDay[];
  hasCommitActivity: boolean;
  repoActivity: RepoActivity[];
  cycleTimeSamples: CycleTimeSample[];
  medianCycleTimeHours: number | null;
  openPRAges: OpenPRAge[];
};

const CACHE_TTL_MS = 2 * 60 * 1000;
const ACTIVITY_WINDOW_DAYS = 14;
const COMMIT_WINDOW_DAYS = 30;
const REVIEW_SAMPLE_LIMIT = 20;
const REPO_ACTIVITY_TOP_N = 6;
const CYCLE_TIME_SAMPLE_LIMIT = 10;
const OPEN_PR_AGE_LIMIT = 15;

const cache = new Map<string, { expiresAt: number; data: GithubDashboardMetrics }>();

function daysAgo(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

function toDateKey(iso: string) {
  return iso.slice(0, 10);
}

function median(values: number[]) {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export async function getGithubDashboardMetrics(
  installationId: string,
): Promise<GithubDashboardMetrics> {
  const cached = cache.get(installationId);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const octokit = await getInstallationOctokit(Number(installationId));

  const { data: repoData } =
    await octokit.rest.apps.listReposAccessibleToInstallation({
      per_page: 100,
    });

  const since30d = daysAgo(COMMIT_WINDOW_DAYS).toISOString();

  const perRepo = await Promise.all(
    repoData.repositories.map(async (repo) => {
      const owner = repo.owner.login;
      const name = repo.name;

      const [openPrs, closedPrs, commits] = await Promise.all([
        octokit.rest.pulls
          .list({ owner, repo: name, state: "open", per_page: 100 })
          .then((res) => res.data),
        octokit.rest.pulls
          .list({
            owner,
            repo: name,
            state: "closed",
            per_page: 100,
            sort: "updated",
            direction: "desc",
          })
          .then((res) => res.data),
        octokit.rest.repos
          .listCommits({ owner, repo: name, since: since30d, per_page: 100 })
          .then((res) => res.data)
          .catch((error: unknown) => {
            const status = (error as { status?: number } | undefined)?.status;

            // A brand-new repo with no commits yet — treat as zero, not an error.
            if (status === 409) {
              return [];
            }

            throw error;
          }),
      ]);

      return { owner, name, openPrs, closedPrs, commits };
    }),
  );

  const openPRCount = perRepo.reduce((sum, repo) => sum + repo.openPrs.length, 0);
  const commitCount30d = perRepo.reduce((sum, repo) => sum + repo.commits.length, 0);

  const sevenDaysAgo = daysAgo(7);
  const mergedThisWeek = perRepo.reduce(
    (sum, repo) =>
      sum +
      repo.closedPrs.filter(
        (pr) => pr.merged_at && new Date(pr.merged_at) >= sevenDaysAgo,
      ).length,
    0,
  );

  // Pull-request activity (opened / merged), last 14 days
  const activityMap = new Map<string, ActivityDay>();
  const windowStart = daysAgo(ACTIVITY_WINDOW_DAYS - 1);
  windowStart.setUTCHours(0, 0, 0, 0);

  for (let i = 0; i < ACTIVITY_WINDOW_DAYS; i++) {
    const date = new Date(windowStart);
    date.setUTCDate(date.getUTCDate() + i);
    const key = toDateKey(date.toISOString());
    activityMap.set(key, { date: key, opened: 0, merged: 0 });
  }

  // Commit activity, same 14-day window
  const commitActivityMap = new Map<string, CommitDay>();
  for (const key of activityMap.keys()) {
    commitActivityMap.set(key, { date: key, count: 0 });
  }

  for (const repo of perRepo) {
    for (const pr of [...repo.openPrs, ...repo.closedPrs]) {
      if (pr.created_at) {
        const entry = activityMap.get(toDateKey(pr.created_at));
        if (entry) entry.opened += 1;
      }

      if (pr.merged_at) {
        const entry = activityMap.get(toDateKey(pr.merged_at));
        if (entry) entry.merged += 1;
      }
    }

    for (const commit of repo.commits) {
      const commitDate =
        commit.commit.author?.date ?? commit.commit.committer?.date;
      if (!commitDate) continue;

      const entry = commitActivityMap.get(toDateKey(commitDate));
      if (entry) entry.count += 1;
    }
  }

  const activity = Array.from(activityMap.values());
  const hasActivity = activity.some((day) => day.opened > 0 || day.merged > 0);

  const commitActivity = Array.from(commitActivityMap.values());
  const hasCommitActivity = commitActivity.some((day) => day.count > 0);

  // Activity by repository — recent PRs + 30-day commits, ranked, top N + "Other"
  const repoActivityAll = perRepo
    .map((repo) => {
      const prCount = repo.openPrs.length + repo.closedPrs.length;
      const commitCount = repo.commits.length;
      return {
        repo: repo.name,
        prCount,
        commitCount,
        total: prCount + commitCount,
      };
    })
    .filter((entry) => entry.total > 0)
    .sort((a, b) => b.total - a.total);

  const repoActivity: RepoActivity[] = repoActivityAll.slice(0, REPO_ACTIVITY_TOP_N);
  const overflow = repoActivityAll.slice(REPO_ACTIVITY_TOP_N);

  if (overflow.length > 0) {
    repoActivity.push({
      repo: "Other",
      prCount: overflow.reduce((sum, r) => sum + r.prCount, 0),
      commitCount: overflow.reduce((sum, r) => sum + r.commitCount, 0),
      total: overflow.reduce((sum, r) => sum + r.total, 0),
    });
  }

  // PR cycle time — most recently merged PRs in the last 30 days
  const thirtyDaysAgo = daysAgo(COMMIT_WINDOW_DAYS);

  const cycleTimeSamples: CycleTimeSample[] = perRepo
    .flatMap((repo) => repo.closedPrs)
    .filter(
      (pr) =>
        pr.merged_at &&
        pr.created_at &&
        new Date(pr.merged_at) >= thirtyDaysAgo,
    )
    .sort(
      (a, b) =>
        new Date(b.merged_at as string).getTime() -
        new Date(a.merged_at as string).getTime(),
    )
    .slice(0, CYCLE_TIME_SAMPLE_LIMIT)
    .map((pr) => ({
      label: `#${pr.number}`,
      hours:
        (new Date(pr.merged_at as string).getTime() -
          new Date(pr.created_at).getTime()) /
        3_600_000,
    }));

  const medianCycleTimeHours = median(cycleTimeSamples.map((s) => s.hours));

  // Open PR age — oldest currently-open PRs first, flags staleness
  const now = Date.now();
  const openPRAges: OpenPRAge[] = perRepo
    .flatMap((repo) =>
      repo.openPrs.map((pr) => ({
        label: `#${pr.number}`,
        repo: repo.name,
        days: (now - new Date(pr.created_at).getTime()) / 86_400_000,
      })),
    )
    .sort((a, b) => b.days - a.days)
    .slice(0, OPEN_PR_AGE_LIMIT);

  // Review rate sample (reuses the closed-PR lists already fetched above)
  const reviewSample = perRepo
    .flatMap((repo) =>
      repo.closedPrs.map((pr) => ({ owner: repo.owner, repo: repo.name, pr })),
    )
    .filter(
      ({ pr }) => pr.closed_at && new Date(pr.closed_at) >= thirtyDaysAgo,
    )
    .slice(0, REVIEW_SAMPLE_LIMIT);

  let reviewRatePct: number | null = null;

  if (reviewSample.length > 0) {
    const reviewedFlags = await Promise.all(
      reviewSample.map(({ owner, repo, pr }) =>
        octokit.rest.pulls
          .listReviews({ owner, repo, pull_number: pr.number, per_page: 1 })
          .then((res) => res.data.length > 0),
      ),
    );

    const reviewedCount = reviewedFlags.filter(Boolean).length;
    reviewRatePct = Math.round((reviewedCount / reviewSample.length) * 100);
  }

  const result: GithubDashboardMetrics = {
    openPRCount,
    mergedThisWeek,
    commitCount30d,
    reviewRatePct,
    activity,
    hasActivity,
    commitActivity,
    hasCommitActivity,
    repoActivity,
    cycleTimeSamples,
    medianCycleTimeHours,
    openPRAges,
  };

  cache.set(installationId, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    data: result,
  });

  return result;
}
