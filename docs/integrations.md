# RecallVault AI — External API & Integration Evaluation

Catalog inspected: `uliya-skill-kit/data/capability-catalog.json` (version 2.2.0, generated 2026-11-05, 9 CLIs / 84 actions).

## Decision summary

| Capability need | Native UGREEN (primary) | Gemini API | Local models (CLIP/embeddings) |
|---|---|---|---|
| Natural-language photo search | `ug-photo/search-screen`, `search-picture`, `search-classify` via `photo-agent` | Not needed — duplicates native semantic search | Not executable on NAS via documented Actions |
| Visual understanding / image description | `ug-photo/vision-vlm`, `vision-ocr` on real host paths | Optional enrichment only; adds external data flow | No documented NAS execution path |
| Document text, summaries, Q&A | `ug-document/extract`, `qa`, `metadata` via `document-agent` | Optional; native QA already returns citations/coverage | Not applicable |
| Query understanding / intent parsing | Parent Skill orchestration + `ug-photo/search-hint` | Could help parsing, but adds key management for marginal gain | Not applicable |
| Memory summaries | Derived from returned metadata + `vision-vlm`/`qa` outputs | Optional polish layer | Not applicable |
| GPS → map display | Only if `ug-photo/meta`/`search-picture` return real coordinates | Google Maps embed — optional, only with real GPS | N/A |
| Face/person search | `ug-photo/search-picture` person/pet filters + `ug-surveillance` face actions (security domain — out of scope for personal memories) | Would require uploading face images — rejected | N/A |

## Rules applied (per requirements)

1. **Native NAS capabilities are the primary source.** Every search, metadata, OCR, VLM, document, and album operation goes through documented CLIs and registered agents only.
2. **Uliya's built-in AI already covers the core.** `search-screen` (natural-language photo search), `vision-vlm` (visual QA), `vision-ocr`, and `ug-document/qa` provide query understanding, image descriptions, and summaries inside the NAS trust boundary.
3. **Gemini API — evaluated, deferred.** It could add richer prose descriptions, but: (a) it requires sending personal photos off-device, (b) the official Skill package forbids custom executables/scripts, so there is no supported in-Skill HTTP mechanism, (c) keys cannot live in the Skill package or frontend. Verdict: **not in MVP**. If a future host exposes an approved server-side proxy, Gemini could enrich `aiDescription` fields — minimum necessary images only, never bulk upload.
4. **External API usage is not assumed permitted.** No external calls are made by `recallvault-ai`.
5. **No library upload.** Nothing leaves the NAS; all processing uses documented Actions on authorized scope.
6. **Minimum necessary data.** The Skill passes only real paths/IDs returned by prior steps; VLM/OCR run only on selected result paths.
7. **CLIP/embeddings — rejected for MVP.** No catalog Action executes custom embedding models on the NAS.
8. **EXIF handled natively.** `ug-photo/meta` and `ug-filemgr/mediainfo` supply metadata; no separate EXIF library is introduced.
9. **Google Maps — optional, gated.** Only rendered when real GPS fields are returned by the NAS; never with demo or inferred coordinates.
10. **Secrets.** No API keys anywhere in `recallvault-ai/` or `recallvault-ui/`. Any future key lives server-side in an approved host mechanism.
11. **Dependencies documented here.** Demo UI imagery is Unsplash-licensed photography bundled locally; no runtime external service is required.
12. **Nothing forced into the Skill.** External APIs stay out of the core MVP entirely.

## Architecture consequence

```
User query
  → parent Skill (SKILL.md) parses intent/filters
  → delegate to photo-agent / file-agent / document-agent / media-agent
  → documented ug-* Actions only
  → evidence-based ranking (references/evidence-and-ranking.md)
  → read-only results; writes approval-gated
```

The companion UI's `window.ugreenRecallVault` bridge mirrors this boundary: live mode consumes host-provided results; demo mode uses bundled synthetic data and local demo images.
