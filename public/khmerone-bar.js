/* Optional zero-dependency widget for non-React child apps:
   <script defer src="https://khmerone.com/khmerone-bar.js"></script>
   <khmerone-bar lang="km"></khmerone-bar> */
class KhmerOneBar extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    const km = this.getAttribute("lang") === "km";
    const home = this.getAttribute("home") || "https://khmerone.com/";
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "KhmerOne Network");
    const brand = document.createElement("strong");
    brand.textContent = "KHMERONE  NETWORK";
    const link = document.createElement("a");
    link.href = home;
    link.textContent = km ? "កម្មវិធីទាំងអស់ ↗" : "All apps ↗";
    nav.append(brand, link);
    const style = document.createElement("style");
    style.textContent = ":host{display:block}nav{box-sizing:border-box;background:#080e18;color:#c7e9f2;border-bottom:1px solid rgba(0,240,255,.22);min-height:32px;padding:5px max(16px,calc((100vw - 1184px)/2));display:flex;justify-content:space-between;align-items:center;gap:12px;font:600 13px system-ui,sans-serif}a{color:#c7e9f2;text-decoration:none;white-space:nowrap;transition:color .2s}a:hover{color:#00f0ff}a:focus-visible{outline:2px solid #fbbf24;outline-offset:2px}";
    root.append(style, nav);
  }
}
customElements.define("khmerone-bar", KhmerOneBar);
