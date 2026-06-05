"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { docsByCategory } from "@/lib/data";
import type { TechCategory } from "@/types";

export const SIDEBAR_CATEGORIES = [
  {
    name: "JavaScript",
    slug: "javascript",
    sourceCategories: ["JavaScript"] as TechCategory[],
    accent: "text-amber-600 dark:text-amber-400",
  },
  {
    name: "React",
    slug: "react",
    sourceCategories: ["React", "Redux"] as TechCategory[],
    accent: "text-sky-600 dark:text-sky-400",
  },
  {
    name: "TypeScript",
    slug: "typescript",
    sourceCategories: ["TypeScript"] as TechCategory[],
    accent: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Next.js",
    slug: "nextjs",
    sourceCategories: ["Next.js"] as TechCategory[],
    accent: "text-zinc-900 dark:text-zinc-100",
  },
  {
    name: "HTML/CSS",
    slug: "html-css",
    sourceCategories: ["HTML5", "CSS3"] as TechCategory[],
    accent: "text-pink-600 dark:text-pink-400",
  },
  {
    name: "GraphQL",
    slug: "graphql",
    sourceCategories: ["GraphQL"] as TechCategory[],
    accent: "text-violet-600 dark:text-violet-400",
  },
  {
    name: "DevOps",
    slug: "devops",
    sourceCategories: ["DevOps"] as TechCategory[],
    accent: "text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "GIT",
    slug: "git",
    sourceCategories: ["GIT"] as TechCategory[],
    accent: "text-red-600 dark:text-red-400",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  const sidebarData = useMemo(() => {
    return SIDEBAR_CATEGORIES.map((item) => {
      const docs = item.sourceCategories.flatMap((cat) => docsByCategory(cat));
      return {
        ...item,
        docs,
      };
    });
  }, []);

  // Sync hash state
  useEffect(() => {
    setActiveHash(window.location.hash);

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    const activeCat = SIDEBAR_CATEGORIES.find((item) => pathname === `/docs/${item.slug}`);
    if (activeCat) return new Set([activeCat.slug]);
    return new Set(SIDEBAR_CATEGORIES.map((c) => c.slug));
  });

  function toggleCategory(slug: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function handleItemClick(e: React.MouseEvent<HTMLAnchorElement>, slug: string, id: string) {
    if (pathname === `/docs/${slug}`) {
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `#${id}`);
        setActiveHash(`#${id}`);
      }
    }
  }

  return (
    <nav className="flex flex-col gap-6 text-sm" aria-label="Documentation topics">
      {sidebarData.map((item) => {
        const open = openCategories.has(item.slug);
        const listId = `sidebar-${item.slug}`;
        const isPageActive = pathname === `/docs/${item.slug}`;

        return (
          <div key={item.slug} className="space-y-2">
            <div className={`flex items-center justify-between rounded-lg px-2 py-1 transition ${
              isPageActive
                ? "bg-zinc-100/80 dark:bg-zinc-900/50"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}>
              <Link
                href={`/docs/${item.slug}`}
                className={`font-semibold hover:underline flex-grow ${item.accent}`}
              >
                {item.name}
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">{item.docs.length}</span>
                <button
                  type="button"
                  onClick={() => toggleCategory(item.slug)}
                  aria-expanded={open}
                  aria-controls={listId}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/50 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  aria-label={`${open ? "Collapse" : "Expand"} ${item.name}`}
                >
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7 4.5 12.5 10 7 15.5V4.5Z" />
                  </svg>
                </button>
              </div>
            </div>

            {open && (
              <ul id={listId} className="space-y-1 border-l border-zinc-200 dark:border-zinc-700">
                {item.docs.map((d) => {
                  const active = isPageActive && activeHash === `#${d.id}`;
                  return (
                    <li key={d.id}>
                      <Link
                        href={`/docs/${item.slug}#${d.id}`}
                        onClick={(e) => handleItemClick(e, item.slug, d.id)}
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
