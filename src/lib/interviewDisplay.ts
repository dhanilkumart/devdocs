import type { InterviewQuestion, RelatedQuestionRef } from "@/types";

/** Stable URL path segment for an interview (safe for `/question/[slug]`). */
export function interviewSlug(q: Pick<InterviewQuestion, "id" | "slug">): string {
  return q.slug ?? q.id;
}

const CARD_MAX_CHARS = 320;

function clampSentences(text: string, maxSentences: number): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length <= maxSentences) return trimmed;
  return `${parts.slice(0, maxSentences).join(" ")}…`;
}

function clampChars(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/** 2–3 short lines for list cards and home preview. */
export function getInterviewCardBlurb(q: InterviewQuestion): string {
  const base = (q.quickAnswer ?? q.answer).trim();
  if (!base) return "";
  const bySentence = clampSentences(base, 3);
  return clampChars(bySentence, CARD_MAX_CHARS);
}

/** Slightly fuller quick answer on the detail page. */
export function getInterviewQuickAnswerDetail(q: InterviewQuestion): string {
  const base = (q.quickAnswer ?? q.answer).trim();
  return clampSentences(base, 5);
}

const DEFAULT_MISTAKES = `• Answering with jargon only—practice saying the same idea in plain English too.
• Forgetting to mention errors, slow networks, or edge cases.
• Giving a long lecture instead of a clear “first this, then that” story.`;

const DEFAULT_TIP = `Start with one simple sentence anyone could follow. Then add a short example (code or real scenario). Finish with a trade-off or how you would check your work.`;

function deriveRealWorld(explanation: string): string {
  const first = explanation.trim().split(/\n\n/)[0]?.trim() ?? "";
  if (!first) return "You will use this idea whenever you build interactive UIs, talk to APIs, or review code with your team.";
  return `In day-to-day work, this often matters when: ${first.charAt(0).toLowerCase()}${first.slice(1)}`;
}

export type ResolvedInterview = {
  slug: string;
  cardBlurb: string;
  quickAnswer: string;
  detailedExplanation: string;
  realWorldUseCase: string;
  codeExample: string;
  commonMistakes: string;
  interviewTip: string;
  related: RelatedQuestionRef[];
};

export function resolveInterview(q: InterviewQuestion, all: InterviewQuestion[]): ResolvedInterview {
  const slug = interviewSlug(q);
  const detailed = (q.detailedExplanation ?? q.explanation).trim();
  const code = (q.codeExample ?? q.example).trim();

  const relatedFromJson = q.relatedQuestions ?? [];
  const seen = new Set(relatedFromJson.map((r) => r.id));
  seen.add(q.id);
  const fill: RelatedQuestionRef[] = [...relatedFromJson];
  if (fill.length < 4) {
    for (const o of all) {
      if (fill.length >= 4) break;
      if (o.id === q.id || seen.has(o.id)) continue;
      if (o.technology !== q.technology) continue;
      fill.push({
        id: o.id,
        preview: o.question.length > 90 ? `${o.question.slice(0, 90)}…` : o.question,
      });
      seen.add(o.id);
    }
  }

  return {
    slug,
    cardBlurb: getInterviewCardBlurb(q),
    quickAnswer: getInterviewQuickAnswerDetail(q),
    detailedExplanation: detailed,
    realWorldUseCase: (q.realWorldUseCase ?? deriveRealWorld(detailed)).trim(),
    codeExample: code || "// No code sample for this card yet.",
    commonMistakes: (q.commonMistakes ?? DEFAULT_MISTAKES).trim(),
    interviewTip: (q.interviewTip ?? DEFAULT_TIP).trim(),
    related: fill.slice(0, 4),
  };
}
