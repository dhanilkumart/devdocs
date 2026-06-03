"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { InterviewAnswerContent } from "@/components/interview/InterviewAnswerContent";
import { QuestionSaveButton } from "@/components/interview/QuestionSaveButton";
import type { InterviewQuestion } from "@/types";
import { interviewSlug } from "@/lib/interviewDisplay";

export function InterviewQuestionModal({
  q,
  onClose,
}: {
  q: InterviewQuestion;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const slug = interviewSlug(q);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`question-modal-${q.id}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/60 px-2 py-4 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-2xl outline-none dark:border-zinc-800 dark:bg-zinc-950"
      >
        <header className="shrink-0 space-y-4 border-b border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-900 dark:bg-violet-950 dark:text-violet-200">
                {q.technology}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {q.level}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <QuestionSaveButton q={q} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>
          <h2 id={`question-modal-${q.id}`} className="text-balance text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {q.question}
          </h2>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <InterviewAnswerContent q={q} />
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-white px-5 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          <span className="text-xs text-zinc-500">Press Esc to close</span>
          <Link
            href={`/question/${slug}`}
            onClick={onClose}
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
          >
            Open full guide -&gt;
          </Link>
        </footer>
      </div>
    </div>
  );
}
