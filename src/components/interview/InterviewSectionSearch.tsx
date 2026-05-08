"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { InterviewQuestion } from "@/types";
import { createInterviewIndex, searchInterviewIndex } from "@/lib/search";
import { interviewSlug } from "@/lib/interviewDisplay";

type Props = {
  /** Questions this search is scoped to (only these are indexed). */
  items: InterviewQuestion[];
  /** Section title for the placeholder + empty state copy. */
  sectionTitle: string;
};

/**
 * In-page horizontal search bar scoped to a single interview section.
 * Visually and behaviorally mirrors the global header search:
 * debounced input, dropdown of hits, click-outside dismiss, Enter to open
 * the first hit. The Fuse index is built once per `items` array.
 */
export function InterviewSectionSearch({ items, sectionTitle }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const index = useMemo(() => createInterviewIndex(items), [items]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 120);
    return () => clearTimeout(t);
  }, [query]);

  const hits = useMemo(() => {
    if (!debounced.trim()) return [];
    return searchInterviewIndex(index, debounced, 12);
  }, [index, debounced]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const goFirstHit = useCallback(() => {
    const first = hits[0];
    if (!first) return;
    router.push(`/question/${interviewSlug(first.item)}`);
    setOpen(false);
  }, [hits, router]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goFirstHit();
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <label htmlFor="section-search" className="sr-only">
        Search {sectionTitle} questions
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
          id="section-search"
          type="search"
          autoComplete="off"
          placeholder={`Search ${items.length} ${sectionTitle} questions…`}
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

      {open && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[min(70vh,420px)] overflow-auto rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          role="listbox"
        >
          {!debounced.trim() && (
            <p className="p-4 text-sm text-zinc-500">
              Type a keyword to search within this section. Results never leave the {sectionTitle} page.
            </p>
          )}

          {debounced.trim() && hits.length === 0 && (
            <p className="p-4 text-sm text-zinc-500">
              No matches in {sectionTitle}. Try another keyword or scroll the full list below.
            </p>
          )}

          {hits.map((h) => (
            <Link
              key={`s-${h.item.id}`}
              href={`/question/${interviewSlug(h.item)}`}
              role="option"
              className="flex flex-col gap-0.5 border-b border-zinc-50 px-4 py-3 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
              onClick={() => setOpen(false)}
            >
              <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                {h.item.technology} · {h.item.level}
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">{h.item.question}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
