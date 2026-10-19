// rui-show on happy-dom: the registry holds every page file, the shell opens
// and moves between pages (disposing the one it leaves), every demo renders
// the same on the DOM and on Skia, the renderer switch makes each demo's root
// on its renderer, and the theme controls restyle the demos.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Window } from 'happy-dom';
import * as THREE from 'three';
import { $three } from 'ren-three';
import { $signal, $read, $write, $roots, $active, $dispose, $settle, Root } from 'ren-core';
import { BASE_THEME, Clock, manualClock, Rui, Button } from 'rui-core';
import { App, pages, find, matches, ranked, PHONE } from '../src/app.jsx';
import { dataOf } from '../src/page.jsx';
import { pages as registry } from '../src/pages/index.generated.js';
import { GROUPS, RENDERERS, rootId } from '../src/site.js';
import { Themed, Orbit } from '../src/stage.jsx';
import { ids, source } from '../scripts/pages.mjs';
import { once, bytes } from '../src/env.js';
import { ARABIC } from '../src/pages/text.jsx';
import { Sfnt } from 'ren-canv';
import { open } from './page.jsx';
import { onDom, onSkia, font, closeWindow, disposeAfter } from './harness.jsx';

// Every window, canvas and root a test opens is disposed in its `t.after`,
// registered as it opens: a failing test frees them too, and the next test
// starts once they are.

/** A text's words, sorted: the same text in any order. @param {string} text */
const words = text => text.split(' ').sort();

/**
 * A text's letters, sorted, spaces left out: a clip cuts text at its rows,
 * and a box narrower than a word (VisuallyHidden's one pixel) breaks it
 * across rows the DOM's text never shows on happy-dom, which lays nothing out.
 * @param {string} text
 */
const letters = text => [...text.replace(/\s+/g, '')].sort();

/** Whether every word or letter of `some` (sorted) is among `all` (sorted), as many times. @param {string[]} some @param {string[]} all */
const within = (some, all) => {
  let j = 0;
  for (const w of some) {
    while (j < all.length && all[j] < w) j++;
    if (all[j] !== w) return false;
    j++;
  }
  return true;
};

/** The page files, by id. */
const files = readdirSync(fileURLToPath(new URL('../src/pages/', import.meta.url)))
  .filter(f => f.endsWith('.jsx'))
  .map(f => f.slice(0, -4))
  .sort();

describe('the registry', () => {
  it('holds one record per file in src/pages, named as its file', () => {
    assert.deepEqual(ids(), files);
    assert.deepEqual(registry.map(p => p.id), files, 'the generated registry is current (scripts/pages.mjs)');
    assert.equal(source(files).split('\n').filter(l => l.startsWith('import ')).length, files.length);
    assert.equal(pages.length, files.length);
  });

  it('gives every record its fields', () => {
    for (const p of registry) {
      const at = `src/pages/${p.id}.jsx`;
      assert.ok(GROUPS.some(g => g.id === p.group), `${at}: a known group`);
      assert.ok(p.title.length > 0 && p.description.length > 0, `${at}: a title and a description`);
      assert.ok(Array.isArray(p.props) && Array.isArray(p.demos) && p.demos.length > 0, `${at}: props and at least one demo`);
      for (const row of p.props) assert.ok(row.name && row.type && row.description, `${at}: prop ${row.name} has a type and a description`);
      // Its demo roots' ids are ren-core's root ids ([a-z][a-z0-9-]{0,31}), the longest renderer's included.
      for (const r of RENDERERS) assert.match(rootId(r.id, `${p.id}-${p.demos.length - 1}`), /^[a-z][a-z0-9-]{0,31}$/, `${at}: a root id per demo`);
      for (const d of p.demos) assert.ok(d.title && typeof d.code === 'string' && d.code.trim().length > 0 && typeof d.view === 'function', `${at}: demo ${d.title} has code and a view`);
    }
  });

  it('orders pages by group, then title; finds and searches them', () => {
    const rank = pages.map(p => GROUPS.findIndex(g => g.id === p.group));
    assert.deepEqual(rank, [...rank].sort((a, b) => a - b));
    for (let i = 1; i < pages.length; i++)
      if (pages[i - 1].group === pages[i].group) assert.ok(pages[i - 1].title.localeCompare(pages[i].title) <= 0, `${pages[i - 1].title} before ${pages[i].title}`);
    assert.equal(find('#button')?.id, 'button');
    assert.equal(find(''), null);
    assert.equal(find('#nope'), null);
    const button = /** @type {any} */ (find('#button'));
    assert.ok(matches(button, 'butt') && matches(button, 'actions press') && !matches(button, 'grid'));
  });
});

describe('a demo\'s code', () => {
  it('names nothing free its page\'s demos neither declare nor describe', async t => {
    // What the code may take as given: the public entries' exports (a demo's imports), and the
    // platform's globals (TypeScript's es2023 and DOM libraries know them).
    const entries = ['rui-core', 'rui-core/hooks', 'rui-core/form', 'rui-core/dates', 'rui-core/charts', 'rui-core/notifications', 'rui-core/launcher', 'rui-core/carousel', 'rui-core/dropzone', 'rui-core/modals', 'rui-core/snippet', 'rui-core/load-bar', 'rui-core/editor', 'rui-core/more', 'ren-core', 'rrx-core'];
    const given = new Set();
    for (const entry of entries) for (const name of Object.keys(await import(entry))) given.add(name);
    // Each page's demo codes as one module, checked by TypeScript: every name it cannot find is free.
    const dir = mkdtempSync(join(tmpdir(), 'rui-show-names-'));
    t.after(() => rmSync(dir, { recursive: true, force: true }));
    const options = { allowJs: true, checkJs: true, noEmit: true, jsx: 'preserve', target: 'es2023', module: 'esnext', moduleResolution: 'bundler', moduleDetection: 'force', lib: ['es2023', 'dom', 'dom.iterable'], types: [], skipLibCheck: true };
    writeFileSync(join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: options, include: ['*.jsx'] }));
    /** Per page, the names its codes describe by a comment line, `// name: what it is` (or `// one, two: …`). @type {Map<string, Set<string>>} */
    const described = new Map();
    for (const p of registry) {
      const all = p.demos.map(d => d.code).join('\n');
      writeFileSync(join(dir, `${p.id}.jsx`), all);
      described.set(p.id, new Set([...all.matchAll(/^\s*\/\/\s*([A-Za-z_$][\w$]*(?:\s*,\s*[A-Za-z_$][\w$]*)*):/gm)].flatMap(m => m[1].split(/\s*,\s*/))));
    }
    // Canaries: names surely free, as a name and as a shorthand property (TypeScript's other message for
    // one, TS18004), so a run that reports nothing, or misses either form, is seen.
    writeFileSync(join(dir, 'canary.jsx'), 'surelyFree;\nconsole.log({ surelyShort });');
    const tsc = fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url));
    const run = spawnSync(process.execPath, [tsc, '-p', join(dir, 'tsconfig.json'), '--pretty', 'false'], { encoding: 'utf8', timeout: 120_000 });
    assert.equal(run.error, undefined, 'tsc ran');
    /** @type {string[]} */
    const free = [];
    /** @type {Set<string>} */
    const canaries = new Set();
    const message = /^(?:.*[\\/])?([\w-]+)\.jsx\(\d+,\d+\): error TS\d+: (?:Cannot find name '([^']+)'|No value exists in scope for the shorthand property '([^']+)')/gm;
    for (const [, file, plain, short] of run.stdout.matchAll(message)) {
      const name = plain ?? short;
      if (file === 'canary') canaries.add(name);
      else if (!given.has(name) && !described.get(file)?.has(name)) free.push(`${file}: ${name}`);
    }
    assert.deepEqual([...canaries].sort(), ['surelyFree', 'surelyShort'], `tsc reported both canaries' free names: ${run.stdout.slice(0, 400)}${run.stderr.slice(0, 400)}`);
    assert.ok(registry.length > 0 && described.size === registry.length, 'every page checked');
    assert.deepEqual([...new Set(free)], [], 'declare it in the code, or describe it: // name: what it is');
  });
});

describe('the loaders', () => {
  it('keep what loaded, and try again after a failure', async () => {
    let calls = 0;
    const load = once(async () => {
      if (++calls === 1) throw new Error('offline');
      return calls;
    });
    await assert.rejects(load(), /offline/);
    assert.equal(await load(), 2, 'a failure is not kept');
    assert.equal(await load(), 2, 'a success is');
    assert.equal(calls, 2);
  });

  it('fail on a response that is not ok, naming the URL', async () => {
    const get = /** @type {any} */ (async (/** @type {string} */ url) => (url.endsWith('font.ttf') ? { ok: true, arrayBuffer: async () => new ArrayBuffer(4) } : { ok: false, status: 404, statusText: 'Not Found' }));
    assert.equal((await bytes('./font.ttf', get)).byteLength, 4);
    await assert.rejects(bytes('./mono.ttf', get), /could not load \.\/mono\.ttf: 404 Not Found/);
  });
});

describe('the shell', () => {
  it('opens on the home page with every page in the sidebar', t => {
    const page = open(App, { t });
    assert.equal(page.all('[data-page="home"]').length, 1);
    for (const p of pages) assert.ok(page.all('[data-ren="Action"]').some(a => a.textContent === p.title), `${p.title} in the sidebar`);
    assert.ok(page.text().includes('One component, three renderers'));
  });

  it('opens every page, disposing the page it leaves', async t => {
    const page = open(App, { t });
    for (const p of pages) {
      page.click(p.title);
      // What the page started (its loads) completes, and what that queued runs.
      await $settle(page.root);
      assert.deepEqual(page.all('[data-page]').map(a => a.getAttribute('data-page')), [p.id], `${p.id} alone on the page`);
      assert.equal(page.window.location.hash, `#${p.id}`);
      const stages = page.all('[data-demo]');
      assert.equal(stages.length, p.demos.length);
      // Each demo in its own root; the previous page's roots are gone.
      assert.ok(stages.every(s => s.querySelector('[data-ren-root]') !== null), `${p.id}: every demo has its root`);
      const live = $roots(page.document).filter(id => id !== 'rui-show');
      assert.equal(live.length, p.demos.length, `${p.id}: only this page's demo roots live (${live.join(', ')})`);
      for (const title of [p.title, p.description.replaceAll('`', '').slice(0, 20)]) assert.ok(page.text().includes(title));
      // The props Table: one grid of four columns (its head's words first: the switches are grids too), its rows boxless rows of a cell each column, the head first.
      const table = page.all('[data-page] [data-ren="View"]').findLast(v => v.style.display === 'grid' && v.closest('[data-demo]') === null && v.textContent.startsWith('NameTypeDefaultDescription'));
      const rows = table === undefined ? [] : [...table.children].filter(r => r.getAttribute('role') === 'row' && r.style.display === 'contents' && r.children.length === 4);
      assert.equal(Math.max(0, rows.length - 1), p.props.length, `${p.id}: a row per prop`);
      // The job ends before the next page, as a browser's task ends between
      // clicks: V8 keeps whatever a WeakRef was made for or read in a job
      // until that job ends (happy-dom caches its queries that way), so
      // every page would stay alive till the last. No duration: an
      // immediate runs right after the job, once its microtasks drain.
      await new Promise(resolve => setImmediate(resolve)); // timer: turn
    }
    page.click('First view');
    assert.equal(page.all('[data-page="home"]').length, 1);
  });

  it('names each demo root by its page, demo and renderer, so its storage outlasts a visit', async t => {
    const page = open(App, { url: 'http://localhost/#hook-local-storage', t });
    assert.ok($roots(page.document).includes('dom-hook-local-storage-0'));
    page.click('spacious');
    assert.equal(page.window.localStorage.getItem('ren:dom-hook-local-storage-0:rui-show-density'), '"spacious"');
    // Other pages first, then back: the demo's root has the same id, and reads what it kept.
    for (const hash of ['#button', '#menu', '#hook-local-storage']) {
      page.window.location.hash = hash;
      page.window.dispatchEvent(new page.window.HashChangeEvent('hashchange'));
      await $settle(page.root);
    }
    assert.ok(page.text().includes('Stored: spacious'), 'the kept value, after other pages');
    // A root made again under its predecessor's id (a three.js root on a new scheme) takes it over.
    page.click('three.js overlay');
    await $settle(page.root);
    assert.ok($roots(page.document).includes('three-hook-local-storage-0'));
    page.click('Dark');
    await $settle(page.root);
    assert.ok($roots(page.document).includes('three-hook-local-storage-0'), 'made again in the dark scheme');
    page.click('DOM');
  });

  it('marks its landmarks and a heading outline, with a skip link to the content', t => {
    const page = open(App, { url: 'http://localhost/#tabs', t });
    const one = (/** @type {string} */ role) => {
      const found = page.all(`[role="${role}"]`);
      assert.equal(found.length, 1, `one ${role}`);
      return found[0];
    };
    const banner = one('banner');
    const main = one('main');
    assert.equal(one('navigation').getAttribute('aria-label'), 'Pages');
    assert.equal(banner.querySelector('[role="heading"]'), null, 'the brand is no heading');
    assert.ok(banner.textContent.includes('rui'));
    // The outline outside the demos' own roots: the page's title, then its sections.
    const p = /** @type {any} */ (find('#tabs'));
    const outline = page.all('[role="heading"]').filter(h => h.closest('[data-demo]') === null);
    const levels = outline.map(h => Number(h.getAttribute('aria-level')));
    assert.deepEqual(levels, [1, ...p.demos.map(() => 2), ...(p.props.length > 0 ? [2] : [])], outline.map(h => h.textContent).join(' | '));
    assert.deepEqual(outline.slice(1, 1 + p.demos.length).map(h => h.textContent), p.demos.map(d => d.title), 'a heading per demo');
    // The skip link: one clipped pixel until focused, then shown; it moves the focus to the main content.
    const skip = page.action('Skip to content');
    const box = skip.parentElement;
    assert.equal(main.getAttribute('tabindex'), '-1', 'the main content out of the Tab order, focusable from code');
    assert.equal(box.style.width, '1px', 'out of sight');
    skip.focus();
    page.flush();
    assert.notEqual(box.style.width, '1px', 'shown on focus');
    page.click('Skip to content');
    assert.equal(page.document.activeElement, main, 'the main content takes the focus');
    assert.equal(box.style.width, '1px', 'out of sight again');
  });

  it('names the document after the page it shows', t => {
    const page = open(App, { url: 'http://localhost/#text', t });
    assert.equal(page.document.title, 'Text · rui-show', 'the page it opens on');
    page.click('Button');
    assert.equal(page.document.title, 'Button · rui-show');
    page.window.location.hash = '#box';
    page.window.dispatchEvent(new page.window.HashChangeEvent('hashchange'));
    page.flush();
    assert.equal(page.document.title, 'Box · rui-show', 'a hash change too');
    page.click('First view');
    assert.equal(page.document.title, 'rui-show', 'home');
  });

  it('goes home to a clean URL, with no trailing #', t => {
    const page = open(App, { url: 'http://localhost/?runtime#text', t });
    page.click('First view');
    assert.equal(page.all('[data-page]')[0].getAttribute('data-page'), 'home');
    assert.equal(page.window.location.href, 'http://localhost/?runtime');
  });

  it('follows the hash, and steps to the previous and next page', t => {
    const page = open(App, { url: 'http://localhost/#text', t });
    assert.equal(page.all('[data-page]')[0].getAttribute('data-page'), 'text');
    const i = pages.findIndex(p => p.id === 'text');
    page.click(`Next: ${pages[i + 1].title}`);
    assert.equal(page.all('[data-page]')[0].getAttribute('data-page'), pages[i + 1].id);
    page.click('Previous: Text');
    assert.equal(page.all('[data-page]')[0].getAttribute('data-page'), 'text');
    page.window.location.hash = '#box';
    page.window.dispatchEvent(new page.window.HashChangeEvent('hashchange'));
    page.flush();
    assert.equal(page.all('[data-page]')[0].getAttribute('data-page'), 'box');
  });

  it('filters the sidebar as you search', t => {
    const page = open(App, { t });
    const input = page.all('[data-ren="Edit"]').find(e => e.placeholder === 'Search components (Ctrl K)');
    input.value = 'tiles';
    input.dispatchEvent(new page.window.Event('input', { bubbles: true }));
    page.flush();
    const titles = page.all('[data-ren="Action"]').map(a => a.textContent);
    assert.ok(titles.includes('Tiles') && !titles.includes('Button'));
    input.dispatchEvent(new page.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    page.flush();
    assert.equal(page.all('[data-page]')[0].getAttribute('data-page'), 'tiles');
  });

  it('ranks a search by title: the title itself, its start, inside it, then group or description', t => {
    const titles = (/** @type {string} */ q) => ranked(pages.filter(p => matches(p, q)), q).map(p => p.title);
    assert.equal(titles('table')[0], 'Table', 'the exact title first, over a description that mentions it');
    assert.equal(titles('TABLE ')[0], 'Table', 'case and spaces aside');
    assert.deepEqual(titles('table').slice(0, 2), ['Table', 'DataTable'], 'then a title holding it');
    assert.equal(titles('butt')[0], 'Button', 'a title it starts');
    const page = open(App, { t });
    const input = page.all('[data-ren="Edit"]').find(e => e.placeholder === 'Search components (Ctrl K)');
    input.value = 'table';
    input.dispatchEvent(new page.window.Event('input', { bubbles: true }));
    page.flush();
    input.dispatchEvent(new page.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    page.flush();
    assert.equal(page.all('[data-page]')[0].getAttribute('data-page'), 'table', 'Enter opens the best title match');
    // The Launcher lists the same order.
    page.document.body.dispatchEvent(new page.window.KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
    page.flush();
    const field = page.all('[data-ren="Edit"]').find(e => e.placeholder === 'Search pages...');
    field.value = 'table';
    field.dispatchEvent(new page.window.Event('input', { bubbles: true }));
    page.flush();
    const listed = page.all('[role="option"]').map(o => o.querySelector('[data-ren="Label"]')?.textContent);
    assert.deepEqual(listed.slice(0, 2), ['Table', 'DataTable'], `the Launcher: ${listed.join(', ')}`);
  });

  it('opens a Launcher of every page with Ctrl K, unless a demo took the key', t => {
    const page = open(App, { t });
    const key = () => page.document.body.dispatchEvent(new page.window.KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
    const field = () => page.all('[data-ren="Edit"]').find(e => e.placeholder === 'Search pages...');
    const take = (/** @type {any} */ e) => e.preventDefault();
    page.document.addEventListener('keydown', take);
    key();
    page.flush();
    assert.equal(field() === undefined, true, 'a key a demo took stays its own');
    page.document.removeEventListener('keydown', take);
    key();
    page.flush();
    assert.equal(field() !== undefined, true, 'the Launcher open');
    page.click('Tiles');
    assert.equal(page.all('[data-page]')[0].getAttribute('data-page'), 'tiles');
  });

  it('makes each demo root on the chosen renderer, and keeps the choice', async t => {
    const page = open(App, { url: 'http://localhost/#button', t });
    const count = find('#button')?.demos.length ?? 0;
    const rooted = (/** @type {string} */ prefix) => $roots(page.document).filter(id => id.startsWith(prefix)).length;
    assert.equal(rooted('dom-'), count);
    page.click('Skia');
    await $settle(page.root);
    assert.ok(rooted('skia-') === count && page.all('[data-demo] canvas').length === count, 'a canvas per demo');
    assert.equal(rooted('dom-'), 0, 'the DOM roots are gone');
    page.click('three.js overlay');
    await $settle(page.root);
    assert.ok(rooted('three-') === count && page.all('[data-demo] canvas').length === count);
    page.click('three.js panel');
    await $settle(page.root);
    assert.ok(rooted('panel-') === count && page.all('[data-demo] canvas').length === count);
    assert.equal(page.window.localStorage.getItem('ren:rui-show:renderer'), 'panel');
    page.click('DOM');
    await $settle(page.root);
    assert.ok(rooted('dom-') === count && page.all('[data-demo] canvas').length === 0);
  });
});

describe('a demo\'s data', () => {
  it('shows on demand under the demo, as ren-json gives it, in place of the code', async t => {
    const page = open(App, { url: 'http://localhost/#button', t });
    const code = () => page.all('[data-page] [data-ren="Label"]').some(l => l.textContent.includes('function Demo()'));
    const shown = () => page.all('[data-page] [data-ren="Label"]').map(l => l.textContent).join('\n');
    assert.ok(code(), 'the code first');
    assert.ok(!shown().includes('"role"'), 'no data until asked for');
    page.click('Data');
    await $settle(page.root);
    const text = shown();
    assert.ok(text.includes('"role": "button"'), `the first demo's buttons, by role:\n${text.slice(0, 400)}`);
    page.click('Code');
    assert.ok(!shown().includes('"role"') && code(), 'the code again');
  });

  it('is every demo\'s, JSON through and through', async () => {
    for (const p of pages)
      for (const [i, demo] of p.demos.entries()) {
        const nodes = await dataOf(demo.view);
        assert.ok(Array.isArray(nodes), `${p.id} #${i + 1}: a list of nodes`);
        assert.deepEqual(JSON.parse(JSON.stringify(nodes)), nodes, `${p.id} #${i + 1}: plain JSON`);
      }
  });
});

describe('the theme controls', () => {
  it('restyle the shell and every demo on the DOM', t => {
    const page = open(App, { url: 'http://localhost/#button', t });
    const solid = () => page.all('[data-demo] [data-ren-root] [data-ren="Action"]').find(a => a.textContent === 'solid');
    const surface = () => page.all('[data-demo] [data-ren-root] > [data-ren="View"] > [data-ren="View"]')[0];
    const indigo = BASE_THEME.colors.indigo;
    const purple = BASE_THEME.colors.purple;
    const rgb = (/** @type {string} */ hex) => `rgb(${[1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;
    const bg = (/** @type {any} */ el) => {
      const value = el.style.background || el.style.backgroundColor;
      return value.startsWith('#') ? rgb(value) : value;
    };
    assert.equal(bg(solid()), rgb(indigo[6]));
    assert.equal(bg(surface()), rgb(BASE_THEME.white));
    page.click('Accent color purple');
    assert.equal(bg(solid()), rgb(purple[6]), 'a new accent color, in place');
    assert.equal(page.window.localStorage.getItem('ren:rui-show:accent'), 'purple');
    page.click('Dark');
    assert.equal(bg(solid()), rgb(purple[6]), 'the dark scheme’s accent shade');
    assert.equal(bg(surface()), rgb(BASE_THEME.colors.night[8]), 'the demo’s surface is dark');
    assert.equal(page.document.documentElement.style.getPropertyValue('--rui-body'), BASE_THEME.colors.night[8], 'the page around the shell too');
    assert.equal(page.all('[data-ren="Action"]').find(a => a.textContent === 'Dark')?.getAttribute('aria-checked'), 'true', 'the scheme control (a radio group) shows dark chosen');
    assert.equal(page.window.localStorage.getItem('ren:rui-show:scheme'), 'dark', 'kept for the next visit');
  });

  it('keep the three.js roots over an accent change, and make them again for a new scheme', async t => {
    for (const renderer of ['three.js overlay', 'three.js panel']) {
      const page = open(App, { url: 'http://localhost/#badge', t });
      page.click(renderer);
      await $settle(page.root);
      const before = page.all('[data-demo] canvas');
      assert.ok(before.length > 0, `${renderer}: canvases`);
      page.click('Accent color teal');
      await $settle(page.root);
      const after = page.all('[data-demo] canvas');
      assert.ok(after.length === before.length && after.every((c, i) => c === before[i]), `${renderer}: the same canvases after an accent change`);
      page.click('Dark');
      await $settle(page.root);
      const dark = page.all('[data-demo] canvas');
      assert.ok(dark.length === after.length && dark.every((c, i) => c !== after[i]), `${renderer}: new canvases for the dark scheme`);
    }
  });

  it('restyle a demo on Skia in place', t => {
    // The Themed every demo root renders, its settings from a signal as the root's props give them.
    /** @type {any} */
    let settings = null;
    const skia = onSkia(() => {
      settings = $signal($active(), { scheme: 'light', accent: 'blue' });
      return <Themed view={() => <Button>Go</Button>} settings={() => $read(settings)} width={200} height={80} />;
    }, { t });
    const fills = () => JSON.stringify(skia.commands().filter(c => c[0] === 'rect' || c[0] === 'round'));
    const light = fills();
    assert.equal(skia.text(), 'Go');
    $write(settings, { scheme: 'light', accent: 'purple' });
    const purple = fills();
    assert.notEqual(purple, light, 'a new accent color repaints');
    $write(settings, { scheme: 'dark', accent: 'purple' });
    assert.notEqual(fills(), purple, 'a new scheme repaints');
    assert.equal(skia.text(), 'Go', 'the same view, restyled in place');
  });

  it('clip a demo to its box on the DOM, as its canvas clips it', t => {
    // Content past the demo's width would scroll its stage, whose scrollbar narrows the width every renderer takes.
    const dom = onDom(() => <Themed view={() => <Button>Go</Button>} settings={() => ({ scheme: 'light', accent: 'blue' })} width={200} height={20} />, { t });
    const surface = /** @type {any} */ (dom.host.querySelector('[data-ren="View"] > [data-ren="View"]'));
    assert.equal(surface.style.overflow, 'hidden');
  });

  it('grow a demo past its height with what it holds, and report it for a canvas to follow', t => {
    // On a phone a demo's rows wrap: the stage grows instead of cutting them off, on every renderer.
    /** @type {number[]} */
    const grown = [];
    const settings = () => ({ scheme: /** @type {'light'} */ ('light'), accent: 'blue', grown: (/** @type {number} */ h) => grown.push(h) });
    const tall = () => <Button h={200}>Go</Button>;
    const skia = onSkia(() => <Themed view={tall} settings={settings} width={200} height={40} />, { t });
    skia.text();
    assert.ok(grown.length > 0 && grown.at(-1) >= 232, `the Surface's height reported: ${grown.at(-1)}`);
    const dom = onDom(() => <Themed view={tall} settings={settings} width={200} height={40} />, { t });
    const surface = /** @type {any} */ (dom.host.querySelector('[data-ren="View"] > [data-ren="View"]'));
    assert.equal(surface.style.minHeight, '40px', 'the demo height is its least');
    assert.equal(surface.style.height, '', 'not its height');
  });
});

describe('a three.js panel', () => {
  it('orbits while the backdrop is dragged, and stops once no button is held', t => {
    const window = new Window();
    /** @type {any} */
    let root = null;
    disposeAfter(t, () => (root !== null && $dispose(root), closeWindow(window)));
    const target = window.document.createElement('div');
    window.document.body.appendChild(target);
    const three = $three(THREE, { font, width: 300, height: 200, renderer: { render: () => {}, setSize: () => {}, dispose: () => {} }, camera: { fov: 40, position: [0, 0, 3] } });
    root = Root({ id: 'orbit', target, renderer: three, children: () => <Orbit view={() => <Button>Go</Button>} width={100} height={50} backdrop="#fff" frame="#000" /> });
    // The tilted group's yaw; the canvas's corners show the backdrop.
    const yaw = () => {
      let y = 0;
      three.scene.traverse((/** @type {any} */ o) => void (o.type === 'Group' && o.rotation.y !== 0 && (y = o.rotation.y)));
      return y;
    };
    const at = (/** @type {string} */ type, /** @type {number} */ x, /** @type {number} */ buttons) => three.dispatch(type, x, 5, { clientX: x, clientY: 5, buttons });
    assert.equal(yaw(), -0.3);
    at('pointerdown', 5, 1);
    at('pointermove', 55, 1);
    const turned = yaw();
    assert.ok(turned > -0.3, `dragged: ${turned}`);
    // Released over the plane: the backdrop hears no pointerup, and its next move holds no button.
    at('pointermove', 105, 0);
    at('pointermove', 155, 0);
    assert.equal(yaw(), turned, 'a move with no button held does not orbit');
  });

  it('grows its plane and frame with a demo taller than its height, and tells the stage', t => {
    const window = new Window();
    /** @type {any} */
    let root = null;
    disposeAfter(t, () => (root !== null && $dispose(root), closeWindow(window)));
    const target = window.document.createElement('div');
    window.document.body.appendChild(target);
    const three = $three(THREE, { font, width: 300, height: 200, renderer: { render: () => {}, setSize: () => {}, dispose: () => {} }, camera: { fov: 40, position: [0, 0, 3] } });
    /** @type {number[]} */
    const grown = [];
    // A nested root's Props are its parent's value (here the root is the top one: the value itself).
    const props = { scheme: 'light', accent: 'blue', grown: (/** @type {number} */ h) => grown.push(h) };
    root = Root({ id: 'tall', target, renderer: three, props, children: () => <Orbit view={() => <Button h={200}>Go</Button>} width={100} height={50} backdrop="#fff" frame="#000" /> });
    three.present();
    const panel = /** @type {any} */ ([...three.surfaces].find((/** @type {any} */ s) => s.panel));
    assert.ok(panel.height >= 232, `the plane as high as the demo: ${panel.height}`);
    three.present();
    assert.ok(grown.at(-1) >= 232, `the stage hears it: ${grown}`);
    /** @type {any} */
    let box = null;
    three.scene.traverse((/** @type {any} */ o) => void (o.geometry?.type === 'BoxGeometry' && (box = o.geometry)));
    assert.ok(box.parameters.height >= 2.32 + 0.16 - 1e-9, `the frame follows: ${box.parameters.height}`);
  });
});

describe('the shell on a phone', () => {
  it('opens the pages in a Drawer from a NavToggle, and closes it on the page chosen', t => {
    const page = open(App, { url: 'http://localhost/#button', width: 390, height: 844, t });
    const links = () => page.all('[data-ren="Action"]').filter(a => a.textContent === 'Badge');
    assert.equal(links().length, 0, 'no sidebar');
    assert.equal(page.all('[placeholder="Search components (Ctrl K)"]').length, 0, 'no search in the header');
    page.click('Open the pages');
    assert.equal(links().length, 1, 'the pages, in the Drawer');
    assert.equal(page.all('[placeholder="Search components (Ctrl K)"]').length, 1, 'the search, in the Drawer');
    assert.ok(page.action('Accent color purple'), 'the accent colors, in the Drawer');
    links()[0].click();
    page.flush();
    assert.equal(page.all('[data-page]')[0].getAttribute('data-page'), 'badge');
    assert.equal(links().length, 0, 'the Drawer closed');
  });

  it('takes a phone to be narrower than the theme’s md breakpoint', () => {
    assert.equal(BASE_THEME.breakpoints.md, '60em');
    assert.equal(PHONE, '(max-width: 59.99em)');
  });

  it('keeps the sidebar and the header search on a wide screen', t => {
    const page = open(App, { url: 'http://localhost/#button', t });
    assert.equal(page.all('[data-ren="Action"]').filter(a => a.textContent === 'Badge').length, 1);
    assert.equal(page.all('[aria-label="Open the pages"]').length, 0, 'no NavToggle');
  });
});

describe('every demo', () => {
  for (const p of pages)
    for (const [i, demo] of p.demos.entries())
      it(`${p.id} #${i + 1} (${demo.title}) shows the same text on the DOM and on Skia`, t => {
        // A clock that never moves: animated demos hold still for the comparison.
        const clock = manualClock();
        const View = demo.view;
        const view = () => (
          <Clock value={clock}>
            <Rui>
              <View />
            </Rui>
          </Clock>
        );
        const dom = onDom(view, { height: demo.height ?? 160, t });
        const skia = onSkia(view, { height: demo.height ?? 160, t });
        // A measured view shows its unmeasured state on happy-dom, which lays nothing out.
        if (demo.measured === true && demo.clipped === true) {
          // Skia shows the DOM's text up to its clip, then what the measure adds (an Excerpt's control).
          const d = dom.text().split(' ');
          const k = skia.text().split(' ');
          let n = 0;
          while (n < d.length && n < k.length && d[n] === k[n]) n++;
          assert.ok(n > 0 && k.length - n < n, `Skia's text begins with the DOM's, to its clip, then the measure's:\n  dom : ${dom.text()}\n  skia: ${skia.text()}`);
        } else if (demo.measured === true) assert.ok(skia.text().startsWith(dom.text()), `the DOM's text begins Skia's:\n  dom : ${dom.text()}\n  skia: ${skia.text()}`);
        // An ellipsis cut paints its … on Skia; the DOM draws it outside its text.
        else if (demo.clipped === true) assert.ok(within(letters(skia.text().replaceAll('…', '')), letters(dom.text())), `every letter Skia paints is among the DOM's:\n  dom : ${dom.text()}\n  skia: ${skia.text()}`);
        else if (demo.unordered === true) assert.deepEqual(words(skia.text()), words(dom.text()), 'the same words, painted in another order');
        else assert.equal(skia.text(), dom.text());
        assert.ok(skia.commands().length > 0, 'Skia painted');
        assert.ok(dom.host.querySelector('[data-ren]') !== null, 'the DOM holds primitives');
      });
});

describe('interactive demos', () => {
  /** A page's demo on both renderers, on a clock that moves only when told, disposed after `t`. @param {import('./harness.jsx').Owner} t @param {string} id @param {number} n */
  const both = (t, id, n) => {
    const clock = manualClock();
    const View = /** @type {any} */ (find(`#${id}`)).demos[n].view;
    const view = () => (
      <Clock value={clock}>
        <Rui>
          <View />
        </Rui>
      </Clock>
    );
    const dom = onDom(view, { t });
    const skia = onSkia(view, { t });
    return { clock, dom, skia };
  };

  it('answer the same presses on the DOM and on Skia', t => {
    const { dom, skia } = both(t, 'button', 2);
    for (const r of [dom, skia]) {
      r.press('Add one');
      r.press('Add one');
    }
    assert.ok(dom.text().includes('pressed 2 times'));
    assert.equal(skia.text(), dom.text());
    for (const r of [dom, skia]) r.press('Reset');
    assert.ok(skia.text().includes('pressed 0 times') && dom.text().includes('pressed 0 times'));
  });

  it('set right-to-left text joined on Skia, at the shaped width of its letters', t => {
    const n = /** @type {any} */ (find('#text')).demos.findIndex((/** @type {any} */ d) => d.title.startsWith('Right to left'));
    const { skia } = both(t, 'text', n);
    const sfnt = new Sfnt(font);
    const size = BASE_THEME.fontSizes.md;
    const joined = sfnt.width(ARABIC, size);
    const apart = [...ARABIC].reduce((sum, letter) => sum + sfnt.width(letter, size), 0);
    assert.ok(joined < apart - 20, `the shaper joins the letters: ${joined} of ${apart} apart`);
    assert.ok(skia.text().includes(`${joined.toFixed(1)} px wide`), skia.text());
  });

  it('animate on the Clock, and pause, the same on both', t => {
    const { clock, dom, skia } = both(t, 'motion', 0);
    assert.equal(dom.text(), 'Pause 0%', 'still before the first frame');
    clock.advance(320);
    const moved = dom.text();
    assert.equal(moved, `Pause ${Math.round(((Math.sin(320 / 400) + 1) / 2) * 100)}%`, 'a frame each 16 ms, on the clock');
    assert.equal(skia.text(), moved);
    for (const r of [dom, skia]) r.press('Pause');
    clock.advance(500);
    assert.ok(dom.text().startsWith('Play'));
    assert.equal(skia.text(), dom.text(), 'paused at the same place');
  });
});
