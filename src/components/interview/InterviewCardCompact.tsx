import Link from "next/link";
import type { InterviewQuestion } from "@/types";
import { getInterviewCardBlurb, interviewSlug } from "@/lib/interviewDisplay";

const LEVEL_STYLE: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  Intermediate: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  Advanced: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
};

export function InterviewCardCompact({ q }: { q: InterviewQuestion }) {
  const slug = interviewSlug(q);
  const blurb = getInterviewCardBlurb(q);
  const levelClass = LEVEL_STYLE[q.level] ?? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";

  return (
    <Link
      href={`/question/${slug}`}
      className="group grid gap-4 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition hover:border-sky-300/80 hover:shadow-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-sky-700/60"
    >
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-900 dark:bg-violet-950 dark:text-violet-200">
            {q.technology}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelClass}`}>{q.level}</span>
        </div>
        <h2 className="text-base font-semibold leading-snug text-zinc-900 group-hover:text-sky-700 dark:text-zinc-50 dark:group-hover:text-sky-400">
          {q.question}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{blurb}</p>
      </div>
      <p className="shrink-0 text-xs font-medium text-sky-600 dark:text-sky-400">Open full guide -&gt;</p>
    </Link>
  );
}
