import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BookmarkButton } from "@/components/docs/BookmarkButton";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DocMarkdown } from "@/lib/markdown-lite";
import { getDocById, getInterviewById, allDocs, docsByCategory } from "@/lib/data";
import { interviewSlug } from "@/lib/interviewDisplay";
import { CategoryDocsClient } from "@/components/docs/CategoryDocsClient";
import type { Metadata } from "next";

export const CATEGORY_MAP = {
  javascript: {
    title: "JavaScript",
    categories: ["JavaScript"],
  },
  react: {
    title: "React",
    categories: ["React", "Redux"],
  },
  typescript: {
    title: "TypeScript",
    categories: ["TypeScript"],
  },
  nextjs: {
    title: "Next.js",
    categories: ["Next.js"],
  },
  "html-css": {
    title: "HTML/CSS",
    categories: ["HTML5", "CSS3"],
  },
  graphql: {
    title: "GraphQL",
    categories: ["GraphQL"],
  },
  devops: {
    title: "DevOps",
    categories: ["DevOps"],
  },
  git: {
    title: "GIT",
    categories: ["GIT"],
  },
} as const;

export function getCategorySlug(category: string): string {
  switch (category) {
    case "JavaScript":
      return "javascript";
    case "React":
    case "Redux":
      return "react";
    case "TypeScript":
      return "typescript";
    case "Next.js":
      return "nextjs";
    case "HTML5":
    case "CSS3":
      return "html-css";
    case "GraphQL":
      return "graphql";
    case "DevOps":
      return "devops";
    case "GIT":
      return "git";
    default:
      return "general";
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categoryParams = Object.keys(CATEGORY_MAP).map((slug) => ({ slug }));
  const docParams = allDocs.map((d) => ({ slug: d.id }));
  return [...categoryParams, ...docParams];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryKey = slug.toLowerCase() as keyof typeof CATEGORY_MAP;
  
  if (CATEGORY_MAP[categoryKey]) {
    const config = CATEGORY_MAP[categoryKey];
    return {
      title: `${config.title} Documentation`,
      description: `All documentation topics for ${config.title}`,
    };
  }

  const doc = getDocById(slug);
  if (!doc) return { title: "Not found" };
  return {
    title: doc.title,
    description: doc.summary,
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const categoryKey = slug.toLowerCase() as keyof typeof CATEGORY_MAP;

  // 1. Is this a category-level page?
  if (CATEGORY_MAP[categoryKey]) {
    const config = CATEGORY_MAP[categoryKey];
    // Gather all documents in the grouped categories
    const docs = config.categories.flatMap((cat) => docsByCategory(cat));
    return <CategoryDocsClient title={config.title} slug={slug} docs={docs} />;
  }

  // 2. Is this an individual doc slug? If so, redirect to the category page with anchor
  const doc = getDocById(slug);
  if (doc) {
    const categorySlug = getCategorySlug(doc.category);
    redirect(`/docs/${categorySlug}#${doc.id}`);
  }

  notFound();
}
