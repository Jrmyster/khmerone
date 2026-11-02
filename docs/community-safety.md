# National Defence — proposal 27

`/community-safety` adds an independent Khmer/English civilian learning guide to Khmer One. It connects four areas: mine and unexploded-ordnance awareness, household emergency preparation, official defence information, and rehabilitation/support referrals. It is not operated or endorsed by the Ministry of National Defence.

## Intended improvements for Cambodian society

- **Prevent avoidable injury:** short, source-linked mine-risk messages help families and schools understand when to seek trained assistance. The page never asks visitors to identify, approach, handle or photograph suspected ordnance.
- **Prepare households:** a six-item interactive checklist encourages shared plans, written contacts and arrangements for children, older people and people with disabilities. Print and UTF-8 text download retain the selected checklist state, mine-safety messages, source links and review caveat. Printed copies include space for private household notes.
- **Improve access to trustworthy information:** the ministry's general-contact page provides an official starting point. Users are prompted to check dates and original sources before forwarding messages. General enquiries are distinguished from urgent hazard reporting.
- **Support recovery and participation:** the existing Support Services Navigator links families to disability, rehabilitation, veterans and household-assistance resources. Availability and eligibility remain provider decisions.

These are intended benefits, not measured outcomes. No incident-reporting, geolocation, surveillance, recruitment, live-warning or military-operational functionality is implemented. The page collects no contact details or incident locations. Checkboxes are component state only and reset on reload. A completed checklist is not a safety certification.

## Sources and maintenance

Sources checked 2026-10-31:

- [Cambodian government mine-safety message, published by AKP](https://vps.akp.gov.kh/post/detail/362948)
- [CMAC risk education and victim assistance](https://cmac.gov.kh/what-we-do/eore-and-victim-assistance/)
- [Ministry of National Defence general enquiries](https://mod.gov.kh/contact/)
- [American Red Cross household planning](https://www.redcross.org/get-help/how-to-prepare-for-emergencies/make-a-plan.html)

The Red Cross material supplies general planning principles, not Cambodia-specific evacuation directions. Current local instructions take precedence. Do not label a static link as a live alert, or a ministry administrative contact as an emergency dispatch line. Keep mine-risk wording focused on non-contact and referral to trained authorities; any expanded safety material should receive specialist review.

The interface and exports explicitly say Khmer translation has not yet been reviewed by a teacher or safety specialist. Content is in `data/communitySafety.ts`; display, print and download use that same data. Shared navigation, app catalogue and site search expose the page and all four guide topics. The Government Services Finder stylesheet is reused with a scoped green safety theme.

## Validation

Tests cover bilingual guidance, trusted source URLs, preservation of caution and provenance in exports, and exact checklist-state export. The production smoke test checks `/community-safety` in the Workers runtime. Shared-navigation and search tests cover integration. No deployment bindings or secrets change.

Validation on 2026-10-31: all 65 tests, lint, TypeScript, production build, Workers runtime route checks and Wrangler deployment dry run passed. Managed browser preview returned connection refused even though the preview daemon reported healthy; visual QA remains unverified. Production deployment is separate from a successful Cloudflare branch preview build.
