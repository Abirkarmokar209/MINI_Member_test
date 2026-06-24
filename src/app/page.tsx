"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "abir@209.com";
type AuthMode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode]         = useState<AuthMode>("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);

  // If session already exists, redirect immediately
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const e = session.user.email?.toLowerCase();
        window.location.href = e === ADMIN_EMAIL ? "/admin" : "/exam";
      } else {
        setLoading(false);
      }
    });
  }, []);

  // Helper: turn any thrown value into a readable string
  function getErrorMessage(err: unknown): string {
    if (!err) return "An unexpected error occurred.";
    if (typeof err === "string") return err;
    if (typeof err === "object") {
      const e = err as Record<string, unknown>;
      if (typeof e.message === "string" && e.message.trim()) return e.message;
      if (typeof e.msg === "string" && e.msg.trim()) return e.msg;
      if (typeof e.error_description === "string") return e.error_description;
      // Last resort: stringify but strip braces if it's just "{}"
      const s = JSON.stringify(err);
      if (s && s !== "{}") return s;
    }
    return "An unexpected error occurred. Please try again.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass  = password.trim();

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (trimmedPass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        // ── Register ────────────────────────────────────────────────
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPass,
        });

        if (signUpErr) {
          setError(getErrorMessage(signUpErr));
          setLoading(false);
          return;
        }

        // signUp can succeed but return null user if email confirmation
        // is enabled — catch that case clearly
        if (!data.user) {
          setError(
            "Registration submitted but email confirmation may be required. " +
            "Ask your admin to disable email confirmation in Supabase."
          );
          setLoading(false);
          return;
        }

        // Insert into public users table (best effort — don't block on failure)
        await supabase.from("users").upsert(
          { id: data.user.id, email: trimmedEmail, has_completed: false },
          { onConflict: "id", ignoreDuplicates: true }
        );

        window.location.href = "/exam";

      } else {
        // ── Login ────────────────────────────────────────────────────
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPass,
        });

        if (signInErr) {
          // Give friendlier messages for common cases
          const msg = getErrorMessage(signInErr);
          if (msg.toLowerCase().includes("invalid login")) {
            setError("Incorrect email or password. Please try again.");
          } else if (msg.toLowerCase().includes("email not confirmed")) {
            setError("Email not confirmed. Ask your admin to disable email confirmation in Supabase.");
          } else {
            setError(msg);
          }
          setLoading(false);
          return;
        }

        if (!data.user) {
          setError("Login failed. Please try again.");
          setLoading(false);
          return;
        }

        const loggedEmail = data.user.email?.toLowerCase();
        window.location.href = loggedEmail === ADMIN_EMAIL ? "/admin" : "/exam";
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-slate-400 text-sm animate-pulse">Loading...</p>
    </main>
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
      <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

        <h1 className="mb-1 text-2xl font-semibold tracking-tight">
          {mode === "login" ? "Student Login" : "Create Account"}
        </h1>
        <p className="mb-6 text-sm text-slate-400">
          {mode === "login"
            ? "Sign in to join the live exam session."
            : "Register your email and password to get started."}
        </p>

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-lg border border-slate-700 p-1 gap-1">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(null); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === "login"
                ? "bg-indigo-500 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(null); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === "register"
                ? "bg-indigo-500 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-slate-100 outline-none ring-indigo-500 focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-slate-100 outline-none ring-indigo-500 focus:ring-2"
            />
            {mode === "register" && (
              <p className="text-xs text-slate-500">Minimum 6 characters</p>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 break-words">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-indigo-500 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login" ? "Sign In" : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}
