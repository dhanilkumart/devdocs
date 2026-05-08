import Fuse, { type IFuseOptions, type FuseResult } from "fuse.js";
import type { DocTopic, GlossaryEntry, InterviewQuestion, InterviewSection, ResumeQuestion } from "@/types";
import { allDocs, allInterviews, allResumeQuestions, INTERVIEW_SECTIONS } from "@/lib/data";
import { glossary } from "@/lib/glossary";

export type AppSearchPage = {
  id: string;
  title: string;
  path: string;
  summary: string;
  tags: string[];
};

export const appSearchPages: AppSearchPage[] = [
  {
    id: "home",
    title: "Home",
    path: "/",
    summary: "Main dashboard for documentation topics, interview practice, saved questions, playground, and resume answers.",
    tags: ["dashboard", "docs", "interview", "practice", "home"],
  },
  {
    id: "interview",
    title: "Practice questions",
    path: "/interview",
    summary: "All interview questions, sections, filters, short answers, full guides, code examples, mistakes, and tips.",
    tags: ["interview", "questions", "answers", "practice", "guide"],
  },
  {
    id: "resume-based",
    title: "Resume-based interview answers",
    path: "/resume-based",
    summary: "Candidate-specific interview answers for projects, senior frontend experience, AI systems, and leadership stories.",
    tags: ["resume", "experience", "projects", "behavioral", "leadership"],
  },
  {
    id: "bookmarks",
    title: "Saved questions",
    path: "/bookmarks",
    summary: "Bookmarked and saved interview questions for later review.",
    tags: ["saved", "bookmarks", "favorites", "review"],
  },
  {
    id: "playground",
    title: "Playground",
    path: "/playground",
    summary: "Interactive area for trying examples and practicing code ideas.",
    tags: ["playground", "code", "practice", "examples"],
  },
  {
    id: "search",
    title: "Search results",
    path: "/search",
    summary: "Full search page for docs, interviews, glossary keywords, resume answers, and app sections.",
    tags: ["search", "keywords", "results", "global"],
  },
];

const appPageSearchKeys: IFuseOptions<AppSearchPage>["keys"] = [
  { name: "title", weight: 0.35 },
  { name: "tags", weight: 0.25 },
  { name: "summary", weight: 0.3 },
  { name: "path", weight: 0.1 },
];

const docSearchKeys: IFuseOptions<DocTopic>["keys"] = [
  { name: "id", weight: 0.04 },
  { name: "title", weight: 0.25 },
  { name: "tags", weight: 0.16 },
  { name: "category", weight: 0.08 },
  { name: "summary", weight: 0.14 },
  { name: "content", weight: 0.2 },
  { name: "code_examples.title", weight: 0.04 },
  { name: "code_examples.code", weight: 0.07 },
  { name: "related_questions.preview", weight: 0.02 },
];

const interviewSearchKeys: IFuseOptions<InterviewQuestion>["keys"] = [
  { name: "id", weight: 0.03 },
  { name: "slug", weight: 0.03 },
  { name: "question", weight: 0.24 },
  { name: "technology", weight: 0.08 },
  { name: "level", weight: 0.03 },
  { name: "section", weight: 0.05 },
  { name: "segment", weight: 0.03 },
  { name: "quickAnswer", weight: 0.11 },
  { name: "answer", weight: 0.1 },
  { name: "detailedExplanation", weight: 0.11 },
  { name: "explanation", weight: 0.07 },
  { name: "realWorldUseCase", weight: 0.06 },
  { name: "example", weight: 0.04 },
  { name: "codeExample", weight: 0.05 },
  { name: "commonMistakes", weight: 0.04 },
  { name: "interviewTip", weight: 0.03 },
  { name: "relatedQuestions.preview", weight: 0.01 },
];

const resumeSearchKeys: IFuseOptions<ResumeQuestion>["keys"] = [
  { name: "id", weight: 0.04 },
  { name: "topic", weight: 0.18 },
  { name: "project", weight: 0.12 },
  { name: "question", weight: 0.25 },
  { name: "short", weight: 0.12 },
  { name: "answer", weight: 0.29 },
];

const glossarySearchKeys: IFuseOptions<GlossaryEntry>["keys"] = [
  { name: "slug", weight: 0.06 },
  { name: "term", weight: 0.28 },
  { name: "aliases", weight: 0.24 },
  { name: "category", weight: 0.08 },
  { name: "short", weight: 0.14 },
  { name: "long", weight: 0.16 },
  { name: "example", weight: 0.04 },
  { name: "related", weight: 0.02 },
];

const sectionSearchKeys: IFuseOptions<InterviewSection>["keys"] = [
  { name: "slug", weight: 0.08 },
  { name: "title", weight: 0.34 },
  { name: "description", weight: 0.42 },
  { name: "technology", weight: 0.16 },
];

const sharedFuseOptions = {
  threshold: 0.42,
  includeScore: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
  ignoreDiacritics: true,
  findAllMatches: true,
} satisfies Omit<IFuseOptions<unknown>, "keys">;

const fuseDocOptions: IFuseOptions<DocTopic> = {
  ...sharedFuseOptions,
  keys: docSearchKeys,
};

const fuseInterviewOptions: IFuseOptions<InterviewQuestion> = {
  ...sharedFuseOptions,
  keys: interviewSearchKeys,
};

const fuseResumeOptions: IFuseOptions<ResumeQuestion> = {
  ...sharedFuseOptions,
  keys: resumeSearchKeys,
};

const fuseGlossaryOptions: IFuseOptions<GlossaryEntry> = {
  ...sharedFuseOptions,
  keys: glossarySearchKeys,
};

const fuseSectionOptions: IFuseOptions<InterviewSection> = {
  ...sharedFuseOptions,
  keys: sectionSearchKeys,
};

const fuseAppPageOptions: IFuseOptions<AppSearchPage> = {
  ...sharedFuseOptions,
  keys: appPageSearchKeys,
};

let fuseAppPages: Fuse<AppSearchPage> | null = null;
let fuseDocs: Fuse<DocTopic> | null = null;
let fuseInterviews: Fuse<InterviewQuestion> | null = null;
let fuseResume: Fuse<ResumeQuestion> | null = null;
let fuseGlossary: Fuse<GlossaryEntry> | null = null;
let fuseSections: Fuse<InterviewSection> | null = null;

function getFuseAppPages(): Fuse<AppSearchPage> {
  if (!fuseAppPages) fuseAppPages = new Fuse(appSearchPages, fuseAppPageOptions);
  return fuseAppPages;
}

function getFuseDocs(): Fuse<DocTopic> {
  if (!fuseDocs) fuseDocs = new Fuse(allDocs, fuseDocOptions);
  return fuseDocs;
}

function getFuseInterviews(): Fuse<InterviewQuestion> {
  if (!fuseInterviews) fuseInterviews = new Fuse(allInterviews, fuseInterviewOptions);
  return fuseInterviews;
}

function getFuseResume(): Fuse<ResumeQuestion> {
  if (!fuseResume) fuseResume = new Fuse(allResumeQuestions, fuseResumeOptions);
  return fuseResume;
}

function getFuseGlossary(): Fuse<GlossaryEntry> {
  if (!fuseGlossary) fuseGlossary = new Fuse(glossary, fuseGlossaryOptions);
  return fuseGlossary;
}

function getFuseSections(): Fuse<InterviewSection> {
  if (!fuseSections) fuseSections = new Fuse(INTERVIEW_SECTIONS, fuseSectionOptions);
  return fuseSections;
}

export function searchAppPages(query: string, limit = 20): FuseResult<AppSearchPage>[] {
  const q = query.trim();
  if (!q) return [];
  return getFuseAppPages().search(q, { limit });
}

export function searchDocs(query: string, limit = 20): FuseResult<DocTopic>[] {
  const q = query.trim();
  if (!q) return [];
  return getFuseDocs().search(q, { limit });
}

export function searchInterviews(query: string, limit = 20): FuseResult<InterviewQuestion>[] {
  const q = query.trim();
  if (!q) return [];
  return getFuseInterviews().search(q, { limit });
}

export function searchResumeQuestions(query: string, limit = 20): FuseResult<ResumeQuestion>[] {
  const q = query.trim();
  if (!q) return [];
  return getFuseResume().search(q, { limit });
}

export function searchGlossary(query: string, limit = 20): FuseResult<GlossaryEntry>[] {
  const q = query.trim();
  if (!q) return [];
  return getFuseGlossary().search(q, { limit });
}

export function searchInterviewSections(query: string, limit = 20): FuseResult<InterviewSection>[] {
  const q = query.trim();
  if (!q) return [];
  return getFuseSections().search(q, { limit });
}

/** Build a fresh Fuse index over an arbitrary list of interview questions. */
export function createInterviewIndex(items: InterviewQuestion[]): Fuse<InterviewQuestion> {
  return new Fuse(items, fuseInterviewOptions);
}

/** Search a pre-built per-section index without touching the global one. */
export function searchInterviewIndex(
  index: Fuse<InterviewQuestion>,
  query: string,
  limit = 20,
): FuseResult<InterviewQuestion>[] {
  const q = query.trim();
  if (!q) return [];
  return index.search(q, { limit });
}

export type UnifiedHit =
  | { kind: "page"; item: AppSearchPage; score: number }
  | { kind: "doc"; item: DocTopic; score: number }
  | { kind: "interview"; item: InterviewQuestion; score: number }
  | { kind: "resume"; item: ResumeQuestion; score: number }
  | { kind: "glossary"; item: GlossaryEntry; score: number }
  | { kind: "section"; item: InterviewSection; score: number };

function scoreOf<T>(result: FuseResult<T>): number {
  return result.score ?? 0;
}

/** Searches all user-visible app content and merges the ranked results. */
export function searchAll(query: string, limit = 30): UnifiedHit[] {
  const q = query.trim();
  if (!q) return [];

  const merged: UnifiedHit[] = [
    ...searchAppPages(q, limit).map((r) => ({
      kind: "page" as const,
      item: r.item,
      score: scoreOf(r),
    })),
    ...searchDocs(q, limit).map((r) => ({
      kind: "doc" as const,
      item: r.item,
      score: scoreOf(r),
    })),
    ...searchInterviews(q, limit).map((r) => ({
      kind: "interview" as const,
      item: r.item,
      score: scoreOf(r),
    })),
    ...searchResumeQuestions(q, limit).map((r) => ({
      kind: "resume" as const,
      item: r.item,
      score: scoreOf(r),
    })),
    ...searchGlossary(q, limit).map((r) => ({
      kind: "glossary" as const,
      item: r.item,
      score: scoreOf(r),
    })),
    ...searchInterviewSections(q, limit).map((r) => ({
      kind: "section" as const,
      item: r.item,
      score: scoreOf(r),
    })),
  ];

  merged.sort((a, b) => a.score - b.score);
  return merged.slice(0, limit);
}
