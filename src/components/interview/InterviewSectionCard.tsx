import Link from "next/link";
import type { InterviewSection, TechCategory } from "@/types";

const TECH_BADGE: Record<TechCategory, string> = {
  JavaScript: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  React: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  Redux: "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200",
  TypeScript: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
  "Next.js": "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
  HTML5: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
  CSS3: "bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-200",
  GraphQL: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
  DevOps: "bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200",
  GIT: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
  General: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
};

export function InterviewSectionCard({ section, count }: { section: InterviewSection; count: number }) {
  return (
    <Link
      href={`/interview/section/${section.slug}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-sky-700"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TECH_BADGE[section.technology]}`}>
          {section.technology}
        </span>
        <span className="text-xs font-medium text-zinc-500">{count} questions</span>
      </div>
      <h3 className="text-base font-semibold leading-snug text-zinc-900 group-hover:text-sky-700 dark:text-zinc-50 dark:group-hover:text-sky-400">
        {section.title}
      </h3>
      <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{section.description}</p>
      <p className="mt-auto text-xs font-medium text-sky-600 dark:text-sky-400">
        Open section with in-page search →
      </p>
    </Link>
  );
}
