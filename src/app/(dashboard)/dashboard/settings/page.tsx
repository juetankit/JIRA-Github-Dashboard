import { AlertTriangle, CircleDot, GitBranch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your organization, integrations, and preferences.
        </p>
      </div>

      {/* Organization */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold text-slate-950">Organization</h2>

          <p className="mt-1 text-sm text-slate-500">
            Basic information about your organization.
          </p>

          <Separator className="my-6" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization name</Label>
              <Input id="org-name" defaultValue="Acme Corp" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-slug">Slug</Label>
              <Input id="org-slug" defaultValue="acme-corp" />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold text-slate-950">Integrations</h2>

          <p className="mt-1 text-sm text-slate-500">
            Connect the tools your team uses every day.
          </p>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-900">
                  <GitBranch className="size-5 text-white" />
                </div>

                <div>
                  <p className="font-medium text-slate-950">GitHub</p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Connected as acme-corp/engineering
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full sm:w-auto">
                Disconnect
              </Button>
            </div>

            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <CircleDot className="size-5 text-indigo-600" />
                </div>

                <div>
                  <p className="font-medium text-slate-950">Jira</p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <span className="size-1.5 rounded-full bg-slate-300" />
                    Not connected
                  </p>
                </div>
              </div>

              <Button className="w-full sm:w-auto">Connect</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="size-5 text-red-600" />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-slate-950">Danger zone</h2>

              <p className="mt-1 text-sm text-slate-500">
                Deleting your organization will remove all members,
                integrations, and data. This action cannot be undone.
              </p>

              <div className="mt-4 flex justify-end">
                <Button variant="destructive">Delete organization</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
