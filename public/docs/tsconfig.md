# tsconfig.json

## 1. What this file is for

### Responsibilities
`tsconfig.json` is the root TypeScript solution configuration file. It uses project references to delegate type checking to `tsconfig.app.json` (for application source code in `src/`) and `tsconfig.node.json` (for Node.js configuration files like `vite.config.ts`).

---

## 2. Source Code & Configuration Breakdown

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### Key Configuration Settings Explained

- **`files: []`:** Specifies that the root configuration contains no direct source files.
- **`references`:** References sub-configurations:
  - `./tsconfig.app.json`: Type-checks frontend application code (`src/`).
  - `./tsconfig.node.json`: Type-checks Node build configuration code (`vite.config.ts`).
- **Benefit:** Enables faster incremental build performance and keeps Node build configs decoupled from browser application code.
