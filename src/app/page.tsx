import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  GitBranch,
  GitPullRequest,
  LayoutDashboard,
  Plug,
  Sparkles,
  Ticket,
  TrendingUp,
} from "lucide-react";

import { AppLogo } from "@/components/layout/app-logo";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { FloatCard } from "@/components/motion/float-card";

const features = [
  {
    title: "GitHub activity",
    description:
      "Pull requests, commits, and reviews across every connected repository, updated in real time.",
    icon: GitBranch,
  },
  {
    title: "Jira issues",
    description:
      "Sprint velocity, cycle time, and open issues from your Jira Cloud site, without opening Jira.",
    icon: Ticket,
  },
  {
    title: "One dashboard",
    description:
      "Your whole team's engineering activity in a single view, organized by workspace.",
    icon: LayoutDashboard,
  },
];

const steps = [
  {
    title: "Create your workspace",
    description:
      "Sign up and a personal workspace is ready instantly, no setup forms to fill in.",
    icon: Building2,
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Connect GitHub and Jira",
    description:
      "Link your repositories and Jira Cloud site to your workspace in a couple of clicks.",
    icon: Plug,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "See everything in one place",
    description:
      "Pull requests, commits, sprints, and issues, all in a single dashboard.",
    icon: BarChart3,
    gradient: "from-fuchsia-500 to-pink-600",
  },
];

const miniStats = [
  { label: "Open PRs", value: "24", icon: GitPullRequest },
  { label: "Velocity", value: "38 pts", icon: TrendingUp },
  { label: "Open Issues", value: "32", icon: Ticket },
  { label: "Review Rate", value: "87%", icon: BarChart3 },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-700">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-32 size-80 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 size-[28rem] rounded-full border border-white/10" />

        {/* Nav */}
        <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8 lg:px-8">
          <AppLogo variant="light" size="lg" />

          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-base font-medium text-white/90 transition-colors hover:text-white"
            >
              Sign in
            </Link>

            <Button
              render={<Link href="/register" />}
              size="lg"
              className="rounded-full bg-white px-6 text-base text-indigo-700 hover:bg-white/90"
            >
              Get started
            </Button>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 pt-8 pb-20 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:pt-16 lg:pb-28">
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                <Sparkles className="size-3.5" />
                GitHub + Jira, unified
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your engineering work.
                <br />
                Finally in one place.
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-6 max-w-lg text-lg leading-8 text-indigo-50">
                Track pull requests, commits, and sprint issues across your
                whole team, without switching between GitHub and Jira all
                day.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  render={<Link href="/register" />}
                  size="lg"
                  className="h-12 gap-2 rounded-full bg-white px-6 text-base text-indigo-700 hover:bg-white/90"
                >
                  Get started free
                  <ArrowRight className="size-4" />
                </Button>

                <Link
                  href="/login"
                  className="text-sm font-medium text-white underline underline-offset-4 hover:text-indigo-50"
                >
                  Sign in to your workspace
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Floating stat cards */}
          <div className="relative hidden h-72 lg:block">
            <FloatCard
              delay={0.2}
              className="absolute top-0 left-4 w-64 -rotate-6"
            >
              <div className="rounded-2xl bg-white p-5 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50">
                    <GitPullRequest className="size-4.5 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    Open Pull Requests
                  </p>
                </div>
                <p className="mt-4 text-3xl font-semibold text-slate-950">
                  24
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Across connected repositories
                </p>
              </div>
            </FloatCard>

            <FloatCard
              delay={0.35}
              className="absolute top-20 right-0 w-64 rotate-3"
            >
              <div className="rounded-2xl bg-white p-5 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50">
                    <TrendingUp className="size-4.5 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    Sprint Velocity
                  </p>
                </div>
                <p className="mt-4 text-3xl font-semibold text-slate-950">
                  38 pts
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Average over the last 3 sprints
                </p>
              </div>
            </FloatCard>

            <FloatCard
              delay={0.5}
              className="absolute top-48 left-16 w-56 -rotate-3"
            >
              <div className="rounded-2xl bg-white p-5 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50">
                    <Ticket className="size-4.5 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    Open Issues
                  </p>
                </div>
                <p className="mt-4 text-3xl font-semibold text-slate-950">
                  32
                </p>
              </div>
            </FloatCard>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <FadeIn key={feature.title} delay={index * 0.1}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50">
                    <Icon className="size-5 text-indigo-600" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                How it works
              </h2>

              <p className="mt-3 text-slate-500">
                From sign-up to full visibility, in a few minutes.
              </p>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <FadeIn key={step.title} delay={index * 0.15}>
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:text-left">
                    <div className="relative mx-auto w-fit sm:mx-0">
                      <div
                        className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ${step.gradient}`}
                      >
                        <Icon className="size-6 text-white" />
                      </div>

                      <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900 shadow ring-1 ring-slate-900/5">
                        {index + 1}
                      </span>
                    </div>

                    <h3 className="mt-5 font-semibold text-slate-950">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              A dashboard built for engineering teams
            </h2>

            <p className="mt-3 text-slate-500">
              Everything your team ships, tracked automatically.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} y={40} className="mt-14">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-slate-400">
                app.orbit.dev/dashboard
              </span>
            </div>

            <div className="flex">
              {/* Mini sidebar */}
              <div className="hidden w-40 shrink-0 border-r border-slate-100 bg-slate-50 p-4 sm:block">
                <div className="mb-4 h-6 w-20 rounded bg-indigo-200" />

                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-indigo-100" />
                  <div className="h-3 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-5/6 rounded bg-slate-200" />
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                </div>
              </div>

              {/* Mini content */}
              <div className="flex-1 p-6">
                <div className="mb-6 h-4 w-32 rounded bg-slate-200" />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {miniStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-slate-100 p-3"
                      >
                        <Icon className="size-4 text-indigo-600" />

                        <p className="mt-2 text-lg font-semibold text-slate-950">
                          {stat.value}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {/* Bar chart */}
                  <div className="rounded-xl border border-slate-100 p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Weekly activity
                    </p>

                    <div className="mt-4 flex h-20 items-end gap-2">
                      {[40, 65, 45, 80, 55, 30, 70].map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-sm bg-indigo-500/80"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Donut chart */}
                  <div className="rounded-xl border border-slate-100 p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Issue breakdown
                    </p>

                    <div className="mt-3 flex items-center gap-4">
                      <div
                        className="size-16 shrink-0 rounded-full"
                        style={{
                          background:
                            "conic-gradient(#4f46e5 0% 58%, #a855f7 58% 85%, #e2e8f0 85% 100%)",
                        }}
                      >
                        <div className="m-[6px] size-[52px] rounded-full bg-white" />
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 shrink-0 rounded-full bg-indigo-600" />
                          Done · 58%
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="size-2 shrink-0 rounded-full bg-purple-500" />
                          In progress · 27%
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="size-2 shrink-0 rounded-full bg-slate-300" />
                          To do · 15%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Integrations */}
      <section id="integrations" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                Works with the tools you already use
              </h2>

              <p className="mt-3 text-slate-500">
                No new workflows to learn, just the data you already have.
              </p>
            </div>
          </FadeIn>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            <FadeIn x={-40} y={0}>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900">
                  <GitBranch className="size-6 text-white" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-950">
                  GitHub
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Install the GitHub App on your organization and see pull
                  requests, commits, and reviews across every repository you
                  connect.
                </p>
              </div>
            </FadeIn>

            <FadeIn x={40} y={0} delay={0.1}>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-600">
                  <Ticket className="size-6 text-white" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-950">
                  Jira
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Connect a Jira Cloud site and track sprint velocity, cycle
                  time, and open issues without leaving your dashboard.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-6 py-20 text-center lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Ready to see it in action?
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="max-w-md text-slate-500">
              Create your workspace and connect GitHub or Jira in a couple of
              minutes.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Button
              render={<Link href="/register" />}
              size="lg"
              className="h-12 gap-2 rounded-full bg-indigo-600 px-6 text-base hover:bg-indigo-700"
            >
              Get started free
              <ArrowRight className="size-4" />
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <AppLogo variant="light" />

              <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
                Unified engineering visibility across GitHub and Jira, built
                for teams that ship fast.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white">Product</h4>

              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <a
                    href="#features"
                    className="transition-colors hover:text-white"
                  >
                    Features
                  </a>
                </li>

                <li>
                  <a
                    href="#how-it-works"
                    className="transition-colors hover:text-white"
                  >
                    How it works
                  </a>
                </li>

                <li>
                  <a
                    href="#integrations"
                    className="transition-colors hover:text-white"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white">Account</h4>

              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <Link
                    href="/login"
                    className="transition-colors hover:text-white"
                  >
                    Sign in
                  </Link>
                </li>

                <li>
                  <Link
                    href="/register"
                    className="transition-colors hover:text-white"
                  >
                    Get started
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Orbit. All rights reserved.
            </p>

            <p className="text-sm text-slate-500">
              Built for engineering teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
