// One view on two renderers, as rui-core's test/harness.jsx does it: the DOM
// (ren-dom on happy-dom) and Skia (ren-skia on headless CanvasKit, laid out
// by Taffy). Also the pieces the site tests share: CanvasKit, the font, and
// three.js with a drawer stub (node has no WebGL).
//
// A copy of rui-core's test/harness.jsx (a test file, not exported), which
// it follows on purpose, not by drift. It differs so: both sides default to a
// demo's size, 680 x 360 (rui-core's: a 1024 x 768 window, a 480 x 360
// canvas); the DOM shows a password Edit as its bullets, as
// ren-canv draws it (`domText`), and shows a node's text in its
// text-transform's case (`cased`); Skia's text joins a Label's styled run
// pieces into its words (`paintedText`, `runBoxes`), as the DOM's spans run
// together; it exports the font, CanvasKit and the Env loaders (three.js with
// a drawer stub), closes the DOM's window on dispose, and disposes a view
// after the test `t` given it (`disposeAfter`). `onDom().press`
// clicks only Actions (rui-core's presses Actions or Views); `onDom`
// returns no `document`, and `onSkia` exposes `commands`. It lacks rui-core's
// `resize`, `nodes`, `both` and `fakeDocument`, which no site test uses.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { setFlagsFromString } from 'node:v8';
import { Window } from 'happy-dom';
import * as THREE from 'three';
import { $root, $dispose, $flush } from 'rrx-core';
import { render as renderDom } from 'ren-dom';
import { $skia, render, loadLayout } from 'ren-skia';

// Each WebAssembly memory reserves its whole range up front; 1 GB each fits
// the address cap (.ai/config/resources.md, from the rui root).
setFlagsFromString('--wasm-max-mem-pages=16384');
await loadLayout();

export const font = readFileSync(fileURLToPath(import.meta.resolve('ren-skia/font.ttf')));
const CanvasKitInit = (await import('canvaskit-wasm')).default;
export const kit = await CanvasKitInit();

/** The environment's loaders, as the browser entry gives them. */
export const loaders = {
  skia: async () => ({ kit, font }),
  /** three.js in node: the scene graph is real, a stub draws. */
  three: async () => ({ THREE, font, renderer: { render: () => {}, setSize: () => {}, dispose: () => {} } }),
};

/**
 * Closes a happy-dom window (`window.close()` closes only a window a
 * script opened, so it does nothing here and the window stays in memory);
 * it is freed once the promise settles, which takes turns of the event loop.
 * @param {any} window @returns {Promise<void>}
 */
export const closeWindow = window => window.happyDOM.close();

/** The test a view belongs to: its `after` disposes the view, awaited, even when the test fails. @typedef {{ after: (fn: () => any) => void }} Owner */

/**
 * Runs `dispose` after the test `t`, awaited, even when the test fails,
 * and then lets it go: node keeps every test's hooks to the end of the
 * run, so a hook that held a window would keep it in memory.
 * @param {Owner | undefined} t @param {() => any} dispose
 */
export function disposeAfter(t, dispose) {
  if (t === undefined) return;
  /** @type {{ dispose: (() => any) | null }} */
  const slot = { dispose };
  t.after(() => {
    const run = slot.dispose;
    slot.dispose = null;
    return run?.();
  });
}

/** Collapses whitespace. @param {string[]} parts */
const normalize = parts => parts.join(' ').replace(/\s+/g, ' ').trim();

/** True when the node or an ancestor below the host is not displayed. @param {any} node @param {any} host */
function hidden(node, host) {
  for (let n = node; n != null && n !== host; n = n.parentElement) if (n.style?.display === 'none') return true;
  return false;
}

/**
 * A node's text as CSS's text-transform shows it: its own or an ancestor's
 * (inherited, but a form control, an Action or an Edit, takes only its own,
 * as the browser's stylesheet resets it there).
 * @param {any} node @param {any} host @param {string} text
 */
function cased(node, host, text) {
  for (let n = node; n != null && n !== host; n = n.parentElement) {
    const t = n.style?.textTransform;
    if (t === 'uppercase') return text.toUpperCase();
    if (t === 'lowercase') return text.toLowerCase();
    if (t === 'capitalize') return text.replace(/(^|\s)(\S)/g, (_, a, b) => a + b.toUpperCase());
    if (t === 'none') return text;
    const role = n.getAttribute?.('data-ren');
    if (role === 'Action' || role === 'Edit') return text;
  }
  return text;
}

/** The text of the Labels, Actions and Edits under a DOM host, in document order, as shown (a password's bullets, the text-transform's case). @param {any} host */
export function domText(host) {
  /** @type {string[]} */
  const out = [];
  for (const node of host.querySelectorAll('[data-ren]')) {
    const role = node.getAttribute('data-ren');
    if ((role !== 'Label' && role !== 'Action' && role !== 'Edit') || hidden(node, host)) continue;
    if (role === 'Action' && node.querySelector('[data-ren]') !== null) continue;
    // A secret Edit is a password input: the browser shows a bullet per unit, as ren-canv draws it.
    const value = role === 'Edit' && node.type === 'password' ? '•'.repeat(node.value.length) : node.value;
    out.push(role === 'Edit' ? value || node.placeholder || '' : cased(node, host, node.textContent));
  }
  return normalize(out);
}

/**
 * The view on the DOM, in a window of `size` (the Skia canvas's by
 * default: the same viewport), disposed after the test `t` when given.
 * @param {() => any} view @param {{ width?: number, height?: number, t?: Owner }} [size]
 */
export function onDom(view, size = {}) {
  const window = new Window({ url: 'http://localhost/', width: size.width ?? 680, height: size.height ?? 360 });
  let stop = () => {};
  /** @type {any} */
  let root = null;
  /** @type {Promise<void> | null} */
  let done = null;
  const dispose = () => (done ??= (stop(), root !== null && $dispose(root), closeWindow(window)));
  disposeAfter(size.t, () => dispose());
  const document = window.document;
  const host = document.createElement('main');
  document.body.appendChild(host);
  root = $root('dom');
  stop = renderDom(view, host, { root });
  return {
    window,
    host,
    root,
    text: () => ($flush(root), domText(host)),
    /** Clicks the first Action whose text is `text`. @param {string} text */
    press(text) {
      const node = [...host.querySelectorAll('[data-ren="Action"]')].find(n => n.textContent?.trim() === text);
      if (node === undefined) throw new Error(`no "${text}" to press on the DOM in: ${this.text()}`);
      node.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      $flush(root);
    },
    dispose,
  };
}

/**
 * The text a canvas painted, in paint order, a Label's (or an Edit's)
 * styled runs joined: ren-canv paints a text command per run piece (its
 * backgrounds between), so a piece inside the same item with runs that
 * starts on the baseline where the one before ended (its width in its
 * face) continues it, as the DOM's spans run together. Separate Labels
 * side by side stay separate words, as on the DOM.
 * @param {any[][]} commands @param {{ width: (text: string, size: number, face?: number) => number }} fonts
 * @param {{ x: number, y: number, right: number, bottom: number }[]} runs the boxes of the items with runs
 */
export function paintedText(commands, fonts, runs) {
  /** @type {string[]} */
  const out = [];
  let x = NaN;
  let y = NaN;
  let owner = -1;
  for (const c of commands) {
    if (c[0] !== 'text') continue;
    const [, value, at, baseline, size, , face] = c;
    const text = String(value);
    const box = runs.findIndex(b => at >= b.x - 0.5 && at <= b.right + 0.5 && baseline >= b.y && baseline <= b.bottom);
    if (box >= 0 && box === owner && Math.abs(baseline - y) < 0.5 && Math.abs(at - x) < 0.5) out[out.length - 1] += text;
    else out.push(text);
    x = at + fonts.width(text, size, face);
    y = baseline;
    owner = box;
  }
  return normalize(out);
}

/** The boxes of a canvas's items that have runs (ren-canv's `spans`), the page's and the portal layer's. @param {any} doc */
function runBoxes(doc) {
  /** @type {any[]} */
  const out = [];
  const walk = (/** @type {any} */ n) => {
    for (let c = n.first; c !== null; c = c.next) {
      if (c.spans != null) out.push(c.getBoundingClientRect());
      walk(c);
    }
  };
  walk(doc.root);
  if (doc.overlay) walk(doc.overlay);
  return out;
}

/** The view on a Skia canvas, disposed after the test `t` when given. @param {() => any} view @param {{ width?: number, height?: number, t?: Owner }} [size] */
export function onSkia(view, size = {}) {
  const skia = /** @type {any} */ ($skia(kit, { font, width: size.width ?? 680, height: size.height ?? 360 }));
  let stop = () => {};
  /** @type {any} */
  let root = null;
  let done = false;
  const dispose = () => {
    if (done) return;
    done = true;
    stop();
    if (root !== null) $dispose(root);
    skia.close();
  };
  disposeAfter(size.t, () => dispose());
  root = $root('skia');
  stop = render(view, skia, { root });
  const commands = () => {
    $flush(root);
    skia.present();
    return /** @type {any[][]} */ (skia.commands());
  };
  return {
    skia,
    root,
    commands,
    /** The text painted, in paint order. */
    text: () => paintedText(commands(), skia.fonts, runBoxes(skia)),
    /** Presses where the text `text` was painted. @param {string} text */
    press(text) {
      const at = commands().find(c => c[0] === 'text' && String(c[1]).trim() === text);
      if (at === undefined) throw new Error(`no "${text}" painted on Skia in: ${this.text()}`);
      skia.press(at[2] + 2, at[3] - 3);
      skia.release(at[2] + 2, at[3] - 3);
      $flush(root);
    },
    dispose,
  };
}
