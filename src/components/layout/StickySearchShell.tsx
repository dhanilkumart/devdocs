import type { ReactNode } from "react";

/**
 * Sticky horizontal container for an in-page search bar. Snaps to the bottom
 * of the scroll container (sticky bottom-0). Slight backdrop-blur so content
 * scrolling underneath stays legible.
 */
export function StickySearchShell({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="sticky bottom-0 lg:top-0 z-30 -mx-4 border-t lg:border-t-0 lg:border-b border-zinc-200/80 bg-zinc-50/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-6 lg:px-6 dark:border-zinc-800 dark:bg-zinc-950/90">
      {hint && (
        <p className="mb-2 text-[11px] text-zinc-500 dark:text-zinc-500 lg:hidden">{hint}</p>
      )}
      {children}
      {hint && (
        <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-500 hidden lg:block">{hint}</p>
      )}
    </div>
  );
}
