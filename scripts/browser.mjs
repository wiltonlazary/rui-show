// Opens the built rui-show in headless Chrome, both bundles (compiled and
// runtime), and visits the home page and every page on each renderer (DOM,
// Skia, three.js overlay, three.js panel): each demo must have its root, a
// canvas that painted (Skia) or holds a WebGL context (three.js), and the
// theme controls must restyle and remake them, and a demo's Data switch must
// show its ren-json data, and the Grid's first demo must be as high on the
// canvases as on the DOM (no row wraps), and the Button page must print on
// more than one sheet, its content within the sheet's width (DOM and Skia),
// and its props table within the content, and the Text page's right-to-left
// line as wide on the canvases as on the DOM (the shaper loaded). Then, as a phone (390 x 844,
// touch), every page must fit its width (no sideways scroll of the page or
// its content; canvases sized, not scaled) and the NavToggle must open the
// pages in a Drawer that choosing one closes. The keyboard's Tab reaches the
// skip link first and its Enter focuses the main region. Real drags on the DOM, as a
// hand makes them (CDP input): a mouse swipe over a Carousel's image moves
// it (no native image drag takes the pointer), and a touch drag moves a Slider
// on the DOM, and on Skia and the three.js overlay keeps the touch (no
// pointercancel, no pan); a right press on the
// ContextMenu demo opens the app's own menu on the DOM and cancels the
// browser's on the canvases. Any page error, console error or console
// warning (WebGL's included) fails the run.
//
//   npm run browser -- [--only compiled|runtime] [--pages button,text] [--renderers dom,skia]
//
// Run scripts/build.mjs first. `npm run browser` takes the machine-wide
// Chrome lock (flock "$HOME/.cache/chrome-bench.lock" node scripts/browser.mjs):
// only one Chrome runs at a time; never nest it in another
// flock. Never under ulimit -v. To stop a run, signal the node process
// (SIGINT or SIGTERM): it stops Chrome's group and removes its folders.
// flock does not pass a signal on, so one sent to flock's (or npm's) pid
// leaves node and Chrome running; Ctrl C in a terminal reaches the whole
// foreground group, node included.

import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { start } from './serve.mjs';
import { ids } from './pages.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
/** @param {string} name */
const option = name => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1].split(',') : null);
const only = option('only');
const modes = ['compiled', 'runtime'].filter(m => only === null || only.includes(m));
const chosen = option('pages');
const pages = ['home', ...ids()].filter(id => chosen === null || chosen.includes(id));
const renderers = ['dom', 'skia', 'three', 'panel'].filter(r => option('renderers') === null || /** @type {string[]} */ (option('renderers')).includes(r));
/** The renderer switch's labels (src/site.js RENDERERS). */
const NAMES = /** @type {Record<string, string>} */ ({ dom: 'DOM', skia: 'Skia', three: 'three.js overlay', panel: 'three.js panel' });

const chrome = ['google-chrome', 'chromium', 'chromium-browser'].find(name => {
  try {
    execFileSync('which', [name], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
});
if (!chrome) throw new Error('Chrome or Chromium is required');

/** How long one DevTools call may take, ms: a page check's own waits are 20 s each; a Chrome that stops answering fails the run. */
const CALL_DEADLINE = 180000;

/** A minimal DevTools protocol session over a page's WebSocket. @param {string} url */
async function devtools(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  let id = 0;
  /** @type {Map<number, { resolve: (message: any) => void, reject: (error: Error) => void, timer: NodeJS.Timeout }>} */
  const calls = new Map();
  /** @type {((message: any) => void)[]} */
  const listeners = [];
  /** Why the session ended (Chrome went away), null while open. @type {Error | null} */
  let ended = null;
  socket.onmessage = event => {
    const message = JSON.parse(String(event.data));
    const call = message.id ? calls.get(message.id) : undefined;
    if (call !== undefined) {
      clearTimeout(call.timer);
      calls.delete(message.id);
      call.resolve(message);
    } else for (const listen of listeners) listen(message);
  };
  /** Fails every call still waiting: no answer comes on a closed socket. @param {Error} error */
  const end = error => {
    ended ??= error;
    for (const call of calls.values()) {
      clearTimeout(call.timer);
      call.reject(error);
    }
    calls.clear();
  };
  socket.onclose = () => end(new Error('the DevTools connection closed: Chrome went away'));
  socket.onerror = () => end(new Error('the DevTools connection failed: Chrome went away'));
  return {
    /** @param {string} method @param {object} [params] @returns {Promise<any>} */
    send: (method, params = {}) =>
      new Promise((resolve, reject) => {
        if (ended !== null) return reject(ended);
        const call = ++id;
        // timer: deadline, a call Chrome never answers fails the run.
        const timer = setTimeout(() => {
          calls.delete(call);
          reject(new Error(`${method} got no answer in ${CALL_DEADLINE / 1000} s`));
        }, CALL_DEADLINE);
        calls.set(call, { resolve, reject, timer });
        socket.send(JSON.stringify({ id: call, method, params }));
      }),
    /** @param {(message: any) => void} listen */
    on: listen => void listeners.push(listen),
    close: () => socket.close(),
  };
}

// The in-page checks, installed once as globalThis.ruiCheck.
const PAGE = String.raw`globalThis.ruiCheck = (() => {
const wait = async (check, ms = 20000, what = String(check)) => {
  // timer: poll, the page's state (a painted canvas, a node) has no event; bounded, it throws.
  for (const end = performance.now() + ms; performance.now() < end; await new Promise(r => setTimeout(r, 25))) {
    const value = check();
    if (value) return value;
  }
  throw new Error('timed out waiting for ' + what);
};
// The Actions (a SegmentedControl's segments too).
const actions = () => [...document.querySelectorAll('[data-ren-root="rui-show"] [data-ren="Action"]')];
const action = label => actions().find(b => b.textContent === label || b.getAttribute('aria-label') === label);
const press = async label => (await wait(() => action(label), 20000, 'the action ' + label)).click();
// Whether a canvas shows more than one color (it painted something), copied
// small into a canvas of our own made for reading.
const probe = document.createElement('canvas');
probe.width = probe.height = 48;
const reader = probe.getContext('2d', { willReadFrequently: true });
const painted = canvas => {
  reader.clearRect(0, 0, 48, 48);
  reader.drawImage(canvas, 0, 0, 48, 48);
  const { data } = reader.getImageData(0, 0, 48, 48);
  const first = data[0] | (data[1] << 8) | (data[2] << 16);
  for (let i = 0; i < data.length; i += 4) if ((data[i] | (data[i + 1] << 8) | (data[i + 2] << 16)) !== first) return true;
  return false;
};
// Every demo on the page rendered on its renderer.
const rendered = async (id, renderer) => {
  const article = await wait(() => document.querySelector('[data-page="' + id + '"]'), 20000, 'the page ' + id);
  const count = Number(article.getAttribute('data-demos'));
  const stages = await wait(() => { const s = [...article.querySelectorAll('[data-demo]')]; return s.length === count && s; }, 20000, count + ' demos on ' + id);
  const out = [];
  for (const stage of stages) {
    const kind = stage.getAttribute('data-renderer');
    if (id !== 'home' && kind !== renderer) throw new Error('demo ' + stage.getAttribute('data-demo') + ' is on ' + kind + ', not ' + renderer);
    const host = await wait(() => stage.querySelector('[data-ren-root^="' + kind + '-"]'), 20000, 'the root of demo ' + stage.getAttribute('data-demo'));
    if (kind === 'dom') {
      await wait(() => host.querySelector('[data-ren]'), 20000, 'primitives in ' + host.getAttribute('data-ren-root'));
      // Laid out as the canvases lay it out: every container a flex or grid box, or none (a boxless table row).
      const loose = [...host.querySelectorAll('[data-ren="View"], [data-ren="Scroll"]')].find(v => !/^(flex|grid|none|contents)$/.test(getComputedStyle(v).display));
      if (loose) throw new Error('a container displays as ' + getComputedStyle(loose).display + ' in ' + host.getAttribute('data-ren-root'));
      out.push('dom');
    } else if (kind === 'skia') {
      // ren-skia makes its canvas in the root's host element.
      const canvas = await wait(() => host.querySelector('canvas'), 20000, 'a canvas for ' + host.getAttribute('data-ren-root'));
      await wait(() => canvas.width > 0 && painted(canvas), 20000, 'paint on ' + host.getAttribute('data-ren-root'));
      out.push('skia ' + canvas.width + 'x' + canvas.height);
    } else {
      const canvas = await wait(() => host.querySelector('canvas'), 20000, 'a canvas in ' + host.getAttribute('data-ren-root'));
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      if (gl === null || gl.isContextLost()) throw new Error('no live WebGL context in ' + host.getAttribute('data-ren-root'));
      out.push(kind + ' ' + canvas.width + 'x' + canvas.height);
    }
  }
  return out;
};
const summary = list => { const n = {}; for (const k of list) n[k] = (n[k] ?? 0) + 1; return Object.entries(n).map(([k, v]) => v + ' ' + k).join(', '); };
async function visit(id, renderer) {
  location.hash = id === 'home' ? '' : '#' + id;
  if (id !== 'home' && renderer !== null) {
    await wait(() => document.querySelector('[data-page="' + id + '"]'), 20000, 'the page ' + id);
    const label = ${JSON.stringify(NAMES)}[renderer];
    const button = action(label);
    if (button) button.click();
  }
  return summary(await rendered(id, renderer));
}
// The theme controls on a page: a new accent color and scheme restyle the
// demos (DOM and Skia in place; three.js roots made again) and come back.
async function theme(id, renderer) {
  await visit(id, renderer);
  const out = [];
  const html = document.documentElement;
  await press('Accent color purple');
  await press('Dark');
  await wait(() => html.getAttribute('data-scheme') === 'dark', 20000, 'the dark scheme');
  out.push(summary(await rendered(id, renderer)) + ' dark');
  // The demo's Surface, in the View that measures it.
  const stage = document.querySelector('[data-demo] [data-ren-root] > [data-ren="View"] > [data-ren="View"]');
  const body = html.style.getPropertyValue('--rui-body').trim();
  const want = 'rgb(' + [1, 3, 5].map(i => parseInt(body.slice(i, i + 2), 16)).join(', ') + ')';
  if (renderer === 'dom' && getComputedStyle(stage).backgroundColor !== want) throw new Error('the demo surface is ' + getComputedStyle(stage).backgroundColor + ' in the dark scheme');
  await press('Light');
  await press('Accent color indigo');
  await wait(() => html.getAttribute('data-scheme') === 'light', 20000, 'the light scheme');
  out.push(summary(await rendered(id, renderer)) + ' light');
  return out.join(' | ');
}
// A page's first demo as high on a canvas as on the DOM: laid out alike (a
// Grid's span 8 and span 4 share a row, none wraps under another).
async function alike(id, renderer) {
  await visit(id, 'dom');
  const dom = await wait(() => document.querySelector('[data-page] [data-demo] [data-ren-root^="dom-"]'), 20000, 'the DOM root on ' + id);
  const high = dom.getBoundingClientRect().height;
  await visit(id, renderer);
  const canvas = await wait(() => document.querySelector('[data-page] [data-demo] [data-ren-root^="' + renderer + '-"] canvas'), 20000, 'the ' + renderer + ' canvas on ' + id);
  const drawn = () => canvas.getBoundingClientRect().height;
  await wait(() => Math.abs(drawn() - high) <= 2, 3000, 'the same height').catch(() => {
    throw new Error('the demo is ' + drawn() + ' high on ' + renderer + ', ' + high + ' on the DOM');
  });
  return 'as high as on the DOM, ' + Math.round(high);
}
// The Text page's right-to-left line as wide on a canvas as on the DOM, within
// a pixel: the canvas shaped it with HarfBuzz (harfbuzz.wasm, loaded beside the
// page) as Chrome shapes the DOM's; by the typeface's advances, its letters set
// apart, it is a third wider. Each demo shows the width it laid out.
async function shaped(renderer) {
  const wide = async r => {
    await visit('text', r);
    const root = await wait(() => [...document.querySelectorAll('[data-page] [data-demo] [data-ren-root^="' + r + '-"]')].find(n => / px wide/.test(n.textContent)), 20000, 'the right-to-left line measured on ' + r);
    return () => Number(/([0-9.]+) px wide/.exec(root.textContent)?.[1] ?? NaN);
  };
  const drawn = (await wide(renderer))();
  await document.fonts.ready;
  const dom = await wide('dom');
  await wait(() => Math.abs(dom() - drawn) <= 1, 3000, 'the same width').catch(() => {
    throw new Error('the right-to-left line is ' + drawn + ' wide on ' + renderer + ', ' + dom() + ' on the DOM: not shaped as the browser shapes it');
  });
  return 'as wide as on the DOM, ' + drawn + ' and ' + dom();
}
// A demo's Data switch: its ren-json data in place of its code, then the code again.
async function data(id) {
  await visit(id, 'dom');
  await press('Data');
  const shown = () => document.querySelector('[data-page]').innerText;
  await wait(() => shown().includes('"role": "button"'), 20000, 'the data of ' + id);
  await press('Code');
  await wait(() => !shown().includes('"role": "button"'), 20000, 'the code again');
  return 'its buttons by role, then the code';
}
// A page on a phone: it fits the width, the page and its content area
// scroll only down, and canvases are made at their size (not scaled by CSS).
async function phone(id, renderer) {
  const out = await visit(id, renderer);
  const vw = document.documentElement.clientWidth;
  if (document.scrollingElement.scrollWidth > vw + 1) throw new Error('the page is ' + document.scrollingElement.scrollWidth + ' wide on a phone ' + vw + ' wide');
  const content = [...document.querySelectorAll('[data-ren-root="rui-show"] [data-ren="Scroll"]')].find(s => s.querySelector('[data-page]'));
  const fits = () => content === undefined || content.scrollWidth <= content.clientWidth + 1;
  await wait(fits, 3000, 'the content to fit').catch(() => {
    throw new Error('the content scrolls sideways: ' + content.scrollWidth + ' in ' + content.clientWidth);
  });
  const scale = Math.min(2, devicePixelRatio);
  const off = () => [...document.querySelectorAll('[data-demo] canvas')].find(canvas => {
    const r = canvas.getBoundingClientRect();
    return Math.abs(canvas.width - r.width * scale) > 2 || Math.abs(canvas.height - r.height * scale) > 2;
  });
  await wait(() => off() === undefined, 3000, 'the canvases to match their boxes').catch(() => {
    const canvas = off();
    const r = canvas.getBoundingClientRect();
    throw new Error('a canvas ' + canvas.width + 'x' + canvas.height + ' shows at ' + r.width + 'x' + r.height);
  });
  return out + ', fits ' + vw;
}
// The pages on a phone: the NavToggle opens them in a Drawer, choosing one goes there and closes it.
async function drawer() {
  location.hash = '#button';
  await wait(() => document.querySelector('[data-page="button"]'), 20000, 'the page button');
  const links = () => actions().filter(a => a.textContent === 'Badge' && a.getBoundingClientRect().width > 0);
  if (links().length > 0) throw new Error('the pages show without the NavToggle');
  await press('Open the pages');
  const link = await wait(() => links()[0], 20000, 'the pages in the Drawer');
  if (link.getBoundingClientRect().right > document.documentElement.clientWidth) throw new Error('the Drawer passes the screen');
  link.click();
  await wait(() => document.querySelector('[data-page="badge"]'), 20000, 'the chosen page');
  await wait(() => links().length === 0, 20000, 'the Drawer to close');
  return 'opened, chose Badge, closed';
}
// What took the pointer from a drag: a native drag (not canceled) or a pointercancel.
const taken = [];
document.addEventListener('dragstart', e => e.defaultPrevented || taken.push('a native drag of ' + (e.target.localName ?? 'text')));
document.addEventListener('pointercancel', () => taken.push('a pointercancel'));
// The page's scroll and its content's, to tell a pan.
const scrolled = () => [scrollY, ...[...document.querySelectorAll('[data-ren-root="rui-show"] [data-ren="Scroll"]')].map(s => s.scrollTop + ',' + s.scrollLeft)].join(' ');
let before = '';
// A demo's element in view: its center, for a drag to start at; found on
// the DOM, and on a canvas at the same offset in its root (every renderer
// lays the demo out alike).
async function aim(id, selector, renderer = 'dom') {
  await visit(id, 'dom');
  const dom = await wait(() => document.querySelector('[data-page] [data-demo] [data-ren-root^="dom-"]'), 20000, 'the DOM root on ' + id);
  const node = await wait(() => dom.querySelector(selector), 20000, selector + ' on ' + id);
  node.scrollIntoView({ block: 'center' });
  const n = node.getBoundingClientRect();
  const d = dom.getBoundingClientRect();
  let x = n.x + n.width / 2;
  let y = n.y + n.height / 2;
  if (renderer !== 'dom') {
    await visit(id, renderer);
    const root = await wait(() => document.querySelector('[data-page] [data-demo] [data-ren-root^="' + renderer + '-"]'), 20000, 'the ' + renderer + ' root on ' + id);
    root.scrollIntoView({ block: 'center' });
    const r = root.getBoundingClientRect();
    x += r.x - d.x;
    y += r.y - d.y;
  }
  taken.length = 0;
  before = scrolled();
  return [Math.round(x), Math.round(y)];
}
// After a touch drag: nothing panned the page or its content.
const still = () => {
  const now = scrolled();
  if (now !== before) throw new Error('the page panned: ' + before + ' to ' + now);
  return true;
};
// Whether each contextmenu event was canceled, by the time it reached the window.
const menus = [];
addEventListener('contextmenu', e => menus.push(e.defaultPrevented ? true : 'not canceled on ' + (e.target.localName ?? '?') + '.' + (e.target.className ?? '') + ' ' + (e.target.closest?.('[data-ren-root]')?.getAttribute('data-ren-root') ?? 'outside a root') + ' at ' + e.clientX + ',' + e.clientY));
// A point on the text of page id's first demo that says 'Right-click here', on renderer: found on the DOM, then
// taken to the renderer's root at the same offset (every renderer lays the demo out alike), in view.
async function point(id, renderer) {
  const rooted = async r => {
    await visit(id, r);
    const root = await wait(() => document.querySelector('[data-page] [data-demo] [data-ren-root^="' + r + '-"]'), 20000, 'the ' + r + ' root on ' + id);
    root.scrollIntoView({ block: 'center' });
    return root;
  };
  const dom = await rooted('dom');
  const text = [...dom.querySelectorAll('*')].find(n => n.childElementCount === 0 && n.textContent.includes('Right-click here'));
  if (!text) throw new Error('no Right-click text on ' + id);
  const t = text.getBoundingClientRect();
  const d = dom.getBoundingClientRect();
  const dx = t.x + t.width / 2 - d.x;
  const dy = t.y + t.height / 2 - d.y;
  const root = renderer === 'dom' ? dom : await rooted(renderer);
  menus.length = 0;
  const r = root.getBoundingClientRect();
  return [Math.round(r.x + dx), Math.round(r.y + dy)];
}
// After a right press: the browser's menu stayed away, and on the DOM the app's own opened.
async function menued(renderer) {
  await wait(() => menus.length > 0, 3000, 'a contextmenu event');
  const open = menus.filter(m => m !== true);
  if (open.length > 0) throw new Error("the browser's own menu: " + open.join('; '));
  if (renderer === 'dom') await wait(() => [...document.querySelectorAll('[role="menu"]')].some(m => m.textContent.includes('Rename')), 3000, "the app's menu");
  return renderer === 'dom' ? "the app's menu, not the browser's" : "the browser's menu canceled";
}
// After a drag: nothing took its pointer, and the demo shows the check's answer.
async function dragged(check) {
  if (taken.length > 0) throw new Error(taken.join(', ') + ' took the pointer');
  const out = await wait(check, 3000, String(check));
  return String(out);
}
// The page as printed on a sheet width px wide (the print media already on): laid out at that width at once,
// before a resize can re-measure anything (printing measures nothing again), every box of the content within
// it, a code line wrapped inside its block. Then the screen's width again.
function printed(width) {
  const html = document.documentElement;
  html.style.width = width + 'px';
  try {
    const main = document.querySelector('[role="main"]');
    const past = [];
    for (const n of main.querySelectorAll('*')) {
      const r = n.getBoundingClientRect();
      // Off the sheet on purpose: a canvas's accessibility mirror, a native entry (to the left, or 1 px).
      if (r.width <= 1 || r.right <= 0) continue;
      if (r.right > width + 1) past.push((n.dataset.ren ?? n.tagName) + (n.getAttribute('role') ? '[' + n.getAttribute('role') + ']' : '') + ' ' + JSON.stringify((n.textContent ?? '').slice(0, 30)) + ' to ' + Math.round(r.right));
      else if (n.dataset.ren === 'Label' && n.scrollWidth > n.clientWidth + 1) past.push('Label ' + JSON.stringify(n.textContent.slice(0, 30)) + ' cut at ' + n.clientWidth + ' of ' + n.scrollWidth);
    }
    if (past.length > 0) throw new Error(past.length + ' boxes past a ' + width + ' px sheet: ' + past.slice(0, 6).join('; '));
    return 'within ' + width + ' px';
  } finally {
    html.style.width = '';
  }
}
// A page's props table on the screen: within the content, its code inside its cells (a column keeps its widest
// word, a type wraps at its spaces).
async function props(id) {
  await visit(id, 'dom');
  const table = await wait(() => document.querySelector('[role="main"] [role="table"]'), 20000, 'the props table');
  const main = document.querySelector('[role="main"]');
  if (table.getBoundingClientRect().right > main.getBoundingClientRect().right + 1 || main.scrollWidth > main.clientWidth + 1) throw new Error('the props table passes the content: ' + Math.round(table.getBoundingClientRect().width) + ' px');
  const past = [];
  for (const cell of table.querySelectorAll('[role="cell"]')) {
    const r = cell.getBoundingClientRect();
    for (const label of cell.querySelectorAll('[data-ren="Label"]')) if (label.getBoundingClientRect().right > r.right + 0.5 || label.scrollWidth > label.clientWidth + 1) past.push(label.textContent.slice(0, 30));
  }
  if (past.length > 0) throw new Error(past.length + ' labels past their cells: ' + past.slice(0, 4).join(' / '));
  return 'within ' + Math.round(table.getBoundingClientRect().width) + ' px';
}
// The element focused, for a report.
const focusedName = () => {
  const a = document.activeElement;
  return a === null || a === document.body ? 'nothing' : (a.dataset?.ren ?? a.tagName) + ' ' + JSON.stringify((a.getAttribute('aria-label') ?? a.textContent ?? '').slice(0, 30));
};
// The skip link: the first Tab stop of a page just loaded (on the DOM, as visited before the load), nothing focused.
async function skipLink(id) {
  await wait(() => document.querySelector('[data-page="' + id + '"]'), 20000, 'the page ' + id);
  if (document.activeElement !== null && document.activeElement !== document.body) throw new Error('loaded with ' + focusedName() + ' focused');
  return 'nothing focused';
}
// After Tab, the skip link has the focus; after Enter on it, the main region (out of the Tab order) has it.
async function skipFocused() {
  try {
    await wait(() => document.activeElement?.textContent === 'Skip to content', 3000, 'the skip link focused by Tab');
  } catch {
    throw new Error('Tab focused ' + focusedName() + ', not the skip link');
  }
  return 'the skip link focused';
}
async function skipped() {
  const main = await wait(() => (document.activeElement?.getAttribute('role') === 'main' ? document.activeElement : null), 3000, 'the main region focused by the skip link');
  if (main.getAttribute('tabindex') !== '-1') throw new Error('the main region is in the Tab order: tabindex ' + main.getAttribute('tabindex'));
  return 'the main region focused, out of the Tab order';
}
return { wait, visit, theme, data, alike, shaped, phone, drawer, aim, still, dragged, point, menued, printed, props, skipLink, skipFocused, skipped };
})();
`;

/**
 * The Chrome running now: its process (the leader of its own group), its
 * profile and temp folders, its exit, and its stop once asked for.
 * @typedef {{ browser: import('node:child_process').ChildProcess, profile: string, temp: string, exited: Promise<unknown>, done: Promise<void> | null }} Running
 */
/** @type {Running | null} */
let running = null;

/** Whether any process of a group is left. @param {number} group */
const alive = group => {
  try {
    process.kill(-group, 0);
    return true;
  } catch {
    return false;
  }
};

/** Stops Chrome's whole group (SIGTERM, then SIGKILL) and removes its folders; one stop per Chrome, however often asked. */
function stop() {
  const r = running;
  if (r === null) return Promise.resolve();
  r.done ??= (async () => {
    const group = /** @type {number} */ (r.browser.pid);
    const signal = (/** @type {NodeJS.Signals} */ name) => {
      try {
        process.kill(-group, name);
      } catch {}
    };
    signal('SIGTERM');
    // timer: deadline, Chrome gets 2 s to exit on SIGTERM before the kill.
    await Promise.race([r.exited, new Promise(resolve => setTimeout(resolve, 2000))]);
    signal('SIGKILL');
    await r.exited;
    // Its other processes (renderers, GPU) go with the group; a bounded wait, then the folders whatever is left.
    for (let i = 0; i < 100 && alive(group); i++) await new Promise(resolve => setTimeout(resolve, 20)); // timer: poll, a group's end has no event
    rmSync(r.profile, { recursive: true, force: true });
    rmSync(r.temp, { recursive: true, force: true });
    if (running === r) running = null;
  })();
  return r.done;
}

/** @type {import('node:http').Server | null} */
let server = null;
/** Set once the run is being stopped (a signal, an error): the stop owns the exit. */
let stopping = false;
/** Stops Chrome, removes its folders, closes the server and exits with `code`. @param {string} why @param {number} code */
async function abort(why, code) {
  if (stopping) return;
  stopping = true;
  console.error(`browser check: stopped: ${why}`);
  try {
    await stop();
  } finally {
    server?.close();
    process.exit(code);
  }
}
// A signal or an error no try took: Chrome's detached group, its profile and its temp folder go too.
process.on('SIGINT', () => void abort('SIGINT', 130));
process.on('SIGTERM', () => void abort('SIGTERM', 143));
process.on('SIGHUP', () => void abort('SIGHUP', 129));
process.on('uncaughtException', error => void abort(String(error?.stack ?? error), 1));
process.on('unhandledRejection', error => void abort(String(/** @type {any} */ (error)?.stack ?? error), 1));

const artifact = existsSync(join(root, 'artifact')) ? join(root, 'artifact') : null;
const base = process.env.TMPDIR || (artifact === null ? tmpdir() : join(artifact, 'tmp'));
mkdirSync(base, { recursive: true });
server = await start();
const port = /** @type {import('node:net').AddressInfo} */ (server.address()).port;
let failed = 0;
let visits = 0;
try {
  for (const mode of modes) {
    const profile = mkdtempSync(join(base, 'rui-show-chrome-'));
    // Chrome's own temp folder (its singleton socket's com.google.Chrome.XXXXXX, which a Chrome stopped by a signal
    // leaves behind): one per run, removed with the profile. It stays short, as a socket's path must be.
    const temp = mkdtempSync(join(tmpdir(), 'rui-show-'));
    // No --disable-gpu: the page composites on SwiftShader, as on a GPU. With a
    // software compositor every WebGL frame shown is read back ("GPU stall due
    // to ReadPixels" warnings on each three.js canvas), which a GPU never does.
    // --disable-ipc-flooding-protection: the check changes the hash for every
    // page on every renderer, one after another as each is seen rendered, far
    // faster than a person does; Chrome would throttle those navigations.
    const browser = spawn(
      chrome,
      ['--headless=new', '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage', '--no-first-run', '--disable-extensions', '--disable-ipc-flooding-protection', '--js-flags=--max-old-space-size=1024', `--user-data-dir=${profile}`, '--window-size=1280,900', '--remote-debugging-port=0', 'about:blank'],
      { stdio: ['ignore', 'ignore', 'pipe'], detached: true, env: { ...process.env, TMPDIR: temp } },
    );
    running = { browser, profile, temp, exited: new Promise(resolve => browser.once('exit', resolve)), done: null };
    try {
      const endpoint = await new Promise((resolve, reject) => {
        let log = '';
        const timer = setTimeout(() => reject(new Error('Chrome did not start')), 20000); // timer: deadline
        browser.on('exit', code => reject(new Error(`Chrome exited (${code}): ${log.slice(-800)}`)));
        browser.stderr.on('data', chunk => {
          log += chunk;
          const match = /DevTools listening on (ws:\/\/\S+)/.exec(log);
          if (match) {
            clearTimeout(timer);
            resolve(match[1]);
          }
        });
      });
      const http = String(endpoint).replace(/^ws:\/\/([^/]+)\/.*$/, 'http://$1');
      const target = (await (await fetch(`${http}/json/list`)).json()).find((/** @type {any} */ t) => t.type === 'page');
      const cdp = await devtools(target.webSocketDebuggerUrl);
      /** Page errors, console errors and console warnings, WebGL's included. @type {string[]} */
      const problems = [];
      cdp.on(message => {
        const p = message.params;
        if (message.method === 'Runtime.exceptionThrown') problems.push(`exception: ${p.exceptionDetails.exception?.description ?? p.exceptionDetails.text}`);
        if (message.method === 'Runtime.consoleAPICalled' && (p.type === 'error' || p.type === 'warning' || p.type === 'assert')) problems.push(`console.${p.type}: ${p.args.map((/** @type {any} */ a) => a.value ?? a.description).join(' ')}`);
        if (message.method === 'Log.entryAdded' && (p.entry.level === 'error' || p.entry.level === 'warning')) problems.push(`${p.entry.source} ${p.entry.level}: ${p.entry.text} ${p.entry.url ?? ''}`);
      });
      await cdp.send('Runtime.enable');
      await cdp.send('Log.enable');
      await cdp.send('Page.enable');
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/${mode === 'runtime' ? '?runtime' : ''}` });
      const ready = await cdp.send('Runtime.evaluate', { expression: `${PAGE}; ruiCheck.wait(() => document.querySelector('[data-page]')).then(() => true)`, awaitPromise: true, returnByValue: true });
      if (ready.result.exceptionDetails) throw new Error(`page did not start: ${JSON.stringify(ready.result.exceptionDetails)}`);
      /** Runs one check and reports it. @param {string} label @param {string} expression */
      const run = async (label, expression) => {
        const before = problems.length;
        const result = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        const thrown = result.result.exceptionDetails;
        const report = thrown ? `FAILED ${thrown.exception?.description ?? thrown.text}` : result.result.result.value;
        const found = problems.slice(before);
        const ok = !thrown && found.length === 0;
        visits++;
        if (!ok) failed++;
        console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(26)} ${report}${found.length ? `\n       ${found.join('\n       ')}` : ''}`);
      };
      console.log(`${mode}: ${pages.length} pages x ${renderers.length} renderers`);
      for (const renderer of renderers) for (const id of pages) if (id !== 'home' || renderer === renderers[0]) await run(`${renderer} ${id}`, `ruiCheck.visit(${JSON.stringify(id)}, ${JSON.stringify(renderer)})`);
      const themed = pages.find(id => id === 'button') ?? pages.find(id => id !== 'home');
      if (themed !== undefined) for (const renderer of renderers) await run(`theme ${renderer} ${themed}`, `ruiCheck.theme(${JSON.stringify(themed)}, ${JSON.stringify(renderer)})`);
      if (pages.includes('button')) await run('data button', `ruiCheck.data('button')`);
      if (pages.includes('button') && renderers.includes('dom')) await run('props button', `ruiCheck.props('button')`);
      // Printed, a page takes as many sheets as its content: src/app.css's print rules release the shell's
      // viewport heights (one sheet, the first screen, without them), and its content fits the sheet's width: a
      // demo's stage measured on the screen (a DOM Surface, a canvas) and its code lines (cut on the right
      // without them). Letter, 0.4 in margins: 7.7 in, 739 px, across.
      if (pages.includes('button')) {
        for (const renderer of renderers.filter(r => r === 'dom' || r === 'skia')) {
          const shown = await cdp.send('Runtime.evaluate', { expression: `ruiCheck.visit('button', ${JSON.stringify(renderer)})`, awaitPromise: true, returnByValue: true });
          await cdp.send('Emulation.setEmulatedMedia', { media: 'print' });
          await run(`print width ${renderer} button`, shown.result.exceptionDetails ? `Promise.reject(new Error('the page did not show'))` : `ruiCheck.printed(739)`);
          await cdp.send('Emulation.setEmulatedMedia', { media: '' });
          const pdf = shown.result.exceptionDetails ? null : await cdp.send('Page.printToPDF', { paperWidth: 8.5, paperHeight: 11, marginLeft: 0.4, marginRight: 0.4 });
          const sheets = pdf === null ? 0 : (Buffer.from(pdf.result.data, 'base64').toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
          await run(`print ${renderer} button`, sheets > 1 ? `'${sheets} sheets'` : `Promise.reject(new Error('printed on ${sheets} sheet(s)'))`);
        }
      }
      // The skip link, by the keyboard (CDP input): Tab from nothing focused reaches it first, Enter moves the focus
      // to the main region.
      if (pages.includes('button') && renderers.includes('dom')) {
        /** A key pressed and released. @param {string} key @param {string} code @param {number} vk @param {string} [text] */
        const keyPress = async (key, code, vk, text) => {
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: vk, ...(text === undefined ? null : { text }) });
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk });
        };
        // The page has the focus, as a window the user types in; loaded again, Tab starts from the document's start.
        await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
        await cdp.send('Runtime.evaluate', { expression: `ruiCheck.visit('button', 'dom')`, awaitPromise: true, returnByValue: true });
        await cdp.send('Page.reload');
        const reloaded = await cdp.send('Runtime.evaluate', { expression: `${PAGE}; ruiCheck.wait(() => document.querySelector('[data-page]')).then(() => true)`, awaitPromise: true, returnByValue: true });
        if (reloaded.result.exceptionDetails) throw new Error(`page did not start again: ${JSON.stringify(reloaded.result.exceptionDetails)}`);
        await run('skip link start', `ruiCheck.skipLink('button')`);
        await keyPress('Tab', 'Tab', 9);
        await run('skip link tab', `ruiCheck.skipFocused()`);
        await keyPress('Enter', 'Enter', 13, '\r');
        await run('skip link enter', `ruiCheck.skipped()`);
        await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: false });
      }
      // The Grid's rows on the canvases as on the DOM: percent columns that fill a row stay on it.
      if (pages.includes('grid')) for (const renderer of renderers.filter(r => r === 'skia' || r === 'three')) await run(`alike ${renderer} grid`, `ruiCheck.alike('grid', ${JSON.stringify(renderer)})`);
      // The shaper loaded: right-to-left text joined on the canvases, as wide as on the DOM.
      if (pages.includes('text') && renderers.includes('dom')) for (const renderer of renderers.filter(r => r === 'skia' || r === 'three')) await run(`shaped ${renderer} text`, `ruiCheck.shaped(${JSON.stringify(renderer)})`);
      /**
       * A drag on a demo as a hand makes it, from the center of the first
       * `selector` on page `id` (on the DOM; the same place on a canvas) by
       * (dx, dy), with the mouse or a touch; then `check` (a page expression)
       * must come true.
       * @param {string} id @param {string} selector @param {number} dx @param {number} dy @param {boolean} touch @param {string} check @param {string} [renderer]
       */
      const gesture = async (id, selector, dx, dy, touch, check, renderer = 'dom') => {
        if (!pages.includes(id) || !renderers.includes('dom') || !renderers.includes(renderer)) return;
        const label = `${touch ? 'touch' : 'mouse'} drag ${renderer === 'dom' ? '' : renderer + ' '}${id}`;
        const aimed = await cdp.send('Runtime.evaluate', { expression: `ruiCheck.aim(${JSON.stringify(id)}, ${JSON.stringify(selector)}, ${JSON.stringify(renderer)})`, awaitPromise: true, returnByValue: true });
        if (aimed.result.exceptionDetails) return run(label, `Promise.reject(new Error(${JSON.stringify(aimed.result.exceptionDetails.exception?.description ?? 'no aim')}))`);
        const [x, y] = aimed.result.result.value;
        const steps = 12;
        if (touch) {
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
          for (let i = 1; i <= steps; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + (dx * i) / steps, y: y + (dy * i) / steps }] });
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        } else {
          await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
          await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 });
          for (let i = 1; i <= steps; i++) await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x + (dx * i) / steps, y: y + (dy * i) / steps, button: 'left', buttons: 1 });
          await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x + dx, y: y + dy, button: 'left', buttons: 0, clickCount: 1 });
        }
        await run(label, `ruiCheck.dragged(${check})`);
      };
      // The picture carousel: a swipe over its image moves it to the next slide.
      await gesture('carousel', '[aria-roledescription="carousel"] img', -250, 0, false, `() => document.querySelector('[data-page]').innerText.includes('slide 2 / 5') ? 'slide 2 / 5' : undefined`);
      // A right press on the ContextMenu demo, on the DOM and each canvas: the app's menu, never the browser's over it.
      if (pages.includes('context-menu'))
        for (const renderer of renderers.filter(r => r !== 'panel')) {
          const label = `right press ${renderer} context-menu`;
          const aimed = await cdp.send('Runtime.evaluate', { expression: `ruiCheck.point('context-menu', ${JSON.stringify(renderer)})`, awaitPromise: true, returnByValue: true });
          if (aimed.result.exceptionDetails) {
            await run(label, `Promise.reject(new Error(${JSON.stringify(aimed.result.exceptionDetails.exception?.description ?? 'no point')}))`);
            continue;
          }
          const [x, y] = aimed.result.result.value;
          await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
          await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'right', buttons: 2, clickCount: 1 });
          await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'right', buttons: 0, clickCount: 1 });
          await run(label, `ruiCheck.menued(${JSON.stringify(renderer)})`);
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        }
      // As a phone: every page on the DOM, one on each canvas renderer, and the Drawer.
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
      await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
      // Loaded again, as a phone loads it: canvases take its pixel ratio when made.
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/${mode === 'runtime' ? '?runtime' : ''}` });
      const phoned = await cdp.send('Runtime.evaluate', { expression: `${PAGE}; ruiCheck.wait(() => document.querySelector('[data-page]')).then(() => true)`, awaitPromise: true, returnByValue: true });
      if (phoned.result.exceptionDetails) throw new Error(`page did not start as a phone: ${JSON.stringify(phoned.result.exceptionDetails)}`);
      console.log(`${mode}: as a phone, 390 x 844`);
      const first = renderers[0];
      for (const id of pages) await run(`phone ${first} ${id}`, `ruiCheck.phone(${JSON.stringify(id)}, ${JSON.stringify(first)})`);
      if (themed !== undefined) for (const renderer of renderers.slice(1)) await run(`phone ${renderer} ${themed}`, `ruiCheck.phone(${JSON.stringify(themed)}, ${JSON.stringify(renderer)})`);
      await run('phone drawer', 'ruiCheck.drawer()');
      // A touch drag on the first Slider (its thumb at 40) moves it; the page does not pan and take the pointer.
      await gesture('slider', '[role="slider"]', 60, 30, true, `() => { const v = document.querySelector('[data-page] [data-demo] [role="slider"]').getAttribute('aria-valuenow'); return v !== '40' && ruiCheck.still() && 'at ' + v; }`);
      // The same on the canvases: the Slider's touchAction keeps the touch (no pointercancel, no pan).
      for (const renderer of ['skia', 'three']) await gesture('slider', '[role="slider"]', 60, 30, true, `() => ruiCheck.still() && 'kept, the page still'`, renderer);
      await cdp.send('Emulation.clearDeviceMetricsOverride');
      cdp.close();
    } finally {
      // Chrome lets go of its profile when it exits.
      await stop();
    }
  }
} catch (error) {
  // Chrome gone mid-run (its DevTools calls fail), or a call with no answer: stopped, cleaned, failed.
  await abort(String(/** @type {any} */ (error)?.stack ?? error), 1);
}
if (!stopping) {
  server.close();
  console.log(failed === 0 ? `browser check: all ${visits} visits ok` : `browser check: ${failed} of ${visits} failed`);
  process.exit(failed === 0 ? 0 : 1);
}
