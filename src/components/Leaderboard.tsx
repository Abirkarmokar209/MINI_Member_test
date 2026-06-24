"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Submission = { id: string; student_id: string; is_correct: boolean; created_at: string };

export default function Leaderboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      const [{ data: userRows }, { data: subRows }] = await Promise.all([
        supabase.from("users").select("id, email"),
        supabase.from("submissions").select("id, student_id, is_correct, created_at"),
      ]);

      if (userRows) {
        const uMap: Record<string, string> = {};
        userRows.forEach((u) => (uMap[u.id] = u.email));
        setUsers(uMap);
      }
      if (subRows) setSubmissions(subRows as Submission[]);
    }
    loadData();

    const channel = supabase
      .channel("live-quiz")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "submissions" }, (payload) => {
        setSubmissions((prev) => [...prev, payload.new as Submission]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const sortedRankings = useMemo(() => {
    const dataMap: Record<string, { correct: number; lastSubmission: string }> = {};

    submissions.forEach((s) => {
      if (!dataMap[s.student_id]) {
        dataMap[s.student_id] = { correct: 0, lastSubmission: s.created_at };
      }
      if (s.is_correct) dataMap[s.student_id].correct += 1;
      if (s.created_at > dataMap[s.student_id].lastSubmission) {
        dataMap[s.student_id].lastSubmission = s.created_at;
      }
    });

    return Object.entries(dataMap)
      .map(([id, stat]) => ({
        id,
        email: users[id] || "Active Student...",
        score: stat.correct,
        time: stat.lastSubmission,
      }))
      .sort((a, b) => b.score !== a.score ? b.score - a.score : new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [submissions, users]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Live Standing Board</h2>
        <span className="flex items-center gap-1 text-xs text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Streaming
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {sortedRankings.length === 0 ? (
          <p className="text-sm text-slate-500">Waiting for live data submissions...</p>
        ) : (
          sortedRankings.map((student, idx) => (
            <div key={student.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
              <span className="text-sm font-medium text-slate-300">#{idx + 1} {student.email}</span>
              <span className="text-sm font-bold text-indigo-400">{student.score} Correct</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}