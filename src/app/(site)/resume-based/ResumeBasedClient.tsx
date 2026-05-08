"use client";

import { useCallback, useMemo, useState } from "react";
import { ResumeQuestionCard } from "@/components/resume/ResumeQuestionCard";
import { ResumeSearch } from "@/components/resume/ResumeSearch";
import { StickySearchShell } from "@/components/layout/StickySearchShell";
import type { ResumeQuestion } from "@/types";

type Props = {
  items: ResumeQuestion[];
  topics: string[];
  projects: string[];
};

/**
 * Interactive shell for the /resume-based page. Owns the topic + project
 * filters and the active search subset. The page server component just
 * passes static data in; everything else is local state.
 */
export function ResumeBasedClient({ items, topics, projects }: Props) {
  const [topic, setTopic] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [searchHits, setSearchHits] = useState<ResumeQuestion[] | null>(null);

  const handleResults = useCallback((results: ResumeQuestion[] | null) => {
    setSearchHits(results);
  }, []);

  const filtered = useMemo(() => {
    let base = searchHits ?? items;
    if (topic) base = base.filter((q) => q.topic === topic);
    if (project) base = base.filter((q) => q.project === project);
    return base;
  }, [items, searchHits, topic, project]);

  const isFiltering = Boolean(topic || project || searchHits);

  return (
    <div className="space-y-6">
      <StickySearchShell hint="Searches questions, topics, projects, and full answers — Enter jumps to the first hit.">
        <ResumeSearch items={items} onResults={handleResults} />
      </StickySearchShell>

      <section aria-label="Filter by topic" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Topic
          </span>
          <button
            type="button"
            onClick={() => setTopic(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              topic === null
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "border border-zinc-200 text-zinc-700 hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:text-zinc-300"
            }`}
          >
            All
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic((current) => (current === t ? null : t))}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                topic === t
                  ? "bg-sky-600 text-white"
                  : "border border-zinc-200 text-zinc-700 hover:border-sky-300 hover:text-sky-700 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Project
          </span>
          <button
            type="button"
            onClick={() => setProject(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              project === null
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "border border-zinc-200 text-zinc-700 hover:border-violet-300 hover:text-violet-700 dark:border-zinc-700 dark:text-zinc-300"
            }`}
          >
            All
          </button>
          {projects.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProject((current) => (current === p ? null : p))}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                project === p
                  ? "bg-violet-600 text-white"
                  : "border border-zinc-200 text-zinc-700 hover:border-violet-300 hover:text-violet-700 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Showing <span className="font-semibold text-zinc-700 dark:text-zinc-200">{filtered.length}</span> of{" "}
        {items.length} questions
        {isFiltering && (
          <button
            type="button"
            onClick={() => {
              setTopic(null);
              setProject(null);
              setSearchHits(null);
            }}
            className="ml-3 text-xs font-medium text-sky-700 hover:underline dark:text-sky-400"
          >
            Clear filters
          </button>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
          No questions match the current filters. Try clearing one of them.
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
