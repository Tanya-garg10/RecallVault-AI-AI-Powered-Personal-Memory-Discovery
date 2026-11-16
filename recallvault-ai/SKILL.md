---
name: recallvault-ai
description: Use when the user asks to rediscover personal photos, videos, or documents on an authorized UGREEN AI NAS through natural-language memory searches, evidence-backed results, timelines, and approved album collections.
---

# Goal

Help users find, understand, organize, and revisit personal memories in their authorized UGREEN AI NAS library. Support natural-language searches for photos, personal video files, and documents; return evidence-backed matches with available metadata; propose collections; and perform writes only after explicit approval and verified support.

# Required input

- A natural-language memory query.
- The authorized NAS scope or library location needed by the installed UGREEN environment. If scope is missing or ambiguous, ask one concise clarification before searching.
- Optional constraints such as media type, event, subject, location, or date range.
- Explicit user confirmation before any album, folder, tag, move, copy, delete, or other state-changing operation.

# Generation-time capability evidence

- `ug-photo` → `photo-agent`
- `ug-filesystem` → `file-agent`
- `ug-filemgr` → `file-agent`
- `file-workflow` → `file-agent`
- `ug-document` → `document-agent`
- `ug-video` → `media-agent`

# Workflow

## 1. Interpret the request

Extract the media type, event or subject terms, explicit date constraints, location constraints, and requested output. Preserve the user's original query as search intent. Do not invent dates, locations, people, events, captions, or file paths. If the request cannot be mapped to a supported read capability, state the limitation and offer the closest supported search.

Read [search workflow](references/search-workflow.md), [capability map](references/capability-map.md), [evidence and ranking](references/evidence-and-ranking.md), and [memory collections](references/memory-classification.md) before executing multi-step searches.

## 2. Establish authorized scope

Search only the user-authorized NAS scope. Do not broaden to unrelated roots, other users' private folders, external devices, or shared directories unless the user explicitly included them and permissions allow access. Treat permission denial as a real result and report it without bypassing controls.

## 3. Photo memory search

For photo-library queries, delegate the complete read-only discovery task to `photo-agent`:

`delegate --target photo-agent --instruction 'Find photo memories matching the user's original request within the authorized NAS scope. Preserve the original query as search intent. Use supported photo search, classification, metadata, OCR, and visual-understanding capabilities only where appropriate. Return real candidate identifiers, filenames, host paths, timestamps, location fields when present, camera metadata when present, match evidence, confidence or uncertainty, and any resultRef needed for later album creation. Keep strong and possible matches separate. Do not create albums, move files, or modify NAS state.'`

Use the returned real business facts only. If the result is explicitly empty, report no verified matches and do not broaden the query or substitute similar photos. If required identifiers or paths are absent, stop dependent work and explain the gap.

## 4. Personal video-file and general file discovery

For personal videos or files outside the photo library, delegate bounded discovery to `file-agent`:

`delegate --target file-agent --instruction 'Discover files matching the user's original request within the authorized NAS scope. Use supported filesystem listing, bounded find, stat, media-info, and tag-read capabilities. Return real paths, names, types, sizes, timestamps, available media metadata, and tag facts. For video memories, do not claim visual-content understanding unless a documented capability actually returned it. Do not move, copy, delete, tag, or otherwise modify files.'`

For catalog movie or series requests, delegate to `media-agent` instead and use only `ug-video/search` catalog results:

`delegate --target media-agent --instruction 'Search the media catalog for the user's movie or series request using supported video search filters. Return real catalog identifiers, titles, metadata, and availability facts needed for playback or subtitle follow-up. Do not claim that catalog results represent personal NAS video files, and do not start playback unless the user requested it.'`

## 5. Document discovery and analysis

First delegate document discovery to `file-agent`:

`delegate --target file-agent --instruction 'Discover real document files matching the user's original request within the authorized NAS scope. Use supported filesystem find, list, stat, and document-relevant filters. Return real document paths, filenames, types, sizes, timestamps, and page or scanned facts when available. Do not read document contents, move files, or modify NAS state.'`

Then delegate document analysis to `document-agent` with the verified paths returned by that discovery step:

`delegate --target document-agent --instruction 'Answer the user's document question using only the real document paths returned by the file-agent discovery step in this workflow. Use supported document metadata, extraction, OCR, and QA capabilities. Return citations, coverage, extracted facts, and failures exactly as supported. If no verified document paths were returned or documents cannot be read, report the gap and do not invent content.'`

For scanned documents, use the documented extraction/OCR path and report coverage or failures. Do not claim OCR succeeded when the expert reports missing or unreadable content.

## 6. Memory timeline

For timeline requests, delegate a read-only summary to `photo-agent`:

`delegate --target photo-agent --instruction 'Summarize photo memories matching the user's original request within the authorized scope into year or month buckets using the supported read-only timeline-summary capability. Return bucket labels, counts, capture-time ranges, and sample photo facts exactly as returned by the NAS. Do not create folders, move photos, or infer event labels that are not supported by returned evidence.'`

Present undated or uncertain items separately. Do not convert upload time into capture time unless the returned metadata identifies that field.

## 7. Smart collections and album creation

After a completed photo search, propose a collection only from verified candidates. Show the proposed album name, match count, representative evidence, and whether the source is a real `source-ref`, explicit picture IDs, or a search `query`. Ask for explicit confirmation before any write.

After confirmation, delegate creation to `photo-agent`:

`delegate --target photo-agent --instruction 'Create the user-confirmed regular photo album using only verified inputs from the completed RecallVault search: the confirmed album name and either the real source-ref, explicitly confirmed picture IDs, or confirmed search query returned by that search. If the required verified input is missing, stop and report the gap. After the write, verify the album through supported album detail or list capabilities and report the real album identifier and status. Do not claim success from the request alone.'`

If the user instead requests file or folder organization outside photo albums, use `file-agent` only for an approved `file-workflow` plan. Require the platform approval flow, preserve the real plan ID, and verify the final result before reporting completion.

## 8. Verification and reporting

Report only facts returned by completed delegations. Include filenames or NAS references, available dates, locations, media metadata, OCR/VLM/document evidence, relevance rationale, and uncertainty. Distinguish strong matches from possible matches. Never fabricate thumbnails, descriptions, GPS coordinates, event names, or album IDs.

# Completion and failure

Handle every delegation state explicitly:

- `completed`: continue only when the returned facts contain the required paths, IDs, counts, text, or other business values.
- `failed`: stop dependent work, preserve confirmed results, and report the failed step without inventing success.
- `cancelled`: report the workflow as incomplete and do not automatically retry effectful operations.
- `waiting_user`: wait for the same delegation to resume after the user answers the platform question.
- `waiting_approval`: wait for platform approval and resume the same delegation; conversational agreement is not approval.

Empty results are valid when the expert explicitly reports no matches. Do not broaden filters, switch to similar objects, or fabricate candidates. Partial completion must list completed, failed or cancelled, waiting, and dependency-blocked steps separately.

# References

- [Search workflow](references/search-workflow.md): query interpretation and capability routing.
- [Capability map](references/capability-map.md): exact documented Actions, parameters, effects, and approval needs.
- [Evidence and ranking](references/evidence-and-ranking.md): match-strength and uncertainty rules.
- [Memory collections](references/memory-classification.md): collection labels and album safety rules.
- [Privacy and permissions](references/privacy-and-permissions.md): scope, consent, and data-handling boundaries.
- [Testing scenarios](references/testing-scenarios.md): read-only, empty-result, permission, and write-safety checks.
