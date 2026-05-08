"use client";

import { useState } from "react";
import { TechText } from "@/components/keyword/TechText";
import type { ResumeQuestion } from "@/types";

const PROJECT_BADGE: Record<string, string> = {
  "AI-Kiosk": "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
  GoodHomes: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  ZEOS: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
  ROVER: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  "Cross-project": "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  "Sentiment Analysis": "bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-200",
  "Sesame Technologies": "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
};

function projectBadge(project?: string): string {
  if (!project) return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
  return PROJECT_BADGE[project] ?? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
}

function paragraphs(text: string) {
  return text.trim().split(/\n\n+/);
}

/**
 * Expandable card for a single resume question. Collapsed view shows the
 * topic, project, the question, and a one-line summary. Expanding reveals
 * the full long-form answer with TechText so technical keywords inside
 * become clickable chips that open the keyword modal.
 *
 * The card has a stable DOM id (`resume-q-<id>`) so the search component
 * can scroll it into view when the user picks a hit.
 */
export function ResumeQuestionCard({ q, defaultOpen = false }: { q: ResumeQuestion; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const blocks = paragraphs(q.answer);

  return (
    <article
      id={`resume-q-${q.id}`}
      className="scroll-mt-32 rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-sky-200 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-sky-800"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`resume-a-${q.id}`}
        className="flex w-full items-start justify-between gap-4 rounded-2xl px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-900 dark:bg-sky-950 dark:text-sky-200">
              {q.topic}
            </span>
            {q.project && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${projectBadge(q.project)}`}>
                {q.project}
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{q.question}</h2>
          {q.short && (
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              <TechText text={q.short} />
            </p>
          )}
        </div>
        <span
          aria-hidden
          className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition ${
            open ? "rotate-180 border-sky-300 text-sky-600 dark:border-sky-700 dark:text-sky-300" : "dark:border-zinc-700 dark:text-zinc-400"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={`resume-a-${q.id}`}
          className="space-y-4 border-t border-zinc-200 px-5 py-5 text-[15px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
        >
          {blocks.map((block, i) => (
            <p key={i}>
              <TechText text={block} />
            </p>
          ))}
        </div>
      )}
    </article>
  );
}
