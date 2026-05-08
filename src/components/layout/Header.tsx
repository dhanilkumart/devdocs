import Link from "next/link";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenuButton } from "@/components/layout/MobileMenuButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
        <MobileMenuButton />
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 text-xs font-bold text-white">
            DA
          </span>
          <span className="hidden sm:inline">DevDocs AI</span>
        </Link>
        <div className="min-w-0 flex-1">
          <GlobalSearch />
        </div>
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
          <Link
            href="/interview"
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            Interview
          </Link>
          <Link
            href="/bookmarks"
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            Saved
          </Link>
          <Link
            href="/resume-based"
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            Resume Based
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
