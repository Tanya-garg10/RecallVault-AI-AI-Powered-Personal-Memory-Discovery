# RecallVault AI

### Every memory has a story. Find yours.

**AI-powered personal memory discovery for UGREEN AI NAS.**

RecallVault AI turns natural language into authorized, evidence-backed search across your personal photos, videos, and documents — powered entirely by documented UGREEN NAS capabilities. Describe a moment; RecallVault finds it, explains why it matched, and helps you gather memories into albums safely.

> *"Find my college farewell photos from 2025."* — that's the whole interface.

## What it does

| Capability | How it works |
|---|---|
| **Natural-language memory search** | Queries are parsed into intent, media type, dates, and places, then routed to the right registered UGREEN expert agent |
| **Smart photo discovery** | Semantic + structured photo search, EXIF metadata, OCR, and visual understanding — only on real, authorized NAS paths |
| **Evidence-based ranking** | Every result explains *why* it matched, with confidence tiers (strong / possible / related) and honest "metadata unavailable" states |
| **Memory timeline** | Read-only year/month buckets generated only from dates the NAS actually returns |
| **Smart collections** | Evidence-backed album suggestions with preview, rename, member selection, and explicit confirmation |
| **Safe writes** | Album creation uses `ug-photo/create-album` only after approval, then verifies via documented read operations |
| **Video & document discovery** | Personal video-file metadata via file agents; document extraction/Q&A via `document-agent`; catalog movies via `media-agent` |

## Repository layout

```
recallvault-ai/          Uploadable UGREEN Skill — SKILL.md + references/ only
                         (official package contract; passes static checker)
recallvault-ui/          Companion dashboard — React + Vite + TypeScript + Tailwind
                         Editorial memory-discovery UI with typed NAS bridge
docs/                    Capability audit, architecture, integrations, testing,
                         validation report
README.md                This file
```

The Skill package and the companion UI are **deliberately separate**: UGREEN Skill rules allow only `SKILL.md` and linked Markdown — no scripts, binaries, or frontend code inside the uploadable package.

## The AI pipeline

```
User query
   │
   ▼
Query understanding ──► Search planning ──► Authorized NAS discovery
   │                                            │
   ▼                                            ▼
Evidence-based ranking ◄── Metadata / OCR / VLM analysis
   │
   ▼
Memory grouping ──► Result presentation ──► User approval ──► Album operation
```

Every stage consumes real outputs from the previous stage. Nothing is fabricated: missing metadata is disclosed, empty results are accepted, and unsupported capabilities are documented rather than simulated.

## Tech stack

**Skill (uploadable):** Uliya Skill format — `SKILL.md` + Markdown references. No executables.

**Companion UI:** React 19 · Vite 8 · TypeScript · Tailwind CSS v4 · shadcn-style components · Framer Motion · React Router · Lucide · Plus Jakarta Sans + Inter.

## Quickstart — Companion UI

```bash
cd recallvault-ui
npm install
npm run dev      # local dev server
npm run lint     # oxlint — 0 warnings, 0 errors
npm run build    # tsc -b && vite build
```

The UI runs in **demo mode** by default with clearly labeled synthetic data and bundled demo photography. When a UGREEN host provides the `window.ugreenRecallVault` bridge, the same UI switches to live NAS data — no code changes needed.

## Validate the Skill

```bash
node uliya-skill-kit/scripts/check-skill.mjs recallvault-ai
```

Latest result: **`static-pass`** — 0 errors, 0 warnings (catalog v2.2.0).

> A static pass verifies package contract compliance only. It does not prove NAS installation, runtime compatibility, permissions, or device execution — see `docs/validation-report.md`.

## Integration architecture

- **Primary:** native UGREEN NAS capabilities via documented `ug-*` CLIs and registered agents (`photo-agent`, `file-agent`, `document-agent`, `media-agent`).
- **Deferred:** Gemini API evaluated and documented in `docs/integrations.md` — excluded from MVP because the Skill format has no supported external-HTTP mechanism and personal media must not leave the NAS trust boundary.
- **Rejected for MVP:** CLIP/embeddings (no catalog Action executes them), Google Maps (only with real GPS metadata), any custom runtime.

## Privacy & safety

- Read-only by default; writes require explicit user confirmation **and** platform approval.
- No NAS credentials in frontend code or the Skill package.
- No bulk upload of personal libraries to external services.
- Album creation verifies results with documented read operations before reporting success.

## Honest limitations

- Arbitrary personal-video *content* understanding is not supported by the catalog — video memories are file discovery + media metadata only.
- Catalog movie/series search (`ug-video/search`) is separate from personal video files.
- Person identification is limited to supported photo-service classifications.
- Real-device behavior (delegation, permissions, `waiting_*` states, album writes) requires a UGREEN AI NAS — documented in `docs/testing.md`.

## Documentation

| Doc | Contents |
|---|---|
| `docs/capability-audit.md` | Every catalog Action mapped to RecallVault workflows |
| `docs/architecture.md` | System design and data flow |
| `docs/integrations.md` | External API evaluation (UGREEN native vs Gemini vs local) |
| `docs/testing.md` | Static checks, demo smoke tests, hardware test plan |
| `docs/validation-report.md` | Latest validation results |
| `recallvault-ai/references/` | Search workflow, evidence ranking, classification, privacy, test scenarios |

**RecallVault AI** — built for the UGREEN Hackathon · *Bring Memories to Life*
