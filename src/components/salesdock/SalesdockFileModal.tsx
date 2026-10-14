"use client";

import React, { useEffect, useRef } from "react";
import { SalesdockDoc } from "@/data/salesdock-docs";
import { SalesdockMarkdown } from "@/components/salesdock/SalesdockMarkdown";

interface SalesdockFileModalProps {
  doc: SalesdockDoc | null;
  onClose: () => void;
  onOpenAnotherDoc?: (doc: SalesdockDoc) => void;
}

export function SalesdockFileModal({ doc, onClose, onOpenAnotherDoc }: SalesdockFileModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!doc) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => dialogRef.current?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    };

    // Use capture phase so this nested modal intercepts and stops Escape first
    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      previouslyFocused?.focus?.();
    };
  }, [doc, onClose]);

  if (!doc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="file-modal-title"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-zinc-950/80 px-2 py-4 backdrop-blur-md sm:items-center sm:px-4 sm:py-8"
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl outline-none dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-200 bg-zinc-50/90 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-sky-700 dark:bg-sky-950/90 dark:text-sky-300">
                <svg className="h-3.5 w-3.5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {doc.path}
              </span>
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400">
                Documentation Preview
              </span>
            </div>
            <h2
              id="file-modal-title"
              className="text-base font-bold font-mono text-zinc-900 sm:text-lg dark:text-zinc-50 leading-snug truncate"
            >
              {doc.title || doc.filename}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close document preview"
            className="-mr-1 -mt-1 rounded-lg p-2 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 space-y-4">
          <SalesdockMarkdown
            content={doc.content}
            onSourceClick={onOpenAnotherDoc ? (anotherDoc) => onOpenAnotherDoc(anotherDoc) : undefined}
          />
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between border-t border-zinc-200 bg-zinc-50/90 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-6">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            Press <kbd className="rounded border border-zinc-300 px-1 py-0.5 font-mono text-[10px] dark:border-zinc-700">Esc</kbd> or click backdrop to close preview
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 transition"
          >
            Back to Q&amp;A
          </button>
        </footer>
      </div>
    </div>
  );
}
