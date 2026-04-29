"use client";

import { useCallback, useEffect, useState } from "react";
import type { RecentSearch } from "@/types";

const STORAGE_KEY = "devdocs-ai-recent-searches";
const MAX = 12;

function read(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is RecentSearch => x && typeof x.query === "string" && typeof x.at === "number")
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function useRecentSearches() {
  const [items, setItems] = useState<RecentSearch[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read());
    setReady(true);
  }, []);

  const push = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;
    setItems((prev) => {
      const next = [{ query: q, at: Date.now() }, ...prev.filter((x) => x.query !== q)].slice(0, MAX);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { items, ready, push, clear };
}
