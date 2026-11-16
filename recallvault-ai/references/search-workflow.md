# Search workflow

## Query interpretation

Convert the user's natural-language request into these fields before delegating:

- `media_type`: photo, personal video file, document, catalog movie/series, mixed, or unclear.
- `intent`: find, explain, timeline, compare, collect, organize, or playback.
- `subject_terms`: event, place, object, person/pet name only when the user supplied it or a supported classification confirms it.
- `date_constraints`: only explicit years, months, ranges, or relative dates that can be resolved without guessing.
- `location_constraints`: only explicit places or metadata-backed locations.
- `scope`: the authorized NAS root, album, folder, or library supplied by the user/environment.
- `output`: result list, details, timeline buckets, collection proposal, or document answer.

Ask one concise clarification only when scope or intent is unsafe or impossible to determine. Do not ask for private CLI parameters that the child expert owns.

## Routing rules

### Photo memories

Use `photo-agent` when the user asks for photos or images likely indexed by the photo service.

- Event/scene/place/people/pet queries: prefer `search-screen` with a single content keyword when the catalog supports it.
- Structured constraints such as explicit year/month, filename text, file type, person/pet filters, OCR text, camera metadata, or album scope: prefer `search-picture`.
- Person/pet/classification ambiguity: use `search-classify` only to resolve supported category candidates; do not infer identity.
- EXIF/date/location/camera details: use `meta` for real image paths and report missing fields as unavailable.
- Visual confirmation or OCR on specific images: use `vision-vlm` or `vision-ocr` only for real image paths and only when the extra evidence is needed.

Examples:

- "Find my college farewell photos from 2025" → photo search with 2025 capture-time bounds plus college/farewell content or filename/OCR evidence.
- "Show pictures from my last vacation" → semantic photo search; do not invent a date range unless the user or metadata supports it.
- "Find Diwali celebration photos" → content/OCR/filename evidence for Diwali/celebration; label festival inference as evidence-based.
- "Find photos taken in December 2025" → structured capture-time range for December 2025.

### Personal videos and files

Use `file-agent` for arbitrary NAS files, including personal video files.

- Use `category` only to establish authorized roots when scope is missing.
- Use `find` with bounded `path`, `type` (`video`, `image`, `documents`, etc.), pattern, depth, and timestamp filters.
- Use `ls`/`stat` to verify folders and file facts.
- Use `ug-filemgr/mediainfo` for codec, duration, resolution, bitrate, and related media metadata when available.
- Use tag reads only when tags are relevant or already part of the request.

Do not claim scene, event, or object understanding for personal videos. If the user needs content-level video search, state that the catalog does not expose that capability and offer filename/date/media-metadata search instead.

### Documents

Use `file-agent` to discover real document paths, then `document-agent` for content work.

- `metadata` for page count, size, time, scanned detection, and directory overview.
- `extract` for structured fields or OCR when the document type/schema is known or `auto` is appropriate.
- `qa` for questions, summaries, comparisons, period/condition lookups, and source-cited answers.

Pass only verified document paths returned by discovery. If extraction coverage is partial, report it. If the document is scanned and OCR fails or is incomplete, do not invent text.

### Catalog movies and series

Use `media-agent` and `ug-video/search` only for catalog media requests. Preserve real catalog identifiers for follow-up subtitle or playback actions. Do not mix catalog titles with personal file paths.

## Ranking

Rank candidates using the rules in [evidence and ranking](evidence-and-ranking.md). A result is strong only when it satisfies the user's explicit constraints and has direct evidence. Possible matches must be labeled and must not be presented as confirmed memories.

## Empty and partial results

- Explicit empty result: report no verified matches in the authorized scope.
- Missing metadata: label the field unavailable.
- Permission denied: report the denial and stop that branch.
- Partial coverage: list what was searched and what failed.
- Missing downstream path/ID/source-ref: stop dependent work and explain the gap.
