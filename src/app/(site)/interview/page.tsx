import { InterviewPageClient } from "@/components/interview/InterviewPageClient";
import { allInterviews } from "@/lib/data";

export const metadata = {
  title: "Practice questions",
  description:
    "Interview-style questions with short answers on cards and full guides on each question page—plain English, code, and tips.",
};

export default function InterviewPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Practice questions</h1>
        <p className="mt-2 max-w-2xl text-pretty text-lg text-zinc-600 dark:text-zinc-400">
          Cards stay easy to scan. Open any question for a full breakdown: explanation, real-world use, code, common
          mistakes, and how to say it in an interview.
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">{allInterviews.length} questions · filter by topic below</p>
      </header>
      <InterviewPageClient />
    </div>
  );
}
