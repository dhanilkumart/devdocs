"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

type Ctx = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const MobileSidebarContext = createContext<Ctx | null>(null);

export function useMobileSidebar() {
  const ctx = useContext(MobileSidebarContext);
  if (!ctx) {
    throw new Error("useMobileSidebar must be used within MobileSidebarProvider");
  }
  return ctx;
}

function MobileSidebarDrawer() {
  const { open, setOpen } = useMobileSidebar();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close menu"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-sidebar-title"
        className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h2 id="mobile-sidebar-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Topics
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="sidebar-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-4 pr-2">
          <Sidebar />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function MobileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <MobileSidebarContext.Provider value={value}>
      {children}
      <MobileSidebarDrawer />
    </MobileSidebarContext.Provider>
  );
}
