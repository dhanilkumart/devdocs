"use client";

import { useMemo, useState } from "react";
import type { InterviewSegment, TechCategory } from "@/types";
import { InterviewFilters } from "@/components/interview/InterviewFilters";
import { SegmentFilter } from "@/components/interview/SegmentFilter";
import { QuestionCard } from "@/components/interview/QuestionCard";
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
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        <strong>Focus</strong> splits <span className="text-zinc-700 dark:text-zinc-300">core language & patterns</span> from{" "}
        <span className="text-zinc-700 dark:text-zinc-300">DOM & browser events</span>. Doc topics stay under{" "}
        <strong>Topics</strong> in the sidebar—interview cards are Q&amp;A only.
      </p>
      <div className="mt-6 space-y-6">
        {filtered.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>
    </>
  );
}
