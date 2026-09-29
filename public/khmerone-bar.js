/* KhmerOne Network bar: standalone Web Component for child sites. */
(() => {
  if (customElements.get("khmerone-bar")) return;

  const SCRIPT = document.currentScript;
  const DEFAULT_HOME = "https://khmerone.jrmyster7.chatgpt.site/";
  const LANGUAGE_KEY = "khmerone-locale";
  const LANGUAGE_PARAM = "khmerone_lang";
  const APPS = [
    { id: "school-connect-cambodia", en: "School Connect Cambodia", km: "ជួយសាលា", url: "https://schoolconnectcambodia.com/", icon: "🏫" },
    { id: "anatomykh", en: "AnatomyKH", km: "កាយវិភាគវិទ្យាខ្មែរ", url: "https://anatomykh.com/", icon: "🫀" },
    { id: "finlitkh", en: "FinLitKH", km: "ចំណេះដឹងហិរញ្ញវត្ថុខ្មែរ", url: "https://finlitkh.com/", icon: "🪙" },
    { id: "khmer-vocation", en: "Khmer Vocation", km: "វិជ្ជាជីវៈខ្មែរ", url: "https://khmervoc.com/", icon: "🗣️" },
    { id: "khmer-english-exam", en: "Khmer English Exam", km: "ប្រឡងភាសាអង់គ្លេសខ្មែរ", url: "https://khmerenglishexam.com/", icon: "📝" },
    { id: "chhouk-baby", en: "Chhouk Baby", km: "ឈូក បេប៊ី", url: "https://chhoukbaby.netlify.app/", icon: "👶" },
    { id: "world-game", en: "World Game Simulation", km: "កម្មវិធីក្លែងធ្វើពិភពលោក", url: "https://world-game-atlas.jrmyster7.chatgpt.site/", icon: "🌍" },
    { id: "fast-and-faster", en: "Fast & Faster", km: "លឿន និងលឿនជាង", url: "https://fastandfaster.netlify.app/", icon: "⚡" },
    { id: "war-is-dumb", en: "War is Dumb", km: "សង្គ្រាមគឺមិនឆ្លាត", url: "https://warisobsolete.com/", icon: "🕊️" },
  ];

  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : DEFAULT_HOME;
    } catch {
      return DEFAULT_HOME;
    }
  };
  const escapeAttribute = (value) => value.replace(/[&"<>]/g, (c) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[c]);
  const withLanguage = (url, lang) => {
    const target = new URL(url);
    target.searchParams.set(LANGUAGE_PARAM, lang);
    return escapeAttribute(target.href);
  };
  const readLanguage = () => {
    const param = new URL(location.href).searchParams.get(LANGUAGE_PARAM);
    if (param === "km" || param === "en") {
      try { localStorage.setItem(LANGUAGE_KEY, param); } catch {}
      return param;
    }
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      if (saved === "km" || saved === "en") return saved;
    } catch {}
    return "km";
  };

  class KhmerOneBar extends HTMLElement {
    static get observedAttributes() { return ["lang", "data-current-app", "data-home-url"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.currentLang = this.getAttribute("lang") === "en" || this.getAttribute("lang") === "km"
        ? this.getAttribute("lang") : readLanguage();
      this.isOpen = false;
      this.onClick = this.onClick.bind(this);
      this.onOutside = this.onOutside.bind(this);
      this.onKeydown = this.onKeydown.bind(this);
    }

    connectedCallback() {
      this.shadowRoot.addEventListener("click", this.onClick);
      document.addEventListener("pointerdown", this.onOutside);
      document.addEventListener("keydown", this.onKeydown);
      this.render();
    }

    disconnectedCallback() {
      this.shadowRoot.removeEventListener("click", this.onClick);
      document.removeEventListener("pointerdown", this.onOutside);
      document.removeEventListener("keydown", this.onKeydown);
    }

    attributeChangedCallback(name, oldValue, value) {
      if (oldValue === value || !this.isConnected) return;
      if (name === "lang" && (value === "km" || value === "en")) this.currentLang = value;
      this.render();
    }

    get homeUrl() { return safeUrl(this.getAttribute("data-home-url") || DEFAULT_HOME); }

    get currentAppId() {
      const explicit = this.getAttribute("data-current-app");
      if (explicit) return explicit;
      if (location.origin === new URL(this.homeUrl).origin) return "portal";
      return APPS.find((app) => new URL(app.url).hostname === location.hostname)?.id || "";
    }

    onClick(event) {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.id === "menu-button") {
        this.setOpen(!this.isOpen);
      } else if (button.id === "lang-button") {
        this.currentLang = this.currentLang === "km" ? "en" : "km";
        try { localStorage.setItem(LANGUAGE_KEY, this.currentLang); } catch {}
        this.isOpen = false;
        this.render();
        this.dispatchEvent(new CustomEvent("khmerone-lang-change", {
          detail: { lang: this.currentLang }, bubbles: true, composed: true,
        }));
      }
    }

    onOutside(event) {
      if (this.isOpen && !event.composedPath().includes(this)) this.setOpen(false);
    }

    onKeydown(event) {
      if (this.isOpen && event.key === "Escape") {
        this.setOpen(false);
        this.shadowRoot.getElementById("menu-button")?.focus();
      }
    }

    setOpen(open) {
      this.isOpen = open;
      this.shadowRoot.getElementById("menu-button")?.setAttribute("aria-expanded", String(open));
      this.shadowRoot.getElementById("dropdown")?.classList.toggle("active", open);
    }

    render() {
      const km = this.currentLang === "km";
      const current = this.currentAppId;
      const apps = [
        { id: "portal", en: "KhmerOne Hub", km: "មជ្ឈមណ្ឌល KhmerOne", url: this.homeUrl, icon: "🌐" },
        ...APPS,
      ];
      this.shadowRoot.innerHTML = `
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&display=swap");
          :host { all: initial; display: block; width: 100%; position: relative; z-index: 999999; color: #f8fafc; font: 400 14px/1.5 "Kantumruy Pro", system-ui, sans-serif; }
          *, *::before, *::after { box-sizing: border-box; }
          button, a { font: inherit; }
          button:focus-visible, a:focus-visible { outline: 2px solid #fbbf24; outline-offset: 2px; }
          .bar { min-height: 44px; padding: 5px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border-bottom: 1px solid rgba(0,240,255,.24); background: #0b0f19; }
          .left, .right { min-width: 0; display: flex; align-items: center; gap: 9px; }
          .brand { color: #eefaff; text-decoration: none; font-weight: 700; white-space: nowrap; }
          .brand:hover { color: #9bf6ff; }
          .network { padding: 2px 6px; border: 1px solid rgba(0,240,255,.4); border-radius: 5px; background: rgba(0,240,255,.12); color: #9bf6ff; font-size: 11px; font-weight: 700; white-space: nowrap; }
          .trigger, .lang { min-height: 32px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 4px 10px; border: 1px solid #415268; border-radius: 7px; background: #1c2b40; color: #edf7fb; cursor: pointer; transition: background .2s, border-color .2s; }
          .trigger:hover, .lang:hover, .trigger[aria-expanded="true"] { border-color: #00f0ff; background: #173c4a; }
          .lang { white-space: nowrap; }
          .dropdown { position: absolute; top: calc(100% + 4px); left: 16px; width: min(340px, calc(100vw - 32px)); max-height: min(550px, calc(100dvh - 60px)); overflow-y: auto; display: none; padding: 6px; border: 1px solid rgba(0,240,255,.35); border-radius: 10px; background: #0f1929; box-shadow: 0 14px 34px rgba(0,0,0,.48); }
          .dropdown.active { display: block; }
          .dropdown-title { padding: 8px 10px; color: #fbbf24; font-size: 12px; font-weight: 700; }
          .app { min-height: 44px; display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 7px; color: #d9ecf2; text-decoration: none; }
          a.app:hover { background: #23374d; color: #fff; }
          .app.current { background: rgba(0,240,255,.13); color: #9bf6ff; font-weight: 700; }
          .icon { width: 23px; flex: none; font-size: 17px; text-align: center; }
          .names { min-width: 0; display: flex; flex-direction: column; }
          .sub { color: #a9c5d0; font-size: 12px; font-weight: 400; }
          .health-note { color: #fbbf24; font-size: 12px; font-weight: 400; line-height: 1.45; }
          @media (max-width: 440px) {
            .bar { padding: 5px 10px; }
            .left { gap: 6px; }
            .network { display: none; }
            .trigger, .lang { padding: 4px 7px; font-size: 12px; }
          }
          @media (prefers-reduced-motion: reduce) {
            .trigger, .lang { transition: none; }
          }
        </style>
        <nav class="bar" aria-label="KhmerOne Network">
          <div class="left">
            <a class="brand" href="${withLanguage(this.homeUrl, this.currentLang)}">🇰🇭 KhmerOne</a>
            <span class="network">${km ? "បណ្ដាញ" : "NETWORK"}</span>
            <button id="menu-button" class="trigger" type="button" aria-controls="dropdown" aria-expanded="${this.isOpen}" aria-label="${km ? "បើកបញ្ជីកម្មវិធី" : "Open app list"}">${km ? "កម្មវិធីទាំងអស់" : "All apps"} <span aria-hidden="true">▾</span></button>
          </div>
          <div class="right"><button id="lang-button" class="lang" type="button" aria-label="${km ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ"}">${km ? "EN" : "ខ្មែរ"}</button></div>
        </nav>
        <div id="dropdown" class="dropdown ${this.isOpen ? "active" : ""}">
          <div class="dropdown-title">${km ? "កម្មវិធីសិក្សា KhmerOne" : "KhmerOne educational apps"}</div>
          ${apps.map((app) => {
            const notice = app.id === "chhouk-baby"
              ? `<span class="health-note">${km ? "ព័ត៌មានវេជ្ជសាស្ត្រកំពុងរង់ចាំការពិនិត្យពីរដ្ឋាភិបាល។ សូមពិគ្រោះជាមួយវេជ្ជបណ្ឌិតមានអាជ្ញាបណ្ណអំពីសុខភាពទារករបស់អ្នក។" : "Medical information is pending government review. Consult a licensed doctor about your baby's health."}</span>`
              : "";
            const names = `<span class="icon" aria-hidden="true">${app.icon}</span><span class="names"><span>${km ? app.km : app.en}</span><span class="sub">${km ? app.en : app.km}</span>${notice}</span></span>`;
            return app.id === current
              ? `<span class="app current" aria-current="page">${names}</span>`
              : `<a class="app" href="${withLanguage(app.url, this.currentLang)}">${names}</a>`;
          }).join("")}
        </div>
      `;
    }
  }

  customElements.define("khmerone-bar", KhmerOneBar);

  if (SCRIPT?.hasAttribute("data-auto-inject")) {
    const inject = () => {
      if (document.querySelector("khmerone-bar")) return;
      const bar = document.createElement("khmerone-bar");
      for (const name of ["data-current-app", "data-home-url", "lang"]) {
        if (SCRIPT.hasAttribute(name)) bar.setAttribute(name, SCRIPT.getAttribute(name));
      }
      document.body.prepend(bar);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject, { once: true });
    else inject();
  }
})();
