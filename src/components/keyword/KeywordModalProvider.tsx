"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { KeywordModal } from "@/components/keyword/KeywordModal";

type Ctx = {
  openKeyword: (slug: string) => void;
  closeKeyword: () => void;
  currentSlug: string | null;
};

const KeywordModalCtx = createContext<Ctx | null>(null);

/**
 * Wraps the app so any descendant can call `useKeywordModal().openKeyword(slug)`
 * to surface the keyword detail panel. There is exactly one modal mounted at
 * the root, so chips don't each render their own — that keeps the DOM small
 * even on pages with hundreds of keyword chips in prose.
 */
export function KeywordModalProvider({ children }: { children: ReactNode }) {
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  const openKeyword = useCallback((slug: string) => setCurrentSlug(slug), []);
  const closeKeyword = useCallback(() => setCurrentSlug(null), []);

  // Close on Escape from anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCurrentSlug(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<Ctx>(() => ({ openKeyword, closeKeyword, currentSlug }), [
    openKeyword,
    closeKeyword,
    currentSlug,
  ]);

  return (
    <KeywordModalCtx.Provider value={value}>
      {children}
      <KeywordModal slug={currentSlug} onClose={closeKeyword} onNavigate={openKeyword} />
    </KeywordModalCtx.Provider>
  );
}

export function useKeywordModal(): Ctx {
  const ctx = useContext(KeywordModalCtx);
  if (!ctx) throw new Error("useKeywordModal must be used inside <KeywordModalProvider>.");
  return ctx;
}
