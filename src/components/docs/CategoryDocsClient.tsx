"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { BookmarkButton } from "@/components/docs/BookmarkButton";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocMarkdown } from "@/lib/markdown-lite";
import { getInterviewById } from "@/lib/data";
import { interviewSlug } from "@/lib/interviewDisplay";
import type { DocTopic } from "@/types";

interface CategoryDocsClientProps {
  title: string;
  slug: string;
  docs: DocTopic[];
}

export function CategoryDocsClient({ title, slug, docs }: CategoryDocsClientProps) {
  const [query, setQuery] = useState("");
  const [activeHash, setActiveHash] = useState("");
  const initialScrollDone = useRef(false);

  // Initialize Fuse search
  const fuse = useMemo(() => {
    return new Fuse(docs, {
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 1,
      ignoreLocation: true,
      keys: [
        { name: "title", weight: 0.4 },
        { name: "tags", weight: 0.2 },
        { name: "summary", weight: 0.2 },
        { name: "content", weight: 0.2 },
      ],
    });
  }, [docs]);

  // Filter docs based on query
  const filteredDocs = useMemo(() => {
    if (!query.trim()) return docs;
    const results = fuse.search(query);
    return results.map((r) => r.item);
  }, [query, docs, fuse]);

  // Handle hash changes and scroll to anchor
  useEffect(() => {
    setActiveHash(window.location.hash);

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Smooth scroll to active hash anchor
  useEffect(() => {
    if (!activeHash) return;
    const targetId = activeHash.substring(1);
    
    // We delay the scroll slightly to ensure the DOM elements are fully mounted
    const timer = setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeHash]);

  // Initial scroll on page load/hydration
  useEffect(() => {
    if (initialScrollDone.current || typeof window === "undefined") return;
    if (window.location.hash) {
      setActiveHash(window.location.hash);
      initialScrollDone.current = true;
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{title} Documentation</h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Showing all topics for {title}. Use the search bar below to filter within this page.
        </p>
      </div>

      {/* Full-width container search bar */}
      <div className="relative w-full">
        <label htmlFor="category-search" className="sr-only">
          Search {title} documentation
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
            id="category-search"
            type="search"
            placeholder={`Search within ${title} documentation...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-12 pr-4 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-sky-400 dark:focus:ring-sky-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-3.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Docs List */}
      <div className="space-y-16">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => {
            const isTarget = activeHash === `#${doc.id}`;
            return (
              <article
                key={doc.id}
                id={doc.id}
                className={`scroll-mt-24 rounded-2xl border p-6 transition-all duration-300 ${
                  isTarget
                    ? "border-sky-500 bg-sky-50/10 shadow-sm ring-1 ring-sky-500/20 dark:border-sky-500/50 dark:bg-sky-950/5"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/20"
                }`}
              >
                {/* Doc Header */}
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-800/80">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      {doc.category}
                    </span>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {doc.title}
                    </h2>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">{doc.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {doc.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <BookmarkButton id={doc.id} title={doc.title} />
                </div>

                {/* Markdown Content */}
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <DocMarkdown content={doc.content} />
                </div>

                {/* Code Examples */}
                {doc.code_examples.length > 0 && (
                  <section className="mt-8">
                    <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Code examples
                    </h3>
                    <div className="space-y-4">
                      {doc.code_examples.map((ex, i) => (
                        <CodeBlock key={i} code={ex.code} language={ex.language} title={ex.title} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Related Questions */}
                {doc.related_questions.length > 0 && (
                  <section className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/30">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      Related interview questions
                    </h3>
                    <ul className="mt-2.5 space-y-1.5 text-sm">
                      {doc.related_questions.map((rq) => {
                        const iq = getInterviewById(rq.id);
                        return (
                          <li key={rq.id}>
                            <Link
                              href={`/question/${interviewSlug(iq ?? { id: rq.id })}`}
                              className="text-sky-600 hover:underline dark:text-sky-400"
                            >
                              {iq?.question ?? rq.preview}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}
              </article>
            );
          })
        ) : (
          /* Empty Search State */
          <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
            <svg
              className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">No results found</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              We couldn't find any documentation matching "{query}".
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex items-center rounded-lg bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                Clear search query
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
