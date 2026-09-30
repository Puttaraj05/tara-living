"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Invalid username or password"
        );
      }

      // Authentication cookie is set by FastAPI.
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EEE9DE] p-0 md:p-4 lg:p-5">
      <div className="relative flex min-h-screen overflow-hidden rounded-none bg-[#EEE9DE] md:min-h-[calc(100vh-2rem)] md:rounded-[28px] lg:min-h-[calc(100vh-2.5rem)]">
        
        {/* =====================================================
            LEFT SIDE — INTERIOR IMAGE
        ====================================================== */}

        <section className="relative hidden overflow-hidden lg:flex lg:w-[55%]">
          {/* Interior image */}
          <img
            src="/images/service-2.jpg"
            alt="Tara Living interior"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Warm overlay */}
          <div className="absolute inset-0 bg-[#596653]/30" />

          {/* Soft cream gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#263126]/75 via-transparent to-[#5d6658]/15" />

          {/* Logo */}
          <div className="absolute left-5 top-5 z-20">
            <img
              src="/images/logo2.png"
              alt="Tara Living"
              className="h-auto w-[50px] object-contain "
            />
          </div>

          {/* Decorative circle */}
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/20" />
          <div className="absolute -bottom-16 -left-12 h-52 w-52 rounded-full border border-white/10" />

          {/* Hero copy */}
          <div className="absolute bottom-12 left-10 right-16 z-10 text-white">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#E5E4D6]">
              Tara Living
            </p>

            <h1 className="max-w-[580px] font-serif text-5xl font-medium leading-[1.04] tracking-[-0.03em] xl:text-6xl">
              Spaces that
              <br />
              feel like home.
            </h1>

            <p className="mt-5 max-w-[450px] text-base leading-7 text-white/80">
              Thoughtfully designed interiors shaped around the people,
              stories and moments that make a space yours.
            </p>
          </div>
        </section>

        {/* =====================================================
            RIGHT SIDE — LOGIN
        ====================================================== */}

        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F5F1E8] px-6 py-12 lg:min-h-0 lg:w-[45%] lg:px-12">
          
          {/* Background decorative shapes */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#DCE2D5]/50" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#E5E0D2]/70" />

          <div className="relative z-10 w-full max-w-[430px]">

            {/* Mobile logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <img
                src="/images/logo.png"
                alt="Tara Living"
                className="h-auto w-[165px] object-contain"
              />
            </div>

            {/* Login card */}
            <div className="rounded-[30px] border border-[#DDD8CB] bg-[#FFFDF8]/90 p-7 shadow-[0_25px_70px_rgba(65,72,58,0.12)] backdrop-blur-sm sm:p-9 md:p-10">

              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#87947C]" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7A8572]">
                    Admin Portal
                  </span>
                </div>

                <h2 className="font-serif text-[34px] font-medium leading-tight tracking-[-0.025em] text-[#30372E]">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#7A8076]">
                  Sign in to manage your Tara Living website.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#626B5C]"
                  >
                    Username
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#87917F]">
                      <UserIcon />
                    </div>

                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(event) =>
                        setUsername(event.target.value)
                      }
                      placeholder="Enter your username"
                      autoComplete="username"
                      required
                      className="h-[54px] w-full rounded-[14px] border border-[#DDD9CF] bg-[#F8F6F0] pl-12 pr-4 text-[14px] text-[#30372E] outline-none transition-all placeholder:text-[#A5A69D] hover:border-[#BBC3B4] focus:border-[#87947C] focus:bg-white focus:ring-4 focus:ring-[#87947C]/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#626B5C]"
                    >
                      Password
                    </label>
                  </div>

                  <div className="group relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#87917F]">
                      <LockIcon />
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="h-[54px] w-full rounded-[14px] border border-[#DDD9CF] bg-[#F8F6F0] pl-12 pr-12 text-[14px] text-[#30372E] outline-none transition-all placeholder:text-[#A5A69D] hover:border-[#BBC3B4] focus:border-[#87947C] focus:bg-white focus:ring-4 focus:ring-[#87947C]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B9187] transition hover:text-[#4F5C49]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOffIcon />
                      ) : (
                        <EyeIcon />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 rounded-[14px] border border-[#E5C9C3] bg-[#FAF0ED] px-4 py-3 text-sm text-[#9A5B50]">
                    <AlertIcon />

                    <p>{error}</p>
                  </div>
                )}

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-2 flex h-[56px] w-full items-center justify-center overflow-hidden rounded-[14px] bg-[#697761] px-6 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(83,97,76,0.20)] transition-all duration-300 hover:bg-[#596750] hover:shadow-[0_14px_30px_rgba(83,97,76,0.26)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative z-10">
                    {loading ? "Signing in..." : "Sign in"}
                  </span>

                  {!loading && (
                    <span className="absolute right-5 transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  )}

                  {loading && (
                    <span className="absolute right-5 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                </button>
              </form>

              {/* Bottom text */}
              <div className="mt-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E4E0D7]" />

                <span className="text-[10px] uppercase tracking-[0.18em] text-[#A0A398]">
                  Tara Living
                </span>

                <div className="h-px flex-1 bg-[#E4E0D7]" />
              </div>

              <p className="mt-5 text-center text-[11px] leading-5 text-[#9A9C94]">
                Authorized access only
              </p>
            </div>

            {/* Copyright */}
            <p className="mt-6 text-center text-[11px] text-[#A2A49C]">
              © {new Date().getFullYear()} Tara Living. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}


/* =========================================================
   ICONS
========================================================= */

function UserIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17.3 17.3 0 0 1-3 3.9" />
      <path d="M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 4.2-.9" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}