import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InterviewQuestionDetail } from "@/components/interview/InterviewQuestionDetail";
import { allInterviews, getInterviewBySlug } from "@/lib/data";
import { interviewSlug } from "@/lib/interviewDisplay";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return allInterviews.map((q) => ({ slug: interviewSlug(q) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const q = getInterviewBySlug(slug);
  if (!q) return { title: "Question not found" };
  const shortQ = q.question.length > 72 ? `${q.question.slice(0, 72)}…` : q.question;
  return {
    title: shortQ,
    description: `${q.technology} · ${q.level}. Short answer and full interview guide.`,
  };
}

export default async function InterviewQuestionPage({ params }: Props) {
  const { slug } = await params;
  const q = getInterviewBySlug(slug);
  if (!q) notFound();

  return <InterviewQuestionDetail q={q} />;
}
