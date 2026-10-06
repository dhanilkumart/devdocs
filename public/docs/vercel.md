# vercel.json

## 1. What this file is for

### Responsibilities
`vercel.json` is the deployment configuration file for hosting the application on Vercel.

---

## 2. Source Code & Configuration Breakdown

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Explanation of Settings

- **Single Page Application (SPA) Fallback:** Configures Vercel URL rewrites so that any requested route (e.g. `/admin` or `/checkout`) serves `index.html`.
- **Why it is needed:** In client-side SPA routing, deep links like `/admin` do not correspond to actual physical files on the server disk. Without this rewrite, refreshing `http://localhost:5174/admin` or accessing it directly on Vercel would trigger a 404 Not Found error. Rewriting all requests to `/index.html` allows client-side code (`App.tsx`) to inspect `window.location.pathname` and render `<AdminPage />`.
