# Government Services Finder — proposal 28

Khmer One's `/public-services` implements the Office of the Council of Ministers proposal as an independent, bilingual directory organized around residents' tasks. It is not a government portal or an endorsed agency service.

## Public benefit

- Eight starting guides cover business registration, birth and civil records, vocational training, household assistance, care and rehabilitation, driving licences, land and construction enquiries, and criminal records. Naming responsible institutions helps residents avoid visiting the wrong office.
- Khmer-first copy, English switching, larger text, keyboard controls and mobile layouts make the starting information easier to use across language and access needs.
- Official links and preparation questions help people confirm documents, fees and follow-up arrangements before travelling, potentially reducing repeat trips and unofficial intermediary costs.
- Printable and downloadable text guides let families and community helpers prepare together and read the guide without a connection. External services still require connectivity.
- A ministry directory links to institutions outside this initial collection. Shared navigation, catalogue and site search expose the guides throughout Khmer One.

These are intended benefits, not measured outcomes. Future evaluation can ask whether users found the right office and avoided unnecessary repeat visits; do not collect identifying case records.

## Content and maintenance

`data/governmentServices.ts` contains bilingual content, institution names, sources and review dates. The finder accepts no applications, payments or personal records and makes no eligibility decisions. Checklist state is held only in component memory. The content does not guarantee fees, processing times or acceptance. Each guide directs users to confirm current requirements with the responsible institution. Khmer translation remains marked for review through the shared content-review component.

Sources checked on 2026-10-31:

- [Official registration and public-service directory](https://registrationservices.gov.kh/home-en/)
- [KhmerSME business preparation](https://www.khmersme.gov.kh/en/starting-a-business/make-your-business-legal/)
- [Ministry of Interior digital services](https://www.interior.gov.kh/en/tech_application_suite)
- [UNESCAP Cambodia civil-registration profile](https://crvs.unescap.org/country/cambodia)
- [MLVT training institute directory](https://skillsportal.mlvt.gov.kh/institutes)
- [IDPoor questions and requests](https://idpoor.gov.kh/en/faq/)
- [Ministry of Social Affairs, Veterans and Youth Rehabilitation](https://mosvy.gov.kh/)
- [MPWT driving-licence information](https://www.mpwt.gov.kh/en/public-services/driver-s-license)
- [Ministry of Justice Criminal Record Digital](https://cr.moj.gov.kh/)
- [CDC ministry and institution directory](https://www.cib-cdc.gov.kh/en/ministries-and-institutions)

Some official services require JavaScript or intermittently block automated access. The land guide links to the official service directory rather than relying on a directly inaccessible portal. Recheck live links and guidance before adding exact fees, deadlines or eligibility rules. Use the existing Feedback menu for corrections, without personal details.

## Validation

`tests/government-services.test.mjs` covers bilingual and institution search, combined filters, source/link integrity and full offline export. `scripts/test-learning-production.mjs` checks the route, shared navigation, Khmer rendering and service links in the Workers runtime. The existing shared-navigation test ensures the generated static Engine Lab menu stays synchronized. Run lint, TypeScript, the test suite, production build, production smoke tests and the Cloudflare deployment dry run before release.

Validation on 2026-10-31: all 63 tests, ESLint, TypeScript, the production build, Workers runtime route smoke tests and Wrangler deployment dry run passed. Browser visual QA remains unverified: the managed preview could not resolve the shared dependency directory in this checkout.

No Cloudflare bindings or deployment configuration change is needed for this page. A successful branch build alone does not establish that the production domain serves the change.
