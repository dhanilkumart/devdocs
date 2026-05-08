"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/interview", label: "Interview" },
  { href: "/bookmarks", label: "Saved" },
  { href: "/resume-based", label: "Resume" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
      aria-label="Mobile"
    >
      {links.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center py-2 text-[11px] font-medium ${
              active ? "text-sky-600 dark:text-sky-400" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
