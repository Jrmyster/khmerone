# Publish the Khmer One learning suite

This release adds `/learning` and eight tools. It preserves `/teacher-audio` and the manual-redirect/native-link fixes. The primary target remains **khmerone.jaredrobertw.workers.dev**. This document is for the site owner; students do not need to do setup.

## 1. Open the new source folder

Extract the release ZIP to a new folder. Keep your previous working folder as a backup. In PowerShell, change to the folder containing `package.json`. Use Node 24 LTS and the pinned pnpm version from `package.json`.

```powershell
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm run setup:learning
pnpm build
```

The setup script reuses or creates `khmerone-learning` (D1) and `khmerone-learning-files` (private R2), then applies the additive database migration. Wrangler may ask you to select your Cloudflare account. Select the account that owns your existing `khmerone` Worker. If Wrangler reports multiple accounts without showing a selector, set `$env:CLOUDFLARE_ACCOUNT_ID` in PowerShell to the account ID shown in your existing Worker dashboard, then rerun setup. Enable R2 in that account if Cloudflare asks. Setup can be rerun safely after resolving an error. It does not deploy or change any secrets. `learning-infra.json` contains only resource IDs; preserve it on this computer. It is intentionally not checked into GitHub.

If you deliberately want links without file uploads, `pnpm run setup:learning --without-files` skips R2. All other exchange features work, but attachment uploads will stay unavailable.

## 2. Add the new secrets

Keep the existing `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` on the **khmerone** Worker. The build defaults the region to `southeastasia`, matching the existing deployment. If your Speech resource is in a different region, change that value in `vite.config.ts` before building. Existing encrypted secrets are preserved by Wrangler deployments.

Create an **Azure Translator** resource in your Azure account. Copy its key and region from **Keys and Endpoint**. This implementation uses Translator's global public endpoint; a private-network-only Translator resource needs additional deployment work. Do not reuse the Speech key unless your Azure resource explicitly provides both services.

Run each command separately. Paste the corresponding value only into Wrangler's secret prompt:

```powershell
pnpm exec wrangler secret put AZURE_TRANSLATOR_KEY --config dist/server/wrangler.json
pnpm exec wrangler secret put AZURE_TRANSLATOR_REGION --config dist/server/wrangler.json
pnpm exec wrangler secret put LEARNING_ADMIN_KEY --config dist/server/wrangler.json
```

For `LEARNING_ADMIN_KEY`, generate a random password of at least 32 characters using your password manager. Save it there and give it only to trusted school editors. It grants submission and moderation rights; it is not a learner login or room code. Rotating the secret revokes the old key. The app holds a typed editor key in tab memory only.

## 3. Publish and check

```powershell
pnpm run deploy:cloudflare:check
pnpm run deploy:cloudflare
pnpm run verify:learning
```

The deployment creates the SQLite Durable Object class for quizzes and binds the rate limiters. Do not delete or rename the `learning-v1` migration in later releases. Check `/learning` at the existing Cloudflare address. A CONFIGURED status only verifies that bindings exist. It does not validate Azure credentials or generate audio.

Run `pnpm run verify:learning --services` to also generate two short clips (English and Khmer) and one English-to-Khmer translation. These three calls use your Azure quota. PASS confirms a nonempty result; listen to clips in the browser and review translation quality separately.

## 4. Confirm real services

- Audio: create and play one English and one Khmer phrase. Also retest `/teacher-audio`.
- Speaking: allow the microphone, record a short English phrase, replay it, tick the send-to-Azure consent box and request feedback. This is English pronunciation practice, not Khmer assessment or exam grading.
- Translation: translate a short sentence in each direction; edit it and mark it reviewed. Have a Khmer teacher check the draft seed definitions, story translations and templates before classroom use.
- Live quiz: open a host tab and a separate learner tab/device. Create, join, answer, reveal, advance and finish. Reload each tab to check session restoration. Do not share host credentials; share only the room code. Rooms expire after two hours and permit 40 players.
- Exchange: unlock the editor, submit a resource and verify it is absent from the public list until approved. Try an attachment if R2 is enabled. Verify a private/rejected attachment cannot be downloaded publicly. Refresh after approval to check persistence.
- Mobile/offline: download a Dictionary or Story text pack, disconnect and open the file. Only the exported text is offline; cloud services need internet. Microphone recording requires HTTPS and browser permission.

## Costs and limits

The new tools use your own Azure and Cloudflare services and may incur usage charges. Set budgets/alerts in both accounts. Speech/translation/new-room creation share a per-IP limit of 20 requests per minute; classroom mutations have a separate 600-per-minute limit to accommodate a school sharing one connection. Cloudflare rate limits are protective limits, not a global billing cap. Azure F0 quotas still apply. The original Audio Maker keeps its separate 5-per-minute limiter.

Exchange listings persist until rejected or removed by the owner. Room data is deleted after expiry. Browser recordings are never stored by Khmer One; Azure processes recordings only after explicit submission. Local quiz, dictionary, announcement and translation drafts remain on that browser. Clearing browser data deletes drafts; export backups before doing so. Attachments are limited to 2 MB and are served as downloads, not inline pages. An interrupted upload may leave an unlinked private file; the owner can remove unused `learning_files` rows and matching `learning/<id>` R2 objects after confirming no resource references them.

## Troubleshooting and rollback

- **Dictionary audio returns 502 / provider_http_400**: rebuild and deploy the latest source. The learning speech request must include Azure's required `User-Agent` header, just like the original Audio Maker. The October 29 fix adds it and a regression check in the Workers runtime.
- **Translation rejects the site connection**: open the existing Translator resource's **Keys and Endpoint**, copy its key with the copy button, and save it again with `pnpm exec wrangler secret put AZURE_TRANSLATOR_KEY --config dist/server/wrangler.json`. Save the exact resource region with the corresponding `AZURE_TRANSLATOR_REGION` command (for Southeast Asia, use `southeastasia`). Paste values only when prompted, without quotation marks. Do not create a second resource or replace the Speech key. If rejection continues, check the resource's subscription and network-access settings in Azure.
- **Translation needs setup**: check both Translator secrets and its exact region. The Speech resource and Translator resource are separate.
- **Exchange unavailable**: rerun setup in the correct account, rebuild and redeploy so the D1 binding is included. Check that the migration applied.
- **Microphone denied**: use the browser's site settings to allow it. Some embedded browsers require opening the site in Safari, Edge or Chrome.
- **Rate limited**: wait a minute. Strong Wi-Fi cannot bypass a provider quota or a site request limit.
- **Missing screen / old page**: refresh once after deployment. New APIs use `no-store`; the original service worker does not cache learning API responses.
- **Rollback**: use Cloudflare Workers → khmerone → Deployments → select the previous working version. Do not delete the D1 database, R2 bucket or Durable Object namespace as part of rollback. A code rollback may need to retain the Durable Object class export; use Cloudflare's deployment rollback compatibility check. Keep the release ZIP and the earlier source backup.

## Ministry archive

The community culture archive uses the existing `LEARNING_DB` and `LEARNING_ADMIN_KEY`. Apply the additive `0003_culture_archive.sql` migration to the same database before releasing the archive. Submissions stay private until an editor approves them. Worksheets, the tool directory and private culture drafts work without these bindings.

## Reference documentation

- [Azure short-audio REST API and pronunciation assessment](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-speech-to-text-short)
- [Azure Translator REST API](https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/reference/v3/reference)
- [Cloudflare Durable Objects migrations](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/)
- [Cloudflare D1 commands](https://developers.cloudflare.com/d1/wrangler-commands/)
- [Cloudflare R2 commands](https://developers.cloudflare.com/r2/reference/wrangler-commands/)
