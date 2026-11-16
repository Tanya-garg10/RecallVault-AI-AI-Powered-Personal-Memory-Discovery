# Privacy and permissions

## Scope

- Operate only inside the user-authorized NAS scope supplied by the user or environment.
- Do not search other users' private folders, unrelated shares, external devices, mirrors, or shared directories unless explicitly authorized.
- Treat NAS permissions as authoritative. A permission denial is a result, not a reason to retry elsewhere.

## Read-only default

Memory search, metadata extraction, OCR/VLM, document QA, timeline summaries, album lists, and file discovery are read-only workflows. Prefer them for every request unless the user explicitly asks to organize or modify NAS content.

## Approval boundaries

Require explicit confirmation before:

- Creating a photo album.
- Creating timeline folders or submitting timeline copy/move tasks.
- Creating tags or binding tags to files.
- Moving, copying, deleting, restoring, renaming, or changing timestamps.
- Downloading subtitles or producing draft document translations/writing.
- Any other state-changing Action.

Conversational agreement in chat is not a substitute for the platform approval flow when the expert requires `waiting_approval`.

## Data handling

- Do not include credentials, tokens, real personal paths, private media, or sensitive metadata in the Skill package or companion frontend.
- Do not transmit personal media or metadata to an external service unless the user explicitly authorizes it and the environment permits it.
- Do not claim data is private, encrypted, or processed locally unless the deployed environment verifies that claim.
- Minimize returned data to what is needed for the user's request.

## Verification

Report success only after the responsible expert returns a completed result containing the required business facts. For writes, verify through a supported read capability or the returned verified identifier/status. Never infer success from a request, plan, or approval alone.
