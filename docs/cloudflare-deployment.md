# Deploy Khmer One to Cloudflare

This repository builds a **Cloudflare Worker with static assets**, using vinext
and the Cloudflare Vite plugin. It is not a static Pages directory: uploading
only `dist/client` would omit the server-rendered homepage, curriculum routes,
brand aliases, and `/api/catalog`.

## Connect the existing Worker to GitHub

In the selected Cloudflare account, open the existing `khmerone` Worker and its
Builds settings. Connect `Jrmyster/khmerone`, using production branch `main` and
the repository root. Configure:

| Setting | Value |
| --- | --- |
| Node | 22.13.0 or newer (Node 22 recommended) |
| Package manager | pnpm 11.25.0, matching `package.json` |
| Install | `pnpm install --frozen-lockfile` |
| Build command | `pnpm run build` |
| Production deploy command | `pnpm run deploy:cloudflare` |
| Non-production deploy command, if enabled | `pnpm exec wrangler versions upload --config dist/server/wrangler.json` |

The Vite configuration names the generated Worker `khmerone`, matching the
existing destination. Build first: it generates `dist/server/wrangler.json`,
the Worker modules, and `dist/client` assets. Do not commit generated output or
use a manually uploaded asset-only ZIP for this build.

Connecting GitHub or choosing an API token may require the account owner's
authorization. Do not broaden repository access beyond this repository.

## Deploy from a local terminal

```sh
pnpm install --frozen-lockfile
pnpm run build
pnpm run deploy:cloudflare:check
pnpm exec wrangler login
pnpm run deploy:cloudflare
```

Choose the intended Cloudflare account during sign-in. When necessary, set
`CLOUDFLARE_ACCOUNT_ID` to the public account ID before deploying. Automation
may use a scoped `CLOUDFLARE_API_TOKEN` stored in its secret manager; never commit
it, put it in client variables, or paste it into chat. This application has no
required provider secrets, D1 databases, or R2 buckets in its current hosting
configuration. Its educational interactions do not require Sites connectors.

## Verify after deployment

Use the live URL returned by Wrangler or shown by the existing Worker. Check
`/`, `/computer-engineering`, `/teacher-toolkit`, and `/api/catalog`. Test the
language switch, gate inputs, code copying, and teacher-toolkit offline setup.
Keep existing custom-domain routes and bindings when updating the Worker.

The application build, TypeScript checks, and 16 Node tests passed for the
curriculum release. Repository-wide CI currently fails on three pre-existing
React effect lint errors in TeacherToolkit and BackgroundAudio; this does not
mean a Cloudflare deployment has occurred or failed. Cloudflare build status
must be checked separately. A Wrangler dry run validates packaging without
uploading or activating a Worker and does not prove authentication or a live
deployment.

Sources: [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
and [Vite static assets](https://developers.cloudflare.com/workers/vite-plugin/reference/static-assets/).
