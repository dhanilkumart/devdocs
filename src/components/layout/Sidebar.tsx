"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  General: "text-emerald-600 dark:text-emerald-400",
};

export function Sidebar() {
  const pathname = usePathname();
  const currentSlug = pathname.startsWith("/docs/") ? pathname.slice("/docs/".length) : undefined;

  return (
    <nav className="flex flex-col gap-6 text-sm" aria-label="Documentation topics">
      {CATEGORIES.map((cat) => {
        const docs = docsByCategory(cat);
        return (
          <div key={cat}>
            <p className={`mb-2 font-semibold ${accent[cat]}`}>{cat}</p>
            <ul className="space-y-1 border-l border-zinc-200 dark:border-zinc-700">
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
          </div>
        );
      })}
    </nav>
  );
}
