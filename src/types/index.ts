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
  technology: TechCategory;
  level: Difficulty;
  question: string;
  answer: string;
  explanation: string;
  example: string;
  /** Core language & patterns vs web platform (DOM, events in the page). Omitted = fundamentals. */
  segment?: InterviewSegment;
}

export interface RecentSearch {
  query: string;
  at: number;
}
