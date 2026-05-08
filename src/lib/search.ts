import Fuse, { type IFuseOptions, type FuseResult } from "fuse.js";
import type { DocTopic, InterviewQuestion } from "@/types";
import { allDocs, allInterviews } from "@/lib/data";

const docSearchKeys: IFuseOptions<DocTopic>["keys"] = [
  { name: "title", weight: 0.35 },
  { name: "tags", weight: 0.2 },
  { name: "category", weight: 0.1 },
  { name: "summary", weight: 0.15 },
  { name: "content", weight: 0.2 },
];

const interviewSearchKeys: IFuseOptions<InterviewQuestion>["keys"] = [
  { name: "question", weight: 0.38 },
  { name: "technology", weight: 0.12 },
  { name: "quickAnswer", weight: 0.08 },
  { name: "answer", weight: 0.12 },
  { name: "detailedExplanation", weight: 0.06 },
  { name: "explanation", weight: 0.1 },
  { name: "example", weight: 0.06 },
  { name: "codeExample", weight: 0.04 },
  { name: "segment", weight: 0.04 },
];

const fuseDocOptions: IFuseOptions<DocTopic> = {
  keys: docSearchKeys,
  threshold: 0.42,
  includeScore: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
  ignoreDiacritics: true,
};

const fuseInterviewOptions: IFuseOptions<InterviewQuestion> = {
  keys: interviewSearchKeys,
  threshold: 0.42,
  includeScore: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
  ignoreDiacritics: true,
};

let fuseDocs: Fuse<DocTopic> | null = null;
let fuseInterviews: Fuse<InterviewQuestion> | null = null;

function getFuseDocs(): Fuse<DocTopic> {
  if (!fuseDocs) fuseDocs = new Fuse(allDocs, fuseDocOptions);
  return fuseDocs;
}

function getFuseInterviews(): Fuse<InterviewQuestion> {
  if (!fuseInterviews) fuseInterviews = new Fuse(allInterviews, fuseInterviewOptions);
  return fuseInterviews;
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
  | { kind: "doc"; item: DocTopic; score: number }
  | { kind: "interview"; item: InterviewQuestion; score: number };

/** Merges doc + interview results, ranked by Fuse score (lower is better). */
export function searchAll(query: string, limit = 30): UnifiedHit[] {
  const q = query.trim();
  if (!q) return [];

  const docs = searchDocs(q, limit);
  const ints = searchInterviews(q, limit);

  const merged: UnifiedHit[] = [
    ...docs.map((r) => ({
      kind: "doc" as const,
      item: r.item,
      score: r.score ?? 0,
    })),
    ...ints.map((r) => ({
      kind: "interview" as const,
      item: r.item,
      score: r.score ?? 0,
    })),
  ];

  merged.sort((a, b) => a.score - b.score);
  return merged.slice(0, limit);
}
