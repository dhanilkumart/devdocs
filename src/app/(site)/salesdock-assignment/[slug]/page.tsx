import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSalesdockDocs, getSalesdockDocBySlug } from "@/data/salesdock-docs";
import { SalesdockMarkdown } from "@/components/salesdock/SalesdockMarkdown";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const docs = getSalesdockDocs();
  const paramsMap = new Map<string, { slug: string }>();

  docs.forEach((doc) => {
    paramsMap.set(doc.routeSlug.toLowerCase(), { slug: doc.routeSlug });
  });

  return Array.from(paramsMap.values());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getSalesdockDocBySlug(slug);

  if (!doc) {
    return {
      title: "Doc Not Found - Salesdock Assignment",
    };
  }

  return {
    title: `${doc.filename} - Salesdock Documentation`,
    description: `Documentation for ${doc.filename} in folder ${doc.folder}.`,
  };
}

export default async function SalesdockDocDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getSalesdockDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const allDocs = getSalesdockDocs();
  const currentIndex = allDocs.findIndex((d) => d.id === doc.id);
  const prevDoc = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const nextDoc = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
        <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400" aria-label="Breadcrumb">
          <Link
            href="/salesdock-assignment"
            className="hover:text-sky-600 dark:hover:text-sky-400 font-medium transition flex items-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Salesdock
          </Link>
          <span>/</span>
          <span className="font-mono text-xs font-semibold uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded">
            {doc.folder}
          </span>
          <span>/</span>
          <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-none">
            {doc.filename}
          </span>
        </nav>

        <Link
          href="/salesdock-assignment"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Folder Structure
        </Link>
      </div>

      {/* Doc Header Card */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {doc.path}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl font-mono">
              {doc.filename}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-2 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
            <span>Embedded Markdown Spec</span>
          </div>
        </div>
      </div>

      {/* Main Markdown Body */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-10">
        <SalesdockMarkdown content={doc.content} />
      </div>

      {/* Bottom Pagination Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200/80 dark:border-zinc-800 pt-6">
        {prevDoc ? (
          <Link
            href={`/salesdock-assignment/${encodeURIComponent(prevDoc.routeSlug)}`}
            className="group flex flex-col rounded-xl border border-zinc-200/80 bg-white p-4 transition hover:border-sky-500/50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-sky-500/50"
          >
            <span className="text-[11px] font-medium text-zinc-400">Previous File</span>
            <span className="font-mono text-sm font-semibold text-zinc-800 group-hover:text-sky-600 dark:text-zinc-200 dark:group-hover:text-sky-400">
              ← {prevDoc.filename}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextDoc ? (
          <Link
            href={`/salesdock-assignment/${encodeURIComponent(nextDoc.routeSlug)}`}
            className="group flex flex-col items-end text-right rounded-xl border border-zinc-200/80 bg-white p-4 transition hover:border-sky-500/50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-sky-500/50"
          >
            <span className="text-[11px] font-medium text-zinc-400">Next File</span>
            <span className="font-mono text-sm font-semibold text-zinc-800 group-hover:text-sky-600 dark:text-zinc-200 dark:group-hover:text-sky-400">
              {nextDoc.filename} →
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
