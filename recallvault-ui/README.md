# RecallVault AI — Companion UI

Premium React + Vite + TypeScript dashboard for the RecallVault AI UGREEN NAS Skill. This app is a presentation layer only: it never contains NAS credentials, undocumented APIs, or fabricated live responses.

## Stack

- React 19 + Vite 8 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- shadcn-style local UI primitives (`src/components/ui/`)
- Framer Motion, Lucide icons, React Router
- Plus Jakarta Sans (headings) + Inter (body) via Fontsource

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL printed by the command.

## Build & checks

```bash
npm run lint    # oxlint
npm run build   # tsc -b && vite build
```

## Data boundary

All NAS access goes through the typed bridge in `src/lib/bridge.ts`, which reads `window.ugreenRecallVault`.

- If the host provides `searchMemories`, `getTimeline`, `getCollections`, `getMediaDetails`, `getRecentMemories`, `getRelatedMemories`, and `createAlbum`, the UI runs in live mode.
- If the bridge is absent or incomplete, the UI uses synthetic demo data from `src/lib/demoData.ts` and shows a persistent demo banner.
- Demo records are fictional examples for interface development. They are never represented as NAS results.
- Album creation is confirmation-gated in the UI and reports `demo-only` in demo mode — no write is performed.

## Pages

- `/` — Home: editorial hero, natural-language search, search history, highlights, recent memories, timeline preview, suggested collections.
- `/explore` — AI Memory Search: query, media/date/location/event filters, sort, strong/possible/related result groups.
- `/timeline` — year selector, month buckets, event labels only when evidence supports them.
- `/collections` — suggested albums with member selection, rename, and confirmation dialog.
- `/collections/:id` — collection detail with media grid and type filters.
- `/memories/:id` — media details: metadata, match reasons, evidence channels, related memories, fullscreen preview.
- `/settings` — connection status, library scope, capability map, privacy notes.

## Design tokens

Warm editorial minimalism: `#FAF9F6` background, `#5746D8` primary, `#EEEAFE` soft primary, `#24233A` ink, `#858399` muted, `#EAE8F0` borders. Defined in `src/index.css` under `@theme`.
