import { resources } from './catalog.js';
import { mountLab } from './labs.js';
import { mountEye } from './eye.js';

const root = document.getElementById('main');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let language = new URLSearchParams(location.search).get('lang');
try { language ||= localStorage.getItem('khmerone-labs-language'); } catch { /* Private browsing may block storage. */ }
language = language === 'km' ? 'km' : 'en';
let dispose;
let revision = 0;
let packBusy = false;
let packReady = false;
let packSize = '';
const t = (en, km) => language === 'km' ? km : en;
const text = value => value[language];
const eye = {id:'eye',symbol:'◉',title:{en:'Eye Optics · Optometry',km:'អុបទិកភ្នែក'},desc:{en:'Explore a simplified focusing model, then access the gkaModelEye MATLAB research project.',km:'ស្វែងយល់ការផ្ដោតពន្លឺ និងចូលទៅកាន់គម្រោងស្រាវជ្រាវ gkaModelEye ក្នុង MATLAB។'},topic:'science',local:true,engine:'Original teaching model + gkaModelEye resource',repo:'gkaguirrelab/gkaModelEye',license:'Separate models; see lesson'};
const catalog = [...resources, eye];

function packStatus(message) {
  const status = document.getElementById('pack-status');
  if (status) status.textContent = message;
  const button = document.getElementById('download-pack');
  if (button) button.disabled = packBusy;
}
async function worker() {
  if (!('serviceWorker' in navigator) || !isSecureContext) throw new Error('Service workers unavailable');
  const registration = await navigator.serviceWorker.register(new URL('sw.js', import.meta.url), {scope:'./'});
  if (registration.active) return registration.active;
  const candidate = registration.installing || registration.waiting;
  if (!candidate) throw new Error('Worker unavailable');
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Worker activation timed out')), 20000);
    function changed() {
      if (candidate.state === 'activated') { clearTimeout(timer); candidate.removeEventListener('statechange', changed); resolve(); }
      if (candidate.state === 'redundant') { clearTimeout(timer); candidate.removeEventListener('statechange', changed); reject(new Error('Worker installation failed')); }
    }
    candidate.addEventListener('statechange', changed); changed();
  });
  return candidate;
}
async function downloadPack() {
  if (packBusy) return;
  packBusy = true;
  packStatus(t('Saving activities on this device…','កំពុងរក្សាទុកសកម្មភាពលើឧបករណ៍នេះ…'));
  try {
    const target = await worker();
    await new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      let timer;
      const resetTimeout = () => {clearTimeout(timer); timer = setTimeout(() => {channel.port1.close(); reject(new Error('Download stalled'));}, 90000);};
      resetTimeout();
      channel.port1.onmessage = ({data}) => {
        if (data.progress) {resetTimeout(); packStatus(t(`Saving ${data.progress} / ${data.total} files…`,`កំពុងរក្សាទុក ${data.progress} / ${data.total}…`));}
        if (typeof data.ok === 'boolean') {clearTimeout(timer); channel.port1.close(); if (data.ok) resolve(); else reject(new Error('Download failed'));}
      };
      target.postMessage({type:'DOWNLOAD_LEARNING_PACK'}, [channel.port2]);
    });
    packReady = true;
    packStatus(t('Saved. Reopen this page offline to use the seven local activities.','បានរក្សាទុក។ បើកទំព័រនេះក្រៅបណ្ដាញ ដើម្បីប្រើសកម្មភាពក្នុងគេហទំព័រ។'));
  } catch {
    packStatus(t('Not saved completely. Check your connection and storage, then retry. External resources are not included.','រក្សាទុកមិនទាន់ពេញលេញ។ សូមពិនិត្យអ៊ីនធឺណិត និងទំហំផ្ទុក រួចព្យាយាមម្តងទៀត។'));
  } finally { packBusy = false; const button = document.getElementById('download-pack'); if (button) button.disabled = false; }
}
function card(item) {
  return `<article class="card"><div class="card-top"><span class="card-symbol" aria-hidden="true">${escape(item.symbol)}</span><span class="badge ${item.local?'':'external'}">${item.local?t('On Khmer One','ក្នុងខ្មែរវ័ន'):t('External resource','ធនធានខាងក្រៅ')}</span></div><h2>${escape(text(item.title))}</h2><p>${escape(text(item.desc))}</p><a class="button" href="#${item.id}">${t('Explore','ស្វែងយល់')} →</a><a class="source-link" href="https://github.com/${item.repo}" target="_blank" rel="noopener noreferrer">${escape(item.engine)} · ${t('Source','ប្រភព')} ↗</a></article>`;
}
function home() {
  root.innerHTML = `<section class="hero"><div><p class="eyebrow">KHMER ONE · ${t('LEARNING LABS','សកម្មភាពសិក្សា')}</p><h1>${t('Learn by exploring.','រៀនតាមការស្វែងយល់។')}</h1><p>${t('Math, molecules, coding, reading and scientific thinking—in Khmer and English.','គណិតវិទ្យា ម៉ូលេគុល កូដ ការអាន និងការគិតបែបវិទ្យាសាស្ត្រ ជាខ្មែរ និងអង់គ្លេស។')}</p></div><div class="hero-visual" aria-hidden="true">${['ƒ(x)','H₂O','{ }','?','Aa','◉'].map(s=>`<span class="symbol">${s}</span>`).join('')}</div></section><section class="pack"><div><strong>${t('Take the local activities offline','រក្សាសកម្មភាពសម្រាប់ប្រើក្រៅបណ្ដាញ')}</strong><p>${t('Seven local activities. Save on Wi-Fi first; the five external resources require their own connection or setup.','សកម្មភាពក្នុងគេហទំព័រចំនួន៧។ រក្សាទុកតាម Wi-Fi ជាមុន។ ធនធានខាងក្រៅត្រូវការអ៊ីនធឺណិត ឬការដំឡើងផ្សេង។')}</p><p id="pack-status" role="status" class="pack-status">${packReady?t('A pack is saved on this device. Download again to update.','មានកញ្ចប់រក្សាទុកលើឧបករណ៍នេះ។ ទាញយកម្ដងទៀតដើម្បីធ្វើបច្ចុប្បន្នភាព។'):escape(packSize)}</p></div><button id="download-pack" class="primary" ${packBusy?'disabled':''}>${t('Save activity pack','រក្សាទុកកញ្ចប់សកម្មភាព')}</button></section><div class="toolbar"><label class="sr-only" for="search">${t('Search activities','ស្វែងរកសកម្មភាព')}</label><input id="search" type="search" placeholder="${t('Search activities…','ស្វែងរកសកម្មភាព…')}"><label class="sr-only" for="topic">${t('Topic','ប្រធានបទ')}</label><select id="topic"><option value="">${t('All topics','គ្រប់ប្រធានបទ')}</option>${[['science','Science','វិទ្យាសាស្ត្រ'],['math','Math','គណិតវិទ្យា'],['coding','Coding','កូដ'],['language','Language','ភាសា'],['school','School resources','ធនធានសាលា']].map(([v,en,km])=>`<option value="${v}">${t(en,km)}</option>`).join('')}</select></div><div id="cards" class="cards"></div><p class="intro-note">${t('Khmer translations are drafts for teacher review. No student account is required.','ការបកប្រែខ្មែរជាសេចក្ដីព្រាងសម្រាប់គ្រូពិនិត្យ។ មិនត្រូវការគណនីសិស្សទេ។')}</p>`;
  const refresh = () => {
    const query = document.getElementById('search').value.toLowerCase().trim();
    const topic = document.getElementById('topic').value;
    const matches = catalog.filter(item => (!topic || item.topic === topic) && (!query || JSON.stringify([item.title,item.desc,item.engine,item.repo]).toLowerCase().includes(query)));
    document.getElementById('cards').innerHTML = matches.length ? matches.map(card).join('') : `<p role="status">${t('No matching activities.','មិនមានសកម្មភាពត្រូវនឹងការស្វែងរក។')}</p>`;
  };
  document.getElementById('search').addEventListener('input', refresh);
  document.getElementById('topic').addEventListener('change', refresh);
  document.getElementById('download-pack').addEventListener('click', downloadPack);
  refresh();
}
async function render() {
  const token = ++revision;
  dispose?.(); dispose = undefined;
  document.documentElement.lang = language;
  document.getElementById('language').textContent = language === 'km' ? 'English' : 'ភាសាខ្មែរ';
  document.getElementById('teacher-link').textContent = t('For teachers','សម្រាប់គ្រូ');
  document.getElementById('credits-link').textContent = t('Open-source credits','ប្រភព និងអាជ្ញាបណ្ណ');
  const item = catalog.find(item => item.id === location.hash.slice(1));
  if (!item) {home(); return;}
  root.innerHTML = `<a class="button quiet" href="#">← ${t('All activities','គ្រប់សកម្មភាព')}</a><header class="lab-heading"><h1>${escape(text(item.title))}</h1><p>${escape(text(item.desc))}</p></header><section id="activity"></section>`;
  const activity = document.getElementById('activity');
  if (!item.local) {
    activity.innerHTML = `<div class="panel"><h2>${t('Opens another website','បើកគេហទំព័រផ្សេង')}</h2><p>${t('This resource is not included in the Khmer One offline pack. Its interface may be in English.','ធនធាននេះមិនរួមបញ្ចូលក្នុងកញ្ចប់ក្រៅបណ្ដាញរបស់ខ្មែរវ័នទេ។ ផ្ទាំងកម្មវិធីអាចជាភាសាអង់គ្លេស។')}</p>${item.setup?`<p>${t('Offline use needs a separate installation and downloaded content.','ការប្រើក្រៅបណ្ដាញត្រូវការការដំឡើង និងទាញយកមាតិកាដោយឡែក។')}</p>`:''}<div class="controls"><a class="button primary" target="_blank" rel="noopener noreferrer" href="${item.url}">${t('Open resource','បើកធនធាន')} ↗</a>${item.secondary?`<a class="button" target="_blank" rel="noopener noreferrer" href="${item.secondary}">${t('Additional resources','ធនធានបន្ថែម')} ↗</a>`:''}</div></div>`;
    return;
  }
  try {
    const cleanup = await (item.id === 'eye' ? mountEye(activity, language) : mountLab(item.id, activity, language));
    if (token === revision) dispose = cleanup; else cleanup?.();
  } catch (error) {
    console.error('Learning activity could not load', error);
    if (token === revision) activity.innerHTML = `<div class="panel" role="alert">${t('This activity could not load. Connect to the internet and retry, or save the activity pack first.','មិនអាចបើកសកម្មភាពបាន។ សូមភ្ជាប់អ៊ីនធឺណិត រួចព្យាយាមម្ដងទៀត ឬរក្សាទុកកញ្ចប់ជាមុន។')} <button id="retry">${t('Retry','ព្យាយាមម្ដងទៀត')}</button></div>`;
    document.getElementById('retry')?.addEventListener('click', render);
  }
}
document.getElementById('language').addEventListener('click', () => {language = language === 'en' ? 'km' : 'en'; try {localStorage.setItem('khmerone-labs-language',language);} catch { /* Optional browser storage. */ } const url = new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);render();});
window.addEventListener('hashchange', () => {render(); root.focus();});
render();
worker().catch(() => {});
(async () => {try {const cache = await caches.open('ko-learning-labs-v1');packReady = Boolean(await cache.match(new URL('offline-ready',import.meta.url)));const response = await fetch(new URL('offline-assets.json',import.meta.url));if (response.ok) packSize = `${((await response.json()).totalBytes/1000000).toFixed(1)} MB`;if (!location.hash && !packBusy) packStatus(packReady?t('A pack is saved on this device. Download again to update.','មានកញ្ចប់រក្សាទុកលើឧបករណ៍នេះ។'):packSize);} catch { /* Pack status is best effort. */ }})();
