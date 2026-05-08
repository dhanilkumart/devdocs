import { interviewSlug } from "@/lib/interviewDisplay";
import { searchAll, type UnifiedHit } from "@/lib/search";

function hitHref(hit: UnifiedHit): string {
  switch (hit.kind) {
    case "page":
      return hit.item.path;
    case "doc":
      return `/docs/${hit.item.id}`;
    case "interview":
      return `/question/${interviewSlug(hit.item)}`;
    case "resume":
      return `/resume-based#resume-q-${hit.item.id}`;
    case "glossary":
      return `/keyword/${hit.item.slug}`;
    case "section":
      return `/interview/section/${hit.item.slug}`;
  }
}

function hitTitle(hit: UnifiedHit): string {
  switch (hit.kind) {
    case "page":
    case "doc":
    case "section":
      return hit.item.title;
    case "interview":
    case "resume":
      return hit.item.question;
    case "glossary":
      return hit.item.term;
  }
}

function hitSummary(hit: UnifiedHit): string {
  switch (hit.kind) {
    case "page":
    case "doc":
      return hit.item.summary;
    case "section":
      return hit.item.description;
    case "interview":
      return hit.item.quickAnswer ?? hit.item.answer;
    case "resume":
      return hit.item.short ?? hit.item.answer;
    case "glossary":
      return hit.item.short;
  }
}

function serializeHit(hit: UnifiedHit) {
  return {
    type: hit.kind,
    id:
      hit.kind === "glossary" || hit.kind === "section"
        ? hit.item.slug
        : hit.kind === "page"
          ? hit.item.id
          : hit.item.id,
    title: hitTitle(hit),
    summary: hitSummary(hit),
    href: hitHref(hit),
    score: hit.score,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? "30"), 100);
  const results = searchAll(q, limit);
  const serialized = results.map(serializeHit);

  return Response.json({
    query: q,
    results: serialized,
    docs: serialized.filter((r) => r.type === "doc"),
    interviews: serialized.filter((r) => r.type === "interview"),
    resume: serialized.filter((r) => r.type === "resume"),
    glossary: serialized.filter((r) => r.type === "glossary"),
    sections: serialized.filter((r) => r.type === "section"),
    pages: serialized.filter((r) => r.type === "page"),
  });
}
