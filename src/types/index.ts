export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type TechCategory =
  | "JavaScript"
  | "React"
  | "TypeScript"
  | "Next.js"
  | "Redux"
  | "HTML5"
  | "CSS3"
  | "GraphQL"
  | "General";

export interface CodeExample {
  language: string;
  title?: string;
  code: string;
}

export interface RelatedQuestionRef {
  id: string;
  preview: string;
}

export interface DocTopic {
  id: string;
  title: string;
  category: TechCategory;
  tags: string[];
  summary: string;
  content: string;
  code_examples: CodeExample[];
  related_questions: RelatedQuestionRef[];
}

/** Separates language/core Q&A from browser/DOM–oriented Q&A; optional on legacy rows (treated as fundamentals). */
export type InterviewSegment = "fundamentals" | "runtime";

export interface InterviewQuestion {
  id: string;
  /** URL segment for /question/[slug]; defaults to `id` when omitted. */
  slug?: string;
  technology: TechCategory;
  level: Difficulty;
  question: string;
  /** Legacy full answer; also used as fallback when `quickAnswer` is omitted. */
  answer: string;
  explanation: string;
  example: string;
  /** Short plain-English blurb for cards and the detail “Quick answer” (2–4 lines). */
  quickAnswer?: string;
  /** Longer teaching text; falls back to `explanation`. */
  detailedExplanation?: string;
  realWorldUseCase?: string;
  codeExample?: string;
  commonMistakes?: string;
  interviewTip?: string;
  relatedQuestions?: RelatedQuestionRef[];
  /** Core language & patterns vs web platform (DOM, events in the page). Omitted = fundamentals. */
  segment?: InterviewSegment;
}

export interface RecentSearch {
  query: string;
  at: number;
}
