import Link from "next/link";

export function AppLogo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 font-semibold tracking-tight"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
        J×G
      </span>

      <span className="text-slate-900">
        Jira × GitHub
      </span>
    </Link>
  );
}