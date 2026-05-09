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
  | "DevOps"
  | "GIT"
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
  /** Optional curated section (e.g., "react-core-concepts"). Used for sectioned interview pages. */
  section?: string;
}

export interface InterviewSection {
  /** URL slug for /interview/section/[slug]. */
  slug: string;
  /** Display title shown on cards and the section page header. */
  title: string;
  /** Short description shown on the section card and at the top of the page. */
  description: string;
  /** Tech category badge for the section card (mirrors existing category palette). */
  technology: TechCategory;
}

/** Snapshot of an interview question stored when a user saves it from the UI. */
export interface SavedQuestionSnapshot extends InterviewQuestion {
  savedAt: number;
}

/** A resume-driven interview question — answered in the candidate's own voice. */
export interface ResumeQuestion {
  id: string;
  /** Topic chip on the card (e.g., "State Management", "WebSockets"). */
  topic: string;
  /** Optional project tag (e.g., "AI-Kiosk", "GoodHomes", "ZEOS", "ROVER"). */
  project?: string;
  question: string;
  /** Optional 1-line summary used as the card preview. */
  short?: string;
  /** Full answer in the candidate's voice. May contain newlines for paragraphs. */
  answer: string;
}

/**
 * A single technical-keyword glossary entry. Powers the in-prose chips,
 * the `<KeywordModal>`, and the dedicated `/keyword/[slug]` page.
 */
export interface GlossaryEntry {
  /** URL slug for /keyword/[slug]. */
  slug: string;
  /** Canonical display term (e.g., "React Server Components"). */
  term: string;
  /**
   * Alternate strings to match in prose (case-insensitive). Always include
   * the canonical term + acronym variants. Order does not matter — matching
   * is by length-descending automatically.
   */
  aliases: string[];
  /** Loose grouping shown on the detail page (e.g., "React", "Tooling"). */
  category?: string;
  /** 1–2 sentence summary shown on the chip tooltip and modal lead. */
  short: string;
  /** Longer explanation rendered as paragraphs on the modal + detail page. */
  long: string;
  /** Optional code or example block. */
  example?: string;
  /** Slugs of related glossary entries to surface as quick links. */
  related?: string[];
}

export interface RecentSearch {
  query: string;
  at: number;
}
