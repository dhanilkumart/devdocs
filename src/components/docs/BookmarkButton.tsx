"use client";

import { useBookmarks } from "@/hooks/useBookmarks";

export function BookmarkButton({ id, title }: { id: string; title: string }) {
  const { ready, has, toggle } = useBookmarks();
  const saved = has(id);

  if (!ready) {
    return (
      <span className="inline-flex h-9 min-w-[100px] items-center justify-center rounded-lg border border-zinc-200 px-3 text-sm dark:border-zinc-700" />
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
        saved
          ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
          : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      }`}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
    >
      <svg className="h-4 w-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {saved ? "Saved" : "Save topic"}
    </button>
  );
}
