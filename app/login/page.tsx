"use client";

import { login } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (error && !toastShownRef.current) {
      toast.error(error);
      toastShownRef.current = true;

      // Clean up the URL to prevent double toasts on refresh/strict mode
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      router.replace(`/login?${newParams.toString()}`);
    }
  }, [error, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[var(--color-background-dark)]">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gradient">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Sign in to track your wealth
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-lg border-0 bg-white/5 py-3 px-4 text-[var(--color-text-primary)] ring-1 ring-inset ring-white/10 placeholder:text-[var(--color-text-muted)] focus:z-10 focus:ring-2 focus:ring-[var(--color-brand-primary)] sm:text-sm sm:leading-6 backdrop-blur-md transition-all duration-200"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-lg border-0 bg-white/5 py-3 px-4 text-[var(--color-text-primary)] ring-1 ring-inset ring-white/10 placeholder:text-[var(--color-text-muted)] focus:z-10 focus:ring-2 focus:ring-[var(--color-brand-primary)] sm:text-sm sm:leading-6 backdrop-blur-md transition-all duration-200"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              formAction={login}
              className="group relative flex w-full justify-center rounded-lg bg-[var(--color-brand-primary)] py-3 px-4 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)] transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
            >
              Sign in
            </button>
          </div>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)] transition-colors"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
