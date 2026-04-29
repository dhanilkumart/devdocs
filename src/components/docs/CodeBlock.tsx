export function CodeBlock({
  code,
  language,
  title,
}: {
  code: string;
  language: string;
  title?: string;
}) {
  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 dark:border-zinc-700">
      {(title || language) && (
        <figcaption className="flex items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-zinc-400">
          <span className="truncate font-medium text-zinc-300">{title ?? language}</span>
          <span className="shrink-0 uppercase tracking-wide">{language}</span>
        </figcaption>
      )}
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-zinc-100">{code}</code>
      </pre>
    </figure>
  );
}
