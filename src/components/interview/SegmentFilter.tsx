"use client";

import type { InterviewSegment } from "@/types";

const ALL = "All" as const;

const LABELS: Record<InterviewSegment, string> = {
  fundamentals: "Core (language & patterns)",
  runtime: "Web (DOM & events)",
};

export function SegmentFilter({
  value,
  onChange,
}: {
  value: InterviewSegment | typeof ALL;
  onChange: (v: InterviewSegment | typeof ALL) => void;
}) {
  const options: (InterviewSegment | typeof ALL)[] = [ALL, "fundamentals", "runtime"];

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Interview focus">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Focus</span>
      {options.map((opt) => {
        const active = value === opt;
        const label = opt === ALL ? "All" : LABELS[opt];
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-sky-600 text-white dark:bg-sky-500"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
