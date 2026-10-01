# Teacher Toolkit Cambodia — implementation prompt

Build a working bilingual teacher workspace inside Khmer One at `/teacher-toolkit`.
Audience: Cambodian teachers and volunteers preparing low-resource classroom lessons.

Use the existing Next.js, React, TypeScript, Khmer font, and theme system. Provide
English and Khmer controls and teaching materials. Start with six reviewed lesson
starters: school vocabulary, present simple, fractions, percentages, electrical
circuits, and the water cycle. Identify these as adaptable starters, not official
curriculum coverage.

Let teachers choose the subject, starter, grade, duration, class size, and resource
type. Generate usable lesson plans with timings, worksheets, multiple-choice
quizzes, analytic rubrics, and classroom activity instructions. Include correct
answer keys for worksheets and quizzes. Allow teachers to edit the generated
text, change titles and objectives, and add classroom notes. Save drafts locally
with graceful handling when browser storage is unavailable.

Provide a clean paper preview, print/Save as PDF through the browser, and a UTF-8
text download. Student copies exclude teacher answers by default. Printed
materials must hide navigation, music, scenery, and unrelated page content.

Add an explicit offline preparation button that caches the toolkit page and its
build-generated JS/CSS/font asset manifest. Report success only when preparation
completes; explain that the first download requires internet. Keep the root audio
element persistent and give its toggle a header slot. Use touch targets of at
least 44 pixels, responsive layouts, readable Khmer text, and keyboard labels.

Add a searchable bilingual Teacher Toolkit app card to the main directory. Verify
timing totals, answer keys, local draft parsing, TypeScript, production compilation,
and the generated offline manifest. Publish the existing Site, push the commit to
GitHub main without rewriting history, and inspect the Cloudflare build status.

No accounts, student personal records, paid APIs, or server-generated materials
are needed. Templates and editing operate in the browser.
