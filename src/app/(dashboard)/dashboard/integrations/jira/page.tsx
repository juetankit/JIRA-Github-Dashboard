import {
  BarChart3,
  Clock,
  KanbanSquare,
  Ticket,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  {
    label: "Open Issues",
    value: "47",
    description: "Across connected projects",
    icon: Ticket,
  },
  {
    label: "In Progress",
    value: "12",
    description: "Currently being worked on",
    icon: KanbanSquare,
  },
  {
    label: "Sprint Velocity",
    value: "38 pts",
    description: "Average over the last 3 sprints",
    icon: TrendingUp,
  },
  {
    label: "Avg. Cycle Time",
    value: "3.2 days",
    description: "From in progress to done",
    icon: Clock,
  },
];

export default function JiraIntegrationPage() {
  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Jira
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Issue tracking and sprint activity from your connected Jira site.
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
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
              <KanbanSquare className="size-5 text-indigo-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">
                Connect your Jira site
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Link a Jira Cloud site to see issues, sprints, and cycle time
                here.
              </p>
            </div>
          </div>

          <Button className="w-full sm:w-auto">Connect Jira</Button>
        </CardContent>
      </Card>

      {/* Activity placeholder */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div>
            <h2 className="font-semibold text-slate-950">
              Sprint activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your Jira issue activity will appear here.
            </p>
          </div>

          <div className="mt-6 flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <BarChart3 className="mx-auto size-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-500">
                Issue burndown
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Connect Jira to start seeing data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
