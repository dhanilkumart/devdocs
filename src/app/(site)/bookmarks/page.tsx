"use client";

import Link from "next/link";
import { useState } from "react";
import { SavedQuestionFull } from "@/components/interview/SavedQuestionFull";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import { getDocById } from "@/lib/data";

type Tab = "questions" | "topics";

export default function BookmarksPage() {
  const { ids, ready: docsReady } = useBookmarks();
  const { items: savedQuestions, clear } = useSavedQuestions();
  const [tab, setTab] = useState<Tab>("questions");

  const docs = ids.map((id) => getDocById(id)).filter(Boolean);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Saved</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Stored locally in your browser. Saved interview questions show their full content here so you always see the
          exact copy you saved, even if the source ever changes.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setTab("questions")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            tab === "questions"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          Questions ({savedQuestions.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("topics")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            tab === "topics"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          Topics ({docsReady ? docs.length : "…"})
        </button>
        {tab === "questions" && savedQuestions.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Remove all saved questions? This cannot be undone.")) clear();
            }}
            className="ml-auto rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/40"
          >
            Clear all
          </button>
        )}
      </div>

      {tab === "questions" ? (
        savedQuestions.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
            No saved questions yet. Open a question or any card and choose <strong>Save question</strong> to copy the
            full guide here.
          </p>
        ) : (
          <div className="space-y-6">
            {savedQuestions.map((s) => (
              <SavedQuestionFull key={s.id} snapshot={s} />
            ))}
          </div>
        )
      ) : !docsReady ? (
        <p className="text-zinc-500">Loading saved topics…</p>
      ) : docs.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          No bookmarked topics yet. Open a doc and choose <strong>Save topic</strong>.
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
