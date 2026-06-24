"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


// To this line:
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const { data: existing, error: lookupError } = await supabase
        .from("users")
        .select("id, email")
        .eq("email", trimmedEmail)
        .maybeSingle();

      if (lookupError) throw lookupError;

      let userId = existing?.id;

      if (!userId) {
        const { data: created, error: insertError } = await supabase
          .from("users")
          .insert({ email: trimmedEmail })
          .select("id, email")
          .single();

        if (insertError) throw insertError;
        userId = created.id;
      }

      localStorage.setItem(
        "mini-quiz-user",
        JSON.stringify({ id: userId, email: trimmedEmail })
      );

      router.push("/exam");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
      <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Student Login</h1>
        <p className="mb-6 text-sm text-slate-400">Enter your email to join the live session.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-indigo-500 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
          >
            {loading ? "Accessing Exam..." : "Start Exam"}
          </button>
        </form>
      </div>
    </main>
  );
}