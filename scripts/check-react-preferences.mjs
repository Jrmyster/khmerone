// Run against a local built app; never needs a live deployment.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || '/tmp/khmerone-browser-check/node_modules/playwright/index.mjs').href);
const base = process.env.REACT_CHECK_URL || 'http://127.0.0.1:5174';
const browser = await chromium.launch();
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydrat|did not match/i.test(message.text())) errors.push(message.text()); });
  await page.goto(base + '/teacher-toolkit');
  await page.getByLabel('Your lesson title', {exact:true}).fill('Persisted regression title');
  await page.getByText('Draft saved on this device', {exact:true}).waitFor();
  await page.evaluate(() => localStorage.setItem('khmerone-background-audio', 'unmuted'));
  await page.reload();
  await page.waitForFunction(() => document.querySelector('input[maxlength="120"]')?.value === 'Persisted regression title');
  await page.getByRole('button', {name:'Resume ambient music',exact:true}).waitFor();
  assert.equal(await page.locator('audio').evaluate(audio => audio.paused), true);
  assert.equal(await page.locator('audio').evaluate(audio => audio.muted), true);
  assert.deepEqual(errors, []);

  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
  });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(base + '/teacher-toolkit');
  await blockedPage.getByLabel('Your lesson title', {exact:true}).fill('Works without storage');
  await blockedPage.getByText('Browser storage is unavailable. You can still edit, print, and download.', {exact:true}).waitFor();
  assert.equal(await blockedPage.getByLabel('Your lesson title', {exact:true}).inputValue(), 'Works without storage');
  assert.equal(await blockedPage.locator('audio').evaluate(audio => audio.paused), true);
  await blocked.close();
  await page.getByLabel('Your lesson title', {exact:true}).fill('Second saved revision');
  await page.getByText('Draft saved on this device', {exact:true}).waitFor();
  await page.reload();
  await page.waitForFunction(() => document.querySelector('input[maxlength="120"]')?.value === 'Second saved revision');
  assert.deepEqual(errors, []);
  await context.close();
  console.log('PASS: persisted hydration, repeated debounced saves, paused remembered audio, blocked storage.');
} finally { await browser.close(); }
