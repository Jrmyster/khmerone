# Foreign Affairs and International Cooperation — proposal 26

`/international-services` adds five independent Khmer/English guides: consular help abroad, travel preparation, entry services for Cambodia, international scholarship sources and community-project cooperation. It is not a ministry-operated or endorsed service.

## Intended social benefits

- Consular contact sources help citizens and relatives find a responsible mission and prepare questions, potentially reducing delays and dependence on unverified intermediaries.
- Travel preparation encourages confirmation with the destination authority, which may reduce document errors and avoidable costs. Cambodia's e-Visa is explicitly distinguished from visas for Cambodians travelling abroad; e-Arrival is distinguished from visa approval.
- Scholarship starting points improve access to information for students, including those outside major cities. The page links to Japanese government scholarship information and Australia Awards Cambodia intake information without claiming applications are open today.
- Community cooperation guidance directs organisations to the Japanese embassy's KUSANONE materials in Khmer and English. Preparation questions encourage a realistic budget, community participation and ongoing maintenance. Funding eligibility and awards remain with the programme.
- Printable/downloadable checklists support preparation without continuous connectivity. A destination selector provides three selected consular-contact sources and a ministry fallback. It is explicitly not a complete embassy directory.

These benefits are intended, not measured outcomes. The page does not process visa applications, decide eligibility, send messages or receive emergencies. It asks for no passport numbers, case details or travel itineraries. Checklist selections remain in component memory and reset on reload. Downloads include the selected state, sources, date and independent/unreviewed-content notices.

## Sources and verification limits

Reviewed 2026-10-31:

- [MFAIC](https://www.mfaic.gov.kh/) — official domain cross-linked by the Cambodian embassy in London; direct automated request rejected. Do not describe its current directory content as verified.
- [Cambodian embassy in Bangkok consular contacts](https://cambodiaembassyinthailand.wordpress.com/about-embassy/) — published mission contact page.
- [Malaysian Foreign Ministry contact directory](https://protocol.kln.gov.my/embassy-contact?letter=C) — search index identifies the Cambodian mission; direct retrieval returned 502. The UI notes possible unavailability and asks users to confirm current details.
- [Cambodian embassy in London consular services](https://www.cambodiaembassyuk.org/visa-cosular-services/) — official mission information, including a link to e-Visa.
- [Cambodia e-Visa](https://www.evisa.gov.kh/) — confirmed by the London embassy and indexed portal content; direct root retrieval returned a redirect loop.
- [Cambodia e-Arrival](https://arrival.gov.kh/) — JavaScript application, corroborated by the [official immigration-service clarification published by AKP](https://www.akp.gov.kh/post/detail/372751).
- [Japanese embassy scholarships](https://www.kh.emb-japan.go.jp/itpr_en/c_000078.html).
- [DFAT Cambodia Australia Awards intake information](https://www.dfat.gov.au/people-to-people/australia-awards/participating-countries/cambodia-information-for-intake).
- [Japanese embassy cooperation and KUSANONE guidance](https://www.kh.emb-japan.go.jp/itpr_en/00_000067.html).

Do not publish fixed fees, entry requirements, processing times or scholarship deadlines without freshly checking the responsible authority. Current guidance may differ by nationality, purpose, location and intake. No embassy telephone number is copied into the application; links lead to the responsible published source. Khmer text is marked as awaiting teacher review.

## Implementation and validation

Data lives in `data/internationalServices.ts`. All five guides are indexed individually in site search, and the app appears in the catalogue and shared navigation. The page reuses the public-services layout styles with a scoped blue international-services theme. Tests cover bilingual content, source destinations, complete exports and checked-state preservation. The Workers production smoke test verifies the route and shared navigation. No deployment bindings or secrets change.

Validation on 2026-10-31: all 67 tests, lint, TypeScript, production build, Workers runtime route checks and Wrangler deployment dry run passed. An initially untranslated e-Arrival label was corrected and verified in both client and server output. Browser visual QA remains unverified because the managed preview browser connection failed during the preceding addition; no infrastructure recovery was established. Production deployment remains separate from branch build success.
