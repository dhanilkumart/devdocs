"use client";

import { useMemo, useState } from "react";
import type { TechCategory } from "@/types";
import { InterviewFilters } from "@/components/interview/InterviewFilters";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { interviewsByTechnology } from "@/lib/data";

export function InterviewPageClient() {
  const [tech, setTech] = useState<TechCategory | "All">("All");

  const filtered = useMemo(() => interviewsByTechnology(tech), [tech]);

  return (
    <>
      <InterviewFilters value={tech} onChange={setTech} />
      <div className="space-y-6">
        {filtered.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>
    </>
  );
}
