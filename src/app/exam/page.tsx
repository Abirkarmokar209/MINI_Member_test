"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { QUESTIONS, EXAM_DURATION_SECONDS } from "../../data/questions";
import Leaderboard from "../../components/Leaderboard";

type User = { id: string; email: string };

export default function ExamPage() {
  const router = useRouter();

  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus]   = useState<"active" | "ended" | "completed">("active");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected]         = useState<string | null>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [secondsLeft, setSecondsLeft]   = useState(EXAM_DURATION_SECONDS);

  const currentQuestion = QUESTIONS[currentIndex];

  // ── Auth + completion check ──────────────────────────────────────
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/"); return; }

      const authUser = session.user;

      const { data: row } = await supabase
        .from("users")
        .upsert(
          { id: authUser.id, email: authUser.email, has_completed: false },
          { onConflict: "id", ignoreDuplicates: true }
        )
        .select("id, email, has_completed")
        .maybeSingle();

      const { data: existing } = row
        ? { data: row }
        : await supabase.from("users").select("id, email, has_completed").eq("id", authUser.id).single();

      const userRow = row ?? existing;
      setUser({ id: authUser.id, email: authUser.email! });
      if (userRow?.has_completed) setStatus("completed");
      setLoading(false);
    }
    init();
  }, [router]);

  // ── Countdown ────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || status !== "active") return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); handleTimeUp(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, status]);

  async function handleTimeUp() {
    if (!user) return;
    await supabase.from("users").update({ has_completed: true }).eq("id", user.id);
    setStatus("ended");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  // ── Submit answer ────────────────────────────────────────────────
  async function handleNextQuestion() {
    if (!user || !selected || submitting) return;
    setSubmitting(true);
    const isCorrect = selected === currentQuestion.correctOption;
    try {
      await supabase.from("submissions").insert({
        student_id: user.id,
        question_id: currentQuestion.id,
        selected_option: selected,
        is_correct: isCorrect,
      });
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
      } else {
        await supabase.from("users").update({ has_completed: true }).eq("id", user.id);
        setStatus("ended");
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Loading exam...</p>
      </main>
    );
  }

  // ── Shared top bar (shown on completed + ended screens) ──────────
  function TopBar() {
    return (
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="text-sm font-medium text-slate-300">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          Log Out
        </button>
      </header>
    );
  }

  // ── Already completed (reload) ───────────────────────────────────
  if (status === "completed") {
    return (
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <TopBar />
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
          <div className="mb-3 text-4xl">✅</div>
          <h1 className="text-2xl font-bold text-emerald-400">You've Already Completed This Exam</h1>
          <p className="mt-2 text-slate-400">Each student can only take the exam once. Here's the live leaderboard.</p>
        </div>
        <Leaderboard />
      </main>
    );
  }

  // ── Just finished ────────────────────────────────────────────────
  if (status === "ended") {
    return (
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <TopBar />
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
          <div className="mb-3 text-4xl">🎉</div>
          <h1 className="text-2xl font-bold text-emerald-400">Exam Finished!</h1>
          <p className="mt-2 text-slate-400">Your answers are recorded. View your rank below.</p>
        </div>
        <Leaderboard />
      </main>
    );
  }

  // ── Active exam ──────────────────────────────────────────────────
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">

      {/* Header: email + logout on left/right, timer centre */}
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="truncate text-sm font-medium text-slate-300">{user?.email}</p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200">
          ⏱ {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}
        </span>

        <button
          onClick={handleLogout}
          className="shrink-0 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          Log Out
        </button>
      </header>

      {/* Progress */}
      <p className="text-sm font-medium text-slate-400">
        Question {currentIndex + 1} of {QUESTIONS.length}
      </p>

      {/* Question card */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-medium">{currentQuestion.text}</h2>
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelected(opt.key)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                selected === opt.key
                  ? "border-indigo-500 bg-indigo-500/10 text-white"
                  : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600"
              }`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                selected === opt.key
                  ? "border-indigo-400 bg-indigo-500 text-white"
                  : "border-slate-600 text-slate-400"
              }`}>
                {opt.key}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextQuestion}
          disabled={!selected || submitting}
          className="mt-6 w-full rounded-lg bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-50"
        >
          {submitting
            ? "Saving Answer..."
            : currentIndex === QUESTIONS.length - 1
            ? "Complete & Finish"
            : "Submit & Next"}
        </button>
      </section>
    </main>
  );
}
