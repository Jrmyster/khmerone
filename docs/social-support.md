# Support Services Navigator

Route: `/social-support`. Built on `codex/khmer-one-learning-suite` to preserve the existing Audio Maker, learning tools, typing game and shared experience.

The Khmer-first interface provides six topic filters (household assistance, disability/rehabilitation, older people, veterans/families, children/families, and youth), bilingual local search, direct provider links, click-to-call contacts, larger text, optional device-voice narration and a printable/downloadable visit plan. No new backend, database migration or provider secret is required. Device narration explicitly reports when no Khmer/English voice is installed; it makes no Azure requests. Downloaded UTF-8 plans are usable offline. The website and external services are not advertised as offline-ready.

Search, selected provider and checkbox progress exist only in component memory. No case records, identity documents, precise location or eligibility answers are collected. The guide does not submit applications or determine eligibility. Feedback asks for resource corrections without personal circumstances. The page labels Khmer copy as not teacher-reviewed; a qualified Khmer reviewer should check it before institutional adoption.

## Sources checked on 31 October 2026

| Entry | Primary source | Scope |
| --- | --- | --- |
| Ministry of Social Affairs, Veterans and Youth Rehabilitation | https://mosvy.gov.kh/en/mission-2 and https://mosvy.gov.kh/en/home | Ministry responsibilities and published contact 023 726 086. English home was indexed but direct fetch encountered a redirect loop; link visitors to the root site. Contact availability was not confirmed by phone. |
| IDPoor | https://idpoor.gov.kh/en/faq/ | Requests through Commune/Sangkat working group, village chief or Public IDPoor app. Ministry of Planning, not MoSVY. No promised eligibility or benefit amount. |
| Exceed Worldwide | https://www.exceed-worldwide.org/cambodia | Physical rehabilitation; school/programme contact 023 881 494. Ask for the right clinic; do not promise all services are free. |
| HelpAge Cambodia | https://helpagecambodia.org/ | Older people/community work; published Battambang office phone 053 953 797. No claim of service availability in every province. |
| Child Helpline Cambodia | https://www.childhelplinecambodia.org/ | Provider states free 24-hour counselling on 1280 across Cambodia. Not emergency dispatch. |
| Disability Action Council | https://dac.gov.kh/en/ | Disability policy and rights information; published phone 023 727 428. Not a clinic or benefit-approval service. |

Dates indicate source review, not live verification of availability, opening hours or fees. Confirm those with the provider. Avoid adding unverified clinic coordinates or precise document requirements. Recheck contacts and translations when updating this data. Data is in `data/socialSupport.ts`, interface in `components/social-support/SocialSupportNavigator.tsx`, styles in `app/social-support/support.css`. The catalog, shared Tools menu and site search include this feature; build regenerates the standalone Engine Lab menu and public search index.

## Deployment

Use the existing Cloudflare `khmerone` Worker and the latest learning-suite source. Preserve the owner's existing `learning-infra.json`, D1/R2 bindings, Durable Object migration and Azure secrets. Do not deploy a build that omits the existing learning database or bucket. No changes to Cloudflare configuration are needed for this module. Build locally with `pnpm build`; run `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm run lint`, `pnpm run test:production` and `pnpm run deploy:cloudflare:check` before release. A dry run does not prove deployment or authentication. After deployment, verify the new route, search, language switch, print/download, and existing `/teacher-audio`, `/typing` and `/learning` routes.

## Validation, 31 October 2026

- All 60 unit/integration tests passed; TypeScript and lint passed.
- Production build and real Workers-runtime rendering passed, including `/social-support`, shared navigation, the Khmer default and source/contact links. Existing routes and unknown-route handling passed.
- Cloudflare packaging dry run passed. This checkout does not contain the owner's ignored `learning-infra.json`; its local build must not be deployed until the live D1/R2 bindings are restored from the authenticated account or the owner's existing configuration.
- Browser interaction/visual checks remain unverified: the managed preview reported running, but the browser returned connection refused. No browser substitute was used.
- Cloudflare deployment is pending authentication; Wrangler reported not authenticated and the dashboard displayed sign-in. No production change was made during these checks.
