import type { InterviewQuestion } from "@/types";

export function QuestionCard({ q }: { q: InterviewQuestion }) {
  return (
    <article
      id={q.id}
      className="scroll-mt-28 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-950 dark:text-violet-200">
          {q.technology}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {q.level}
        </span>
      </div>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{q.question}</h2>
      <div className="mt-4 space-y-4 text-[15px]">
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Answer</h3>
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{q.answer}</p>
        </section>
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Explanation</h3>
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{q.explanation}</p>
        </section>
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">Example</h3>
          <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-[13px] leading-relaxed text-zinc-100">
            <code>{q.example}</code>
          </pre>
        </section>
      </div>
    </article>
  );
}
