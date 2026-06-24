"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Leaderboard from "../../components/Leaderboard";

const ADMIN_EMAIL = "abir@209.com";

export default function AdminPage() {
  const [verified, setVerified]     = useState(false);
  const [clearing, setClearing]     = useState(false);
  const [clearMsg, setClearMsg]     = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const email = session?.user?.email?.toLowerCase();
      if (!session || email !== ADMIN_EMAIL) {
        window.location.href = "/";
      } else {
        setVerified(true);
      }
    });
  }, []);

  async function handleClearLeaderboard() {
    setClearing(true);
    setClearMsg(null);
    try {
      const { error } = await supabase
        .from("submissions")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;

      await supabase
        .from("users")
        .update({ has_completed: false })
        .neq("id", "00000000-0000-0000-0000-000000000000");

      setClearMsg({ type: "success", text: "Leaderboard cleared. Students can retake the exam." });
    } catch (err: any) {
      setClearMsg({ type: "error", text: err.message || "Failed to clear leaderboard." });
    } finally {
      setClearing(false);
      setConfirmOpen(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!verified) return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-slate-400 text-sm animate-pulse">Verifying admin...</p>
    </main>
  );

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">

      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Signed in as <span className="text-amber-400 font-medium">{ADMIN_EMAIL}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          Log Out
        </button>
      </header>

      {/* Admin badge */}
      <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <span className="text-lg">🛡️</span>
        <p className="text-sm text-amber-300 font-medium">
          Admin access active. View the live leaderboard and manage exam submissions below.
        </p>
      </div>

      {/* Clear card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Clear Leaderboard</h2>
            <p className="mt-0.5 text-sm text-slate-400">
              Deletes all submissions and resets exam completion for all students.
            </p>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          >
            Clear All
          </button>
        </div>

        {clearMsg && (
          <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            clearMsg.type === "success"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}>
            {clearMsg.text}
          </p>
        )}
      </div>

      {/* Live leaderboard */}
      <Leaderboard />

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">Are you sure?</h3>
            <p className="mt-2 text-sm text-slate-400">
              This will permanently delete <strong className="text-white">all submissions</strong> and
              allow students to retake the exam.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-lg border border-slate-700 py-2 text-sm text-slate-300 transition hover:border-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleClearLeaderboard}
                disabled={clearing}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {clearing ? "Clearing..." : "Yes, Clear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
