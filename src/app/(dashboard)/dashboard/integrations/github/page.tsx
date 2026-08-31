import { eq } from "drizzle-orm";
import {
  BarChart3,
  CircleAlert,
  CircleCheck,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
} from "lucide-react";
import { headers } from "next/headers";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { CommitActivityChart } from "@/features/github/components/commit-activity-chart";
import { OpenPrAgeChart } from "@/features/github/components/open-pr-age-chart";
import { PrCycleTimeChart } from "@/features/github/components/pr-cycle-time-chart";
import { PullRequestActivityChart } from "@/features/github/components/pull-request-activity-chart";
import { RepoActivityChart } from "@/features/github/components/repo-activity-chart";
import {
  getGithubDashboardMetrics,
  type GithubDashboardMetrics,
} from "@/features/github/lib/queries";
import { getCurrentOrganizationForUser } from "@/server/db/queries/organizations";
import { db } from "@/server/db";
import { githubIntegrations } from "@/server/db/schema";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_state: "That connection request expired or couldn't be verified. Please try again.",
  no_organization: "We couldn't find a workspace for your account.",
  not_configured: "GitHub integration isn't configured yet.",
  missing_installation: "GitHub didn't send back an installation to connect.",
};

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="mt-6 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
      <div className="text-center">
        <BarChart3 className="mx-auto size-8 text-slate-300" />
        <p className="mt-3 text-xs text-slate-400">{message}</p>
      </div>
    </div>
  );
}

export default async function GithubIntegrationPage({
  searchParams,
}: {
  searchParams: Promise<{
    connected?: string;
    disconnected?: string;
    pending?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organization = session
    ? await getCurrentOrganizationForUser(session.user.id)
    : null;

  const [integration] = organization
    ? await db
        .select()
        .from(githubIntegrations)
        .where(eq(githubIntegrations.organizationId, organization.id))
        .limit(1)
    : [];

  let dashboardMetrics: GithubDashboardMetrics | null = null;
  let metricsLoadFailed = false;

  if (integration) {
    try {
      dashboardMetrics = await getGithubDashboardMetrics(
        integration.githubInstallationId,
      );
    } catch {
      metricsLoadFailed = true;
    }
  }

  const metrics = [
    {
      label: "Open Pull Requests",
      value: dashboardMetrics ? String(dashboardMetrics.openPRCount) : "—",
      description: "Across connected repositories",
      icon: GitPullRequest,
    },
    {
      label: "Merged This Week",
      value: dashboardMetrics ? String(dashboardMetrics.mergedThisWeek) : "—",
      description: "Pull requests merged",
      icon: GitMerge,
    },
    {
      label: "Commits",
      value: dashboardMetrics ? String(dashboardMetrics.commitCount30d) : "—",
      description: "During the last 30 days",
      icon: GitCommit,
    },
    {
      label: "Review Rate",
      value:
        dashboardMetrics?.reviewRatePct != null
          ? `${dashboardMetrics.reviewRatePct}%`
          : "—",
      description: "Pull requests reviewed",
      icon: BarChart3,
    },
  ];

  const errorMessage = params.error
    ? ERROR_MESSAGES[params.error] ?? "Something went wrong connecting GitHub."
    : null;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          GitHub
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Pull request and commit activity from your connected repositories.
        </p>
      </div>

      {/* Status banners */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert className="size-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      {params.connected && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CircleCheck className="size-4 shrink-0" />
          GitHub connected successfully.
        </div>
      )}

      {params.disconnected && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <CircleCheck className="size-4 shrink-0" />
          GitHub disconnected.
        </div>
      )}

      {params.pending && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          <CircleAlert className="size-4 shrink-0" />
          Installation requested — an organization admin needs to approve it on GitHub.
        </div>
      )}

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card
              key={metric.label}
              className="border-slate-200 shadow-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {metric.label}
                    </p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                      {metric.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {metric.description}
                    </p>
                  </div>

                  <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50">
                    <Icon className="size-5 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connection status */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-900">
              <GitBranch className="size-5 text-white" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">
                {integration
                  ? `Connected as ${integration.githubAccountLogin}`
                  : "Connect your GitHub account"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {integration
                  ? "Orbit can read pull requests, commits, and reviews from this installation."
                  : "Install the GitHub App to see pull requests, commits, and reviews here."}
              </p>
            </div>
          </div>

          {integration ? (
            <form
              action="/api/integrations/github/disconnect"
              method="post"
            >
              <Button type="submit" variant="outline" className="w-full sm:w-auto">
                Disconnect
              </Button>
            </form>
          ) : (
            <a
              href="/api/integrations/github/install"
              className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}
            >
              Connect GitHub
            </a>
          )}
        </CardContent>
      </Card>

      {/* Activity */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div>
            <h2 className="font-semibold text-slate-950">
              Pull request activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Opened and merged pull requests over the last 14 days.
            </p>
          </div>

          {integration && dashboardMetrics?.hasActivity ? (
            <div className="mt-6">
              <PullRequestActivityChart data={dashboardMetrics.activity} />
            </div>
          ) : (
            <div className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <div className="text-center">
                <BarChart3 className="mx-auto size-8 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-500">
                  Pull request activity
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {!integration
                    ? "Connect GitHub to start seeing data."
                    : metricsLoadFailed
                      ? "Couldn't load live activity right now. Try refreshing the page."
                      : "No pull request activity in the last 14 days."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commit activity + Activity by repository */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div>
              <h2 className="font-semibold text-slate-950">Commit activity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Commits per day over the last 14 days.
              </p>
            </div>

            {integration && dashboardMetrics?.hasCommitActivity ? (
              <div className="mt-6">
                <CommitActivityChart data={dashboardMetrics.commitActivity} />
              </div>
            ) : (
              <ChartEmptyState
                message={
                  !integration
                    ? "Connect GitHub to start seeing data."
                    : metricsLoadFailed
                      ? "Couldn't load live activity right now."
                      : "No commits in the last 14 days."
                }
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div>
              <h2 className="font-semibold text-slate-950">
                Activity by repository
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Pull requests and commits, last 30 days.
              </p>
            </div>

            {integration &&
            dashboardMetrics &&
            dashboardMetrics.repoActivity.length > 0 ? (
              <div className="mt-6">
                <RepoActivityChart data={dashboardMetrics.repoActivity} />
              </div>
            ) : (
              <ChartEmptyState
                message={
                  !integration
                    ? "Connect GitHub to start seeing data."
                    : metricsLoadFailed
                      ? "Couldn't load live activity right now."
                      : "No repository activity in the last 30 days."
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* PR cycle time + Open PR age */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div>
              <h2 className="font-semibold text-slate-950">PR cycle time</h2>
              <p className="mt-1 text-sm text-slate-500">
                Time from opened to merged, last 30 days.
              </p>
            </div>

            {integration &&
            dashboardMetrics &&
            dashboardMetrics.cycleTimeSamples.length > 0 ? (
              <div className="mt-6">
                <PrCycleTimeChart
                  samples={dashboardMetrics.cycleTimeSamples}
                  medianHours={dashboardMetrics.medianCycleTimeHours}
                />
              </div>
            ) : (
              <ChartEmptyState
                message={
                  !integration
                    ? "Connect GitHub to start seeing data."
                    : metricsLoadFailed
                      ? "Couldn't load live activity right now."
                      : "No pull requests merged in the last 30 days."
                }
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div>
              <h2 className="font-semibold text-slate-950">Open PR age</h2>
              <p className="mt-1 text-sm text-slate-500">
                How long currently open pull requests have been waiting.
              </p>
            </div>

            {integration &&
            dashboardMetrics &&
            dashboardMetrics.openPRAges.length > 0 ? (
              <div className="mt-6">
                <OpenPrAgeChart data={dashboardMetrics.openPRAges} />
              </div>
            ) : (
              <ChartEmptyState
                message={
                  !integration
                    ? "Connect GitHub to start seeing data."
                    : metricsLoadFailed
                      ? "Couldn't load live activity right now."
                      : "No open pull requests right now."
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
