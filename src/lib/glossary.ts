import type { GlossaryEntry } from "@/types";
import data from "@/data/glossary.json";
import javascriptData from "@/data/glossary-javascript.json";

export const glossary: GlossaryEntry[] = [
  ...(data as GlossaryEntry[]),
  ...(javascriptData as GlossaryEntry[]),
];

const bySlug = new Map(glossary.map((e) => [e.slug, e] as const));

/**
 * Lookup table from a normalized alias (lowercased) → entry. Built once at
 * module load and reused by every `<TechText>` render.
 */
const byAlias = new Map<string, GlossaryEntry>();
for (const entry of glossary) {
  const all = new Set<string>([entry.term, ...entry.aliases]);
  for (const alias of all) {
    const key = alias.toLowerCase();
    if (!byAlias.has(key)) byAlias.set(key, entry);
  }
}

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return bySlug.get(slug);
}

export function findGlossaryEntryByAlias(alias: string): GlossaryEntry | undefined {
  return byAlias.get(alias.toLowerCase());
}

/**
 * Escape a string so it can be safely embedded in a regex character class.
 * Glossary aliases include parentheses, dots, and `+` (e.g. `R&D`, `c++`),
 * any of which would change regex meaning if not escaped.
 */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const ALL_ALIASES = Array.from(
  new Set(glossary.flatMap((e) => [e.term, ...e.aliases])),
).sort((a, b) => b.length - a.length); // longest-first so multi-word matches win

/**
 * Single combined regex over every alias. Word-boundary on each side so we
 * don't match `Reduxify` for `Redux` or `MemoryLeak` for `memory leak`. The
 * `i` flag makes it case-insensitive; the `g` flag is required for matchAll.
 *
 * Note: regex alternation matches the first alternative that succeeds at a
 * given position, so the longest-first sort ensures `Redux Toolkit` wins
 * over `Redux` when both could apply.
 */
export const KEYWORD_REGEX = new RegExp(
  `(?<![\\w/])(?:${ALL_ALIASES.map(escapeRegex).join("|")})(?![\\w/])`,
  "gi",
);

/** Returns the list of related entries (resolved from slugs) for an entry. */
export function relatedEntries(entry: GlossaryEntry): GlossaryEntry[] {
  if (!entry.related?.length) return [];
  return entry.related.map((s) => bySlug.get(s)).filter((e): e is GlossaryEntry => Boolean(e));
}
