import {
  BarChart3,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  {
    label: "Open Pull Requests",
    value: "24",
    description: "Across connected repositories",
    icon: GitPullRequest,
  },
  {
    label: "Merged This Week",
    value: "15",
    description: "Pull requests merged",
    icon: GitMerge,
  },
  {
    label: "Commits",
    value: "138",
    description: "During the last 30 days",
    icon: GitCommit,
  },
  {
    label: "Review Rate",
    value: "87%",
    description: "Pull requests reviewed",
    icon: BarChart3,
  },
];

export default function GithubIntegrationPage() {
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
                Connect your GitHub account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Install the GitHub App to see pull requests, commits, and
                reviews here.
              </p>
            </div>
          </div>

          <Button className="w-full sm:w-auto">Connect GitHub</Button>
        </CardContent>
      </Card>

      {/* Activity placeholder */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div>
            <h2 className="font-semibold text-slate-950">
              Repository activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your GitHub pull request and commit activity will appear here.
            </p>
          </div>

          <div className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <BarChart3 className="mx-auto size-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-500">
                Pull request activity
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Connect GitHub to start seeing data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
