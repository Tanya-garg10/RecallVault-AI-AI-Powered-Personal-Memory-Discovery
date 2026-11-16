# RecallVault AI

**Every memory has a story. Find yours.**

RecallVault AI is a UGREEN AI NAS Skill for natural-language discovery of authorized personal photos, video files, and documents. It uses only capabilities documented in the official Uliya Skill Developer Package and delegates real NAS work to registered experts.

## Repository layout

- `recallvault-ai/` — uploadable UGREEN Skill package. It contains only `SKILL.md` and `references/` to satisfy the official package contract.
- `uliya-skill-kit/` — official developer package used for the capability audit.
- `docs/` — project-level audit, architecture, integration evaluation, testing, and validation notes.
- `recallvault-ui/` — optional React + Vite + TypeScript companion dashboard (Tailwind CSS, shadcn-style components, editorial memory-discovery design).

## What is implemented

- Natural-language memory search orchestration across photo, file, video-file, and document domains.
- Evidence-based ranking with explicit uncertainty and missing-metadata handling.
- Read-only memory timeline summaries through `ug-photo/timeline-summary`.
- Smart collection proposals using real photo search result references.
- Approval-gated album creation through `ug-photo/create-album`.
- Document discovery and cited document QA/extraction through `ug-document`.
- Personal video-file discovery through filesystem/media metadata; catalog movie/series search is handled separately through `ug-video/search`.
- A polished companion UI with a clearly separated bridge and labeled demo mode.

## Important limitations

- This repository does not contain a real UGREEN NAS device response. Runtime behavior requires the UGREEN Skill host and registered experts.
- Arbitrary personal video content understanding is not supported by the catalog; video memories are limited to file discovery and available media metadata.
- Person identification is limited to supported photo-service classifications/filters; RecallVault does not infer identity.
- The companion UI does not expose NAS credentials and does not fabricate live results.

## Validation

Run the official static checker against the uploadable package:

```bash
node uliya-skill-kit/scripts/check-skill.mjs recallvault-ai
```

A static pass does not prove installation, compatibility, permissions, or device execution. See `docs/validation-report.md` for the latest result.
