"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, GitPullRequest } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { AppLogo } from "@/components/layout/app-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { FadeIn } from "@/components/motion/fade-in";
import { FloatCard } from "@/components/motion/float-card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message ?? "Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-700 lg:flex lg:w-2/5 lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-indigo-300/20 blur-3xl" />

        <FadeIn className="relative">
          <AppLogo variant="light" size="lg" />
        </FadeIn>

        <div className="relative">
          <FadeIn delay={0.1}>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Welcome back to your engineering dashboard.
            </h2>

            <p className="mt-4 text-indigo-50">
              Pick up right where you left off, pull requests, sprints, and
              issues, all in one place.
            </p>
          </FadeIn>

          <FloatCard delay={0.3} className="mt-8 w-60 -rotate-3">
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
        </div>

        <FadeIn delay={0.2}>
          <p className="relative text-sm text-indigo-100">
            © {new Date().getFullYear()} Orbit
          </p>
        </FadeIn>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <FadeIn className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <AppLogo />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to your engineering dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="john@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  Forgot password?
                </button>
              </div>

              <PasswordInput
                id="password"
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Create an account
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            By signing in, you agree to our terms of service and privacy
            policy.
          </p>
        </FadeIn>
      </div>
    </main>
  );
}
