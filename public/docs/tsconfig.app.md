# tsconfig.app.json

## 1. What this file is for

### Responsibilities
`tsconfig.app.json` is the TypeScript compiler configuration file for the application source code located inside the `src/` directory.

---

## 2. Source Code & Configuration Breakdown

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### Key Configuration Settings Explained

- **`target: "es2023"` & `lib: ["ES2023", "DOM"]`:** Compiles code targeting ES2023 JavaScript standards and includes browser DOM type declarations.
- **`types: ["vite/client"]`:** Includes Vite client type declarations (for `import.meta.env`, CSS modules, static assets).
- **`moduleResolution: "bundler"`:** Configures modern bundler-style module resolution suitable for Vite.
- **`noEmit: true`:** Instructs TypeScript not to emit output `.js` files during type-checking (Vite handles transpilation).
- **`jsx: "react-jsx"`:** Uses React 17+ automatic JSX transform (does not require `import React from 'react'` in every JSX file).
- **`noUnusedLocals` & `noUnusedParameters`:** Strict linting compiler flags flagging unused variables or function parameters.
- **`include: ["src"]`:** Limits type checking to files inside `src/`.
