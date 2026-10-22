# LINAD Tutors — architecture and publication scope

## Routes

- `#/tutors` — catalogue; non-personal filter/sort values in URL search parameters.
- `#/tutors/:tutorId` — profile with the same stable ID as the data record.
- `#/tutors/:tutorId/request` — validated lesson enquiry.
- `#/tutors/become` — validated teacher application.
- `#/tutors/prepared` — honest preparation result; direct entry without an in-memory draft has a recovery screen.

The feature is lazy-loaded by one narrow route integration in App.tsx. Existing Header, Footer, global CSS, preferences, Learning and Practice are reused without edits. The old unused TutorsPage placeholder export remains in SectionPages.tsx to avoid touching unrelated shared pages.

## Layers

- `model.ts`: tutor, localisation, filter, contact and draft contracts; no React dependency.
- `data.ts`: six explicitly Demo records; existing portrait filenames; contact configuration defaults to null.
- `copy.ts`: complete RU/DE/EN interface copy, independent of teaching language.
- `service.ts`: pure search/filter/sort, validation helper, channel-link validation and text preparation. Email URI creation reuses the site's existing contact-link utility.
- `Catalog.tsx`, `Profile.tsx`, `Forms.tsx`, `Prepared.tsx`: five screens.
- `TutorUI.tsx`, `useTutorLocale.ts`: small shared UI/locale helpers.
- `Tutors.tsx`: internal router and ephemeral prepared-draft state.
- `src/styles/tutors.css`: scoped styles using existing LINAD theme, font, CTA and interaction variables.

## Contact configuration

No real tutor contacts or application recipient were supplied. All values in `tutorContacts` and `teacherApplicationContact` are null. Demo tutors are never assigned the project owner's contact details. The sidebar renders an informative unavailable state, not a clickable placeholder or fictitious account.

When actual, explicitly approved tutor destinations are available, connect them through the contact configuration/repository adapter in `data.ts` (or replace that adapter with an API). Keep public contact configuration centralised when introducing actual addresses. Telegram accepts only HTTPS `t.me` username destinations without arbitrary query/path data. Email uses the shared validated, encoded `mailto:` builder. Neither path sends anything automatically.

For Telegram, the result provides copying plus the configured contact link; the user pastes and sends the text. For Email, the configured link includes recipient, subject and complete CRLF-encoded message. The installed mail client decides whether it can open the URI. A link opening is never treated as delivery or booking confirmation.

## Personal data

No fetch/submission, backend, registration, calendar reservation or payment code is included. Name/email/message exist only in the form and the feature's in-memory draft. There is no personal data in URLs or local/session storage. The result is intentionally cleared by document reload or leaving the feature. Editing from the result restores the prepared fields while the feature remains mounted. Site language/theme preferences still use the existing site storage.

Clipboard success is shown only after `navigator.clipboard.writeText()` resolves. If it fails or the browser blocks access, the result selects the read-only text for manual copying. The explicit Select text action is always available.

## QA protection

`qa/tutors/protected-before.json` records every pre-existing source file. Only App.tsx is authorised to differ, and the test reconstructs the exact allowed route/import/title patch from `App.before.tsx`. The remaining 112 sources (including Header/Footer, all Learning/Practice content and global tokens/styles) and all 36 pre-existing public files are hash checked. Portrait copies are byte-identical to the six existing project images.

Historical audits keep their original snapshots. `tests/protected-source.ts` applies a fixed reviewed App.tsx after-hash for this task; no blanket source-directory exclusion was introduced. The speech audit's additions list includes the explicit 12-file Tutors manifest.

The new Playwright suite checks filters, ordering, profiles, navigation, native control semantics, local validation, message content, missing/unsafe contacts, URI encoding, successful and denied clipboard paths, no outgoing form submission, themes, live locale changes and responsive widths 320 / 360 / 768 / 1440. Real demo-contact dispatch is intentionally unavailable; configured-contact generation is checked with confirmed-address test fixtures, which are not shipped as tutor contacts.
