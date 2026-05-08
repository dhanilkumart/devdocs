"use client";

import type { GlossaryEntry } from "@/types";
import { useKeywordModal } from "@/components/keyword/KeywordModalProvider";

/**
 * Inline button rendered in place of a matched keyword in prose. Subtle
 * styling — looks like a slightly emphasized link — so dense paragraphs
 * don't turn into a wall of pills. Click opens the shared modal.
 */
export function KeywordChip({ entry, label }: { entry: GlossaryEntry; label: string }) {
  const { openKeyword } = useKeywordModal();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openKeyword(entry.slug);
      }}
      title={entry.short}
      aria-label={`Open keyword details for ${entry.term}`}
      className="rounded-md border-b border-dashed border-sky-400/60 bg-sky-50/40 px-1 font-medium text-sky-700 underline-offset-2 transition hover:border-sky-500 hover:bg-sky-100 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-sky-500/50 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-900/40 dark:hover:text-sky-200"
    >
      {label}
    </button>
  );
}
