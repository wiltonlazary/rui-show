// The browser entry: rui-show's root on the page, with CanvasKit, three.js
// and the fonts loaded on first use.

import { Root } from 'ren-core';
import { $dom } from 'ren-dom';
import { loadLayout, loadShaper } from 'ren-canv';
import { Env, environment, once, bytes } from './env.js';
import { App } from './app.jsx';

/** Loads a classic script once. @param {string} src @returns {Promise<void>} */
const script = src =>
  new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    tag.src = src;
    tag.onload = () => resolve();
    tag.onerror = () => reject(new Error(`could not load ${src}`));
    document.head.appendChild(tag);
  });

/** The canvases' typeface and monospace one (code), which the DOM demos set their text in too. */
const FONTS = { font: './font.ttf', mono: './mono.ttf' };
// Each loaded once; a failure is tried again on the next demo that needs it.
const typefaces = once(() => Promise.all([bytes(FONTS.font), bytes(FONTS.mono)]));
/**
 * What the drawn primitives need before they render, beside the page and
 * loaded together: Taffy, their layout engine, and HarfBuzz, which shapes
 * the text they measure (Arabic joined, marks on their bases).
 */
const engines = () => Promise.all([loadLayout('./taffy.wasm'), loadShaper('./harfbuzz.wasm')]);

const env = environment({
  scale: Math.min(2, globalThis.devicePixelRatio ?? 1),
  fonts: { document, ...FONTS },
  skia: once(async () => {
    await Promise.all([script('./canvaskit/canvaskit.js'), engines()]);
    const init = /** @type {any} */ (globalThis).CanvasKitInit;
    const [kit, [font, mono]] = await Promise.all([init({ locateFile: (/** @type {string} */ file) => `./canvaskit/${file}` }), typefaces()]);
    return { kit, font, mono };
  }),
  // three.js is a chunk of its own: it loads when a three.js demo first shows.
  three: once(() => Promise.all([import('three'), typefaces(), engines()]).then(([THREE, [font, mono]]) => ({ THREE, font, mono }))),
});

Root({
  id: 'rui-show',
  target: /** @type {HTMLElement} */ (document.getElementById('app')),
  renderer: $dom(document),
  provide: [[Env, env]],
  children: () => <App start={location.hash} window={window} />,
});
