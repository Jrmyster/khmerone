# Inspection — proposal 23

`/inspection` provides a Khmer/English Inspection & Service Accountability guide and a browser-local service-issue worksheet. It is independent of the Ministry of Inspection. The page neither submits complaints nor determines whether conduct is unlawful.

## Intended social benefits

- **Clearer citizen records:** seven optional fields separate the service concerned, event sequence, expected service, direct observations, existing records, requested response and follow-up. This can reduce repeated retelling and missing information.
- **Better routing:** four source-linked starting points distinguish the Ministry of Inspection from the Ministry of Interior's General Department of Inspection, the Anti-Corruption Unit and independent Transparency International advice. Users confirm jurisdiction directly.
- **Fairer review:** prompts encourage factual descriptions and distinguish observation from assumptions. Delays and disagreements are not automatically classified as corruption.
- **Access across language and connectivity needs:** Khmer-first display, English switching, larger text, printable worksheets and UTF-8 text export support families and community helpers. Blank worksheets can be printed for private handwriting.
- **Service improvement:** clearer requested outcomes and follow-up notes may help receiving offices understand issues and identify practical corrections. These are intended benefits, not measured results.

## Privacy and behaviour

Drafts and checkbox state exist only in React component memory. This feature has no API, form submission, file upload, localStorage, analytics event or URL encoding of draft content. Reload or Clear my notes resets the page state. Language switching preserves notes without translating them. Print and text download are user initiated and include draft-only status, source links, date and review notice. Downloaded and printed copies must be kept private by the user.

Inputs are optional and bounded; text is rendered with normal React escaping. No HTML export or HTML injection is used. The plaintext export preserves literal user text. Do not use Khmer One's shared Feedback menu for complaints; it is separately intended for website corrections. No anonymity, confidentiality, acceptance or response-time guarantee is made for third-party channels. The page suggests independent advice when someone is concerned about privacy, retaliation or legal time limits.

## Sources reviewed 2026-10-31

- [Ministry of Inspection](https://inspection.gov.kh/) — direct automated retrieval timed out. The ministry domain is identified in its published organisation document metadata, [catalogued by Open Development Cambodia](https://data.opendevelopmentcambodia.net/en/laws_record/sub-decree-no-06-on-the-organization-and-functioning-of-the-ministry-of-inspection).
- [TRC service-code directory](https://www.trc.gov.kh/en/resources/emergency-numbers/) — lists 1268 for Ministry of Inspection public reporting. The guide does not claim this is emergency dispatch or operates continuously.
- [Ministry of Interior official app directory](https://www.interior.gov.kh/en/tech_application_suite) and [institutional responsibilities](https://www.interior.gov.kh/en/about_moi) — identify the separate Interior complaint channel and its scope.
- [Interior complaint portal](https://css-gdin.interior.gov.kh/home) — indexed official form shows complaint, personal-information, identity-confirmation and evidence stages; direct retrieval timed out. No submission or login was attempted.
- [Anti-Corruption Unit](https://www.acu.gov.kh/) and its [published role](https://www.acu.gov.kh/en_sub_index.php?03c7c0ace395d80182db07ae2c30f034=19&4a8a08f09d37b73795649038408b5f33=1) — links to the competent institution rather than claiming all service problems are corruption.
- [Transparency International Cambodia advice contact page](https://www.transparency.org/en/report-corruption/cambodia) — clearly labelled independent advice, not a government decision-maker.

Recheck channel scope and required forms before publishing detailed submission instructions. Khmer wording remains marked as awaiting teacher review. This is a preparation aid, not a prescribed official complaint form.

## Integration and validation

The app is included in the catalogue, shared navigation and site search; each contact guide has its own search anchor. Tests cover bounded isolated edits, empty/reset state, multilingual literal export, checked-state preservation, source provenance and bilingual channel content. The production smoke test checks `/inspection` in the Workers runtime. No deployment bindings or secrets change.

Validation on 2026-10-31: all 70 tests, lint, TypeScript, production build, Workers runtime route checks and Wrangler deployment dry run passed. Shared site code was checked for draft capture: it handles its separate feedback form and low-data preference, not this worksheet. Browser visual QA remains unverified because the managed preview connection failed during the preceding additions, with no established infrastructure recovery. Production deployment remains separate from branch-build success.
