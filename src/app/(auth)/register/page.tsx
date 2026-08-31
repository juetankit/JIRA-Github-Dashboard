"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { AppLogo } from "@/components/layout/app-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { FadeIn } from "@/components/motion/fade-in";
import { FloatCard } from "@/components/motion/float-card";

const benefits = [
  "Personal workspace created instantly, no setup forms",
  "Connect GitHub and Jira in a couple of clicks",
  "See pull requests, commits, and issues together",
];

const strengthLevels = [
  { label: "Weak", color: "bg-red-500" },
  { label: "Fair", color: "bg-yellow-500" },
  { label: "Good", color: "bg-blue-500" },
  { label: "Strong", color: "bg-emerald-500" },
];

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return { score, ...strengthLevels[Math.max(score - 1, 0)] };
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      setError(error.message ?? "Unable to create account.");
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
              Start tracking in minutes.
            </h2>

            <ul className="mt-6 space-y-4">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-indigo-50"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-white" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FloatCard delay={0.4} className="mt-8 w-60 rotate-3">
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
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Connect your engineering tools and track team productivity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>

              <Input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="John Doe"
              />
            </div>

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
              <Label htmlFor="password">Password</Label>

              <PasswordInput
                id="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />

              {password.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {strengthLevels.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full ${
                          index < strength.score
                            ? strength.color
                            : "bg-slate-100"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-400">
                    {strength.label} · use at least 8 characters
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Use at least 8 characters.
                </p>
              )}
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
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            By creating an account, you agree to our terms of service and
            privacy policy.
          </p>
        </FadeIn>
      </div>
    </main>
  );
}
