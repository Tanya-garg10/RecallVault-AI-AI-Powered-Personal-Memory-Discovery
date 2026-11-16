# RecallVault AI Architecture

## Product boundary

RecallVault AI is an orchestration Skill plus an optional companion dashboard. The Skill is the source of truth for NAS behavior. The dashboard is a presentation layer only; it must not invent NAS responses or call undocumented APIs.

## Runtime flow

1. The user enters a natural-language memory query in the companion UI or directly to the Skill host.
2. The parent Skill interprets the query into media type, event/subject terms, date constraints, location constraints, and requested output.
3. The parent delegates discovery to the registered expert that owns the required capability:
   - `photo-agent` for photo-library semantic/content search, photo metadata, OCR/VLM, timeline summaries, and albums.
   - `file-agent` for authorized filesystem discovery, file metadata, tags, and approved file workflows.
   - `document-agent` for document metadata, extraction/OCR, and cited document answers.
   - `media-agent` only when the user is asking about cataloged movies/series rather than personal files.
4. The expert returns a public `delegation_result`. The parent uses only verified business facts from `completed` results.
5. The parent ranks evidence, separates strong and possible matches, and explains missing metadata or uncertainty.
6. For collections, the parent proposes an album name and exact candidate source. `photo-agent` may create a regular album only after approval, using `source-ref`, `add-item`, or `query` exactly as returned by the workflow.
7. The parent verifies creation through album detail/list or the returned verified album identifier. It never reports success from a request alone.

## State handling

- `completed`: continue only when required business values are present.
- `failed`: stop dependent work and preserve confirmed results.
- `cancelled`: report incomplete work; do not retry effectful operations automatically.
- `waiting_user`: wait for the same delegation to resume after clarification.
- `waiting_approval`: wait for platform approval; conversational agreement is not approval.

## Companion dashboard

`recallvault-ui` is a React/Vite interface with six views: Home, Search, Timeline, Collections, Media Details, and Settings.

The UI defines a `RecallVaultBridge` interface. A UGREEN host can provide live results through `window.ugreenRecallVault` when such a bridge is installed by the platform. If the bridge is absent, the UI remains usable in an explicitly labeled demo mode and reports live NAS status as unavailable. Demo records are synthetic and are never presented as NAS data.

## Data honesty rules

- No fake NAS integration.
- No fabricated search results, dates, locations, captions, thumbnails, or album IDs.
- Unsupported video-content understanding is not simulated.
- Missing EXIF/GPS/OCR data is shown as unavailable.
- Album creation is confirmed before execution and verified afterward.
