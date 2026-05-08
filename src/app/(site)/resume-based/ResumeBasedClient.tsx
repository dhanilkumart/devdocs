"use client";

import { useCallback, useMemo, useState } from "react";
import { ResumeQuestionCard } from "@/components/resume/ResumeQuestionCard";
import { ResumeSearch } from "@/components/resume/ResumeSearch";
import { StickySearchShell } from "@/components/layout/StickySearchShell";
import type { ResumeQuestion } from "@/types";

type Props = {
  items: ResumeQuestion[];
};

/**
 * Interactive shell for the /resume-based page. Search still indexes topic
 * and project metadata, but the page does not render those tags as filters.
 */
export function ResumeBasedClient({ items }: Props) {
  const [searchHits, setSearchHits] = useState<ResumeQuestion[] | null>(null);

  const handleResults = useCallback((results: ResumeQuestion[] | null) => {
    setSearchHits(results);
  }, []);

  const filtered = useMemo(() => searchHits ?? items, [items, searchHits]);

  return (
    <div className="space-y-6">
      <StickySearchShell hint="Searches questions and full answers — Enter jumps to the first hit.">
        <ResumeSearch items={items} onResults={handleResults} />
      </StickySearchShell>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Showing <span className="font-semibold text-zinc-700 dark:text-zinc-200">{filtered.length}</span> of{" "}
        {items.length} questions
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
          No questions match the current search. Try another keyword.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => (
            <ResumeQuestionCard key={q.id} q={q} />
          ))}
        </div>
      )}
    </div>
  );
}
