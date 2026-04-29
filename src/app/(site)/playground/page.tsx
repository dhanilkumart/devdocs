"use client";

import { useMemo, useState } from "react";

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; padding: 1rem; }
    h1 { color: #0ea5e9; }
  </style>
</head>
<body>
  <h1>Hello DevDocs</h1>
  <p>Edit HTML/CSS/JS on the left.</p>
</body>
</html>`;

export default function PlaygroundPage() {
  const [src, setSrc] = useState(DEFAULT_HTML);
  const doc = useMemo(() => ({ __html: src }), [src]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Playground</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Quick HTML/CSS/JS scratch pad rendered in a sandboxed iframe. For production sandboxes, wire in CodeSandbox or
          StackBlitz.
        </p>
      </header>
      <div className="grid min-h-[420px] gap-4 lg:grid-cols-2">
        <textarea
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          spellCheck={false}
          className="min-h-[360px] w-full resize-y rounded-xl border border-zinc-200 bg-white p-4 font-mono text-[13px] text-zinc-900 outline-none ring-sky-500/30 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          aria-label="Source code"
        />
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800">
          <iframe
            title="Preview"
            sandbox="allow-scripts"
            className="h-full min-h-[360px] w-full bg-white"
            srcDoc={src}
          />
        </div>
      </div>
    </div>
  );
}
