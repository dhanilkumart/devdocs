import { searchDocs, searchInterviews } from "@/lib/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 50);

  const docs = searchDocs(q, limit).map((r) => ({
    type: "doc" as const,
    id: r.item.id,
    title: r.item.title,
    category: r.item.category,
    summary: r.item.summary,
    tags: r.item.tags,
    score: r.score,
  }));

  const interviews = searchInterviews(q, limit).map((r) => ({
    type: "interview" as const,
    id: r.item.id,
    question: r.item.question,
    technology: r.item.technology,
    level: r.item.level,
    score: r.score,
  }));

  return Response.json({ query: q, docs, interviews });
}
