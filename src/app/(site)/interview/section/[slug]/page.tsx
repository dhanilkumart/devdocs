import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InterviewCardCompact } from "@/components/interview/InterviewCardCompact";
import { InterviewSectionSearch } from "@/components/interview/InterviewSectionSearch";
import { StickySearchShell } from "@/components/layout/StickySearchShell";
import { INTERVIEW_SECTIONS, getInterviewSection, interviewsBySection } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return INTERVIEW_SECTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = getInterviewSection(slug);
  if (!section) return { title: "Section not found" };
  return {
    title: `${section.title} interview questions`,
    description: section.description,
  };
}

export default async function InterviewSectionPage({ params }: Props) {
  const { slug } = await params;
  const section = getInterviewSection(slug);
  if (!section) notFound();

  const questions = interviewsBySection(slug);

  return (
    <div className="space-y-8">
      <nav className="text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/interview" className="hover:text-sky-600 dark:hover:text-sky-400">
          Practice
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700 dark:text-zinc-300">{section.title}</span>
      </nav>

      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
          {section.technology} · Section
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{section.title}</h1>
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {section.description}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          {questions.length} curated questions · search stays inside this page
        </p>
      </header>

      <StickySearchShell hint="Type a keyword above to fuzzy-match questions, answers, and code in this section only.">
        <InterviewSectionSearch items={questions} sectionTitle={section.title} />
      </StickySearchShell>

      {questions.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white p-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          No questions in this section yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q) => (
            <InterviewCardCompact key={q.id} q={q} />
          ))}
        </div>
      )}

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/interview" className="font-medium text-sky-600 hover:underline dark:text-sky-400">
          ← Back to all sections
        </Link>
      </p>
    </div>
  );
}
