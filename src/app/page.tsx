"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "abir@209.com";
type AuthMode = "login" | "register";

export default function LoginPage() {
  const router  = useRouter();
  const [mode, setMode]       = useState<AuthMode>("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // If a session already exists skip the login page entirely
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
        // ── Register new student ──────────────────────────────────
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: trimmedPass,
        });
        if (signUpErr) throw signUpErr;
        if (data.user) {
          await supabase.from("users").upsert(
            { id: data.user.id, email: trimmedEmail, has_completed: false },
            { onConflict: "id", ignoreDuplicates: true }
          );
        }
        window.location.href = "/exam";
      } else {
        // ── Login ─────────────────────────────────────────────────
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPass,
        });
        if (signInErr) throw signInErr;

        const loggedEmail = data.user.email?.toLowerCase();
        window.location.href = loggedEmail === ADMIN_EMAIL ? "/admin" : "/exam";
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
              mode === "login" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(null); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              mode === "register" ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"
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
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
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
