import type { ReactNode } from "react";
import { Fragment } from "react";
import { findGlossaryEntryByAlias, KEYWORD_REGEX } from "@/lib/glossary";
import { KeywordChip } from "@/components/keyword/KeywordChip";

/**
 * Renders prose with every glossary keyword turned into an interactive chip.
 * Pure server-friendly text-splitter — the chip itself is the only client
 * component. Each keyword is matched at most once per render so we don't
 * blow up paragraphs that mention the same term repeatedly.
 *
 * `text` may contain `\n` newlines — they are preserved as <br /> elements,
 * so callers can pass a whole paragraph block directly.
 */
export function TechText({ text }: { text: string }) {
  if (!text) return null;
  return <>{splitWithKeywords(text)}</>;
}

function splitWithKeywords(text: string): ReactNode[] {
  // We mutate a local copy of the regex iterator because RegExp objects with
  // /g are stateful — using a shared one across renders would cause bugs.
  const regex = new RegExp(KEYWORD_REGEX.source, KEYWORD_REGEX.flags);
  const seen = new Set<string>();
  const out: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(regex)) {
    const idx = match.index ?? 0;
    const matched = match[0];
    const entry = findGlossaryEntryByAlias(matched);
    if (!entry) continue;

    // Only chip the first occurrence of a given term per text block — keeps
    // dense paragraphs readable.
    if (seen.has(entry.slug)) continue;
    seen.add(entry.slug);

    if (idx > last) out.push(renderPlain(text.slice(last, idx), out.length));
    out.push(
      <KeywordChip key={`kw-${entry.slug}-${idx}`} entry={entry} label={matched} />,
    );
    last = idx + matched.length;
  }
  if (last < text.length) out.push(renderPlain(text.slice(last), out.length));
  return out;
}

function renderPlain(chunk: string, key: number): ReactNode {
  if (!chunk.includes("\n")) return <Fragment key={key}>{chunk}</Fragment>;
  const parts = chunk.split("\n");
  return (
    <Fragment key={key}>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </Fragment>
      ))}
    </Fragment>
  );
}
