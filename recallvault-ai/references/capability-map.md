# RecallVault capability map

Source: official catalog `data/capability-catalog.json` version `2.2.0`. Action names and parameter names are preserved exactly. Example paths and IDs in the catalog are synthetic; real NAS responses are authoritative.

## `ug-photo` → `photo-agent`

| Action | Effect / approval | RecallVault use | Important parameters |
|---|---|---|---|
| `search-picture` | read / none | Structured photo search by date, file type, filename, location, person, pet, OCR, album, camera, and path scope | `start-time`, `end-time`, `file-type`, `file-name-contains`, `location`, `person-name`, `pet-name`, `ocr-contains`, `dir`, `range-personal`, `range-share`, `sort-by`, `limit`, `total-judge` |
| `search-screen` | read / none | Semantic/content-recognition photo search where one keyword may include scene, event, place, people, pets, and time | `keyword`, `start-time`, `end-time`, `time-field`, `file-type`, `storage-type`, `sort-by`, `limit` |
| `search-classify` | read / none | Find person/pet or image-recognition classification candidates | `category`, `keyword`, `page`, `page-size` |
| `meta` | read / none | EXIF/media metadata for real image paths | `path`, `raw` |
| `vision-ocr` | read / none | OCR for real image paths | `path` |
| `vision-vlm` | read / none | Visual QA for real image paths | `path`, `prompt`, optional model/token controls |
| `timeline-summary` | read / none | Read-only year/month photo buckets with counts, ranges, and samples | same filter family as photo search plus `group-by`, `sample-size` |
| `timeline` | state-change / workflow | Create year/month timeline folders and submit batch copy/move tasks | same filter family plus `group-by`; requires approval and verification |
| `albums` | read / none | List photo albums | `keyword`, `album-select`, `album-type`, `share-select`, paging/sorting |
| `album-detail` | read / none | Inspect a real album UUID | `album-uuid`, `get-type` |
| `create-album` | state-change / workflow | Create a regular album from confirmed inputs | `album-name` required; mutually exclusive `query`, `add-item`, `source-ref`; `source-ref` must match the documented result-reference pattern and come from a real search |

Catalog notes:

- `search-picture` and `search-screen` return search criteria, result references, previews, totals, and capture-time spans as supported by the deployed service.
- `create-album --source-ref` is preferred when a prior search returned a valid result reference. `add-item` is for a small set of explicitly confirmed picture IDs. `query` asks the photo service to select members internally and freezes up to the documented limit.
- `timeline` is not a preview; it creates folders and submits batch tasks.

## `ug-filesystem` → `file-agent`

| Action | Effect / approval | RecallVault use | Important parameters |
|---|---|---|---|
| `category` | read / none | List authorized root categories and children | `root-type`, `permission`, `limit` |
| `find` | read / none | Bounded file/folder discovery by path, pattern, type, timestamps, and size | `path`, `pattern`, `type`, `max-depth`, `start-timestamp`, `end-timestamp`, `date-type`, `min-size`, `max-size`, `sort-by`, `sort`, `limit` |
| `ls` | read / none | List folder contents recursively or non-recursively | `path`, `recursive`, `max-depth`, `limit`, `sort-by`, `sort` |
| `stat` | read / none | Inspect one real path | `path` |

## `ug-filemgr` → `file-agent`

| Action | Effect / approval | RecallVault use | Important parameters |
|---|---|---|---|
| `mediainfo` | read / none | Media metadata for one real file path | `path`, `intranet-share-id` |
| `tag-list` | read / none | List current user tags | none |
| `tag-get-by-name` | read / none | Resolve a real tag by name | `name` |
| `tag-filter` | read / none | Find files by real tag IDs and optional paths | `tag-id`, `path`, `recursive` |
| `tag-get-file` | read / none | Read tags bound to files | `path` |

## `file-workflow` → `file-agent`

| Action | Effect / approval | RecallVault use | Important parameters |
|---|---|---|---|
| `start` | read / none | Create a file operation plan for an explicitly requested organization task | `kind` plus the documented organization/deduplication parameters |
| `run` | state-change / workflow | Run an approved plan by real plan ID | `id` |
| `batch-transfer` | state-change / workflow | Copy/move an explicit batch after approval | `actionType`, `data` |
| `batch-move` | state-change / workflow | Move/rename multiple files after approval | destination/source/rule fields documented by the catalog |
| `batch-del` | state-change / workflow | Delete multiple files after approval | `paths` |
| `batch-restore` | state-change / workflow | Restore deleted files after approval | `id` |

RecallVault does not use file-workflow for ordinary memory search. It is reserved for an explicit organization request with confirmation and verification.

## `ug-document` → `document-agent`

| Action | Effect / approval | RecallVault use | Important parameters |
|---|---|---|---|
| `metadata` | read / none | Document size/time/pages/scanned detection and directory overview | `file`, `include-pages`, `directory-limit` |
| `extract` | read / none | Structured extraction/OCR for supported schemas | `query` required; `file`, `schema`, `content-scope`, `max-files`, `dedupe`, `body-cap` |
| `qa` | read / none | Document QA/summary/lookup with citations and coverage | `query` required; `file`, `intent`, `keywords`, `entities`, `content-scope`, `top-k`, `max-files` |

Document translation and writing Actions exist but are draft-producing or mixed-effect operations; RecallVault does not use them for read-only memory discovery.

## `ug-video` → `media-agent`

| Action | Effect / approval | RecallVault use | Important parameters |
|---|---|---|---|
| `search` | read / none | Catalog movie/series/library/favorites/recent/updated/activity search | `type` required; `keyword`, `classification`, `style-keyword`, `country-keyword`, `release-start`, `release-end`, `collection-id`, `media-lib-id`, paging/limits, `play` |
| `shortlist` | read / none | Check several named titles | `title` |
| `subtitle-search` | read / none | Search subtitle candidates for a real video | `video-path`, `query`, season/episode fields |
| `subtitle-download` | state-change / gateway | Download a real subtitle candidate after approval | `file-id`, `video-path` |
| `control` | state-change / none | Playback control only when explicitly requested | `operation` |

Important boundary: `ug-video/search` is a media-catalog capability. It must not be described as semantic understanding of arbitrary personal video files.

## Not used by RecallVault

- `ug-music`, `ug-surveillance`, and `ug-knowledge` are outside the memory-discovery scope unless a later user request explicitly needs them.
- No catalog Action provides arbitrary personal-video frame analysis, face recognition by name, guaranteed GPS extraction, or a generic NAS REST API.
