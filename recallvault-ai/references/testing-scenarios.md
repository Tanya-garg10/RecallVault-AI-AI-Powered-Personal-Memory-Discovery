# Testing scenarios

These scenarios are for the Skill host with registered experts available. Static package checks do not replace NAS runtime tests.

## Core read scenarios

1. Photo event search: ask for college farewell photos from an explicit year. Verify the expert uses supported photo search, returns real identifiers/paths, separates strong and possible matches, and does not invent event labels.
2. Semantic photo search: ask for last vacation pictures without an explicit date. Verify no unsupported date range is invented and missing location/date metadata is labeled unavailable.
3. Festival search: ask for Diwali celebration photos. Verify OCR/VLM/classification evidence is cited only when actually returned.
4. Date search: ask for photos taken in a specific month/year. Verify capture-time versus upload-time fields are not conflated.
5. Document search: ask for documents related to college events. Verify file discovery returns real paths and document QA/extraction returns citations or coverage/failures.
6. Personal video search: ask for vacation videos. Verify filesystem/media-info discovery and no claim of video content understanding.
7. Catalog video search: ask for a movie or series. Verify `media-agent` catalog results are kept separate from personal files.

## Timeline scenarios

8. Ask for a year/month memory timeline. Verify `timeline-summary` is read-only, buckets use returned dates, undated items are separate, and no folders are created.
9. Ask to organize photos into timeline folders. Verify approval is required, `timeline` is state-changing, and bucket/folder/submit/failure counts are verified before reporting.

## Collection and write scenarios

10. After a completed photo search, propose an album. Verify the proposal shows real candidates and requires confirmation.
11. Confirm album creation. Verify `create-album` uses only `source-ref`, confirmed `add-item` IDs, or confirmed `query`, then verifies the album through detail/list.
12. Attempt album creation without a valid source-ref or IDs. Verify the workflow stops and does not fabricate identifiers.
13. Request file organization. Verify `file-workflow` approval is required, the plan ID is preserved, and completion is verified.

## Edge and failure scenarios

14. Empty photo result: verify the response says no verified matches and does not broaden scope.
15. Missing EXIF/GPS: verify fields are reported unavailable.
16. Permission denied folder: verify the denial is reported and no bypass is attempted.
17. Inconclusive OCR/VLM: verify the match is labeled uncertain.
18. Partial document extraction: verify coverage and failures are reported.
19. `waiting_user`: verify the same delegation resumes after clarification.
20. `waiting_approval`: verify platform approval is required and conversational agreement is insufficient.
21. `failed` or `cancelled`: verify dependent work stops and partial results are reported accurately.
