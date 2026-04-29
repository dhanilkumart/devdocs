import type { ReactNode } from "react";

function inlineFormat(line: string): ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.9em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function DocMarkdown({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="doc-markdown space-y-4 text-[15px]">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="mt-8 scroll-mt-24 text-lg font-semibold tracking-tight text-zinc-900 first:mt-0 dark:text-zinc-50"
            >
              {inlineFormat(block.slice(3))}
            </h2>
          );
        }

        const lines = block.split("\n").map((l) => l.trim());
        if (lines.length > 0 && lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="my-2 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
              {lines.map((line, j) => (
                <li key={j}>{inlineFormat(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="leading-relaxed text-zinc-700 dark:text-zinc-300">
            {inlineFormat(block)}
          </p>
        );
      })}
    </div>
  );
}
