import { InterviewPageClient } from "@/components/interview/InterviewPageClient";
import { allInterviews } from "@/lib/data";

export const metadata = {
  title: "Interview preparation",
  description: "Topic-wise interview questions with answers, explanations, and examples.",
};

export default function InterviewPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Interview preparation</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Filter by technology and by focus (core language vs web/DOM). Documentation topics live under{" "}
          <strong>Topics</strong> in the sidebar—this page is Q&amp;A only. On each card, read{" "}
          <strong>Quick answer</strong> first; <strong>More detail</strong> adds context and phrasing for real interviews.
        </p>
        <p className="mt-2 text-sm text-zinc-500">{allInterviews.length} questions in the bank.</p>
      </header>
      <InterviewPageClient />
    </div>
  );
}
