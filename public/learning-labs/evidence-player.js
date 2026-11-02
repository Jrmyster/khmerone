(async () => {
  const lang = new URLSearchParams(location.search).get('lang') === 'km' ? 'km' : 'en';
  document.documentElement.lang = lang;
  const base = new URL('./', location.href);
  try {
    await new H5PStandalone.H5P(document.getElementById('activity'), {
      id: 'khmerone-evidence',
      h5pJsonPath: new URL('h5p/evidence', base).href,
      contentJsonPath: new URL('h5p/evidence/content-' + lang, base).href,
      librariesPath: new URL('h5p/libraries', base).href,
      frameJs: new URL('vendor/h5p/frame.bundle.js', base).href,
      frameCss: new URL('vendor/h5p/styles/h5p.css', base).href,
      // This page is already isolated in an iframe. Rendering inside its real
      // same-origin document keeps all script requests under the offline worker.
      // A nested about:blank frame did not retain that control when offline.
      embedType: 'div',
      frame: false,
    });
  } catch (error) {
    document.getElementById('error').textContent = lang === 'km'
      ? 'មិនអាចបើកសកម្មភាពបាន។ សូមភ្ជាប់អ៊ីនធឺណិត ហើយសាកល្បងម្តងទៀត។'
      : 'The activity could not load. Connect and try again, or download the activity pack first.';
    console.error('H5P activity', error);
  }
})();
