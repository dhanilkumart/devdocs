import Link from "next/link";
import { searchAll, type UnifiedHit } from "@/lib/search";
import { getInterviewCardBlurb, interviewSlug } from "@/lib/interviewDisplay";

export const metadata = {
  title: "Search results",
};

function hitHref(hit: UnifiedHit): string {
  switch (hit.kind) {
    case "page":
      return hit.item.path;
    case "doc":
      return `/docs/${hit.item.id}`;
    case "interview":
      return `/question/${interviewSlug(hit.item)}`;
    case "resume":
      return `/resume-based#resume-q-${hit.item.id}`;
    case "glossary":
      return `/keyword/${hit.item.slug}`;
    case "section":
      return `/interview/section/${hit.item.slug}`;
  }
}

function hitMeta(hit: UnifiedHit): string {
  switch (hit.kind) {
    case "page":
      return "Page";
    case "doc":
      return `Topic - ${hit.item.category}`;
    case "interview":
      return `Interview - ${hit.item.technology} - ${hit.item.level}`;
    case "resume":
      return hit.item.project ? `Resume - ${hit.item.topic} - ${hit.item.project}` : `Resume - ${hit.item.topic}`;
    case "glossary":
      return hit.item.category ? `Keyword - ${hit.item.category}` : "Keyword";
    case "section":
      return `Section - ${hit.item.technology}`;
  }
}

function hitTitle(hit: UnifiedHit): string {
  switch (hit.kind) {
    case "page":
    case "doc":
    case "section":
      return hit.item.title;
    case "interview":
    case "resume":
      return hit.item.question;
    case "glossary":
      return hit.item.term;
  }
}

function hitSummary(hit: UnifiedHit): string {
  switch (hit.kind) {
    case "page":
    case "doc":
      return hit.item.summary;
    case "section":
      return hit.item.description;
    case "interview":
      return getInterviewCardBlurb(hit.item);
    case "resume":
      return hit.item.short ?? hit.item.answer;
    case "glossary":
      return hit.item.short;
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = (typeof q === "string" ? q : String(q)).trim();
  const hits = searchAll(query, 80);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Search results</h1>
        {query ? (
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Showing app-wide matches for{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-200">&quot;{query}&quot;</span>
          </p>
        ) : (
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Enter a keyword in the search bar to search docs, interviews, glossary terms, resume answers, and app pages.
          </p>
        )}
      </header>

      {!query && (
        <p className="text-sm text-zinc-500">
          Tip: try <Link href="/search?q=useState">useState</Link>,{" "}
          <Link href="/search?q=Fiber">Fiber</Link>,{" "}
          <Link href="/search?q=resume">resume</Link>, or{" "}
          <Link href="/search?q=GraphQL">GraphQL mutation</Link>.
        </p>
      )}

      {query && hits.length === 0 && (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          No results. Adjust spelling or browse categories from the home page.
        </p>
      )}

      <ul className="space-y-4">
        {hits.map((h) => (
          <li
            key={`${h.kind}-${hitHref(h)}`}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <Link
              href={hitHref(h)}
              className="font-semibold text-zinc-900 hover:text-sky-600 dark:text-zinc-50 dark:hover:text-sky-400"
            >
              {hitTitle(h)}
            </Link>
            <p className="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">{hitMeta(h)}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {hitSummary(h)}
            </p>
            {h.kind === "doc" && (
              <div className="mt-2 flex flex-wrap gap-2">
                {h.item.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
