# himelahmed.dev

Himel Ahmed's portfolio — Next.js (App Router, TypeScript), Tailwind v4, Framer Motion.

## Structure

- `src/app/page.tsx` — the "print": Z-rail nav, 7 sticky-stacked layer sections, tic-tac-toe hero game, case-study/writeup reader overlay.
- `src/app/case-studies/[slug]` — standalone, shareable per-project case study pages.
- `src/components/` — `ui/` (shared primitives), `layout/` (rail, sticky sections), `sections/` (home page content), `overlay/` (the doc reader), `case-studies/` (tabbed page shell).
- `src/content/*.json` — all copy (projects, case studies, writeups, competition record, stack, experience). Edit these to update site content without touching components.
- `src/lib/` — tic-tac-toe game logic, the scroll-tracking hook, shared types.

## Adding real screenshots / photo

Project screenshots and the operator photo are graceful placeholders until real files exist:

- `public/himel.png` — profile photo (Operator section).
- `public/shots/<slug>-*.png` — pass a `src` into the relevant `ShotPlaceholder` usage once you have real screenshots; until then the labeled placeholder shows instead.

## Develop

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```
# portfolio
