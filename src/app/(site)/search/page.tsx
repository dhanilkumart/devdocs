import Link from "next/link";
import { searchAll } from "@/lib/search";

export const metadata = {
  title: "Search results",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = (typeof q === "string" ? q : String(q)).trim();
  const hits = searchAll(query, 40);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Search results</h1>
        {query ? (
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Showing matches for <span className="font-medium text-zinc-900 dark:text-zinc-200">&quot;{query}&quot;</span>
          </p>
        ) : (
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Enter a keyword in the search bar to see ranked results.</p>
        )}
      </header>

      {!query && (
        <p className="text-sm text-zinc-500">
          Tip: try <Link href="/search?q=useState">useState</Link>,{" "}
          <Link href="/search?q=closures">closures</Link>, or{" "}
          <Link href="/search?q=GraphQL">GraphQL mutation</Link>.
        </p>
      )}

      {query && hits.length === 0 && (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          No results. Adjust spelling or browse categories from the home page.
        </p>
      )}

      <ul className="space-y-4">
        {hits.map((h) =>
          h.kind === "doc" ? (
            <li
              key={`d-${h.item.id}`}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <Link href={`/docs/${h.item.id}`} className="font-semibold text-zinc-900 hover:text-sky-600 dark:text-zinc-50 dark:hover:text-sky-400">
                {h.item.title}
              </Link>
              <p className="mt-1 text-xs font-medium text-sky-600 dark:text-sky-400">{h.item.category}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{h.item.summary}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {h.item.tags.map((t) => (
                  <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ) : (
            <li
              key={`i-${h.item.id}`}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              <Link
                href={`/interview#${h.item.id}`}
                className="font-semibold text-zinc-900 hover:text-violet-600 dark:text-zinc-50 dark:hover:text-violet-400"
              >
                {h.item.question}
              </Link>
              <p className="mt-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                {h.item.technology} · {h.item.level}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{h.item.answer}</p>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
