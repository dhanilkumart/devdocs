"use client";

import { useMobileSidebar } from "@/components/layout/MobileSidebarProvider";

export function MobileMenuButton() {
  const { setOpen } = useMobileSidebar();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 lg:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      aria-label="Open documentation menu"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
