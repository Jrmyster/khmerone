# KhmerOne Network bar

The standalone Web Component lives at `/khmerone-bar.js` on the KhmerOne portal. It uses a shadow root, has no package dependency, and shows the same app destinations as `data/apps.ts`. Update both files when a destination changes.

## Static site

Add this to the page's `<head>`:

```html
<script
  src="https://khmerone.jrmyster7.chatgpt.site/khmerone-bar.js"
  data-auto-inject
  data-current-app="anatomykh"
  defer
></script>
```

The bar is inserted at the start of `<body>`. The `data-current-app` attribute may be omitted; the component then matches the current hostname. Valid IDs: `school-connect-cambodia`, `anatomykh`, `finlitkh`, `khmer-vocation`, `khmer-english-exam`, `chhouk-baby`, `world-game`, and `war-is-dumb`.

For explicit placement, omit `data-auto-inject` and add `<khmerone-bar data-current-app="anatomykh"></khmerone-bar>` where the bar should appear.

## React / Next.js

```tsx
import Script from "next/script";
import { createElement } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <Script src="https://khmerone.jrmyster7.chatgpt.site/khmerone-bar.js" strategy="afterInteractive" />
    {createElement("khmerone-bar", { "data-current-app": "finlitkh" })}
    <main>{children}</main>
  </>;
}
```

The optional `lang="en"` or `lang="km"` attribute sets the initial widget language. A host app can listen for the composed `khmerone-lang-change` event; its `detail.lang` is `en` or `km`.

```js
document.querySelector("khmerone-bar")?.addEventListener("khmerone-lang-change", (event) => {
  console.log(event.detail.lang);
});
```

The widget stores `khmerone-locale` in storage for the **current site origin**. Network links also carry a `khmerone_lang` query parameter, allowing another site using this widget to adopt the selection. Browser local storage alone cannot share a preference between `anatomykh.com`, `finlitkh.com`, and other distinct domains.

By default, the brand link points to the currently deployed portal. Once `khmerone.com` is connected, set `data-home-url="https://khmerone.com/"` on the script tag for auto injection or on `<khmerone-bar>` for explicit placement.

The current portal deployment is owner-only. A public child site cannot load the script from that URL until the portal is made public or the script is placed on a public host. The script itself has no authenticated API dependency. If a child site has a restrictive Content Security Policy, allow the script origin; Google Fonts are optional, with system-font fallback.
