# DevDocs AI

Developer documentation and interview-prep app built with Next.js App Router.

## Local Development

### Requirements

- Node.js 20+
- npm 10+

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Useful commands

```bash
npm run lint
npm run build
```

## Project Structure

- `src/app/(site)` - pages (`/`, `/docs/[slug]`, `/interview`, `/question/[slug]`, `/resume-based`, `/keyword/[slug]`)
- `src/data/docs/*.json` - docs topic content
- `src/data/interviews*.json` - interview Q&A datasets
- `src/data/resume-questions.json` and `src/data/resume-devops.json` - resume-based answers
- `src/data/glossary*.json` - keyword/glossary entries
- `src/lib/data.ts` - central aggregation and lookup maps
- `src/types/index.ts` - content type contracts

## Content System (How to add topics, questions, answers)

This app is file-driven. You add or edit JSON records, and pages update automatically in dev mode.

### 1) Add a new docs topic (topic + answer content)

Docs topics power `/docs/[slug]`.

1. Pick the correct file in `src/data/docs/`:
   - `javascript.json`, `react.json`, `typescript.json`, `nextjs.json`, `css3.json`, `html5.json`, `graphql.json`, `redux.json`, `devops.json`, `git.json`
2. Add an object matching `DocTopic` from `src/types/index.ts`.
3. Keep `id` unique (used as URL slug).
4. Save and test at `/docs/<id>`.

Example:

```json
{
  "id": "react-usememo-basics",
  "title": "useMemo basics",
  "category": "React",
  "tags": ["react", "useMemo", "performance"],
  "summary": "Use useMemo to memoize expensive computed values between renders.",
  "content": "## What it does\n\n`useMemo` caches a computed value until dependencies change.",
  "code_examples": [
    {
      "title": "Memoized filtering",
      "language": "tsx",
      "code": "const visible = useMemo(() => items.filter(f), [items, f]);"
    }
  ],
  "related_questions": [
    { "id": "react-usememo-001", "preview": "When should you avoid useMemo?" }
  ]
}
```

### 2) Add a new interview question and answer

Interview questions power `/interview`, `/question/[slug]`, and section pages.

This project is now JSON-first for interview content. `src/lib/interviewContent.ts` no longer auto-generates rich answer fields from keyword-matching rules at runtime.

1. Choose a target dataset in `src/data/interviews*.json` (for example `src/data/interviews-react-next-50.json`).
2. Add a question object with required fields.
3. Keep `id` unique across all interview files.
4. Optional: set custom `slug` for URL; otherwise `id` is used.
5. Optional: set `section` to include the question in a curated section page.

Use `src/data/template-question.json` as a base.

Example:

```json
{
  "id": "react-hooks-usesync-001",
  "slug": "react-usesyncexternalstore-why",
  "technology": "React",
  "level": "Advanced",
  "question": "Why is useSyncExternalStore preferred for external stores in concurrent rendering?",
  "answer": "It provides a consistent snapshot contract that avoids tearing.",
  "explanation": "React needs snapshot + subscribe semantics that remain consistent while rendering can be interrupted.",
  "example": "Use `useSyncExternalStore(subscribe, getSnapshot)` with Redux-like stores.",
  "quickAnswer": "It prevents stale snapshots and tearing in concurrent mode.",
  "detailedExplanation": "It standardizes how React reads and subscribes to external state sources.",
  "realWorldUseCase": "Shared global stores across complex dashboards with frequent updates.",
  "codeExample": "const state = useSyncExternalStore(store.subscribe, store.getSnapshot);",
  "commonMistakes": "- Using useEffect subscriptions without stable snapshot semantics.",
  "interviewTip": "Explain tearing and concurrent rendering safety in one line.",
  "segment": "runtime",
  "section": "react-core-concepts"
}
```

AI prompt you can reuse for bulk generation:

```text
Generate N interview questions in strict JSON array format.
Output only valid JSON (no markdown, no comments).
Each item must follow this exact schema:
{
  "id": "unique-id",
  "slug": "optional-slug",
  "technology": "JavaScript|React|TypeScript|Next.js|Redux|HTML5|CSS3|GraphQL|DevOps|GIT|General",
  "level": "Beginner|Intermediate|Advanced",
  "question": "...",
  "answer": "...",
  "explanation": "...",
  "example": "...",
  "quickAnswer": "...",
  "detailedExplanation": "...",
  "realWorldUseCase": "...",
  "codeExample": "...",
  "commonMistakes": "...",
  "interviewTip": "...",
  "segment": "fundamentals|runtime",
  "section": "existing-section-slug"
}
Use plain strings for all fields.
Keep IDs unique.
Do not omit required keys.
```

### 3) Add a new interview section (topic grouping)

Sections power `/interview/section/[slug]`.

1. Edit `INTERVIEW_SECTIONS` in `src/lib/data.ts`.
2. Add a new section object:
   - `slug` (URL segment)
   - `title`
   - `description`
   - `technology`
3. Assign matching `section` value on interview questions.

If no question has that `section`, the page will show "No questions in this section yet."

### 4) Add resume-based interview answers

Resume answers power `/resume-based`.

1. Add entries in:
   - `src/data/resume-questions.json` (general)
   - `src/data/resume-devops.json` (DevOps-focused)
2. Keep `id` unique.
3. Use `topic` for chips/filtering and optional `project` label.
4. Use `src/data/resume-question-overrides.json` only when you want to patch specific records by `id`.

Example:

```json
{
  "id": "rb-999",
  "topic": "System Design",
  "project": "ROVER",
  "question": "How did you prevent websocket storms in production?",
  "short": "Backpressure + batching + per-tenant throttling stabilized peak traffic.",
  "answer": "We added event batching, bounded queues, and tenant-level throttles..."
}
```

### 5) Add glossary keywords (optional but recommended)

Glossary entries power keyword chips, modal, and `/keyword/[slug]`.

1. Add entries in `src/data/glossary.json` or `src/data/glossary-javascript.json`.
2. Include `term` and rich `aliases` so in-text matching works.
3. Keep `slug` unique.

## Validation Checklist After Content Changes

After adding/editing content, run:

```bash
npm run lint
npm run build
```

Then manually verify:

- Docs page opens: `/docs/<id>`
- Interview card appears: `/interview`
- Question detail opens: `/question/<slug-or-id>`
- Section page includes question: `/interview/section/<section-slug>`
- Resume entry appears: `/resume-based`
- Keyword detail opens (if added): `/keyword/<keyword-slug>`

## Important Data Rules

- `technology` must match `TechCategory` values in `src/types/index.ts`.
- `level` must be one of: `Beginner`, `Intermediate`, `Advanced`.
- Keep IDs globally unique per content type.
- Prefer append-only edits to datasets unless fixing incorrect content.
- Avoid trailing commas or comments in JSON files.
