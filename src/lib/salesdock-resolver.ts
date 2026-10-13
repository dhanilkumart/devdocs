import { SALESDOCK_DOCS } from "@/data/salesdock-docs";

/**
 * Normalizes a source code file path (e.g. "src/types/discount.ts" or "types/discount.ts")
 * and attempts to find its corresponding Salesdock documentation page route.
 *
 * Returns the resolved Next.js route path (e.g. "/salesdock-assignment/discount.md"),
 * or null if no corresponding doc exists.
 */
export function resolveSalesdockSourcePath(rawPath: string): string | null {
  const clean = rawPath.trim().replace(/^`|`$/g, "");
  // Strip optional leading "src/" or "./src/" or "./"
  const withoutSrc = clean.replace(/^(\.\/)?src\//, "").replace(/^\.\//, "");
  const baseFilename = clean.split("/").pop() || "";
  const baseWithoutExt = baseFilename.replace(/\.[^.]+$/, "");

  // Match against SALESDOCK_DOCS
  const found = SALESDOCK_DOCS.find((doc) => {
    // 1. Direct match on doc.title (e.g. "discount.ts" === "discount.ts")
    if (doc.title === baseFilename) return true;

    // 2. Direct match on relative path without .md extension
    // doc.path is e.g. "types/discount.md", withoutSrc is e.g. "types/discount.ts"
    const docPathWithoutExt = doc.path.replace(/\.md$/, "");
    const queryPathWithoutExt = withoutSrc.replace(/\.[^.]+$/, "");
    if (docPathWithoutExt === queryPathWithoutExt) return true;

    // 3. Match filename without extension
    if (doc.slugWithoutExt === baseWithoutExt) return true;

    return false;
  });

  if (!found) return null;

  return `/salesdock-assignment/${encodeURIComponent(found.routeSlug)}`;
}
