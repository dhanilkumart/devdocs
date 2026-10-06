# eslint.config.js

## 1. What this file is for

### Responsibilities
`eslint.config.js` is the code linting configuration file for ESLint 9+ using the modern Flat Configuration format. It defines linting rules, recommended preset plugins, and language options for TypeScript and React files in the project.

---

## 2. Source Code & Configuration Breakdown

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
```

### Explanation of Configuration Settings

1. **`globalIgnores(['dist'])`:** Excludes the production build output directory `dist` from ESLint checks.
2. **`files: ['**/*.{ts,tsx}']`:** Applies linting rules to all TypeScript (`.ts`) and React TypeScript (`.tsx`) files.
3. **`extends` Presets:**
   - `js.configs.recommended`: Standard recommended JavaScript linting rules.
   - `tseslint.configs.recommended`: TypeScript-specific rules for static type checking and syntax correctness.
   - `reactHooks.configs.flat.recommended`: Enforces React Hooks rules (e.g. `rules-of-hooks` and `exhaustive-deps`).
   - `reactRefresh.configs.vite`: Enforces Vite Fast Refresh rules (ensures components export valid React elements).
4. **`languageOptions.globals: globals.browser`:** Registers browser global variables (`window`, `document`, `localStorage`, `fetch`) so ESLint does not flag them as undefined variables.
