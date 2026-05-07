import Link from "next/link";
import { notFound } from "next/navigation";
import { BookmarkButton } from "@/components/docs/BookmarkButton";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocMarkdown } from "@/lib/markdown-lite";
import { getDocById, getInterviewById, allDocs } from "@/lib/data";
import { interviewSlug } from "@/lib/interviewDisplay";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allDocs.map((d) => ({ slug: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocById(slug);
  if (!doc) return { title: "Not found" };
  return {
    title: doc.title,
    description: doc.summary,
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDocById(slug);
  if (!doc) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{doc.category}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{doc.title}</h1>
          <p className="mt-2 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">{doc.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {doc.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <BookmarkButton id={doc.id} title={doc.title} />
      </div>

      <DocMarkdown content={doc.content} />

      {doc.code_examples.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Code examples</h2>
          <div className="space-y-6">
            {doc.code_examples.map((ex, i) => (
              <CodeBlock key={i} code={ex.code} language={ex.language} title={ex.title} />
            ))}
          </div>
        </section>
      )}

      {doc.related_questions.length > 0 && (
        <section className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Related interview questions</h2>
          <ul className="mt-3 space-y-2">
            {doc.related_questions.map((rq) => {
              const iq = getInterviewById(rq.id);
              return (
                <li key={rq.id}>
                  <Link
                    href={`/question/${interviewSlug(iq ?? { id: rq.id })}`}
                    className="text-sky-600 hover:underline dark:text-sky-400"
                  >
                    {iq?.question ?? rq.preview}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-5 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">AI-style explanation (optional)</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          For a conversational walkthrough, paste this topic into your preferred LLM with the code samples above. DevDocs
          AI ships curated facts only—no runtime model calls.
        </p>
      </section>
    </div>
  );
}
