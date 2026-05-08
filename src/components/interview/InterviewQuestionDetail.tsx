import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { QuestionSaveButton } from "@/components/interview/QuestionSaveButton";
import { TechText } from "@/components/keyword/TechText";
import type { InterviewQuestion } from "@/types";
import { interviewSlug, resolveInterview } from "@/lib/interviewDisplay";
import { allInterviews, getInterviewById } from "@/lib/data";

function DetailSection({
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
    <section className={`rounded-2xl border p-6 shadow-sm ${styles}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</div>
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

export function InterviewQuestionDetail({ q }: { q: InterviewQuestion }) {
  const r = resolveInterview(q, allInterviews);
  const lang = guessLanguage(r.codeExample);

  return (
    <article className="mx-auto max-w-3xl space-y-8 pb-16">
      <nav className="text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/interview" className="hover:text-sky-600 dark:hover:text-sky-400">
          Practice
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700 dark:text-zinc-300">Question</span>
      </nav>

      <header className="space-y-4 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-900 dark:bg-violet-950 dark:text-violet-200">
              {q.technology}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {q.level}
            </span>
          </div>
          <QuestionSaveButton q={q} />
        </div>
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          {q.question}
        </h1>
      </header>

      <DetailSection title="Quick answer">{formatBody(r.quickAnswer)}</DetailSection>

      <DetailSection title="Detailed explanation">{formatBody(r.detailedExplanation)}</DetailSection>

      <DetailSection title="Real-world use case">{formatBody(r.realWorldUseCase)}</DetailSection>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Code example</h2>
        <CodeBlock code={r.codeExample} language={lang} title="Example" />
      </section>

      <DetailSection title="Common mistakes" variant="warn">
        {formatBody(r.commonMistakes)}
      </DetailSection>

      <DetailSection title="Interview tip" variant="tip">
        {formatBody(r.interviewTip)}
      </DetailSection>

      {r.related.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Related questions
          </h2>
          <ul className="mt-4 space-y-3">
            {r.related.map((ref) => {
              const other = getInterviewById(ref.id);
              const href = `/question/${interviewSlug(other ?? { id: ref.id })}`;
              return (
                <li key={ref.id}>
                  <Link href={href} className="text-[15px] font-medium text-sky-700 hover:underline dark:text-sky-400">
                    {other?.question ?? ref.preview}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/interview" className="font-medium text-sky-600 hover:underline dark:text-sky-400">
          ← Back to all practice questions
        </Link>
      </p>
    </article>
  );
}
