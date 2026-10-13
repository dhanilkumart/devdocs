"use client";

import React, { useState } from "react";
import Link from "next/link";

import { resolveSalesdockSourcePath } from "@/lib/salesdock-resolver";

interface SalesdockMarkdownProps {
  content: string;
}

// Convert relative markdown links (e.g. '../components/discounts/SideCart.md') to /salesdock-assignment/[slug]
function resolveDocHref(href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#")) {
    return href;
  }

  // Attempt resolving via unambiguous source path resolver first
  const resolved = resolveSalesdockSourcePath(href);
  if (resolved) return resolved;

  // Extract filename from path (e.g., SideCart.md)
  const filename = href.split("/").pop() || href;
  return `/salesdock-assignment/${encodeURIComponent(filename)}`;
}

// Inline Markdown formatter for text inside headers, list items, paragraphs, table cells
function renderInlineText(text: string): React.ReactNode {
  // Regex to match **bold**, *italic*, `code`, [link](url), ~~strikethrough~~
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|~~[^~]+~~)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-zinc-900 dark:text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-zinc-800 dark:text-zinc-200">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      const codeText = part.slice(1, -1);
      const docLink = resolveSalesdockSourcePath(codeText);

      if (docLink) {
        return (
          <Link
            key={index}
            href={docLink}
            title={`View Salesdock documentation for ${codeText}`}
            className="group/code inline-flex items-center gap-1 rounded-md border border-sky-300/60 bg-sky-50/80 px-1.5 py-0.5 font-mono text-xs font-semibold text-sky-700 shadow-xs transition hover:border-sky-500 hover:bg-sky-100/90 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-sky-800/80 dark:bg-sky-950/60 dark:text-sky-300 dark:hover:border-sky-400 dark:hover:bg-sky-900/60 dark:hover:text-sky-200"
          >
            <span>{codeText}</span>
            <svg
              className="h-3 w-3 shrink-0 opacity-70 transition-transform group-hover/code:translate-x-0.5 group-hover/code:opacity-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        );
      }

      return (
        <code
          key={index}
          className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-xs font-medium text-sky-700 dark:bg-zinc-800/80 dark:text-sky-300"
        >
          {codeText}
        </code>
      );
    }

    if (part.startsWith("~~") && part.endsWith("~~")) {
      return (
        <del key={index} className="line-through text-zinc-400">
          {part.slice(2, -2)}
        </del>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const targetHref = resolveDocHref(href);
      const isInternal = targetHref.startsWith("/salesdock-assignment");

      if (isInternal) {
        return (
          <Link
            key={index}
            href={targetHref}
            className="font-medium text-sky-600 underline decoration-sky-400/40 underline-offset-2 transition hover:text-sky-500 hover:decoration-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
          >
            {label}
          </Link>
        );
      }

      return (
        <a
          key={index}
          href={targetHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sky-600 underline decoration-sky-400/40 underline-offset-2 transition hover:text-sky-500 hover:decoration-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
        >
          {label}
        </a>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-5 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-900 shadow-sm dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 px-4 py-2 text-xs font-mono text-zinc-400">
        <span className="uppercase tracking-wider font-semibold text-zinc-400">{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md bg-zinc-800/80 px-2.5 py-1 text-xs font-sans text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-200">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function SalesdockMarkdown({ content }: SalesdockMarkdownProps) {
  // Parse content into blocks
  const parseBlocks = (markdown: string) => {
    const lines = markdown.split("\n");
    const blocks: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const prevI = i;
      const line = lines[i];

      // Fenced code block (```lang)
      if (line.trim().startsWith("```")) {
        const language = line.trim().replace(/^```/, "").trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        blocks.push(
          <CodeBlock key={`code-${i}`} code={codeLines.join("\n")} language={language} />
        );
        continue;
      }

      // Markdown Table (| Header 1 | Header 2 |)
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }

        if (tableLines.length >= 2) {
          const headerCells = tableLines[0]
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());
          
          // Skip divider line (line index 1)
          const bodyRows = tableLines.slice(2).map((rowLine) =>
            rowLine
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim())
          );

          blocks.push(
            <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-zinc-100/80 text-zinc-900 dark:bg-zinc-800/60 dark:text-zinc-100 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    {headerCells.map((cell, cellIdx) => (
                      <th key={cellIdx} className="px-4 py-3 border-r last:border-r-0 border-zinc-200 dark:border-zinc-800">
                        {renderInlineText(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {bodyRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-3 border-r last:border-r-0 border-zinc-200 dark:border-zinc-800">
                          {renderInlineText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Horizontal rule
      if (/^(---|\*\*\*|___)\s*$/.test(line.trim())) {
        blocks.push(<hr key={`hr-${i}`} className="my-8 border-zinc-200 dark:border-zinc-800" />);
        i++;
        continue;
      }

      // Headings
      if (line.startsWith("# ")) {
        blocks.push(
          <h1 key={`h1-${i}`} className="mt-8 mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl border-b border-zinc-200 dark:border-zinc-800 pb-3">
            {renderInlineText(line.slice(2))}
          </h1>
        );
        i++;
        continue;
      }

      if (line.startsWith("## ")) {
        blocks.push(
          <h2 key={`h2-${i}`} className="mt-8 mb-3 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            {renderInlineText(line.slice(3))}
          </h2>
        );
        i++;
        continue;
      }

      if (line.startsWith("### ")) {
        blocks.push(
          <h3 key={`h3-${i}`} className="mt-6 mb-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-200">
            {renderInlineText(line.slice(4))}
          </h3>
        );
        i++;
        continue;
      }

      if (line.startsWith("#### ")) {
        blocks.push(
          <h4 key={`h4-${i}`} className="mt-4 mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-300">
            {renderInlineText(line.slice(5))}
          </h4>
        );
        i++;
        continue;
      }

      // Blockquotes
      if (line.trim().startsWith(">")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith(">")) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
          i++;
        }
        blocks.push(
          <blockquote key={`quote-${i}`} className="my-4 border-l-4 border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 px-4 py-3 rounded-r-lg text-zinc-700 dark:text-zinc-300 font-sans italic text-sm">
            {quoteLines.map((qLine, qIdx) => (
              <p key={qIdx} className="my-1">{renderInlineText(qLine)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Unordered lists (- or *)
      if (/^[\s]*[-*]\s+/.test(line)) {
        const listItems: string[] = [];
        while (i < lines.length && /^[\s]*[-*]\s+/.test(lines[i])) {
          listItems.push(lines[i].replace(/^[\s]*[-*]\s+/, ""));
          i++;
        }
        blocks.push(
          <ul key={`ul-${i}`} className="my-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300 text-[15px] leading-relaxed">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx}>{renderInlineText(item)}</li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered lists (1., 2.)
      if (/^[\s]*\d+\.\s+/.test(line)) {
        const listItems: string[] = [];
        while (i < lines.length && /^[\s]*\d+\.\s+/.test(lines[i])) {
          listItems.push(lines[i].replace(/^[\s]*\d+\.\s+/, ""));
          i++;
        }
        blocks.push(
          <ol key={`ol-${i}`} className="my-4 list-decimal space-y-2 pl-6 text-zinc-700 dark:text-zinc-300 text-[15px] leading-relaxed">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx}>{renderInlineText(item)}</li>
            ))}
          </ol>
        );
        continue;
      }

      // Empty line
      if (!line.trim()) {
        i++;
        continue;
      }

      // Paragraph
      const pLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].trim().startsWith("#") &&
        !lines[i].trim().startsWith("```") &&
        !lines[i].trim().startsWith("|") &&
        !lines[i].trim().startsWith(">") &&
        !/^[\s]*[-*]\s+/.test(lines[i]) &&
        !/^[\s]*\d+\.\s+/.test(lines[i]) &&
        !/^(---|\*\*\*|___)\s*$/.test(lines[i].trim())
      ) {
        pLines.push(lines[i].trim());
        i++;
      }

      if (pLines.length > 0) {
        blocks.push(
          <p key={`p-${i}`} className="my-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
            {renderInlineText(pLines.join(" "))}
          </p>
        );
      }

      if (i === prevI) {
        if (lines[i] && lines[i].trim()) {
          blocks.push(
            <p key={`p-${i}`} className="my-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
              {renderInlineText(lines[i].trim())}
            </p>
          );
        }
        i++;
      }
    }

    return blocks;
  };

  return (
    <div className="salesdock-markdown selection:bg-sky-500/20">
      {parseBlocks(content)}
    </div>
  );
}
