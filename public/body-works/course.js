import { lessons } from './lessons.js';
import { storageKey, selectLesson, parseProgress, emptyProgress, recordAnswer, grade, completedLessons } from './state.js';

const $ = id => document.getElementById(id);
const copy = {
  tools:['Educational Tools','ឧបករណ៍អប់រំ'],search:['Search','ស្វែងរក'],
  eyebrow:['MEDICAL & LIFE SCIENCES · SHORT COURSE','វិទ្យាសាស្ត្រវេជ្ជសាស្ត្រ និងជីវិត · វគ្គខ្លី'],
  title:['How Your Body Works','របៀបដែលរាងកាយរបស់អ្នកដំណើរការ'],
  intro:['One body. Many teams. Discover how they work together.','រាងកាយមួយ មានប្រព័ន្ធជាច្រើន។ ស្វែងយល់ពីរបៀបដែលវាធ្វើការរួមគ្នា។'],
  duration:['6 short lessons · About 20–25 minutes with questions · No account','មេរៀនខ្លី៦ · ប្រហែល២០–២៥នាទី រួមទាំងសំណួរ · មិនត្រូវការគណនី'],
  review:['Introductory education, not personal medical advice. Khmer translations are drafts for teacher review.','ការអប់រំមូលដ្ឋាន មិនមែនដំបូន្មានវេជ្ជសាស្ត្រផ្ទាល់ខ្លួនទេ។ ការបកប្រែខ្មែរជាសេចក្ដីព្រាងសម្រាប់គ្រូពិនិត្យ។'],
  resume:['Continue learning','បន្តការសិក្សា'],contents:['Your six lessons','មេរៀនទាំងប្រាំមួយ'],
  freeOrder:['Read in order or choose any lesson. Answer both questions correctly to complete a lesson.','អានតាមលំដាប់ ឬជ្រើសមេរៀនណាមួយ។ ឆ្លើយសំណួរទាំងពីរត្រឹមត្រូវដើម្បីបញ្ចប់មេរៀន។'],
  connection:['Connect the ideas','ភ្ជាប់គំនិត'],vocab:['Two useful words','ពាក្យមានប្រយោជន៍ពីរ'],think:['Pause and explain','ឈប់គិត ហើយពន្យល់'],
  linkedPack:['The linked explorer is optional and has its own offline pack. You can finish this course without opening it.','កម្មវិធីដែលបានភ្ជាប់ជាជម្រើសបន្ថែម និងមានកញ្ចប់ក្រៅបណ្ដាញផ្ទាល់ខ្លួន។ អ្នកអាចបញ្ចប់វគ្គនេះដោយមិនបើកវា។'],
  quiz:['Check your understanding','ពិនិត្យការយល់របស់អ្នក'],retry:['No timer. Try again as often as you need; the explanation is part of the lesson.','គ្មានការកំណត់ពេល។ សាកល្បងម្ដងទៀតតាមតម្រូវការ។ ការពន្យល់ជាផ្នែកមួយនៃមេរៀន។'],
  previous:['← Previous lesson','← មេរៀនមុន'],next:['Next lesson →','មេរៀនបន្ទាប់ →'],print:['Print this lesson','បោះពុម្ពមេរៀននេះ'],
  sources:['Sources and reading','ប្រភព និងការអាន'],sourceNote:['Sources checked November 3, 2026. These are simplified learning summaries, not a complete anatomy course.','ប្រភពបានពិនិត្យថ្ងៃទី៣ ខែវិច្ឆិកា ឆ្នាំ២០២៦។ នេះជាសេចក្ដីសង្ខេបសាមញ្ញសម្រាប់សិក្សា មិនមែនវគ្គកាយវិភាគពេញលេញទេ។'],
  attribution:['Adapted and simplified for Khmer One from OpenStax Anatomy and Physiology 2e. Added Khmer translations, examples and quizzes. OpenStax has not reviewed or endorsed this course.','សម្រួលសម្រាប់ Khmer One ពី OpenStax Anatomy and Physiology 2e។ បានបន្ថែមការបកប្រែខ្មែរ ឧទាហរណ៍ និងសំណួរ។ OpenStax មិនបានពិនិត្យ ឬគាំទ្រវគ្គនេះទេ។'],
  credits:['Credits and adaptation terms','ប្រភព និងលក្ខខណ្ឌកែសម្រួល'],offlineTitle:['Keep the whole course offline','រក្សាវគ្គទាំងមូលសម្រាប់ប្រើក្រៅបណ្ដាញ'],
  offlineInfo:['Save all six lessons, quizzes and Khmer fonts. External sources and linked explorers are not included. Browser storage can be cleared or evicted.','រក្សាទុកមេរៀនទាំង៦ សំណួរ និងពុម្ពអក្សរខ្មែរ។ ប្រភពខាងក្រៅ និងកម្មវិធីដែលបានភ្ជាប់មិនរួមបញ្ចូលទេ។ ឃ្លាំងកម្មវិធីរុករកអាចត្រូវសម្អាត ឬលុបបាន។'],
  savePack:['Save course pack','រក្សាទុកកញ្ចប់វគ្គ'],reset:['Reset my course progress','កំណត់វឌ្ឍនភាពវគ្គឡើងវិញ'],
  privacy:['Progress stays in this browser. No names, health information or student accounts are collected.','វឌ្ឍនភាពរក្សាទុកលើកម្មវិធីរុករកនេះ។ មិនប្រមូលឈ្មោះ ព័ត៌មានសុខភាព ឬគណនីសិស្សទេ។'],
  resetTitle:['Reset this course?','កំណត់វគ្គនេះឡើងវិញ?'],resetWarning:['This clears the completed questions in this browser only. Other Khmer One activities are not affected.','វាលុបវឌ្ឍនភាពសំណួរក្នុងកម្មវិធីរុករកនេះតែប៉ុណ្ណោះ។ សកម្មភាពផ្សេងរបស់ Khmer One មិនប៉ះពាល់ទេ។'],
  cancel:['Cancel','បោះបង់'],confirm:['Reset progress','កំណត់វឌ្ឍនភាពឡើងវិញ']
};
const params = new URLSearchParams(location.search);
let language = params.get('lang');
let progress = emptyProgress(), storageAvailable = true;
try { language ||= localStorage.getItem('khmerone-locale'); progress = parseProgress(localStorage.getItem(storageKey)); }
catch { storageAvailable = false; }
language = language === 'km' ? 'km' : 'en';
let current = selectLesson(params.get('lesson') || progress.last);
const selections = new Map(), feedback = new Map();
let packBusy = false, packState = 'idle', packBytes = 0, packDownloaded = 0, packTotal = 0;
const t = (en,km) => language === 'km' ? km : en;
const text = value => value[language];
const element = (tag,content,className) => { const node = document.createElement(tag); if (content !== undefined) node.textContent = content; if (className) node.className = className; return node; };
function lessonURL(lesson) { const url = new URL('index.html',import.meta.url); url.search = new URLSearchParams({lang:language,lesson:lesson.id}).toString(); return url; }
function persist() { try { localStorage.setItem(storageKey,JSON.stringify(progress)); storageAvailable = true; } catch { storageAvailable = false; } }
function showProgress() {
  const complete = completedLessons(progress);
  $('progress').value = complete.length;
  $('progress-label').textContent = t(`${complete.length} of ${lessons.length} lessons complete`,`${complete.length} / ${lessons.length} មេរៀនបានបញ្ចប់`);
  $('storage-status').textContent = storageAvailable ? t('Progress is saved only in this browser.','វឌ្ឍនភាពរក្សាទុកតែលើកម្មវិធីរុករកនេះ។') : t('Progress is not saved: browser storage is unavailable. You can still learn in this tab.','មិនបានរក្សាទុកវឌ្ឍនភាព៖ ឃ្លាំងកម្មវិធីរុករកមិនអាចប្រើបាន។ អ្នកនៅតែអាចរៀនក្នុងផ្ទាំងនេះ។');
  $('completion').hidden = complete.length !== lessons.length;
  $('completion').textContent = t('Course complete! You answered all 12 questions correctly. Explain how three body systems work together, then revisit any lesson. This is a learning milestone, not a medical qualification.','បានបញ្ចប់វគ្គ! អ្នកបានឆ្លើយសំណួរទាំង១២ត្រឹមត្រូវ។ ពន្យល់ពីរបៀបដែលប្រព័ន្ធរាងកាយបីធ្វើការរួមគ្នា ហើយរំឭកមេរៀនណាមួយ។ នេះជាជំហានសិក្សា មិនមែនជាគុណវុឌ្ឍិវេជ្ជសាស្ត្រទេ។');
  $('lesson-status').textContent = complete.includes(current.id) ? t('Lesson complete. Both questions answered correctly.','បានបញ្ចប់មេរៀន។ សំណួរទាំងពីរបានឆ្លើយត្រឹមត្រូវ។') : t('Complete both questions to finish this lesson.','ឆ្លើយសំណួរទាំងពីរឱ្យត្រឹមត្រូវដើម្បីបញ្ចប់មេរៀន។');
  for (const link of $('lesson-list').children) link.querySelector('small').textContent = complete.includes(link.dataset.lesson) ? t('✓ Complete','✓ បានបញ្ចប់') : t('3 minute lesson','មេរៀន៣នាទី');
}
function showFeedback(question) {
  const target = $(`feedback-${question.id}`), result = feedback.get(question.id);
  delete target.dataset.correct;
  if (result === 'missing') { target.textContent = t('Choose an answer first.','សូមជ្រើសចម្លើយជាមុន។'); return; }
  if (typeof result === 'boolean') {
    target.dataset.correct = String(result);
    target.textContent = (result ? t('Correct. ','ត្រឹមត្រូវ។ ') : t('Try again. ','សាកល្បងម្ដងទៀត។ ')) + text(question.explanation);
  } else target.textContent = progress.passed.includes(question.id) ? t('Previously completed. Try it again to review.','បានបញ្ចប់ពីមុន។ សាកល្បងម្ដងទៀតដើម្បីរំឭក។') : '';
}
function renderQuestions() {
  $('questions').replaceChildren(...current.questions.map((question,index) => {
    const section = element('section',undefined,'question'); section.dataset.question = question.id;
    const group = element('fieldset'); group.append(element('legend',`${index + 1}. ${text(question.prompt)}`));
    question.choices.forEach((choice,choiceIndex) => {
      const label = element('label',undefined,'answer'), input = document.createElement('input');
      input.type = 'radio'; input.name = question.id; input.value = String(choiceIndex); input.checked = selections.get(question.id) === choiceIndex;
      input.addEventListener('change',() => { selections.set(question.id,choiceIndex); feedback.delete(question.id); showFeedback(question); });
      label.append(input,element('span',text(choice))); group.append(label);
    });
    const button = element('button',t('Check answer','ពិនិត្យចម្លើយ')); button.type = 'button'; button.dataset.check = question.id;
    const message = element('p',undefined,'feedback'); message.id = `feedback-${question.id}`; message.setAttribute('role','status');
    button.addEventListener('click',() => {
      if (!selections.has(question.id)) feedback.set(question.id,'missing');
      else { const choice = selections.get(question.id); feedback.set(question.id,grade(question,choice)); progress = recordAnswer(progress,question,choice); persist(); }
      showFeedback(question); showProgress();
    });
    section.append(group,button,message); return section;
  }));
  current.questions.forEach(showFeedback);
}
function renderLesson() {
  document.documentElement.lang = language;
  document.title = text(current.title) + ' · ' + copy.title[language === 'km' ? 1 : 0] + ' · Khmer One';
  for (const node of document.querySelectorAll('[data-copy]')) node.textContent = copy[node.dataset.copy][language === 'km' ? 1 : 0];
  $('language').textContent = language === 'km' ? 'English' : 'ភាសាខ្មែរ';
  $('language').setAttribute('aria-label',t('Switch to Khmer','ប្ដូរទៅភាសាអង់គ្លេស'));
  $('lesson-list').setAttribute('aria-label',t('Lessons','មេរៀន'));
  $('lesson-list').replaceChildren(...lessons.map(lesson => {
    const link = element('a',undefined,'lesson-link'); link.href = lessonURL(lesson).href; link.dataset.lesson = lesson.id;
    if (lesson.id === current.id) link.setAttribute('aria-current','step');
    const label = element('div'); label.append(element('strong',text(lesson.title)),element('small',''));
    link.append(element('span',String(lesson.number).padStart(2,'0')),label);
    link.addEventListener('click',event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return; event.preventDefault(); navigate(lesson.id,true,true); });
    return link;
  }));
  $('lesson-number').textContent = String(current.number).padStart(2,'0');
  $('lesson-meta').textContent = t(`LESSON ${current.number} OF 6 · ABOUT 3 MINUTES`,`មេរៀន ${current.number} / ៦ · ប្រហែល៣នាទី`);
  $('lesson-title').textContent = text(current.title); $('goal').textContent = text(current.goal); $('hook').textContent = text(current.hook);
  $('sections').replaceChildren(...current.sections.map(section => { const node = element('section'); node.append(element('h3',text(section.title)),element('p',text(section.text))); return node; }));
  $('sequence').replaceChildren(...current.sequence.map(item => element('li',text(item))));
  $('sequence-note').textContent = text(current.sequenceNote);
  $('words').replaceChildren(...current.vocabulary.map(item => { const node = element('div'); node.append(element('dt',text(item.term)),element('dd',text(item.definition))); return node; }));
  $('think').textContent = text(current.think);
  const destination = new URL(current.explore.url,location.origin); destination.searchParams.set('lang',language);
  $('explore').href = destination.href; $('explore').textContent = text(current.explore.label) + ' →';
  $('sources').replaceChildren(...current.sources.map(source => { const li = element('li'), a = element('a',source.title); a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; li.append(a); return li; }));
  $('previous').disabled = current.number === 1; $('next').disabled = current.number === lessons.length;
  renderQuestions(); showProgress(); showPackStatus();
}
function navigate(id,push = false,focus = false) {
  current = selectLesson(id); progress.last = current.id; persist();
  history[push ? 'pushState' : 'replaceState'](null,'',lessonURL(current)); renderLesson();
  if (focus) $('lesson-title').focus();
}
$('previous').addEventListener('click',() => navigate(lessons[Math.max(0,current.number - 2)].id,true,true));
$('next').addEventListener('click',() => navigate(lessons[Math.min(lessons.length - 1,current.number)].id,true,true));
$('resume').addEventListener('click',() => { const complete = completedLessons(progress); const next = !complete.includes(progress.last) ? selectLesson(progress.last) : lessons.find(lesson => !complete.includes(lesson.id)) || current; navigate(next.id,true,true); });
$('language').addEventListener('click',() => { language = language === 'en' ? 'km' : 'en'; try { localStorage.setItem('khmerone-locale',language); } catch { /* Language remains usable in this tab. */ } history.replaceState(null,'',lessonURL(current)); renderLesson(); });
window.addEventListener('popstate',() => { const query = new URLSearchParams(location.search); language = query.get('lang') === 'km' ? 'km' : 'en'; navigate(query.get('lesson'),false,true); });
$('reset-progress').addEventListener('click',() => $('reset-dialog').showModal());
$('cancel-reset').addEventListener('click',() => $('reset-dialog').close());
$('confirm-reset').addEventListener('click',() => { progress = emptyProgress(); selections.clear(); feedback.clear(); $('reset-dialog').close(); navigate(lessons[0].id,false,true); });
let sourcesWereOpen = false;
$('print').addEventListener('click',() => { const sources = document.querySelector('details.sources'); sourcesWereOpen = sources.open; sources.open = true; window.print(); });
window.addEventListener('afterprint',() => { document.querySelector('details.sources').open = sourcesWereOpen; });
function showPackStatus() {
  $('save-pack').disabled = packBusy;
  if (packBytes) $('pack-size').textContent = `${(packBytes / 1000000).toFixed(2)} MB · ${t('6 lessons and 12 questions','៦មេរៀន និង១២សំណួរ')}`;
  const messages = {
    idle:'',
    saving:t(`Saving course: ${packDownloaded} / ${packTotal || '…'} files…`,`កំពុងរក្សាទុក៖ ${packDownloaded} / ${packTotal || '…'} ឯកសារ…`),
    saved:t('Saved. Reopen this course offline on this browser. External explorers and sources need their own connection or download.','បានរក្សាទុក។ បើកវគ្គនេះក្រៅបណ្ដាញលើកម្មវិធីរុករកនេះ។ កម្មវិធី និងប្រភពផ្សេងត្រូវការអ៊ីនធឺណិត ឬកញ្ចប់ផ្ទាល់ខ្លួន។'),
    error:t('The new pack was not saved completely. Check HTTPS, your connection and available browser storage, then retry. Any older complete pack is kept.','កញ្ចប់ថ្មីមិនបានរក្សាទុកពេញលេញ។ ពិនិត្យ HTTPS អ៊ីនធឺណិត និងឃ្លាំងផ្ទុក រួចព្យាយាមម្ដងទៀត។ កញ្ចប់ចាស់ពេញលេញនៅតែរក្សាទុក។')
  };
  $('pack-status').textContent = messages[packState]; $('pack-status').dataset.state = packState;
}
async function worker() {
  if (!isSecureContext || !('serviceWorker' in navigator)) throw new Error('Offline saving unavailable');
  const registration = await navigator.serviceWorker.register(new URL('sw.js',import.meta.url),{scope:'./'});
  if (registration.active) return registration.active;
  const candidate = registration.installing || registration.waiting;
  if (!candidate) throw new Error('Worker unavailable');
  await new Promise((resolve,reject) => {
    const timeout = setTimeout(() => { candidate.removeEventListener('statechange',changed); reject(new Error('Activation timeout')); },20000);
    function changed() { if (candidate.state === 'activated' || candidate.state === 'redundant') { clearTimeout(timeout); candidate.removeEventListener('statechange',changed); if (candidate.state === 'activated') resolve(); else reject(new Error('Installation failed')); } }
    candidate.addEventListener('statechange',changed); changed();
  });
  return candidate;
}
$('save-pack').addEventListener('click',async () => {
  if (packBusy) return;
  packBusy = true; packState = 'saving'; packDownloaded = 0; packTotal = 0; showPackStatus();
  try {
    const target = await worker();
    await new Promise((resolve,reject) => {
      const channel = new MessageChannel(); let timeout;
      const tick = () => { clearTimeout(timeout); timeout = setTimeout(() => { channel.port1.close(); reject(new Error('Download timeout')); },90000); };
      tick(); channel.port1.onmessage = ({data}) => {
        if (data.progress) { tick(); packDownloaded = data.progress; packTotal = data.total; showPackStatus(); }
        if (typeof data.ok === 'boolean') { clearTimeout(timeout); channel.port1.close(); if (data.ok) resolve(); else reject(new Error('Pack incomplete')); }
      };
      target.postMessage({type:'DOWNLOAD_BODY_COURSE'},[channel.port2]);
    });
    packState = 'saved';
  } catch { packState = 'error'; }
  finally { packBusy = false; showPackStatus(); }
});
navigate(current.id);
worker().catch(() => {});
(async () => { try { const response = await fetch(new URL('offline-assets.json',import.meta.url)); if (!response.ok) return; const manifest = await response.json(); if (Number.isFinite(manifest.totalBytes)) packBytes = manifest.totalBytes; showPackStatus(); } catch { /* Pack size is advisory. */ } })();
