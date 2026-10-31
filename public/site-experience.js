/* Shared progressive enhancement for React pages and the standalone Engine Lab. */
(() => {
  const root = document.documentElement;
  let low = false;
  try { const saved = localStorage.getItem('khmerone-low-data'); low = saved === null ? navigator.connection?.saveData === true : saved === 'true'; }
  catch { low = navigator.connection?.saveData === true; }
  root.dataset.lowData = String(low);
  function init() {
    const shell = document.getElementById('ko-site-shell');
    if (!shell || shell.dataset.ready) return;
    shell.dataset.ready = 'true';
    const toggle = shell.querySelector('[data-ko-low]');
    const note = shell.querySelector('[data-ko-data-note]');
    function sync(value) {
      low = value; root.dataset.lowData = String(low);
      toggle.setAttribute('aria-pressed', String(low));
      toggle.querySelector('span').firstChild.textContent = `Low data: ${low ? 'on' : 'off'}`;
      note.hidden = !low;
      if (low) document.querySelectorAll('audio,video').forEach(media => { media.preload = 'none'; });
      window.dispatchEvent(new Event('khmerone:data-change'));
    }
    sync(low);
    toggle.addEventListener('click', () => { sync(!low); try { localStorage.setItem('khmerone-low-data', String(low)); } catch { note.hidden = false; note.textContent = 'Preference applies to this page. Browser storage is unavailable.'; } });
    window.addEventListener('storage', e => { if (e.key === 'khmerone-low-data') sync(e.newValue === 'true'); });
    shell.querySelectorAll('a').forEach(a => { if (!a.hash && new URL(a.href).pathname === location.pathname) a.setAttribute('aria-current', 'page'); });
    const menus = shell.querySelectorAll('details.ko-tools');
    document.addEventListener('click', event => {
      for (const menu of menus) if (!menu.contains(event.target) || (event.target instanceof Element && event.target.closest('a'))) menu.open = false;
    });
    for (const menu of menus) {
      menu.addEventListener('keydown', event => {
        if (event.key === 'Escape') { menu.open = false; menu.querySelector('summary').focus(); }
      });
    }
    const dialog = shell.querySelector('dialog'), form = dialog.querySelector('form');
    const result = shell.querySelector('[data-ko-result]'), submit = shell.querySelector('[data-ko-submit]');
    let requestId = '', fingerprint = '';
    shell.querySelector('[data-ko-feedback]').addEventListener('click', () => {
      // Only include known public content selectors, never arbitrary query strings or fragments.
      const query = new URLSearchParams();
      for (const key of ['term','story','unit','gate','language','template','resource']) { const value = new URL(location.href).searchParams.get(key); if (value && /^[\w-]{1,80}$/.test(value)) query.set(key,value); }
      const context = document.querySelector('[data-feedback-context]')?.getAttribute('data-feedback-context');
      if (context && /^(term|story)=[\w-]{1,80}$/.test(context)) { const [key,value] = context.split('='); query.set(key,value); }
      form.elements.page.value = location.pathname + (query.size ? '?' + query : '');
      dialog.showModal();
    });
    shell.querySelector('[data-ko-close]').addEventListener('click', () => dialog.close());
    form.addEventListener('submit', async e => {
      e.preventDefault(); if (submit.disabled || !form.reportValidity()) return;
      const payload = {category:form.elements.category.value,message:form.elements.message.value.trim(),page:form.elements.page.value,website:form.elements.website.value};
      if (payload.message.length < 5) { result.textContent = 'Please add a little more detail (at least 5 characters).'; return; }
      const current = JSON.stringify(payload); if (current !== fingerprint) { requestId = crypto.randomUUID(); fingerprint = current; }
      submit.disabled = true; result.textContent = 'Sending…';
      try {
        const response = await fetch('/api/learning/feedback', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,id:requestId}),signal:AbortSignal.timeout(20000)});
        if (!response.ok) throw new Error(response.status === 429 ? 'Too many reports. Please wait a minute and try again.' : 'Your report was not confirmed. Please try again. Your text is still here.');
        result.textContent = 'Thank you. Your report was saved for the editor. អរគុណ! មតិរបស់អ្នកត្រូវបានរក្សាទុក។';
        form.elements.message.value = ''; fingerprint = ''; requestId = '';
      } catch (error) { result.textContent = error.name === 'TimeoutError' ? 'The connection timed out. Retry to confirm your report; it will not be duplicated.' : error.message || 'Could not send. Please try again.'; }
      finally { submit.disabled = false; }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
