const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(process.cwd(), 'node_modules/playwright'));
const { expect } = require(path.join(process.cwd(), 'node_modules/@playwright/test'));
const base = process.argv[2], out = process.argv[3], smoke = process.argv.includes('--smoke');
fs.mkdirSync(out, { recursive: true });
const results = [], traffic = [], observations = [];
const only = process.argv.find(arg => arg.startsWith('--only='))?.slice(7);
let browser;
const shot = async (page, name, fullPage = false) => page.screenshot({ path: path.join(out, name + '.png'), fullPage });
async function widths(page, label) {
  const d = await page.evaluate(() => ({ viewport: innerWidth, client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  observations.push({ label, widths: d });
  expect(d.scroll, label + ' root overflow').toBeLessThanOrEqual(d.client);
  expect(d.body, label + ' body overflow').toBeLessThanOrEqual(d.client);
}
async function focus(page, label) {
  const d = await page.evaluate(() => {
    const e = document.activeElement, s = getComputedStyle(e), r = e.getBoundingClientRect();
    return { tag: e.tagName, id: e.id, text: e.textContent?.trim().slice(0, 80), outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, display: s.display, visibility: s.visibility, width: r.width, height: r.height };
  });
  observations.push({ label, focus: d }); return d;
}
async function image(page, label) {
  const img = page.locator('main img');
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute('src', '/images/starter.svg');
  await expect(img).toHaveAttribute('alt', 'An orange sun above sculptural arches and a green hillside');
  await expect.poll(() => img.evaluate(e => e.complete && e.naturalWidth > 0)).toBe(true);
  const response = await page.request.get(base + '/images/starter.svg');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/svg+xml');
  expect(await response.text()).toContain('<svg');
  observations.push({ label, localImage: { status: response.status(), type: response.headers()['content-type'], dimensions: await img.evaluate(e => [e.naturalWidth, e.naturalHeight]) } });
}
async function run(name, viewport, action, mobile = false) {
  if (only && name !== only) return;
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  const errors = [], failed = [], bad = [], external = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push({ kind: 'console.error', text: msg.text() }); });
  page.on('pageerror', error => errors.push({ kind: 'pageerror', text: error.message }));
  page.on('requestfailed', req => failed.push({ url: req.url(), error: req.failure()?.errorText }));
  page.on('response', response => { if (response.status() >= 400) bad.push({ url: response.url(), status: response.status() }); });
  page.on('request', req => { if (!req.url().startsWith(base)) external.push(req.url()); });
  try {
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await action(page);
    await page.waitForTimeout(150);
    expect(errors, 'Application console/runtime errors').toEqual([]);
    expect(bad, 'HTTP >=400 responses').toEqual([]);
    expect(failed, 'Failed requests').toEqual([]);
    expect(external, 'Unexpected external dependency').toEqual([]);
    results.push({ name, status: 'PASS' });
  } catch (error) {
    results.push({ name, status: 'FAIL', error: error.stack });
    await shot(page, name + '-failure', true).catch(() => {});
  } finally {
    traffic.push({ name, errors, failed, bad, external });
    await context.close();
  }
}
(async () => {
  browser = await chromium.launch();
  observations.push({ browserVersion: browser.version(), base, smoke });
  if (smoke) {
    await run('dev-smoke', { width: 375, height: 812 }, async page => {
      await expect(page.locator('h1')).toHaveText('Make room for your next idea.');
      await image(page, 'dev');
      const toggle = page.getByRole('button', { name: /menu$/ });
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
      await expect(page).toHaveURL(/#about$/);
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await widths(page, 'dev');
      await shot(page, 'dev-mobile', true);
    }, true);
  } else {
    await run('B1-desktop-navigation', { width: 1440, height: 900 }, async page => {
      await expect(page).toHaveTitle('Stark Studio — A clear place to begin');
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Thoughtful websites, built around the things that matter.');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      for (const role of ['banner', 'main', 'contentinfo']) await expect(page.getByRole(role)).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
      await image(page, 'desktop'); await widths(page, 'desktop');
      await shot(page, 'desktop-full', true);
      for (const [label, id] of [['Approach', 'approach'], ['About', 'about']]) {
        await page.getByRole('navigation').getByRole('link', { name: label }).click();
        await expect(page).toHaveURL(new RegExp('#' + id + '$'));
        await expect(page.locator('#' + id)).toBeInViewport();
      }
      await page.getByRole('link', { name: 'Back to top' }).click();
      await expect(page).toHaveURL(/#main$/);
      await page.getByRole('link', { name: /Explore our approach/ }).click();
      await expect(page).toHaveURL(/#approach$/);
      await page.locator('header > div > a').click();
      await expect(page).toHaveURL(/#main$/);
    });
    await run('B2-mobile-pointer', { width: 375, height: 812 }, async page => {
      const toggle = page.getByRole('button', { name: /menu$/ }), nav = page.getByRole('navigation');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toHaveAttribute('aria-controls', 'primary-navigation');
      await expect(page.getByRole('navigation', { includeHidden: true })).toHaveAttribute('id', 'primary-navigation');
      await expect(nav).toBeHidden();
      await image(page, 'mobile'); await widths(page, 'mobile-closed');
      await shot(page, 'mobile-full', true);
      for (let i = 0; i < 2; i++) {
        await toggle.tap(); await expect(nav).toBeVisible(); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await widths(page, 'mobile-open-' + i); await shot(page, 'mobile-open-' + i);
        await toggle.tap(); await expect(nav).toBeHidden(); await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      }
      for (const [label, id] of [['About', 'about'], ['Approach', 'approach']]) {
        await toggle.tap(); await nav.getByRole('link', { name: label }).tap();
        await expect(page).toHaveURL(new RegExp('#' + id + '$')); await expect(nav).toBeHidden();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('#' + id)).toBeInViewport();
        await focus(page, 'pointer-selection-' + id);
      }
    }, true);
    await run('B3-keyboard-focus', { width: 375, height: 812 }, async page => {
      await page.keyboard.press('Tab');
      const skip = page.getByRole('link', { name: 'Skip to content' });
      await expect(skip).toBeFocused(); await expect(skip).toBeInViewport();
      const f = await focus(page, 'skip'); expect(f.outlineStyle).not.toBe('none'); expect(parseFloat(f.outlineWidth)).toBeGreaterThan(0);
      await shot(page, 'skip-focus');
      await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused();
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.keyboard.press('Tab'); await expect(skip).toBeFocused();
      await page.keyboard.press('Tab'); await expect(page.locator('header > div > a')).toBeFocused();
      await page.keyboard.press('Tab');
      const toggle = page.getByRole('button', { name: /menu$/ }), nav = page.getByRole('navigation');
      await expect(toggle).toBeFocused();
      const t = await focus(page, 'menu-button'); expect(t.outlineStyle).not.toBe('none'); expect(parseFloat(t.outlineWidth)).toBeGreaterThan(0);
      await shot(page, 'menu-button-focus');
      await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: /Explore our approach/ })).toBeFocused();
      await page.keyboard.press('Shift+Tab'); await expect(toggle).toBeFocused();
      await page.keyboard.press('Space'); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Tab'); await expect(nav.getByRole('link', { name: 'Approach' })).toBeFocused();
      await shot(page, 'nav-link-focus');
      await page.keyboard.press('Escape'); await expect(nav).toBeHidden(); await expect(toggle).toBeFocused();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false'); await shot(page, 'escape-focus-return');
      await page.keyboard.press('Enter'); await expect(nav).toBeVisible();
      await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await expect(nav.getByRole('link', { name: 'About' })).toBeFocused();
      await page.keyboard.press('Enter'); await expect(page).toHaveURL(/#about$/); await expect(nav).toBeHidden();
      await expect(page.locator('#about')).toBeFocused(); await focus(page, 'keyboard-selection');
    }, true);
    await run('B4-breakpoints-B6-overflow', { width: 767, height: 900 }, async page => {
      const toggle = page.getByRole('button', { name: /menu$/ }), nav = page.getByRole('navigation');
      await expect(toggle).toBeVisible(); await expect(nav).toBeHidden(); await widths(page, '767-closed');
      await toggle.click(); await expect(nav).toBeVisible(); await widths(page, '767-open');
      await page.setViewportSize({ width: 768, height: 900 });
      await expect(toggle).toBeHidden(); await expect(nav).toBeVisible(); await widths(page, '768-desktop');
      await page.waitForTimeout(100);
      const a = await focus(page, 'after-mobile-to-desktop'); expect(a.width > 0 && a.height > 0).toBe(true);
      await shot(page, 'breakpoint-768', true);
      await page.setViewportSize({ width: 375, height: 812 }); await expect(toggle).toBeVisible();
      // State may remain open; no reset contract. Close explicitly before the next transition.
      if (await toggle.getAttribute('aria-expanded') === 'true') await toggle.click();
      await page.setViewportSize({ width: 768, height: 900 });
      await nav.getByRole('link', { name: 'About' }).focus();
      await page.setViewportSize({ width: 767, height: 900 }); await expect(nav).toBeHidden();
      await page.waitForTimeout(100);
      const b = await focus(page, 'after-desktop-to-mobile'); expect(b.width > 0 && b.height > 0).toBe(true);
      await page.setViewportSize({ width: 320, height: 812 });
      await widths(page, '320-closed'); await shot(page, 'narrow-320-closed', true);
      await toggle.click(); await widths(page, '320-open'); await shot(page, 'narrow-320-open');
      await nav.getByRole('link', { name: 'Approach' }).click(); await expect(page).toHaveURL(/#approach$/); await expect(nav).toBeHidden();
    });
  }
})().catch(error => { results.push({ name: 'driver', status: 'BLOCKED', error: error.stack }); }).finally(async () => {
  if (browser) await browser.close();
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ results, observations, traffic }, null, 2));
  console.log(JSON.stringify(results, null, 2));
  process.exitCode = results.some(r => r.status !== 'PASS') ? 1 : 0;
});
