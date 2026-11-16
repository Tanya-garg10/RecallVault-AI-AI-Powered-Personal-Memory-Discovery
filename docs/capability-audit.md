# RecallVault AI Capability Audit

Audit source: `uliya-skill-kit/data/capability-catalog.json`, catalog version `2.2.0`, generated `2026-11-05`. The catalog documents 9 CLIs and 84 public Actions checked against uclaw `release_2026930`; it does not prove that a specific NAS deployment has every feature enabled.

## Registered expert mapping used by RecallVault AI

| CLI | Registered agent | RecallVault use |
|---|---|---|
| `ug-photo` | `photo-agent` | Photo/video-library photo search, EXIF/media metadata, OCR/VLM evidence, timeline summaries, album detail/list, approved album creation, approved timeline organization |
| `ug-filesystem` | `file-agent` | Authorized root discovery, bounded file search, folder listing, file stat |
| `ug-filemgr` | `file-agent` | Media metadata for real file paths and user tag reads |
| `file-workflow` | `file-agent` | Approved file organization plans and verified batch operations when album/photo operations are insufficient |
| `ug-document` | `document-agent` | Document metadata, OCR/structured extraction, document QA with citations |
| `ug-video` | `media-agent` | Catalog media search only; not a substitute for personal NAS video-file discovery |

## Supported memory-search capabilities

### Photo discovery

- `ug-photo/search-picture`: structured photo search by capture/upload time, file type, filename text, location, person, pet, OCR text, camera/lens/exposure/ISO/aperture/focal filters, album filters, and path scope.
- `ug-photo/search-screen`: content-recognition search with one keyword that may combine scene, event, place, people, pets, and time, for example beach or festival queries.
- `ug-photo/search-classify`: typed classification candidates for people/pets or image-recognition categories.
- `ug-photo/meta`: EXIF/media metadata for real image paths, with a documented local EXIF fallback when the index lacks data.
- `ug-photo/vision-ocr`: OCR over real image paths.
- `ug-photo/vision-vlm`: visual question answering over real image paths.
- `ug-photo/timeline-summary`: read-only year/month buckets with counts, capture ranges, and sample photos.
- `ug-photo/timeline`: state-changing year/month folder organization; workflow approval required and result must be verified.
- `ug-photo/albums` and `ug-photo/album-detail`: read existing albums by real UUID.
- `ug-photo/create-album`: state-changing regular album creation. It can use mutually exclusive `query`, `add-item`, or `source-ref`; `source-ref` must be a real result reference returned by photo search. Approval is required.

### File, video-file, and document discovery

- `ug-filesystem/category`: list authorized root categories such as personal folders and shared folders.
- `ug-filesystem/find`: bounded filename/type/date/size search under a user-authorized root.
- `ug-filesystem/ls` and `ug-filesystem/stat`: inspect real folders and files.
- `ug-filemgr/mediainfo`: media metadata for one real file path.
- `ug-filemgr/tag-list`, `tag-get-by-name`, `tag-filter`, `tag-get-file`: read user tags and tag/file relationships.
- `file-workflow/start`, `run`, `batch-transfer`, `batch-move`, `batch-del`, `batch-restore`: plan/execute approved file operations. RecallVault uses these only after explicit confirmation and only for supported organization tasks.
- `ug-document/metadata`: document size/time/page/scanned detection and directory overview.
- `ug-document/extract`: structured extraction/OCR for supported document schemas.
- `ug-document/qa`: document QA/summary/lookup with citations and coverage.

### Catalog video search

- `ug-video/search`: searches the media catalog for movies, series, collections, actors, styles, regions, release dates, favorites, recent, updated, and activity views.
- This is useful for media-library titles, but it is not evidence that arbitrary personal video files on the NAS were indexed or understood. Personal video memories should be discovered through `ug-filesystem`/`ug-filemgr` and labeled only by available file/media metadata unless another documented capability proves more.

## Unsupported or limited capabilities

- No catalog Action performs semantic search over arbitrary personal video content or extracts frames from videos.
- No catalog Action identifies a person by name from a photo unless the photo service already provides supported person/pet classification filters or results.
- No catalog Action guarantees GPS location metadata; location filters exist, but missing metadata must be reported as unavailable.
- `ug-photo/create-album` can create a regular photo album from a real `source-ref`, explicit `add-item` IDs, or a `query`; it does not prove that every album type or folder organization use case is supported.
- `ug-photo/timeline` creates timeline folders and submits batch copy/move tasks; it is state-changing and must not be treated as a read-only preview.
- OCR/VLM/document extraction quality depends on the deployed service, file readability, model availability, and returned coverage/failures.
- The companion UI cannot call undocumented NAS APIs. It either uses a host-provided bridge implementing documented skill results or clearly labeled demo data.

## Privacy and permission boundaries

- Every search stays within the user-authorized NAS scope.
- Read operations are preferred; state-changing Actions require platform/user approval through the registered expert workflow.
- Album creation is proposed with the exact album name and candidate source, then executed only after confirmation.
- File move/copy/delete workflows are not part of the default memory search and require a separate explicit organization request plus approval.
- No credentials, tokens, real personal paths, or private media are embedded in the Skill package or frontend source.
