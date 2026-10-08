// Run after a Jekyll build: ACTIVITIES_BUILD=/path/to/build node --test tests/activities/browser.test.cjs
// Optional ACTIVITIES_BASELINE_BUILD compares a pre-refactor build's visible content.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '../..');
const build = path.resolve(process.env.ACTIVITIES_BUILD || path.join(root, '_site'));
let browser;
before(async () => {
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
});
after(async () => { await browser?.close(); });

async function openPage(lang, options = {}) {
  const context = await browser.newContext({ javaScriptEnabled: options.javascript !== false, viewport: options.viewport || { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(({ year }) => {
    const NativeDate = Date;
    globalThis.Date = class extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [`${year}-10-04T12:00:00`])); }
      static now() { return new NativeDate(`${year}-10-04T12:00:00`).valueOf(); }
    };
  }, { year: options.year || 2026 });
  const directory = options.build || build;
  const route = lang === 'en' ? '/activities/' : '/zh/activities/';
  await page.route('https://activities.test/**', request => {
    const url = new URL(request.request().url());
    let filename = path.join(directory, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) filename = path.join(filename, 'index.html');
    if (!fs.existsSync(filename)) return request.fulfill({ status: 404, body: '' });
    let body = fs.readFileSync(filename);
    const ext = path.extname(filename);
    if (ext === '.html') {
      // Same host scaffolding in both versions; no substitute component markup.
      body = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>body{font:16px/1.5 Arial,sans-serif;color:#111;margin:0}.wrapper{max-width:1000px;padding:30px;margin:auto}h1{font-size:36px}a{color:#2a7ae2;text-decoration:none}a:hover{text-decoration:underline}p{margin:0 0 15px}@media(max-width:600px){.wrapper{padding:20px}}</style></head><body><main class="wrapper"><h1>${lang === 'en' ? 'Activities' : '动态'}</h1>${body.toString()}</main></body></html>`;
    }
    return request.fulfill({ body, contentType: ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' })[ext] || 'application/octet-stream' });
  });
  await page.goto(`https://activities.test${route}${options.hash || ''}`);
  return { page, context, errors };
}

async function withPage(lang, options, run) {
  const session = await openPage(lang, options);
  try { await run(session.page); assert.deepEqual(session.errors, []); }
  finally { await session.context.close(); }
}

async function content(page) {
  return page.locator('.activities-page').evaluate(root => {
    const text = element => element?.textContent.replace(/\s+/g, ' ').trim() || '';
    const links = element => [...element.querySelectorAll('a')].map(link => [text(link), link.getAttribute('href')]);
    return {
      intro: text(root.querySelector('.activities-intro')),
      headings: [...root.querySelectorAll('h2')].map(text),
      cards: [...root.querySelectorAll('.activity-highlight-card')].map(card => [text(card), card.getAttribute('href')]),
      entries: [...root.querySelectorAll('.activity-entry')].map(entry => ({
        id: entry.id, date: entry.querySelector('time').getAttribute('datetime'),
        text: text(entry), links: links(entry),
        details: [...entry.querySelectorAll('.activity-entry-detail')].map(text)
      })),
      filters: [...root.querySelectorAll('[data-activity-filter]')].map(button => [button.getAttribute('data-activity-filter'), text(button)])
    };
  });
}

const visibleIds = page => page.locator('.activity-entry:not([hidden])').evaluateAll(entries => entries.map(entry => entry.id));
const openYears = page => page.locator('.activity-year[open]:not([hidden])').evaluateAll(years => years.map(year => year.getAttribute('data-year-section')));

for (const lang of ['en', 'zh']) {
  test(`${lang}: rendered content preserves baseline`, async t => {
    if (!process.env.ACTIVITIES_BASELINE_BUILD) return t.skip('Migration baseline not supplied');
    const baseline = await openPage(lang, { build: path.resolve(process.env.ACTIVITIES_BASELINE_BUILD) });
    try {
      const expected = await content(baseline.page);
      await withPage(lang, {}, async page => assert.deepEqual(await content(page), expected));
    } finally { await baseline.context.close(); }
  });

  test(`${lang}: current-year-only and missing-current-year`, async () => {
    await withPage(lang, { year: 2026 }, async page => assert.deepEqual(await openYears(page), ['2026']));
    await withPage(lang, { year: 2028 }, async page => assert.deepEqual(await openYears(page), []));
  });

  test(`${lang}: every filter, counts, expansion, and All reset`, async () => {
    await withPage(lang, {}, async page => {
      const all = await page.locator('.activity-entry').evaluateAll(entries => entries.map(entry => ({ id: entry.id, type: entry.dataset.type, slides: entry.dataset.hasSlides === 'true', year: entry.closest('.activity-year').dataset.yearSection })));
      const filters = ['all', 'paper', 'tool', 'talk', 'slides', 'media', 'outreach', 'recognition', 'music'];
      assert.deepEqual(await page.locator('[data-activity-filter]').evaluateAll(buttons => buttons.map(button => button.dataset.activityFilter)), filters);
      for (const filter of filters) {
        const expected = all.filter(entry => filter === 'all' || (filter === 'slides' ? entry.slides : entry.type === filter));
        const button = page.locator(`[data-activity-filter="${filter}"]`);
        await button.click();
        assert.equal(await button.getAttribute('aria-pressed'), 'true');
        assert.equal(await button.locator('[data-filter-count]').textContent(), `(${expected.length})`);
        assert.deepEqual(await visibleIds(page), expected.map(entry => entry.id));
        assert.deepEqual(await openYears(page), filter === 'all' ? ['2026'] : [...new Set(expected.map(entry => entry.year))]);
        assert.equal(await page.locator('#activity-filter-status').textContent(), lang === 'en' ? `Showing ${expected.length} of ${all.length} items.` : `显示 ${expected.length} 项，共 ${all.length} 项。`);
      }
      await page.locator('[data-activity-filter="all"]').click();
      assert.deepEqual(await openYears(page), ['2026']);
    });
  });

  test(`${lang}: music deep link selects four events and supports history`, async () => {
    await withPage(lang, { hash: '#filter-music' }, async page => {
      assert.equal(await page.locator('[data-activity-filter="music"]').getAttribute('aria-pressed'), 'true');
      assert.deepEqual(await visibleIds(page), [
        'music-2026-07-naples-china', 'music-2025-04-shanghai-nights',
        'music-2025-01-fairy-tales', 'music-2023-01-plum-blossom'
      ]);
      assert.deepEqual(await openYears(page), ['2026', '2025', '2023']);
      await page.evaluate(() => { location.hash = '#paper-2025-07-flattened-axion'; });
      await page.waitForFunction(() => location.hash === '#paper-2025-07-flattened-axion');
      assert.equal(await page.locator('#paper-2025-07-flattened-axion').isVisible(), true);
      await page.goBack();
      await page.waitForFunction(() => location.hash === '#filter-music');
      assert.equal(await page.locator('[data-activity-filter="music"]').getAttribute('aria-pressed'), 'true');
      assert.equal((await visibleIds(page)).length, 4);
    });
  });

  test(`${lang}: expand/collapse visible years only`, async () => {
    await withPage(lang, {}, async page => {
      await page.locator('[data-activity-filter="tool"]').click();
      const visible = await page.locator('.activity-year:not([hidden])').evaluateAll(years => years.map(year => year.dataset.yearSection));
      await page.locator('[data-year-action="collapse"]').click();
      assert.deepEqual(await openYears(page), []);
      await page.locator('[data-year-action="expand"]').click();
      assert.deepEqual(await openYears(page), visible);
      assert.equal(await page.locator('.activity-year[hidden][open]').count(), 0);
    });
  });

  test(`${lang}: zero-match filter leaves no visible or open years`, async () => {
    await withPage(lang, {}, async page => {
      // Controlled DOM input represents a future archive with no paper entries.
      await page.locator('.activity-entry[data-type="paper"]').evaluateAll(entries => entries.forEach(entry => { entry.dataset.type = 'talk'; }));
      await page.locator('[data-activity-filter="paper"]').click();
      assert.deepEqual(await visibleIds(page), []);
      assert.deepEqual(await openYears(page), []);
      assert.equal(await page.locator('.activity-year:not([hidden])').count(), 0);
      assert.match(await page.locator('#activity-filter-status').textContent(), lang === 'en' ? /^Showing 0 of / : /^显示 0 项/);
      await page.locator('[data-activity-filter="all"]').click();
      assert.deepEqual(await openYears(page), ['2026']);
    });
  });

  test(`${lang}: highlights and related links reveal filtered-out entries`, async () => {
    await withPage(lang, {}, async page => {
      await page.locator('[data-activity-filter="paper"]').click();
      await page.locator('.activity-highlight-card[href="#outreach-2025-01-dimensions"]').click();
      assert.equal(await page.locator('#outreach-2025-01-dimensions').isVisible(), true);
      assert.equal(await page.locator('[data-activity-filter="all"]').getAttribute('aria-pressed'), 'true');
      await page.locator('[data-activity-filter="tool"]').click();
      await page.locator('#tool-2025-07-axion-dark-photon-simulator a[href="#paper-2025-07-flattened-axion"]').click();
      assert.equal(await page.locator('#paper-2025-07-flattened-axion').isVisible(), true);
    });
  });

  test(`${lang}: Back and Forward reveal a hidden target`, async () => {
    await withPage(lang, {}, async page => {
      await page.locator('.activity-highlight-card[href="#outreach-2025-01-dimensions"]').click();
      await page.locator('[data-year-link="2026"]').click();
      await page.locator('[data-activity-filter="paper"]').click();
      await page.goBack();
      await page.waitForFunction(() => location.hash === '#outreach-2025-01-dimensions');
      assert.equal(await page.locator('#outreach-2025-01-dimensions').isVisible(), true);
      assert.equal(await page.locator('[data-activity-filter="all"]').getAttribute('aria-pressed'), 'true');
      await page.locator('[data-activity-filter="tool"]').click();
      await page.goForward();
      await page.waitForFunction(() => location.hash === '#year-2026');
      assert.equal(await page.locator('#year-2026').isVisible(), true);
    });
  });

  test(`${lang}: visible history target keeps filter; direct/year/unknown hashes`, async () => {
    await withPage(lang, { hash: '#paper-2025-07-flattened-axion' }, async page => {
      assert.equal(await page.locator('#paper-2025-07-flattened-axion').isVisible(), true);
      await page.locator('[data-year-link="2026"]').click();
      await page.locator('[data-activity-filter="paper"]').click();
      await page.goBack();
      await page.waitForFunction(() => location.hash === '#paper-2025-07-flattened-axion');
      assert.equal(await page.locator('[data-activity-filter="paper"]').getAttribute('aria-pressed'), 'true');
      await page.locator('[data-year-action="collapse"]').click();
      await page.locator('[data-year-link="2025"]').click();
      assert.equal(await page.locator('#year-2025').evaluate(year => year.open), true);
      await page.evaluate(() => { location.hash = '#not-an-entry'; });
      await page.waitForFunction(() => location.hash === '#not-an-entry');
      await page.evaluate(() => { location.hash = '#%'; });
      await page.waitForFunction(() => location.hash === '#%');
      assert.equal(await page.locator('[data-activity-filter="paper"]').getAttribute('aria-pressed'), 'true');
    });
  });

  test(`${lang}: no-JavaScript fallback has no inert controls`, async () => {
    await withPage(lang, { javascript: false }, async page => {
      assert.equal(await page.locator('.activity-controls').isVisible(), false);
      assert.equal(await page.locator('.activity-year-actions').isVisible(), false);
      await page.locator('#year-2025 > summary').click();
      assert.equal(await page.locator('#year-2025').evaluate(year => year.open), true);
      assert.equal(await page.locator('#outreach-2025-01-dimensions').isVisible(), true);
    });
  });

  test(`${lang}: optional desktop/mobile visual captures`, async t => {
    if (!process.env.ACTIVITIES_SCREENSHOTS) return t.skip('Screenshot output not requested');
    fs.mkdirSync(process.env.ACTIVITIES_SCREENSHOTS, { recursive: true });
    for (const width of [1440, 390]) {
      await withPage(lang, { viewport: { width, height: 1000 } }, async page => {
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Horizontal overflow');
        await page.screenshot({ path: path.join(process.env.ACTIVITIES_SCREENSHOTS, `${lang}-${width}.png`), fullPage: true });
      });
    }
  });
}
