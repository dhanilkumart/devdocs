# tsconfig.node.json

## 1. What this file is for

### Responsibilities
`tsconfig.node.json` is the TypeScript compiler configuration file for Node.js build tools and configuration scripts, specifically `vite.config.ts`.

---

## 2. Source Code & Configuration Breakdown

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

### Key Configuration Settings Explained

- **`types: ["node"]`:** Includes Node.js core type declarations (e.g. `process`, `__dirname`).
- **`module: "nodenext"`:** Uses Node.js ESM module resolution rules.
- **`include: ["vite.config.ts"]`:** Explicitly targets `vite.config.ts` for type checking.
