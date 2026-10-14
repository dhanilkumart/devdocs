"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { SalesdockQAItem } from "@/data/salesdock-qa";
import { SalesdockDoc } from "@/data/salesdock-docs";
import { SalesdockMarkdown } from "@/components/salesdock/SalesdockMarkdown";
import { resolveSalesdockSourcePath, findSalesdockDoc } from "@/lib/salesdock-resolver";
import { SalesdockFileModal } from "@/components/salesdock/SalesdockFileModal";

interface SalesdockQAModalProps {
  item: SalesdockQAItem | null;
  onClose: () => void;
}

export function SalesdockQAModal({ item, onClose }: SalesdockQAModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [activePreviewDoc, setActivePreviewDoc] = React.useState<SalesdockDoc | null>(null);
  const [language, setLanguage] = React.useState<"ENG" | "MAL">("ENG");

  // Reset to English when active question changes
  useEffect(() => {
    setLanguage("ENG");
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => dialogRef.current?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      // If a nested preview modal is open, let that modal handle its own Escape first
      if (e.key === "Escape") {
        if (activePreviewDoc) {
          // File preview will close via its own capture listener
          return;
        }
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [item, onClose, activePreviewDoc]);

  if (!item) return null;

  const handleOpenSourceDoc = (doc: SalesdockDoc) => {
    setActivePreviewDoc(doc);
  };

  const handleCloseSourceDoc = () => {
    setActivePreviewDoc(null);
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qa-modal-title"
        className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/70 px-2 py-4 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8"
        onClick={(e) => {
          if (e.target === e.currentTarget && !activePreviewDoc) onClose();
        }}
      >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl outline-none dark:border-zinc-800 dark:bg-zinc-950"
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-200 bg-zinc-50/80 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60 sm:px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-2">
              <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-950/80 dark:text-sky-300">
                {item.category}
              </span>
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
                {item.id}
              </span>
            </div>
            <h2
              id="qa-modal-title"
              className="text-base font-bold text-zinc-900 sm:text-lg dark:text-zinc-50 leading-snug"
            >
              {item.question}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-1 -mt-1 rounded-lg p-2 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 space-y-6">
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/40">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Summary Preview
            </h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {item.preview}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Detailed Answer &amp; Code Architecture
              </h3>

              {/* Language Switcher: Vertical Stacked Compact Buttons (MAL / ENG) */}
              <div
                className="flex flex-col overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 p-0.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                role="group"
                aria-label="Answer language switcher"
              >
                <button
                  type="button"
                  onClick={() => setLanguage("MAL")}
                  aria-pressed={language === "MAL"}
                  aria-label="Show answer in Malayalam"
                  title="Show answer in Malayalam"
                  className={`px-2 py-0.5 text-[10px] font-bold tracking-wider transition rounded-xs ${
                    language === "MAL"
                      ? "bg-sky-600 text-white shadow-xs dark:bg-sky-500"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  MAL
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("ENG")}
                  aria-pressed={language === "ENG"}
                  aria-label="Show answer in English"
                  title="Show answer in English"
                  className={`px-2 py-0.5 text-[10px] font-bold tracking-wider transition rounded-xs ${
                    language === "ENG"
                      ? "bg-sky-600 text-white shadow-xs dark:bg-sky-500"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  ENG
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <SalesdockMarkdown
                content={(language === "MAL" && item.answerMl ? item.answerMl : item.answer) || item.answer}
                onSourceClick={handleOpenSourceDoc}
              />
            </div>
          </div>

          {item.relatedFiles && item.relatedFiles.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Referenced Codebase Documentation
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.relatedFiles.map((file) => {
                  const matchedDoc = findSalesdockDoc(file);
                  if (matchedDoc) {
                    return (
                      <button
                        key={file}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenSourceDoc(matchedDoc);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/70 px-2.5 py-1 text-xs font-mono font-medium text-sky-700 hover:bg-sky-100 dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/40 transition cursor-pointer"
                      >
                        <svg className="h-3.5 w-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {file}
                      </button>
                    );
                  }

                  const resolvedHref = resolveSalesdockSourcePath(file) || `/salesdock-assignment/${encodeURIComponent(file.split("/").pop() || file)}`;
                  return (
                    <Link
                      key={file}
                      href={resolvedHref}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50/70 px-2.5 py-1 text-xs font-mono font-medium text-sky-700 hover:bg-sky-100 dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/40 transition"
                    >
                      <svg className="h-3.5 w-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {file}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between border-t border-zinc-200 bg-zinc-50/80 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/60 sm:px-6">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            Press <kbd className="rounded border border-zinc-300 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-700">Esc</kbd> to close
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition"
          >
            Close
          </button>
        </footer>
      </div>
    </div>

    {/* Layer 2: File Preview Modal (stacked on top with z-[60]) */}
    <SalesdockFileModal
      doc={activePreviewDoc}
      onClose={handleCloseSourceDoc}
      onOpenAnotherDoc={handleOpenSourceDoc}
    />
  </>
);
}
