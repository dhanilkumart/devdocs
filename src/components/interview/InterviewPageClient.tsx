"use client";

import { useMemo, useState } from "react";
import type { InterviewSegment, TechCategory } from "@/types";
import { InterviewFilters } from "@/components/interview/InterviewFilters";
import { SegmentFilter } from "@/components/interview/SegmentFilter";
import { InterviewCardCompact } from "@/components/interview/InterviewCardCompact";
import { interviewsFiltered } from "@/lib/data";

export function InterviewPageClient() {
  const [tech, setTech] = useState<TechCategory | "All">("All");
  const [segment, setSegment] = useState<InterviewSegment | "All">("All");

  const filtered = useMemo(() => interviewsFiltered(tech, segment), [tech, segment]);

  return (
    <>
      <div className="space-y-4">
        <InterviewFilters value={tech} onChange={setTech} />
        <SegmentFilter value={segment} onChange={setSegment} />
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Each card shows the question, topic, level, and a <strong className="text-zinc-800 dark:text-zinc-200">short answer</strong> only.
        Open a card for the full guide: longer explanation, real-world use, code, mistakes to avoid, and interview tips. Doc
        guides stay under <strong className="text-zinc-800 dark:text-zinc-200">Topics</strong> in the sidebar.
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
        <span className="font-medium text-zinc-600 dark:text-zinc-400">Focus</span> filters core language vs DOM & browser
        questions.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        {filtered.map((q) => (
          <InterviewCardCompact key={q.id} q={q} />
        ))}
      </div>
    </>
  );
}
