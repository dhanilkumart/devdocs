"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORIES, docsByCategory } from "@/lib/data";
import type { TechCategory } from "@/types";

const accent: Record<TechCategory, string> = {
  JavaScript: "text-amber-600 dark:text-amber-400",
  React: "text-sky-600 dark:text-sky-400",
  Redux: "text-purple-600 dark:text-purple-400",
  TypeScript: "text-blue-600 dark:text-blue-400",
  "Next.js": "text-zinc-900 dark:text-zinc-100",
  HTML5: "text-orange-600 dark:text-orange-400",
  CSS3: "text-pink-600 dark:text-pink-400",
  GraphQL: "text-violet-600 dark:text-violet-400",
  DevOps: "text-cyan-600 dark:text-cyan-400",
  GIT: "text-red-600 dark:text-red-400",
  General: "text-emerald-600 dark:text-emerald-400",
};

export function Sidebar() {
  const pathname = usePathname();
  const currentSlug = pathname.startsWith("/docs/") ? pathname.slice("/docs/".length) : undefined;
  const docsByCat = useMemo(
    () => CATEGORIES.map((cat) => ({ cat, docs: docsByCategory(cat) })),
    [],
  );
  const currentCategory = docsByCat.find(({ docs }) => docs.some((d) => d.id === currentSlug))?.cat;
  const [openCategories, setOpenCategories] = useState<Set<TechCategory>>(() => {
    if (currentCategory) return new Set([currentCategory]);
    return new Set(CATEGORIES);
  });

  function toggleCategory(cat: TechCategory) {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <nav className="flex flex-col gap-6 text-sm" aria-label="Documentation topics">
      {docsByCat.map(({ cat, docs }) => {
        const open = openCategories.has(cat);
        const listId = `sidebar-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <div key={cat} className="space-y-2">
            <button
              type="button"
              onClick={() => toggleCategory(cat)}
              aria-expanded={open}
              aria-controls={listId}
              className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1 text-left transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:hover:bg-zinc-900"
            >
              <span className={`font-semibold ${accent[cat]}`}>{cat}</span>
              <span className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                {docs.length}
                <svg
                  className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 4.5 12.5 10 7 15.5V4.5Z" />
                </svg>
              </span>
            </button>

            {open && (
              <ul id={listId} className="space-y-1 border-l border-zinc-200 dark:border-zinc-700">
                {docs.map((d) => {
                  const active = currentSlug === d.id;
                  return (
                    <li key={d.id}>
                      <Link
                        href={`/docs/${d.id}`}
                        className={`block border-l-2 py-1 pl-3 -ml-px text-left transition ${
                          active
                            ? "border-sky-500 font-medium text-zinc-900 dark:border-sky-400 dark:text-zinc-50"
                            : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
                        }`}
                      >
                        {d.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
