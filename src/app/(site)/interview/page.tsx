import { InterviewPageClient } from "@/components/interview/InterviewPageClient";
import { InterviewSectionCard } from "@/components/interview/InterviewSectionCard";
import { INTERVIEW_SECTIONS, allInterviews, countInterviewsBySection } from "@/lib/data";

export const metadata = {
  title: "Practice questions",
  description:
    "Interview-style questions grouped into focused sections — each with its own search bar — plus full guides on each question page.",
};

export default function InterviewPage() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Practice questions</h1>
        <p className="mt-2 max-w-2xl text-pretty text-lg text-zinc-600 dark:text-zinc-400">
          Cards stay easy to scan. Open any question for a full breakdown: explanation, real-world use, code, common
          mistakes, and how to say it in an interview.
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
          {allInterviews.length} questions · {INTERVIEW_SECTIONS.length} curated sections
        </p>
      </header>

      <section aria-labelledby="sections-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="sections-heading" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Sections
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Each section is its own page with a horizontal search bar that only matches questions in that section —
              the same UX as the global search, just scoped.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTERVIEW_SECTIONS.map((s) => (
            <InterviewSectionCard key={s.slug} section={s} count={countInterviewsBySection(s.slug)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="all-questions-heading" className="space-y-4">
        <div>
          <h2 id="all-questions-heading" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Browse every question
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Filter the full library by technology and focus. Use the section cards above for a tighter, in-section
            search experience.
          </p>
        </div>
        <InterviewPageClient />
      </section>
    </div>
  );
}
