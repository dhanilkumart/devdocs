import type { ReactNode } from "react";

/**
 * Sticky horizontal container for an in-page search bar. Tucks under the
 * site's sticky header on mobile (top-[60px]) and snaps to the top of the
 * scroll container on desktop (lg:top-0). Slight backdrop-blur so content
 * scrolling underneath stays legible. Z stays below the global header
 * (z-40) so the header search keeps priority.
 *
 * Used on the per-section interview page and the Resume Based page so the
 * search bar stays accessible no matter how far the user has scrolled.
 */
export function StickySearchShell({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="sticky top-[68px] z-30 -mx-4 border-b border-zinc-200/80 bg-zinc-50/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-6 lg:px-6 dark:border-zinc-800 dark:bg-zinc-950/90">
      {children}
      {hint && (
        <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-500">{hint}</p>
      )}
    </div>
  );
}
