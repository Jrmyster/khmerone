# Khmer One search

## Coverage

The home-page search, floating search and `/search` page share the same English/Khmer content index. Results include catalog apps, local pages, STEM definitions and examples, complete stories and questions, teaching units and generated resources, coding lessons and examples, announcement templates, skill paths, learning crews, and approved school resource descriptions.

The index reads the same content collections used to render these features. `scripts/generate-public-search.mjs` also extracts public page copy and the Engine Lab's embedded learning text before each production build. New static page routes and public HTML pages are discovered automatically. Dynamic routes require concrete destinations in the generator; brand aliases share the home-page entry.

Linked external apps are indexed through their catalog descriptions and tags. This does not crawl their full websites. Uploaded PDF/image contents, browser drafts, recordings, editor queues and private resources are not indexed.

## Search behavior

- English title matches rank above incidental mentions. Searches accept multiple words in any order, word prefixes and simple English plurals.
- English and Khmer fields are searched together. Khmer vowel marks are preserved; invisible word separators and extra spaces do not prevent matches. Khmer/Arabic digits and Latin accents are normalized.
- Results show their content type, bilingual title and a matching excerpt. Full results can be filtered by type and expanded in batches.
- Dictionary, story, teaching-unit, code, template and resource links select the matching entry. Template links select the template without replacing an existing draft.
- The dictionary and school exchange use the same normalization as site search. Both home-page search inputs share query state; existing app category and grade filters remain available.

## Published resources

Public searches use `/api/learning/resources?index=1` and follow its `nextCursor` to avoid the previous 200-record cutoff. Only approved rows are returned. A direct resource link fetches that approved ID; rejected or pending IDs return no public record. Resource errors leave the static apps and lessons searchable.

## Maintaining the index

1. Add or edit public content in its existing data collection or page component.
2. Run `pnpm build` to refresh generated page copy and create the release.
3. Run `pnpm test` to check route coverage, bilingual content coverage, ranking and resource privacy/pagination.
4. Deploy with `pnpm run deploy:cloudflare`.

For a new data-driven feature with multiple hidden tabs or entries, add its collection to `data/siteSearch.ts` and a deep link in its component. Keep private data out of this collection.

## Verification

The regression suite covers every current page/catalog entry, all STEM/story/toolkit text, Khmer normalization, exact-title ranking, words found only inside page content, resource loading and safe snippets. The real Workers-runtime test covers pagination beyond 200 approved rows and confirms that private/rejected records remain hidden.

Production rendering includes `/search` and all learning pages. Local interactive browser QA could not start a Chrome debugging session in this environment and remains unverified. After deployment, check `algorithm`, `កោសិកា`, `wooden board`, `condense droplets`, and `compression`; open a result and confirm the selected entry. Check the narrow mobile layout and both home-page inputs.
