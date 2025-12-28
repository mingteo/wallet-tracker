"use client";

import { signup } from "../login/actions";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Suspense } from "react";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const toastShownRef = useRef(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (error && !toastShownRef.current) {
      toast.error(error);
      toastShownRef.current = true;

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      router.replace(`/register?${newParams.toString()}`);
    }
  }, [error, router, searchParams]);

  const handleSubmit = (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;
    const fullName = formData.get("full_name") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!fullName) {
      toast.error("Full Name is required");
      return;
    }

    startTransition(() => {
      signup(formData);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[var(--color-background-dark)]">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gradient">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Start tracking your finance today
          </p>
        </div>

        <form action={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="full-name" className="sr-only">
                Full Name
              </label>
              <input
                id="full-name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                className="relative block w-full rounded-lg border-0 bg-white/5 py-3 px-4 text-[var(--color-text-primary)] ring-1 ring-inset ring-white/10 placeholder:text-[var(--color-text-muted)] focus:z-10 focus:ring-2 focus:ring-[var(--color-brand-primary)] sm:text-sm sm:leading-6 backdrop-blur-md transition-all duration-200"
                placeholder="Full Name"
              />
            </div>
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
                autoComplete="new-password"
                required
                className="relative block w-full rounded-lg border-0 bg-white/5 py-3 px-4 text-[var(--color-text-primary)] ring-1 ring-inset ring-white/10 placeholder:text-[var(--color-text-muted)] focus:z-10 focus:ring-2 focus:ring-[var(--color-brand-primary)] sm:text-sm sm:leading-6 backdrop-blur-md transition-all duration-200"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-lg border-0 bg-white/5 py-3 px-4 text-[var(--color-text-primary)] ring-1 ring-inset ring-white/10 placeholder:text-[var(--color-text-muted)] focus:z-10 focus:ring-2 focus:ring-[var(--color-brand-primary)] sm:text-sm sm:leading-6 backdrop-blur-md transition-all duration-200"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-lg bg-[var(--color-brand-primary)] py-3 px-4 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)] transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating Account..." : "Sign up"}
            </button>
          </div>

          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
