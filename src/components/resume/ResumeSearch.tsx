"use client";

import Fuse, { type IFuseOptions } from "fuse.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ResumeQuestion } from "@/types";

const fuseOptions: IFuseOptions<ResumeQuestion> = {
  keys: [
    { name: "question", weight: 0.4 },
    { name: "topic", weight: 0.15 },
    { name: "project", weight: 0.1 },
    { name: "short", weight: 0.15 },
    { name: "answer", weight: 0.2 },
  ],
  threshold: 0.42,
  includeScore: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
  ignoreDiacritics: true,
};

type Props = {
  /** Full set of resume questions to search across. */
  items: ResumeQuestion[];
  /** Callback fired when the visible filtered list should change. */
  onResults: (results: ResumeQuestion[] | null) => void;
};

/**
 * In-page horizontal search bar for the Resume Based page. Mirrors the
 * global search UX (debounced input, dropdown of top hits, click-outside
 * dismiss) but the input also acts as a live filter that pushes the matched
 * subset back to the page via `onResults`. Passing `null` from `onResults`
 * means "show everything" — the parent can collapse back to the full list
 * when the query is empty.
 */
export function ResumeSearch({ items, onResults }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(() => new Fuse(items, fuseOptions), [items]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 120);
    return () => clearTimeout(t);
  }, [query]);

  const allHits = useMemo(() => {
    const q = debounced.trim();
    if (!q) return null;
    return fuse.search(q).map((r) => r.item);
  }, [fuse, debounced]);

  // Push results to parent so the cards list reflects the active filter.
  useEffect(() => {
    onResults(allHits);
  }, [allHits, onResults]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const scrollToFirst = useCallback(() => {
    const first = allHits?.[0];
    if (!first) return;
    const el = document.getElementById(`resume-q-${first.id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }, [allHits]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      scrollToFirst();
    }
    if (e.key === "Escape") setOpen(false);
  };

  const previewHits = (allHits ?? []).slice(0, 8);

  return (
    <div ref={wrapRef} className="relative w-full">
      <label htmlFor="resume-search" className="sr-only">
        Search resume-based questions
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          id="resume-search"
          type="search"
          autoComplete="off"
          placeholder={`Search ${items.length} resume-based questions…`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-base text-zinc-900 shadow-sm outline-none ring-sky-500/40 placeholder:text-zinc-400 focus:border-sky-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      {open && debounced.trim() && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[min(70vh,420px)] overflow-auto rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          role="listbox"
        >
          {previewHits.length === 0 ? (
            <p className="p-4 text-sm text-zinc-500">
              No matches. The list below is filtered too — clear the search to see everything.
            </p>
          ) : (
            previewHits.map((q) => (
              <button
                key={q.id}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => {
                  const el = document.getElementById(`resume-q-${q.id}`);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setOpen(false);
                }}
                className="flex w-full flex-col gap-0.5 border-b border-zinc-50 px-4 py-3 text-left last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-50">{q.question}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
