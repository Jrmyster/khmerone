# KhmerOne

A bilingual, mobile-first directory for seven Cambodian educational apps. Built with Next.js App Router, TypeScript, Tailwind CSS and lucide-react.

## Run

```bash
npm install
npm run dev
```

## Registry and launch links

Edit `data/apps.ts` to update translations, grade levels, descriptions and links. `url: null` deliberately shows **Link pending**; replace it only with a confirmed public URL. School Connect Cambodia is linked to `https://schoolconnectcambodia.com/`. World Game uses the address supplied for the project, `https://world-game-atlas.jrmyster7.chatgpt.site/`. The portal opens external apps in a new tab, since many sites block iframes.

`offlineReady` describes the child app itself. The portal's service worker caches its own shell and `/api/catalog` metadata after a successful visit; it cannot make external apps available offline.

## Network bar in child apps

For React, copy `components/KhmerOneBar.tsx` and its `Locale` type or adapt the two locale strings. Render `<KhmerOneBar locale="km" homeUrl="https://khmerone.com/" />` above the child app header. This component uses inline styles, so the child app needs no portal CSS.

For a plain HTML app, add:

```html
<script defer src="https://khmerone.com/khmerone-bar.js"></script>
<khmerone-bar lang="km" home="https://khmerone.com/"></khmerone-bar>
```

The `home` prop/attribute can point at the deployed portal address until a custom domain is connected. The script uses Shadow DOM so its styling stays isolated. Language and theme selections are saved only in the portal browser origin.
