# Memory collections

## Collection proposal rules

Suggest collections only from verified candidates returned by completed searches. Useful labels include Travel Memories, College Events, Festivals, Family Moments, Vacations, and Celebrations, but a label is a suggestion unless supported by query terms plus NAS evidence.

Before proposing an album:

1. Confirm the candidate set is non-empty and within the authorized scope.
2. Confirm every candidate has a real identifier, path, or result reference returned by the NAS.
3. Choose an album name that reflects the user's request without inventing facts.
4. Show the proposed name, candidate count, representative matches, evidence summary, and write action.
5. Ask for explicit confirmation.

## Album creation

Use `ug-photo/create-album` through `photo-agent` for regular photo albums.

Preferred input order:

1. `source-ref` from the latest filtered `search-picture` or `search-screen` result when available.
2. `add-item` for a small set of picture IDs explicitly confirmed by the user.
3. `query` only when the user confirms a composite search query and the photo service is expected to select members.

`query`, `add-item`, and `source-ref` are mutually exclusive. Never copy identifiers from examples or fabricate a `source-ref`.

After the write:

- Verify through `albums` or `album-detail` when possible.
- Report the real album UUID/identifier, name, member count, and any failed or partial status exactly as returned.
- If creation is blocked, cancelled, or unverified, say so and do not claim success.

## Timeline organization

`timeline-summary` is read-only and safe for the Timeline page. `timeline` creates year/month folders and submits batch copy/move tasks; use it only when the user explicitly asks to organize photos into timeline folders, after approval, and verify bucket statuses, folder IDs, submitted counts, and failures.

## File collections outside photo albums

For documents or personal video files, do not call them photo albums. If the user asks to organize them, use `file-agent` with `file-workflow` only after confirmation. Preserve the approved plan ID and verify the result before reporting completion.
