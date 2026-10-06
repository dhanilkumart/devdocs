# vite.config.ts

## 1. What this file is for

### Responsibilities
`vite.config.ts` is the configuration file for the Vite build tool and development server.

---

## 2. Source Code & Configuration Breakdown

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

### Explanation of Settings

- **`import react from '@vitejs/plugin-react'`:** Imports the official Vite plugin for React applications.
- **`plugins: [react()]`:** Configures Fast Refresh (HMR for React components) and automatic JSX transformation using Babel/SWC.
- **`defineConfig`:** Vite helper function providing autocomplete and type validation for configuration options.
