import Link from "next/link";

type AppLogoProps = {
  variant?: "dark" | "light";
  size?: "default" | "lg";
};

export function AppLogo({ variant = "dark", size = "default" }: AppLogoProps) {
  const isLarge = size === "lg";

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 font-bold tracking-tight"
    >
      <span
        className={`flex items-center justify-center rounded-lg bg-indigo-600 font-bold text-white ${
          isLarge ? "size-11 text-lg" : "size-8 text-sm"
        }`}
      >
        O
      </span>

      <span
        className={`${isLarge ? "text-2xl" : "text-base"} ${
          variant === "light" ? "text-white" : "text-slate-900"
        }`}
      >
        Orbit
      </span>
    </Link>
  );
}