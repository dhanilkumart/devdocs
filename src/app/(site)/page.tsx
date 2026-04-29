import Link from "next/link";
import { CATEGORIES, allDocs } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">DevDocs AI</p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Documentation and interview prep, curated for frontend & full-stack developers
        </h1>
        <p className="mt-4 text-pretty text-lg text-zinc-600 dark:text-zinc-400">
          Search across topics with fuzzy matching, explore structured guides, and practice level-tagged questions—without
          scraping raw vendor docs.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const count = allDocs.filter((d) => d.category === cat).length;
          return (
            <Link
              key={cat}
              href={`/search?q=${encodeURIComponent(cat)}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-sky-700"
            >
              <h2 className="font-semibold text-zinc-900 group-hover:text-sky-600 dark:text-zinc-50 dark:group-hover:text-sky-400">
                {cat}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">{count} curated topics</p>
            </Link>
          );
        })}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Popular entry points</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/docs/react-use-state", label: "React useState" },
            { href: "/docs/js-closures", label: "JavaScript closures" },
            { href: "/docs/graphql-queries-mutations", label: "GraphQL queries & mutations" },
            { href: "/docs/next-app-router", label: "Next.js App Router" },
            { href: "/interview", label: "Interview bank" },
            { href: "/playground", label: "HTML/CSS/JS playground" },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-sky-600 hover:underline dark:text-sky-400">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
