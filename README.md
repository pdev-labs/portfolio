# pdev-labs — portfolio

Personal portfolio of pdev-labs, 16-year-old open-source systems developer.
Next.js 14 App Router · TypeScript · zero images · dark/light/system themes.

Live: https://pdev-labs.github.io *(deployment target — see Vercel note below)*

## Run

```bash
npm install
npm run dev      # http://localhost:3001
npm run build && npm start
```

## Structure

- `app/` — routes, layout, global CSS, sitemap, robots, OG image, privacy page, docs guides
- `middleware.ts` — serves `go.pdevlabs.me` short links and `docs.pdevlabs.me` from this repo
- `components/` — nav, interactive terminal, theme, filters, palette, toasts, effects
- `data/site.ts` — profile, projects, skills, experience (grounded in GitHub data)
- `public/` — `logo.svg`, favicon

## Features

Runnable in-browser terminal (28 commands, history, tab-complete), command palette
(`Ctrl/⌘K`), project filtering + sorting, skill→work cross-linking, spring-physics
scrolling, WebGL hero backdrop, consent-gated storage, contact form with spam cooldown.
