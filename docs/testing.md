# RecallVault AI Testing Notes

## Static Skill validation

Command:

```bash
node uliya-skill-kit/scripts/check-skill.mjs recallvault-ai
```

Expected result: `status: static-pass`, zero errors, zero warnings. A static pass does not prove NAS installation, runtime compatibility, permissions, or device execution.

## Companion UI validation

Commands run from `recallvault-ui`:

```bash
npm install
npm run lint
npm run build
```

Expected results:

- `npm run lint` reports 0 warnings and 0 errors.
- `npm run build` produces `dist/index.html` and bundled assets without errors.

## Demo mode smoke tests

The companion UI ships a typed bridge (`recallvault-ui/src/lib/bridge.ts`) that falls back to labeled synthetic data when `window.ugreenRecallVault` is absent. Exercise it in the browser:

```bash
cd recallvault-ui
npm run dev
```

Then verify in demo mode (persistent banner confirms demo data):

- Home hero search for "Find my college farewell photos from 2025" routes to `/explore` and returns strong/possible groups.
- College event document query returns document-kind records.
- Vacation query returns travel-tagged photos and video-file records.
- December 2025 query returns only the December 2025 demo photo.
- Diwali query returns festival-tagged demo photos.
- Timeline shows year selector and month buckets derived only from returned dates.
- Collections show suggestions with member selection, rename, and a confirmation dialog; confirming reports `demo-only` and performs no write.
- Memory detail shows metadata, match reasons, evidence channels, and related memories.
- Settings shows demo scope, capability map, and privacy notes.

Expected demo behavior:

- Album creation returns `demo-only` with `verified: false`; no NAS write is claimed.
- Missing metadata renders as "unavailable" rather than inferred values.

## NAS runtime tests required on hardware

The following cannot be proven without a UGREEN AI NAS running the Skill host and registered experts:

1. Authorized scope discovery through `ug-filesystem/category` and bounded `find`.
2. Photo semantic search through `ug-photo/search-screen` and structured search through `ug-photo/search-picture`.
3. EXIF/OCR/VLM metadata quality through `ug-photo/meta`, `vision-ocr`, and `vision-vlm`.
4. Read-only timeline buckets through `ug-photo/timeline-summary`.
5. Album creation and verification through `ug-photo/create-album`, `albums`, and `album-detail`.
6. Document metadata/extraction/QA through `ug-document`.
7. Personal video-file metadata through `ug-filesystem` and `ug-filemgr/mediainfo`.
8. Permission-denied, empty-result, partial-coverage, `waiting_user`, `waiting_approval`, `failed`, and `cancelled` handling.

## Known limitations

- Arbitrary personal-video visual search is unsupported by the catalog.
- Person identification is limited to supported photo-service classifications.
- Location and event labels must come from returned metadata/evidence.
- The companion UI uses a host-provided bridge contract; no undocumented NAS API is called.
