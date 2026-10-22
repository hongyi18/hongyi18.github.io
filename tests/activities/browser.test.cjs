// Run after a build: ACTIVITIES_BUILD=/path/to/build node --test tests/activities/browser.test.cjs
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '../..');
const build = path.resolve(process.env.ACTIVITIES_BUILD || path.join(root, '_site'));
const html = fs.readFileSync(path.join(build, 'activities/index.html'), 'utf8');
const years = [...html.matchAll(/data-year-section="(\d{4})"/g)].map(match => Number(match[1]));
assert(years.length, 'Build the activities pages before running browser tests');
// Freeze time relative to the archive, not to a year that will become stale.
const testYear = Math.max(...years);
let browser;
before(async () => {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
});
after(async () => { await browser?.close(); });

async function withPage(lang, options, run) {
  const context = await browser.newContext({ javaScriptEnabled: options.javascript !== false, viewport: options.viewport || { width: 1440, height: 1000 } });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(({ year }) => {
      const NativeDate = Date;
      globalThis.Date = class extends NativeDate {
        constructor(...args) { super(...(args.length ? args : [`${year}-06-15T12:00:00`])); }
        static now() { return new NativeDate(`${year}-06-15T12:00:00`).valueOf(); }
      };
    }, { year: options.year ?? testYear });
    await page.route('https://activities.test/**', request => {
      const url = new URL(request.request().url());
      let filename = path.join(build, decodeURIComponent(url.pathname));
      if (url.pathname.endsWith('/')) filename = path.join(filename, 'index.html');
      if (!fs.existsSync(filename)) return request.fulfill({ status: 404, body: '' });
      let body = fs.readFileSync(filename);
      const ext = path.extname(filename);
      if (ext === '.html') {
        // Minimal host styling; the actual component markup, CSS, and JS come from Jekyll.
        body = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>body{font:16px/1.5 Arial,sans-serif;margin:0}.wrapper{max-width:1000px;padding:20px;margin:auto}</style></head><body><main class="wrapper">${body.toString()}</main></body></html>`;
      }
      return request.fulfill({ body, contentType: ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' })[ext] || 'application/octet-stream' });
    });
    await page.goto(`https://activities.test${lang === 'en' ? '/activities/' : '/zh/activities/'}${options.hash || ''}`);
    await run(page);
    assert.deepEqual(errors, [], 'Browser JavaScript errors');
  } finally { await context.close(); }
}

const entries = page => page.locator('.activity-entry').evaluateAll(items => items.map(item => ({
  id: item.id, type: item.dataset.type, slides: item.dataset.hasSlides === 'true',
  year: item.closest('.activity-year').dataset.yearSection
})));
const visibleIds = page => page.locator('.activity-entry:not([hidden])').evaluateAll(items => items.map(item => item.id));
const openYears = page => page.locator('.activity-year[open]:not([hidden])').evaluateAll(items => items.map(item => item.dataset.yearSection));
const entryYears = items => [...new Set(items.map(item => item.year))];
const selectedFilter = page => page.locator('[data-activity-filter][aria-pressed="true"]').getAttribute('data-activity-filter');

async function setHash(page, hash) {
  await page.evaluate(value => new Promise(resolve => {
    if (location.hash === value) return resolve();
    // Resolve after the component's existing hashchange handler has run.
    window.addEventListener('hashchange', resolve, { once: true });
    location.hash = value;
  }), hash);
}

for (const lang of ['en', 'zh']) {
  test(`${lang}: only the current year opens; an absent current year opens none`, async () => {
    await withPage(lang, { year: testYear }, async page => assert.deepEqual(await openYears(page), [String(testYear)]));
    await withPage(lang, { year: testYear + 1 }, async page => assert.deepEqual(await openYears(page), []));
  });

  test(`${lang}: filters update entries, counts, years, and status; All resets`, async () => {
    await withPage(lang, {}, async page => {
      const all = await entries(page);
      const filters = await page.locator('[data-activity-filter]').evaluateAll(buttons => buttons.map(button => button.dataset.activityFilter));
      assert(filters.includes('all') && filters.includes('slides'));
      for (const filter of filters) {
        const expected = all.filter(item => filter === 'all' || (filter === 'slides' ? item.slides : item.type === filter));
        const button = page.locator(`[data-activity-filter="${filter}"]`);
        await button.click();
        assert.equal(await selectedFilter(page), filter);
        assert.equal(await button.locator('[data-filter-count]').textContent(), `(${expected.length})`);
        assert.deepEqual(await visibleIds(page), expected.map(item => item.id));
        assert.deepEqual(await openYears(page), filter === 'all' ? [String(testYear)] : entryYears(expected));
        const template = await page.locator('.activities-page').getAttribute('data-status-template');
        assert.equal(await page.locator('#activity-filter-status').textContent(), template.replace('{visible}', expected.length).replace('{total}', all.length));
      }
      await page.locator('[data-activity-filter="all"]').click();
      assert.deepEqual(await openYears(page), [String(testYear)]);
    });
  });

  test(`${lang}: music deep link and history follow the current dataset`, async () => {
    await withPage(lang, { hash: '#filter-music' }, async page => {
      const all = await entries(page);
      const music = all.filter(item => item.type === 'music');
      assert.equal(await selectedFilter(page), 'music');
      assert.deepEqual(await visibleIds(page), music.map(item => item.id));
      assert.deepEqual(await openYears(page), entryYears(music));
      const other = all.find(item => item.type !== 'music');
      await setHash(page, `#${other.id}`);
      assert.equal(await page.locator(`#${other.id}`).isVisible(), true);
      await page.goBack();
      await page.waitForFunction(() => document.querySelector('[data-activity-filter="music"]').getAttribute('aria-pressed') === 'true');
      assert.deepEqual(await visibleIds(page), music.map(item => item.id));
    });
  });

  test(`${lang}: expand/collapse affects only visible years`, async () => {
    await withPage(lang, {}, async page => {
      await page.locator('[data-activity-filter="tool"]').click();
      const expected = entryYears((await entries(page)).filter(item => item.type === 'tool'));
      await page.locator('[data-year-action="collapse"]').click();
      assert.deepEqual(await openYears(page), []);
      await page.locator('[data-year-action="expand"]').click();
      assert.deepEqual(await openYears(page), expected);
      assert.equal(await page.locator('.activity-year[hidden][open]').count(), 0);
    });
  });

  test(`${lang}: an empty filter hides all years and All restores the archive`, async () => {
    await withPage(lang, {}, async page => {
      await page.locator('.activity-entry[data-type="paper"]').evaluateAll(items => items.forEach(item => { item.dataset.type = 'talk'; }));
      await page.locator('[data-activity-filter="paper"]').click();
      assert.deepEqual(await visibleIds(page), []);
      assert.deepEqual(await openYears(page), []);
      assert.equal(await page.locator('.activity-year:not([hidden])').count(), 0);
      await page.locator('[data-activity-filter="all"]').click();
      assert.deepEqual(await openYears(page), [String(testYear)]);
    });
  });

  test(`${lang}: highlights and related links reveal filtered-out entries`, async () => {
    await withPage(lang, {}, async page => {
      const all = await entries(page);
      const card = page.locator('.activity-highlight-card').first();
      const target = await card.getAttribute('href');
      const targetEntry = all.find(item => `#${item.id}` === target);
      const otherType = all.find(item => item.type !== targetEntry.type).type;
      await page.locator(`[data-activity-filter="${otherType}"]`).click();
      await card.click();
      assert.equal(await page.locator(target).isVisible(), true);
      assert.equal(await selectedFilter(page), 'all');

      const related = await page.locator('.activity-entry-links a[href^="#"]').evaluateAll(links => {
        const link = links.find(link => {
          const target = document.getElementById(link.getAttribute('href').slice(1));
          return target && target.dataset.type !== link.closest('.activity-entry').dataset.type;
        });
        return { source: link.closest('.activity-entry').id, type: link.closest('.activity-entry').dataset.type, target: link.getAttribute('href') };
      });
      await page.locator(`[data-activity-filter="${related.type}"]`).click();
      await page.locator(`#${related.source} a[href="${related.target}"]`).click();
      assert.equal(await page.locator(related.target).isVisible(), true);
      assert.equal(await selectedFilter(page), 'all');
    });
  });

  test(`${lang}: history reveals hidden targets without clearing a compatible filter`, async () => {
    await withPage(lang, {}, async page => {
      const all = await entries(page);
      const target = all.find(item => item.type === 'paper');
      const yearHash = `#year-${testYear}`;
      await setHash(page, `#${target.id}`);
      await page.locator(`[data-year-link="${testYear}"]`).click();
      await page.locator('[data-activity-filter="tool"]').click();
      await page.goBack();
      await page.waitForFunction(id => !document.getElementById(id).hidden, target.id);
      assert.equal(await page.locator(`#${target.id}`).isVisible(), true);
      assert.equal(await selectedFilter(page), 'all');
      await page.goForward();
      await page.waitForFunction(hash => location.hash === hash, yearHash);
      await page.locator('[data-activity-filter="paper"]').click();
      await page.goBack();
      await page.waitForFunction(id => location.hash === `#${id}`, target.id);
      assert.equal(await selectedFilter(page), 'paper');
      await page.locator('[data-year-action="collapse"]').click();
      await page.locator(`[data-year-link="${target.year}"]`).click();
      assert.equal(await page.locator(`#year-${target.year}`).evaluate(year => year.open), true);
      await setHash(page, '#not-an-entry');
      await setHash(page, '#%');
      assert.equal(await selectedFilter(page), 'paper');
    });
  });

  test(`${lang}: entry deep links open their archive year on arrival`, async () => {
    const id = html.match(/<article id="([^"]+)" class="activity-entry"/)[1];
    await withPage(lang, { hash: `#${id}` }, async page => {
      assert.equal(await page.locator(`#${id}`).isVisible(), true);
    });
  });

  test(`${lang}: native disclosures work without JavaScript`, async () => {
    await withPage(lang, { javascript: false }, async page => {
      assert.equal(await page.locator('.activity-controls').isVisible(), false);
      assert.equal(await page.locator('.activity-year-actions').isVisible(), false);
      const year = page.locator('.activity-year').first();
      await year.locator('summary').click();
      assert.equal(await year.evaluate(year => year.open), true);
      assert.equal(await year.locator('.activity-entry').first().isVisible(), true);
    });
  });

  test(`${lang}: desktop and mobile layouts do not overflow`, async () => {
    for (const width of [1440, 390]) {
      await withPage(lang, { viewport: { width, height: 1000 } }, async page => {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Horizontal overflow');
        if (process.env.ACTIVITIES_SCREENSHOTS) {
          fs.mkdirSync(process.env.ACTIVITIES_SCREENSHOTS, { recursive: true });
          await page.screenshot({ path: path.join(process.env.ACTIVITIES_SCREENSHOTS, `${lang}-${width}.png`), fullPage: true });
        }
      });
    }
  });
}
