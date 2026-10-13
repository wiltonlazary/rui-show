// What rui-show needs from where it runs, as one rrx-core context: the
// browser entry (main.jsx) loads CanvasKit, three.js and the fonts on first
// use (kept once loaded, tried again after a failure); the tests give
// headless CanvasKit and three.js with a drawer stub.
// Components read it with `$lookup(Env)`, never from globals.

import { $context, $task } from 'rrx-core';

/**
 * @typedef {object} Environment
 * @property {(() => Promise<{ kit: any, font: ArrayBuffer | Uint8Array, mono?: ArrayBuffer | Uint8Array }>) | null} skia loads CanvasKit and the fonts: the typeface and the monospace one code is drawn in (null: no Skia here)
 * @property {(() => Promise<{ THREE: Record<string, any>, font: ArrayBuffer | Uint8Array, mono?: ArrayBuffer | Uint8Array, renderer?: any }>) | null} three loads three.js (its own chunk in the browser) and the fonts its primitives are drawn in; tests add a drawer stub as `renderer`, since node has no WebGL
 * @property {{ document: any, font: string, mono: string } | null} fonts the canvases' font files (URLs) and the document the DOM demos are in: a DOM demo sets its text in them (ren-dom's `font` and `mono`), as Skia and three.js draw it (null: the page's font)
 * @property {number} scale the canvases' device pixel ratio
 */

/** @param {Partial<Environment>} overrides @returns {Environment} */
export const environment = overrides => ({ skia: null, three: null, fonts: null, scale: 1, ...overrides });

export const Env = $context(environment({}));

/**
 * A task that loads what `load` gives (null: this environment has none, a
 * failure `what is unavailable` shows), for Pending and Recover.
 * @template T
 * @param {import('rrx-core').Graph} R @param {(() => Promise<T>) | null} load @param {string} what
 */
export const loading = (R, load, what) =>
  $task(R, () => load, (/** @type {(() => Promise<T>) | null} */ run, complete) => {
    let live = true;
    if (run === null) complete({ ok: false, error: new Error(`this environment has no ${what}`) });
    else
      run().then(
        value => live && complete({ ok: true, value }),
        error => live && complete({ ok: false, error }),
      );
    return () => void (live = false);
  });

/**
 * `load`, run once and its promise kept, unless it fails: a failure is
 * forgotten, so the next call tries again (a network that came back).
 * @template T @param {() => Promise<T>} load @returns {() => Promise<T>}
 */
export const once = load => {
  /** @type {Promise<T> | null} */
  let kept = null;
  return () =>
    (kept ??= load().catch(error => {
      kept = null;
      throw error;
    }));
};

/**
 * A file's bytes; a response that is not ok (a 404 page) fails, naming the URL.
 * @param {string} url @param {typeof fetch} [get]
 */
export const bytes = async (url, get = fetch) => {
  const response = await get(url);
  if (!response.ok) throw new Error(`could not load ${url}: ${response.status} ${response.statusText}`);
  return response.arrayBuffer();
};
