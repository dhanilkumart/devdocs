import type { Metadata } from "next";
import { ResumeBasedClient } from "./ResumeBasedClient";
import { allResumeQuestions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Resume Based — DevDocs",
  description:
    "Resume-driven interview questions answered in the candidate's own voice — ZEOS, AI-Kiosk, GoodHomes, ROVER, and cross-project decisions, with clickable technical keywords.",
};

export default function ResumeBasedPage() {
  const items = allResumeQuestions;

  return (
    <div className="space-y-8 pb-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
          Section · Resume Based
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Resume Based Interview Questions
        </h1>
        <p className="max-w-3xl text-pretty text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {items.length} questions and answers drawn straight from the projects on the resume — ZEOS, AI-Kiosk,
          GoodHomes, ROVER, and cross-project work. Click any technical keyword inside an answer to open the keyword
          modal with the full definition and a link to its dedicated page.
        </p>
      </header>

      <ResumeBasedClient items={items} />
    </div>
  );
}
