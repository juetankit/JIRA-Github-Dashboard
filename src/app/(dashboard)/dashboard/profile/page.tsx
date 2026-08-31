import { Monitor, Smartphone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { headers } from "next/headers";

const sessions = [
  {
    device: "Chrome on Windows",
    location: "Pune, IN",
    status: "Active now",
    active: true,
    icon: Monitor,
  },
  {
    device: "Safari on iPhone",
    location: "Pune, IN",
    status: "Last active 2 days ago",
    active: false,
    icon: Smartphone,
  },
];

export default async function ProfilePage() {

  const session = await auth.api.getSession({
    headers: await headers()
  });

  const {name, email} = session?.user || {name: "", email: ""};
  
  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your personal account information.
        </p>
      </div>

      {/* Personal information */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold text-slate-950">
            Personal information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            This information is visible to other members of your
            organization.
          </p>

          <Separator className="my-6" />

          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-indigo-100 text-indigo-700">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            <Button variant="outline" size="sm">
              Change avatar
            </Button>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" defaultValue={name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={email}
                disabled
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold text-slate-950">Security</h2>

          <p className="mt-1 text-sm text-slate-500">
            Update your password to keep your account secure.
          </p>

          <Separator className="my-6" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input id="current-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button>Update password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Active sessions */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold text-slate-950">Active sessions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Devices currently signed in to your account.
          </p>

          <Separator className="my-6" />

          <div className="space-y-4">
            {sessions.map((session) => {
              const Icon = session.icon;

              return (
                <div
                  key={session.device}
                  className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="size-5 text-slate-600" />
                    </div>

                    <div>
                      <p className="font-medium text-slate-950">
                        {session.device}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                        <span
                          className={`size-1.5 rounded-full ${session.active ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                        />
                        {session.location} · {session.status}
                      </p>
                    </div>
                  </div>

                  {!session.active && (
                    <Button variant="outline" className="w-full sm:w-auto">
                      Sign out
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
