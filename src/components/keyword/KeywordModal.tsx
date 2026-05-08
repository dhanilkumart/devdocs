"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { TechText } from "@/components/keyword/TechText";
import { getGlossaryEntry, relatedEntries } from "@/lib/glossary";

function formatBody(text: string) {
  const blocks = text.trim().split(/\n\n+/);
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
      {blocks.map((block, i) => (
        <p key={i}>
          <TechText text={block} />
        </p>
      ))}
    </div>
  );
}

function guessLanguage(code: string): string {
  if (/:\s*(string|number|boolean|void|Promise|interface|type)\b/.test(code)) return "typescript";
  if (code.includes("useState") || code.includes("useEffect") || code.includes("export default")) return "tsx";
  if (code.startsWith("#") || code.includes("docker") || code.includes("vercel")) return "bash";
  return "javascript";
}

/**
 * Centered modal that displays a glossary entry. The provider mounts exactly
 * one of these and feeds it the currently-open slug. `onNavigate` lets nested
 * keyword chips inside the modal swap which entry is shown without closing.
 */
export function KeywordModal({
  slug,
  onClose,
  onNavigate,
}: {
  slug: string | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock background scroll while open + restore previous focus on close.
  useEffect(() => {
    if (!slug) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [slug]);

  if (!slug) return null;
  const entry = getGlossaryEntry(slug);
  if (!entry) return null;

  const related = relatedEntries(entry);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyword-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/60 px-2 py-4 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl outline-none dark:border-zinc-800 dark:bg-zinc-950"
      >
        <header className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
              {entry.category ?? "Keyword"}
            </p>
            <h2 id="keyword-modal-title" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {entry.term}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-m-1 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
            <TechText text={entry.short} />
          </p>

          {formatBody(entry.long)}

          {entry.example && (
            <section className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Example
              </h3>
              <CodeBlock code={entry.example} language={guessLanguage(entry.example)} title="Snippet" />
            </section>
          )}

          {related.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Related
              </h3>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => onNavigate(r.slug)}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-sky-700 dark:hover:bg-sky-950/40 dark:hover:text-sky-300"
                  >
                    {r.term}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
          <span className="text-xs text-zinc-500">Press Esc to close</span>
          <Link
            href={`/keyword/${entry.slug}`}
            onClick={onClose}
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
          >
            Open full page →
          </Link>
        </footer>
      </div>
    </div>
  );
}
