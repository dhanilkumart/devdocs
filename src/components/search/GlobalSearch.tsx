"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchAll } from "@/lib/search";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { interviewSlug } from "@/lib/interviewDisplay";

export function GlobalSearch() {
  const router = useRouter();
  const { items: recent, push: pushRecent, ready: recentReady } = useRecentSearches();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 120);
    return () => clearTimeout(t);
  }, [query]);

  const hits = useMemo(() => {
    if (!debounced.trim()) return [];
    return searchAll(debounced, 12);
  }, [debounced]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const goSearchPage = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    pushRecent(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }, [pushRecent, query, router]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (hits.length > 0) {
        const first = hits[0];
        pushRecent(query.trim());
        if (first.kind === "doc") router.push(`/docs/${first.item.id}`);
        else router.push(`/question/${interviewSlug(first.item)}`);
      } else goSearchPage();
      setOpen(false);
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-xl">
      <label htmlFor="global-search" className="sr-only">
        Search documentation and interviews
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          id="global-search"
          type="search"
          autoComplete="off"
          placeholder="Search topics, tags, interview questions…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-10 text-base text-zinc-900 shadow-sm outline-none ring-sky-500/40 placeholder:text-zinc-400 focus:border-sky-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
        <button
          type="button"
          onClick={goSearchPage}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Search
        </button>
      </div>

      {open && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[min(70vh,420px)] overflow-auto rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          role="listbox"
        >
          {!debounced.trim() && recentReady && recent.length > 0 && (
            <div className="border-b border-zinc-100 p-3 dark:border-zinc-800">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Recent</p>
              <ul className="space-y-1">
                {recent.slice(0, 6).map((r) => (
                  <li key={r.at + r.query}>
                    <button
                      type="button"
                      className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      onClick={() => {
                        setQuery(r.query);
                        router.push(`/search?q=${encodeURIComponent(r.query)}`);
                        setOpen(false);
                      }}
                    >
                      {r.query}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {debounced.trim() && hits.length === 0 && (
            <p className="p-4 text-sm text-zinc-500">No matches. Try another keyword or browse the sidebar.</p>
          )}

          {hits.map((h) =>
            h.kind === "doc" ? (
              <Link
                key={`d-${h.item.id}`}
                href={`/docs/${h.item.id}`}
                role="option"
                className="flex flex-col gap-0.5 border-b border-zinc-50 px-4 py-3 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                onClick={() => {
                  pushRecent(debounced);
                  setOpen(false);
                }}
              >
                <span className="text-xs font-medium text-sky-600 dark:text-sky-400">Topic · {h.item.category}</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">{h.item.title}</span>
                <span className="line-clamp-2 text-xs text-zinc-500">{h.item.summary}</span>
              </Link>
            ) : (
              <Link
                key={`i-${h.item.id}`}
                href={`/question/${interviewSlug(h.item)}`}
                role="option"
                className="flex flex-col gap-0.5 border-b border-zinc-50 px-4 py-3 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                onClick={() => {
                  pushRecent(debounced);
                  setOpen(false);
                }}
              >
                <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                  Interview · {h.item.technology} · {h.item.level}
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">{h.item.question}</span>
              </Link>
            ),
          )}

          {debounced.trim() && hits.length > 0 && (
            <button
              type="button"
              className="w-full border-t border-zinc-100 px-4 py-2.5 text-center text-sm font-medium text-sky-600 dark:border-zinc-800 dark:text-sky-400"
              onClick={() => {
                goSearchPage();
                setOpen(false);
              }}
            >
              View all results for &quot;{debounced.trim()}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
