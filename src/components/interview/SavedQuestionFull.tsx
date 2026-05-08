"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { TechText } from "@/components/keyword/TechText";
import type { SavedQuestionSnapshot } from "@/types";
import { useSavedQuestions } from "@/hooks/useSavedQuestions";
import { interviewSlug, resolveInterview } from "@/lib/interviewDisplay";
import { allInterviews } from "@/lib/data";

function Section({
  title,
  children,
  variant = "default",
}: {
  title: string;
  children: ReactNode;
  variant?: "default" | "tip" | "warn";
}) {
  const styles =
    variant === "tip"
      ? "border-sky-200 bg-sky-50/80 dark:border-sky-900/50 dark:bg-sky-950/30"
      : variant === "warn"
        ? "border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/25"
        : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40";

  return (
    <section className={`rounded-2xl border p-5 shadow-sm ${styles}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{title}</h3>
      <div className="mt-2 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</div>
    </section>
  );
}

function formatBody(text: string) {
  const lines = text.trim().split(/\n/);
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const t = line.trim();
        if (!t) return <br key={i} />;
        if (t.startsWith("• ") || t.startsWith("- ")) {
          return (
            <p key={i} className="flex gap-2">
              <span className="shrink-0 text-sky-600 dark:text-sky-400">•</span>
              <span>
                <TechText text={t.replace(/^[•-]\s*/, "")} />
              </span>
            </p>
          );
        }
        return (
          <p key={i}>
            <TechText text={t} />
          </p>
        );
      })}
    </div>
  );
}

function guessLanguage(code: string): string {
  if (/:\s*(string|number|boolean|void|Promise|interface|type)\b/.test(code)) return "typescript";
  if (code.includes("useState") || code.includes("useEffect") || code.includes("export default")) return "tsx";
  return "javascript";
}

function formatSavedAt(ts: number): string {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

/**
 * Full snapshot view of a saved interview question — shown on the Saved page.
 * Renders directly from the localStorage snapshot so the user always sees the
 * exact content they saved, even if the source ever changes.
 */
export function SavedQuestionFull({ snapshot }: { snapshot: SavedQuestionSnapshot }) {
  const { remove } = useSavedQuestions();
  const r = resolveInterview(snapshot, allInterviews);
  const lang = guessLanguage(r.codeExample);
  const slug = interviewSlug(snapshot);

  return (
    <article className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/40 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-900 dark:bg-violet-950 dark:text-violet-200">
              {snapshot.technology}
            </span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {snapshot.level}
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              Saved {formatSavedAt(snapshot.savedAt)}
            </span>
          </div>
          <h2 className="text-xl font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{snapshot.question}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/question/${slug}`}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Open original
          </Link>
          <button
            type="button"
            onClick={() => remove(snapshot.id)}
            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/40"
          >
            Remove
          </button>
        </div>
      </header>

      <Section title="Quick answer">{formatBody(r.quickAnswer)}</Section>
      <Section title="Detailed explanation">{formatBody(r.detailedExplanation)}</Section>
      <Section title="Real-world use case">{formatBody(r.realWorldUseCase)}</Section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Code example</h3>
        <CodeBlock code={r.codeExample} language={lang} title="Example" />
      </section>

      <Section title="Common mistakes" variant="warn">
        {formatBody(r.commonMistakes)}
      </Section>
      <Section title="Interview tip" variant="tip">
        {formatBody(r.interviewTip)}
      </Section>
    </article>
  );
}
