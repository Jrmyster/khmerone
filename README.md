# KhmerOne

A bilingual, mobile-first directory for eight Cambodian educational apps. Built with Next.js App Router, TypeScript, Tailwind CSS and lucide-react.

## Run

```bash
npm install
npm run dev
```

## Registry and launch links

Edit `data/apps.ts` to update translations, grade levels, descriptions and links. The registry includes the app addresses supplied by the project owner. The portal opens external apps in a new tab, since many sites block iframes. Chhouk Baby carries a bilingual notice that its medical information is pending government review and directs visitors to consult a licensed doctor about their baby's health.

`offlineReady` describes the child app itself. The portal's service worker caches only explicitly allowlisted public images after they are viewed. It does not cache navigation HTML, API responses, or private payloads, and it cannot make the portal homepage or external apps available offline.

## Network bar in child apps

For React, copy `components/KhmerOneBar.tsx` and its `Locale` type or adapt the two locale strings. Render `<KhmerOneBar locale="km" homeUrl="https://khmerone.com/" />` above the child app header. This component uses inline styles, so the child app needs no portal CSS.

For a plain HTML app, add:

```html
<script defer src="https://khmerone.com/khmerone-bar.js"></script>
<khmerone-bar lang="km" home="https://khmerone.com/"></khmerone-bar>
```

The `home` prop/attribute can point at the deployed portal address until a custom domain is connected. The script uses Shadow DOM so its styling stays isolated. Language and theme selections are saved only in the portal browser origin.

## Helper bot

`components/HelperBot.tsx` is a reusable client component. Pass the current `locale`, search `query`, filtered `resultCount`, `onSelectFilter`, and `onFocusSearch`. It reacts to search text with a short bilingual bubble; tapping it spins the SVG avatar and opens category shortcuts. Its animation and glass styles are in `app/globals.css`, including mobile and reduced-motion rules.

## Youth skill pathways

The homepage includes a four-pathway skills dashboard, personal Cyber-XP badges, and proposed province-based crew concepts. Content and rules live in `data/engagement.ts` and `hooks/useCyberProgress.ts`. Read `docs/youth-engagement.md` for XP calculations, bilingual messaging, and the boundaries of the local-only crew prototype.
