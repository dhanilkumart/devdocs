import type { DocTopic, InterviewQuestion, InterviewSegment, TechCategory } from "@/types";
import css from "@/data/docs/css3.json";
import graphql from "@/data/docs/graphql.json";
import html from "@/data/docs/html5.json";
import javascript from "@/data/docs/javascript.json";
import nextjs from "@/data/docs/nextjs.json";
import react from "@/data/docs/react.json";
import redux from "@/data/docs/redux.json";
import typescript from "@/data/docs/typescript.json";
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
import { enrichInterviewQuestion } from "@/lib/interviewContent";
import { interviewSlug } from "@/lib/interviewDisplay";

export const allDocs: DocTopic[] = [
  ...(javascript as DocTopic[]),
  ...(react as DocTopic[]),
  ...(redux as DocTopic[]),
  ...(typescript as DocTopic[]),
  ...(nextjs as DocTopic[]),
  ...(html as DocTopic[]),
  ...(css as DocTopic[]),
  ...(graphql as DocTopic[]),
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
