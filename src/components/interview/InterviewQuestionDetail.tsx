import Link from "next/link";
import { InterviewAnswerContent } from "@/components/interview/InterviewAnswerContent";
import { QuestionSaveButton } from "@/components/interview/QuestionSaveButton";
import { TechText } from "@/components/keyword/TechText";
import type { InterviewQuestion } from "@/types";

export function InterviewQuestionDetail({ q }: { q: InterviewQuestion }) {
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
          <TechText text={q.question} />
        </h1>
      </header>

      <InterviewAnswerContent q={q} />

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/interview" className="font-medium text-sky-600 hover:underline dark:text-sky-400">
          â† Back to all practice questions
        </Link>
      </p>
    </article>
  );
}
