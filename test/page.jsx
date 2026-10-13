// Opens rui-show, or any view, in an application root on a happy-dom
// document with the environment the browser entry would give, and a few
// ways to drive it.

import { Window } from 'happy-dom';
import { Root, $dispose, $flush } from 'ren-core';
import { $dom } from 'ren-dom';
import { Env, environment } from '../src/env.js';
import { loaders, closeWindow, disposeAfter } from './harness.jsx';

/**
 * @param {any} view a component
 * @param {{ env?: Partial<import('../src/env.js').Environment>, url?: string, width?: number, height?: number, t?: import('./harness.jsx').Owner }} [options]
 * `t`: the test whose `after` disposes the page, awaited, even when the test fails.
 */
export function open(view, options = {}) {
  const window = new Window({ url: options.url ?? 'http://localhost/', width: options.width ?? 1280, height: options.height ?? 900 });
  /** @type {any} */
  let root = null;
  /** @type {Promise<void> | null} */
  let done = null;
  const dispose = () => (done ??= (root !== null && $dispose(root), closeWindow(window)));
  disposeAfter(options.t, () => dispose());
  const document = window.document;
  const page = document.createElement('div');
  document.body.appendChild(page);
  const env = environment({ ...loaders, ...options.env });
  const View = view;
  root = Root({ id: 'rui-show', target: page, renderer: $dom(document), storage: window.localStorage, locks: null, provide: [[Env, env]], children: () => <View window={window} start={window.location.hash} /> });
  const host = /** @type {any} */ (page.firstChild);
  // The whole document: a Drawer or a Launcher is in a portal outside the root's element.
  const all = (/** @type {string} */ selector) => /** @type {any[]} */ ([...document.querySelectorAll(selector)]);
  // What a press reaches: Actions, and a SegmentedControl's segments (only the checked one is an Action, the
  // group's one Tab stop; the others are pressable radios).
  const pressable = '[data-ren="Action"], [role="radio"]';
  /** The first Action or radio whose text is `text`, or with that accessible name. @param {string} text */
  const action = text => {
    const found = all(pressable).find(b => b.textContent === text || b.getAttribute('aria-label') === text);
    if (!found) throw new Error(`no action "${text}" in: ${all(pressable).map(b => b.textContent || b.getAttribute('aria-label')).join(' | ')}`);
    return found;
  };
  return {
    env,
    window,
    document,
    host,
    root,
    all,
    action,
    /** Clicks an action by its text or name, and flushes. @param {string} text */
    click(text) {
      action(text).click();
      $flush(root);
    },
    text: () => host.textContent,
    flush: () => $flush(root),
    dispose,
  };
}
