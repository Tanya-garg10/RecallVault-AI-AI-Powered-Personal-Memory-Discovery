# Evidence and ranking

## Evidence types

Use only evidence returned by the responsible expert:

- Structured metadata: timestamps, filename, file type, size, camera/lens/exposure/ISO/aperture/focal length, codec, duration, resolution, bitrate.
- Photo-service search evidence: matching filters, result reference, preview items, totals, capture-time span, classification candidates.
- Visual evidence: OCR text or VLM answer for a real image path.
- Document evidence: extracted fields, QA answer, citations, page references, coverage, and failures.
- File evidence: real path, directory listing, stat attributes, media info, and tag relationships.

## Match strength

### Strong match

A strong match should satisfy all explicit user constraints that the capability can verify and have at least one direct evidence source, such as:

- Capture/upload timestamp inside the requested range when the user asked for a date.
- Filename, OCR text, VLM answer, classification, location metadata, or document citation supporting the requested subject/event.
- Media type matching the request.
- A real path or identifier returned by the NAS.

### Possible match

Label a result as possible when one or more requested constraints cannot be verified, evidence is indirect, OCR/VLM is inconclusive, metadata is missing, or the item matches only part of a compound query.

### Non-match

Do not include unrelated items merely to fill a gallery. Do not broaden dates, locations, people, or event terms without user approval.

## Ranking order

1. Exact explicit constraints: media type, date range, path scope, person/pet/location filters actually supported.
2. Direct content evidence: OCR, VLM, document citation, classification, filename match.
3. Metadata richness: available capture time, camera, codec, duration, page count.
4. Recency or user-requested sort order when supported.

Within the same strength, preserve the order returned by the NAS unless the user requested another sort.

## Explanation format

For each result, report:

- Real filename or NAS reference.
- Available date/time fields and which field they represent.
- Location only when returned by metadata or search evidence.
- Why it matched, citing the evidence type.
- Missing or uncertain fields.
- Whether the match is strong or possible.

Never invent a thumbnail URL, description, GPS coordinate, event name, or person identity.
