"use client";

import { InterviewCardCompact } from "@/components/interview/InterviewCardCompact";
import { interviewsFiltered } from "@/lib/data";

export function InterviewPageClient() {
  const filtered = interviewsFiltered("All", "All");

  return (
    <>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Each card shows the question, topic, level, and a <strong className="text-zinc-800 dark:text-zinc-200">short answer</strong> only.
        Click a question title to preview the full answer in a popup, or use <strong className="text-zinc-800 dark:text-zinc-200">Open full guide</strong> for the dedicated page.
        Doc guides stay under <strong className="text-zinc-800 dark:text-zinc-200">Topics</strong> in the sidebar.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        {filtered.map((q) => (
          <InterviewCardCompact key={q.id} q={q} />
        ))}
      </div>
    </>
  );
}
