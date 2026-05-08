import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { TechText } from "@/components/keyword/TechText";
import { getGlossaryEntry, glossary, relatedEntries } from "@/lib/glossary";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return glossary.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) return { title: "Keyword not found" };
  return {
    title: `${entry.term} — keyword detail`,
    description: entry.short,
  };
}

function guessLanguage(code: string): string {
  if (/:\s*(string|number|boolean|void|Promise|interface|type)\b/.test(code)) return "typescript";
  if (code.includes("useState") || code.includes("useEffect") || code.includes("export default")) return "tsx";
  if (code.startsWith("#") || code.includes("docker") || code.includes("vercel")) return "bash";
  return "javascript";
}

export default async function KeywordPage({ params }: Props) {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) notFound();

  const related = relatedEntries(entry);

  return (
    <article className="mx-auto max-w-3xl space-y-8 pb-16">
      <nav className="text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700 dark:text-zinc-300">Keyword</span>
        <span className="mx-2">/</span>
        <span className="text-zinc-700 dark:text-zinc-300">{entry.term}</span>
      </nav>

      <header className="space-y-3 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        {entry.category && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
            {entry.category}
          </p>
        )}
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {entry.term}
        </h1>
        <p className="text-pretty text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          <TechText text={entry.short} />
        </p>
      </header>

      <section className="space-y-4 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        {entry.long.split(/\n\n+/).map((block, i) => (
          <p key={i}>
            <TechText text={block} />
          </p>
        ))}
      </section>

      {entry.example && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Example
          </h2>
          <CodeBlock code={entry.example} language={guessLanguage(entry.example)} title="Snippet" />
        </section>
      )}

      {entry.aliases.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Also written as
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {entry.aliases.map((a) => (
              <span
                key={a}
                className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {a}
              </span>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Related keywords
          </h2>
          <ul className="mt-3 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/keyword/${r.slug}`}
                  className="text-[15px] font-medium text-sky-700 hover:underline dark:text-sky-400"
                >
                  {r.term}
                </Link>
                <span className="ml-2 text-sm text-zinc-500 dark:text-zinc-400">— {r.short}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
