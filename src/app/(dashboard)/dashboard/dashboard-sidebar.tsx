"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  GitPullRequest,
  LayoutDashboard,
  Settings,
  Ticket,
  TrendingUp,
  GitBranch,
  CircleDot,
} from "lucide-react";


import { AppLogo } from "@/components/layout/app-logo";
import { Separator } from "@/components/ui/separator";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Engineering",
    items: [
      {
        label: "Pull Requests",
        href: "/dashboard/pull-requests",
        icon: GitPullRequest,
      },
      {
        label: "Issues",
        href: "/dashboard/issues",
        icon: Ticket,
      },
      {
        label: "Productivity",
        href: "/dashboard/productivity",
        icon: TrendingUp,
      },
    ],
  },
  {
    label: "Integrations",
    items: [
      {
        label: "GitHub",
        href: "/dashboard/integrations/github",
        icon: GitBranch,
      },
      {
        label: "Jira",
        href: "/dashboard/integrations/jira",
        icon: CircleDot,
      },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <AppLogo />
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
        {navigation.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section.label}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <Icon className="size-4" />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-200 p-3">
        <Link
          href="/dashboard/settings"
          className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Settings className="size-4" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}