"use client";

import Link from "next/link";
import { useState } from "react";
import { InterviewQuestionModal } from "@/components/interview/InterviewQuestionModal";
import { QuestionSaveButton } from "@/components/interview/QuestionSaveButton";
import { TechText } from "@/components/keyword/TechText";
import type { InterviewQuestion } from "@/types";
import { getInterviewCardBlurb, interviewSlug } from "@/lib/interviewDisplay";

const LEVEL_STYLE: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  Intermediate: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  Advanced: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
};

export function InterviewCardCompact({ q }: { q: InterviewQuestion }) {
  const [open, setOpen] = useState(false);
  const slug = interviewSlug(q);
  const blurb = getInterviewCardBlurb(q);
  const levelClass = LEVEL_STYLE[q.level] ?? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";

  return (
    <article className="group grid gap-4 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition hover:border-sky-300/80 hover:shadow-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-sky-700/60">
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-900 dark:bg-violet-950 dark:text-violet-200">
            {q.technology}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelClass}`}>{q.level}</span>
        </div>
        <h2>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(true);
              }
            }}
            aria-haspopup="dialog"
            className="cursor-pointer text-left text-base font-semibold leading-snug text-zinc-900 transition hover:text-sky-700 focus:outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-zinc-50 dark:hover:text-sky-400"
          >
            <TechText text={q.question} />
          </div>
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <TechText text={blurb} />
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
        <QuestionSaveButton q={q} variant="icon" />
        <Link
          href={`/question/${slug}`}
          className="text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
        >
          Open full guide -&gt;
        </Link>
      </div>
      {open && <InterviewQuestionModal q={q} onClose={() => setOpen(false)} />}
    </article>
  );
}
