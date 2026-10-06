# Recovery and delivery ledger — 2026-10-06

## Evidence
- The interrupted implementation was built at `/mnt/data/nabil-portfolio` in the previous runtime.
- That working directory did not survive into this runtime. Three preview images and the full textual creation/inspection history survived.
- GitHub main contains only its original README. Verified base commit: `033cf322c365f6f6f6f54e09a1171aec9d174dbe`; tree: `a8794f4345a8b7ae5f08c4db6dab411174d60456`.
- Recovered source from the conversation history, not a claim that the old directory still exists.

## Scope
Preserve the previous graphite/chalk/copper design, custom SVG compute assembly, profile data, architecture explorer, stack explorer, career imagery, contact brief, motion and mobile behavior. No redesign and no invented employers, social URLs or credentials.

## Delivery plan
1. Restore previous sources and tests in an isolated local repository.
2. Run Node and rendered-browser QA; fix any regression.
3. Publish all source files in DeepDlueIV/Nabil using the GitHub connector (direct git DNS is unavailable).
4. Fast-forward main with an expected-head check; never overwrite concurrent work.
5. Read back the remote tree, compare blob hashes, and provide exact commit/source links plus a source archive.

Ruling: main is the delivery branch because the user explicitly wants files visible at the provided repository, whose main contains no existing website. Preserve unrelated work if the branch changes. No public-hosting changes without verification.
