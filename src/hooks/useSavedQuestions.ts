"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { InterviewQuestion, SavedQuestionSnapshot } from "@/types";

const STORAGE_KEY = "devdocs-ai-saved-questions";
const CHANGE_EVENT = "devdocs-saved-questions-change";

/**
 * Module-level cache so getSnapshot returns a stable reference until the
 * underlying data actually changes. Required by useSyncExternalStore — without
 * caching, getSnapshot would return a fresh array each call and React would
 * loop forever.
 */
let cachedSnapshot: SavedQuestionSnapshot[] | null = null;

function loadFromStorage(): SavedQuestionSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is SavedQuestionSnapshot =>
        x !== null && typeof x === "object" && typeof (x as { id?: unknown }).id === "string",
    );
  } catch {
    return [];
  }
}

function getSnapshot(): SavedQuestionSnapshot[] {
  if (cachedSnapshot === null) cachedSnapshot = loadFromStorage();
  return cachedSnapshot;
}

const EMPTY_SNAPSHOT: SavedQuestionSnapshot[] = [];

function getServerSnapshot(): SavedQuestionSnapshot[] {
  return EMPTY_SNAPSHOT;
}

function subscribe(callback: () => void): () => void {
  const onChange = (e: Event) => {
    if (e instanceof StorageEvent && e.key && e.key !== STORAGE_KEY) return;
    cachedSnapshot = null;
    callback();
  };
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function write(next: SavedQuestionSnapshot[]) {
  cachedSnapshot = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Persists full snapshots of interview questions in localStorage so the
 * Saved page can display a complete copy even if the original ever changes
 * or moves. Storage is namespaced separately from the topic bookmarks hook
 * so the two features never collide. Backed by useSyncExternalStore for
 * cross-tab updates and to avoid set-state-in-effect cascades.
 */
export function useSavedQuestions() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);

  const save = useCallback((q: InterviewQuestion) => {
    const current = getSnapshot();
    if (current.some((x) => x.id === q.id)) return;
    write([{ ...q, savedAt: Date.now() }, ...current]);
  }, []);

  const remove = useCallback((id: string) => {
    write(getSnapshot().filter((x) => x.id !== id));
  }, []);

  const toggle = useCallback(
    (q: InterviewQuestion) => {
      if (has(q.id)) remove(q.id);
      else save(q);
    },
    [has, remove, save],
  );

  const clear = useCallback(() => {
    write([]);
  }, []);

  return { items, has, save, remove, toggle, clear };
}
