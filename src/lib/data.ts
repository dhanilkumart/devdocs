import type {
  DocTopic,
  InterviewQuestion,
  InterviewSection,
  InterviewSegment,
  ResumeQuestion,
  TechCategory,
} from "@/types";
import css from "@/data/docs/css3.json";
import graphql from "@/data/docs/graphql.json";
import html from "@/data/docs/html5.json";
import javascript from "@/data/docs/javascript.json";
import javascriptImportant from "@/data/docs/javascript-important.json";
import nextjs from "@/data/docs/nextjs.json";
import react from "@/data/docs/react.json";
import redux from "@/data/docs/redux.json";
import typescript from "@/data/docs/typescript.json";
import devops from "@/data/docs/devops.json";
import git from "@/data/docs/git.json";
import interviews from "@/data/interviews.json";
import fe100a from "@/data/interviews-fe100-a.json";
import fe100b from "@/data/interviews-fe100-b.json";
import fe100c from "@/data/interviews-fe100-c.json";
import fe100d from "@/data/interviews-fe100-d.json";
import interviewsAdvanced from "@/data/interviews-advanced-scenarios.json";
import interviewsCssMaster from "@/data/interviews-css-master.json";
import interviewsJsExtracted from "@/data/interviews-js-extracted.json";
import interviewsTs50 from "@/data/interviews-typescript-50.json";
import interviewsReactNext50 from "@/data/interviews-react-next-50.json";
import interviewsJavascript50 from "@/data/interviews-javascript-50.json";
import interviewsSeniorFe from "@/data/interviews-senior-fe.json";
import interviewsFePatternsCombined from "@/data/interviews-fe-patterns-combined.json";
import interviewsFrontendMnc100 from "@/data/interviews-frontend-mnc-100.json";
import interviewsDevopsAzure from "@/data/interviews-devops-azure.json";
import resumeQuestionsRaw from "@/data/resume-questions.json";
import resumeQuestionOverridesRaw from "@/data/resume-question-overrides.json";
import resumeDevopsRaw from "@/data/resume-devops.json";
import { enrichInterviewQuestion } from "@/lib/interviewContent";
import { interviewSlug } from "@/lib/interviewDisplay";

export const allDocs: DocTopic[] = [
  ...(javascript as DocTopic[]),
  ...(javascriptImportant as DocTopic[]),
  ...(react as DocTopic[]),
  ...(redux as DocTopic[]),
  ...(typescript as DocTopic[]),
  ...(nextjs as DocTopic[]),
  ...(html as DocTopic[]),
  ...(css as DocTopic[]),
  ...(graphql as DocTopic[]),
  ...(devops as DocTopic[]),
  ...(git as DocTopic[]),
];

const rawInterviews: InterviewQuestion[] = [
  ...(interviews as InterviewQuestion[]),
  ...(fe100a as InterviewQuestion[]),
  ...(fe100b as InterviewQuestion[]),
  ...(fe100c as InterviewQuestion[]),
  ...(fe100d as InterviewQuestion[]),
  ...(interviewsAdvanced as InterviewQuestion[]),
  ...(interviewsCssMaster as InterviewQuestion[]),
  ...(interviewsJsExtracted as InterviewQuestion[]),
  ...(interviewsTs50 as InterviewQuestion[]),
  ...(interviewsReactNext50 as InterviewQuestion[]),
  ...(interviewsJavascript50 as InterviewQuestion[]),
  ...(interviewsSeniorFe as InterviewQuestion[]),
  ...(interviewsFePatternsCombined as InterviewQuestion[]),
  ...(interviewsFrontendMnc100 as InterviewQuestion[]),
  ...(interviewsDevopsAzure as InterviewQuestion[]),
];

export const allInterviews: InterviewQuestion[] = rawInterviews.map(enrichInterviewQuestion);

const docById = new Map(allDocs.map((d) => [d.id, d]));
const interviewById = new Map(allInterviews.map((q) => [q.id, q]));
const interviewBySlug = new Map(allInterviews.map((q) => [interviewSlug(q), q] as const));

export function getDocById(id: string): DocTopic | undefined {
  return docById.get(id);
}

export function getInterviewById(id: string): InterviewQuestion | undefined {
  return interviewById.get(id);
}

export function getInterviewBySlug(slug: string): InterviewQuestion | undefined {
  return interviewBySlug.get(slug);
}

export const CATEGORIES: TechCategory[] = [
  "JavaScript",
  "React",
  "Redux",
  "TypeScript",
  "Next.js",
  "HTML5",
  "CSS3",
  "GraphQL",
  "DevOps",
  "GIT",
];

/** Includes topics like behavioral / Agile that have no doc sidebar section */
export const INTERVIEW_FILTER_OPTIONS: TechCategory[] = [...CATEGORIES, "General"];

export function docsByCategory(category: TechCategory): DocTopic[] {
  return allDocs.filter((d) => d.category === category);
}

export function interviewsByTechnology(tech: TechCategory | "All"): InterviewQuestion[] {
  if (tech === "All") return allInterviews;
  return allInterviews.filter((q) => q.technology === tech);
}

/** Segment omitted on legacy questions counts as fundamentals. */
export function normalizeInterviewSegment(q: InterviewQuestion): InterviewSegment {
  return q.segment ?? "fundamentals";
}

export function interviewsFiltered(
  tech: TechCategory | "All",
  segment: InterviewSegment | "All",
): InterviewQuestion[] {
  const base = interviewsByTechnology(tech);
  if (segment === "All") return base;
  return base.filter((q) => normalizeInterviewSegment(q) === segment);
}

/**
 * Curated interview sections — each renders as a separate page at
 * /interview/section/[slug] with its own in-page search bar.
 */
export const INTERVIEW_SECTIONS: InterviewSection[] = [
  {
    slug: "react-core-concepts",
    title: "React Core Concepts",
    description:
      "Virtual DOM, JSX, lifecycle, hooks, reconciliation, portals, Fiber, code splitting, and useMemo/useCallback trade-offs.",
    technology: "React",
  },
  {
    slug: "state-management",
    title: "State Management",
    description:
      "Props vs state, Context vs Redux, RTK, Zustand, server state with TanStack Query, optimistic updates, and useReducer.",
    technology: "React",
  },
  {
    slug: "typescript-essentials",
    title: "TypeScript Essentials",
    description:
      "interface vs type, typed props, generics, Zod at runtime, unknown vs any, utility types, discriminated unions, and type-safe hooks.",
    technology: "TypeScript",
  },
  {
    slug: "performance-optimization",
    title: "Performance Optimization",
    description:
      "Profiling, bundle reduction, virtualization, image optimization, debounce/throttle, WebSocket render storms, Core Web Vitals, and infinite scroll.",
    technology: "React",
  },
  {
    slug: "ai-realtime-systems",
    title: "AI & Real-Time Systems",
    description:
      "Voice assistants, hallucination control, document summarization, RAG, WebSocket lifecycle, streaming LLM UIs, and Twilio integration.",
    technology: "General",
  },
  {
    slug: "nextjs-ssr",
    title: "Next.js & SSR",
    description:
      "App Router vs Pages Router, RSC, hydration, auth, middleware, multi-tenancy, env vars, ISR, fine-grained caching, and route handlers.",
    technology: "Next.js",
  },
  {
    slug: "system-design",
    title: "Frontend System Design",
    description:
      "Workflow builders, real-time collaborative editors, monitoring dashboards, microfrontends, caching strategy, error boundaries, RBAC, offline support, and observability.",
    technology: "General",
  },
  {
    slug: "css-tailwind-uiux",
    title: "CSS, Tailwind & UI/UX",
    description:
      "Units, Grid vs Flex, Tailwind at scale, glassmorphism, WCAG accessibility, responsive design, design systems, dark mode, and animation performance.",
    technology: "CSS3",
  },
  {
    slug: "tools-devops-workflow",
    title: "DevOps & Workflow",
    description:
      "Git workflow, Azure DevOps, CI/CD, Docker, feature flags, testing strategy, monitoring, env config, Vercel vs self-host, ESLint/Prettier, and Cloudflare.",
    technology: "DevOps",
  },
  {
    slug: "behavioural-leadership",
    title: "Behavioural & Leadership",
    description:
      "Complex feature stories, technical disagreement, onboarding juniors, tech debt vs delivery, DX wins, incident response, growth, and responsible AI.",
    technology: "General",
  },
];

const sectionBySlug = new Map(INTERVIEW_SECTIONS.map((s) => [s.slug, s] as const));

export function getInterviewSection(slug: string): InterviewSection | undefined {
  return sectionBySlug.get(slug);
}

export function interviewsBySection(slug: string): InterviewQuestion[] {
  return allInterviews.filter((q) => q.section === slug);
}

export function countInterviewsBySection(slug: string): number {
  return interviewsBySection(slug).length;
}

/**
 * Resume-driven questions — answered in the candidate's own voice. Powers
 * the /resume-based page. Topics and projects are free-form strings (not
 * tied to TechCategory) because they describe real situations from work.
 */
type ResumeQuestionOverride = Pick<ResumeQuestion, "id"> & Partial<Omit<ResumeQuestion, "id">>;

const duplicateResumeQuestionIds = new Set([
  "rb-043", // repeats rb-027
  "rb-044", // repeats rb-023/rb-019
  "rb-048", // repeats rb-031
  "rb-049", // repeats rb-032
  "rb-050", // repeats rb-033
  "rb-055", // repeats rb-005/rb-026
  "rb-056", // repeats rb-020/rb-036
]);

const resumeQuestionOverrides = new Map(
  (resumeQuestionOverridesRaw as ResumeQuestionOverride[]).map((q) => [q.id, q] as const),
);

export const allResumeQuestions: ResumeQuestion[] = [
  ...(resumeQuestionsRaw as ResumeQuestion[])
    .filter((q) => !duplicateResumeQuestionIds.has(q.id))
    .map((q) => ({ ...q, ...resumeQuestionOverrides.get(q.id) })),
  ...(resumeDevopsRaw as ResumeQuestion[]),
];

const resumeById = new Map(allResumeQuestions.map((q) => [q.id, q] as const));

export function getResumeQuestionById(id: string): ResumeQuestion | undefined {
  return resumeById.get(id);
}

/** Unique topic chips, in first-seen order. */
export function resumeTopics(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of allResumeQuestions) {
    if (seen.has(q.topic)) continue;
    seen.add(q.topic);
    out.push(q.topic);
  }
  return out;
}

/** Unique projects (those that have a project), in first-seen order. */
export function resumeProjects(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of allResumeQuestions) {
    if (!q.project || seen.has(q.project)) continue;
    seen.add(q.project);
    out.push(q.project);
  }
  return out;
}
