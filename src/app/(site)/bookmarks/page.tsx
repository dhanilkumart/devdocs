"use client";

import Link from "next/link";
import { useBookmarks } from "@/hooks/useBookmarks";
import { getDocById } from "@/lib/data";

export default function BookmarksPage() {
  const { ids, ready } = useBookmarks();

  if (!ready) {
    return (
      <div>
        <p className="text-zinc-500">Loading saved topics…</p>
      </div>
    );
  }

  const docs = ids.map((id) => getDocById(id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Saved topics</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Stored locally in your browser. Clear cookies/site data to reset.
        </p>
      </header>

      {docs.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          No bookmarks yet. Open a doc and choose <strong>Save topic</strong>.
        </p>
      ) : (
        <ul className="space-y-3">
          {docs.map((d) =>
            d ? (
              <li
                key={d.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <Link href={`/docs/${d.id}`} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
                  {d.title}
                </Link>
                <p className="text-sm text-zinc-500">{d.category}</p>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
}
