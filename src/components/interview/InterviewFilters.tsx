"use client";

import type { TechCategory } from "@/types";
import { INTERVIEW_FILTER_OPTIONS } from "@/lib/data";

const ALL = "All" as const;

export function InterviewFilters({
  value,
  onChange,
}: {
  value: TechCategory | typeof ALL;
  onChange: (v: TechCategory | typeof ALL) => void;
}) {
  const options: (TechCategory | typeof ALL)[] = [ALL, ...INTERVIEW_FILTER_OPTIONS];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by technology">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
