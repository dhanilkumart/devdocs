"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getSalesdockQAItems, SalesdockQAItem } from "@/data/salesdock-qa";
import { SalesdockQAModal } from "@/components/salesdock/SalesdockQAModal";

export function SalesdockQAClient() {
  const allItems = useMemo(() => getSalesdockQAItems(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<SalesdockQAItem | null>(null);

  const filteredItems = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return allItems;
    return allItems.filter((item) =>
      item.question.toLowerCase().includes(trimmed)
    );
  }, [allItems, searchQuery]);

  return (
    <div className="flex flex-col relative pb-28 lg:pb-12 min-h-full">
      {/* Page Header */}
      <div className="mb-6 order-1">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3" aria-label="Breadcrumb">
          <Link
            href="/salesdock-assignment"
            className="hover:text-sky-600 dark:hover:text-sky-400 font-medium transition flex items-center gap-1"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Salesdock
          </Link>
          <span>/</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Interview Q&amp;A</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              Salesdock Interview Q&amp;A
            </h1>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Curated architectural questions and detailed answers explaining how the Salesdock discount engine and checkout application was designed and built.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            <span className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              {filteredItems.length} {filteredItems.length === 1 ? "Question" : "Questions"}
            </span>
            <Link
              href="/salesdock-assignment"
              className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-sky-400 dark:hover:text-sky-300 transition"
            >
              &larr; Codebase Tree
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Search Bar (Order 2 on desktop) */}
      <div className="hidden lg:block order-2 mb-6">
        <div className="relative w-full">
          <label htmlFor="desktop-qa-search" className="sr-only">
            Search Salesdock Interview Questions
          </label>
          <div className="relative">
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400 dark:text-zinc-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              id="desktop-qa-search"
              type="search"
              placeholder="Search Salesdock interview questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-12 pr-10 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-sky-400 dark:focus:ring-sky-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Questions Vertical List: Full-width Horizontal Tiles (Order 3) */}
      <div className="order-3 space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item)}
              aria-label={`View answer for: ${item.question}`}
              className="group relative flex w-full flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 text-left shadow-sm transition hover:border-sky-500/60 hover:shadow-md focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-sky-500/60 dark:focus:border-sky-400 dark:focus:ring-sky-400/20"
            >
              <div className="w-full space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/80 dark:text-sky-300">
                    {item.category}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                    {item.id}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {item.question}
                </h2>

                {/* 2-line preview */}
                <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.preview}
                </p>
              </div>

              <div className="mt-4 flex w-full items-center justify-end border-t border-zinc-100 pt-3 dark:border-zinc-800/80 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-sky-600 group-hover:text-sky-700 dark:text-sky-400 dark:group-hover:text-sky-300 transition-colors">
                  <span>View more</span>
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          ))
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <svg
              className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
              No interview questions found
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              No Q&amp;A items match &ldquo;{searchQuery}&rdquo;. Try another search term or reset.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 inline-flex items-center rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 transition"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Mobile Fixed Bottom Search Input (Hidden on Desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200/90 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 shadow-lg">
        <div className="relative w-full">
          <label htmlFor="mobile-qa-search" className="sr-only">
            Search Salesdock Interview Questions
          </label>
          <div className="relative">
            <svg
              className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400 dark:text-zinc-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              id="mobile-qa-search"
              type="search"
              placeholder="Search Salesdock Q&A..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-9 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-sky-400 dark:focus:ring-sky-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Answer Detail Modal */}
      <SalesdockQAModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
