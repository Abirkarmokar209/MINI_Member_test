"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { QUESTIONS, EXAM_DURATION_SECONDS } from "../../data/questions";
import Leaderboard from "../../components/Leaderboard";

export default function ExamPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);
  const [status, setStatus] = useState<"active" | "ended">("active");

  const currentQuestion = QUESTIONS[currentIndex];

  useEffect(() => {
    const raw = localStorage.getItem("mini-quiz-user");
    if (!raw) {
      router.replace("/");
      return;
    }
    setUser(JSON.parse(raw));
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (loading || status !== "active") return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStatus("ended");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, status]);

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
        setStatus("ended");
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading exam terminal...</div>;

  if (status === "ended") {
    return (
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-emerald-400">Exam Finished!</h1>
          <p className="mt-2 text-slate-400">Your final answers are securely recorded. View your rank below.</p>
        </div>
        <Leaderboard />
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
      <header className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">Question {currentIndex + 1} of {QUESTIONS.length}</span>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200">
          ⏱ {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}
        </span>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-medium">{currentQuestion.text}</h2>
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelected(opt.key)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                selected === opt.key ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600"
              }`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-sm font-semibold ${selected === opt.key ? "border-indigo-400 bg-indigo-500 text-white" : "border-slate-600 text-slate-400"}`}>{opt.key}</span>
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
          {submitting ? "Saving Answer..." : currentIndex === QUESTIONS.length - 1 ? "Complete & Finish" : "Submit & Next"}
        </button>
      </section>
    </main>
  );
}