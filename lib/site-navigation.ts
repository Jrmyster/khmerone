// Used by both the React layout and the standalone Engine Lab build.
export const builtInTools = [
  ['Inspection & accountability', 'អធិការកិច្ច និងគណនេយ្យភាព', '/inspection'],
  ['International services', 'សេវាអន្តរជាតិ', '/international-services'],
  ['Community safety', 'សុវត្ថិភាពសហគមន៍', '/community-safety'],
  ['Government services', 'សេវារដ្ឋាភិបាល', '/public-services'],
  ['Support services', 'សេវាជំនួយ', '/social-support'],
  ['Keyboard Garden', 'រៀនវាយអក្សរ', '/typing'],
  ['Learning studio', 'កន្លែងសិក្សា', '/learning'],
  ['STEM dictionary', 'វចនានុក្រម STEM', '/learning/dictionary'],
  ['Speaking practice', 'ហាត់និយាយ', '/learning/speaking'],
  ['Listening quizzes', 'សំណួរស្តាប់', '/learning/quiz-maker'],
  ['Story library', 'បណ្ណាល័យរឿង', '/learning/stories'],
  ['Announcements', 'សេចក្ដីជូនដំណឹង', '/learning/announcements'],
  ['Translation', 'ការបកប្រែ', '/learning/translation'],
  ['Live quiz', 'សំណួរផ្ទាល់', '/learning/live-quiz'],
  ['School exchange', 'ការចែករំលែកសាលា', '/learning/exchange'],
  ['Audio Maker', 'កម្មវិធីសំឡេង', '/teacher-audio'],
  ['Teacher Toolkit', 'ឧបករណ៍គ្រូ', '/teacher-toolkit'],
  ['Computer Engineering', 'វិស្វកម្មកុំព្យូទ័រ', '/computer-engineering'],
  ['Engine Lab', 'មន្ទីរពិសោធន៍ម៉ាស៊ីន', '/engine-lab.html'],
] as const;
const label = (en: string, km: string) => `<span>${en}<small lang="km">${km}</small></span>`;
export const siteNavigationHtml = `<nav class="ko-nav" aria-label="Khmer One navigation">
<a class="ko-brand" href="/">KHMER ONE<small lang="km">ខ្មែរ វ័ន</small></a>
<a href="/">${label('Home', 'ទំព័រដើម')}</a>
<details class="ko-tools"><summary>${label('Tools', 'ឧបករណ៍')}</summary><div class="ko-tool-list">${builtInTools.map(([en, km, url]) => `<a href="${url}">${label(en, km)}</a>`).join('')}</div></details>
<a href="/search">${label('Search', 'ស្វែងរក')}</a>
<button type="button" data-ko-low aria-pressed="false">${label('Low data: off', 'សន្សំទិន្នន័យ')}</button>
<button type="button" data-ko-feedback>${label('Feedback', 'មតិកែលម្អ')}</button>
</nav><p class="ko-data-note" data-ko-data-note hidden>Low-data mode is on. Decorative pictures are hidden. Audio loads only when you ask for it. <span lang="km">រូបតុបតែងត្រូវបានលាក់។ ចុចដើម្បីផ្ទុកសំឡេង។</span></p>
<dialog class="ko-feedback" aria-labelledby="ko-feedback-title"><form>
<div class="ko-dialog-heading"><h2 id="ko-feedback-title">Report a problem <small lang="km">រាយការណ៍បញ្ហា</small></h2><button type="button" data-ko-close aria-label="Close feedback">×</button></div>
<p>Your report goes privately to the Khmer One editor. Please leave out student names, passwords and personal information.</p>
<label>Problem type · ប្រភេទបញ្ហា<select name="category" required><option value="translation">Incorrect translation · ការបកប្រែមិនត្រឹមត្រូវ</option><option value="link">Broken link · តំណខូច</option><option value="instructions">Confusing instructions · ការណែនាំមិនច្បាស់</option><option value="other">Other · ផ្សេងទៀត</option></select></label>
<label>What should we fix? · តើគួរកែអ្វី?<textarea name="message" rows="5" minlength="5" maxlength="2000" required placeholder="Include the word, link or step that needs attention."></textarea></label>
<label>Page · ទំព័រ<input name="page" readonly /></label>
<label class="ko-honeypot" aria-hidden="true">Leave blank<input name="website" tabindex="-1" autocomplete="off" /></label>
<p role="status" data-ko-result></p><button type="submit" data-ko-submit>Send feedback · បញ្ជូនមតិកែលម្អ</button>
<p><a href="/feedback-inbox">Editor inbox · ប្រអប់មតិអ្នកកែសម្រួល</a></p>
</form></dialog>`;
