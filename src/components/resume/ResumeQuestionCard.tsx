"use client";

import { useState } from "react";
import { TechText } from "@/components/keyword/TechText";
import type { ResumeQuestion } from "@/types";

function paragraphs(text: string) {
  return text.trim().split(/\n\n+/);
}

/**
 * Expandable card for a single resume question. Collapsed view shows the
 * question and a one-line summary. Expanding reveals the full long-form answer
 * with TechText so technical keywords become clickable chips.
 */
export function ResumeQuestionCard({ q, defaultOpen = false }: { q: ResumeQuestion; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const blocks = paragraphs(q.answer);

  return (
    <article
      id={`resume-q-${q.id}`}
      className="scroll-mt-32 rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-sky-200 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-sky-800"
    >
      <div className="flex w-full items-start justify-between gap-4 rounded-2xl px-5 py-4 text-left">
        <div className="min-w-0 space-y-2">
          <h2>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={`resume-a-${q.id}`}
              className="text-left text-base font-semibold leading-snug text-zinc-900 hover:text-sky-700 focus:outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-zinc-50 dark:hover:text-sky-400"
            >
              {q.question}
            </button>
          </h2>
          {q.short && (
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              <TechText text={q.short} />
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`resume-a-${q.id}`}
          aria-label={open ? "Collapse answer" : "Expand answer"}
          className={`mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition ${
            open ? "rotate-180 border-sky-300 text-sky-600 dark:border-sky-700 dark:text-sky-300" : "dark:border-zinc-700 dark:text-zinc-400"
          }`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

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
