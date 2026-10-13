// What a page is, the sidebar's groups, the renderers a demo runs on and the
// themes the controls pick from. Pages are data: one module per page in
// src/pages/<id>.jsx exports a PageRecord as its default; scripts/pages.mjs
// collects them into src/pages/index.generated.js, so adding a page is adding
// a file.

import { BASE_THEME, themeOf } from 'rui-core';

/**
 * A row of a page's props table.
 * @typedef {object} PropRow
 * @property {string} name the prop's name
 * @property {string} type its type, as TypeScript would write it
 * @property {string=} default its default, as code (`'md'`, `false`); none for no default
 * @property {string} description what it does
 */

/**
 * A live example: `view` renders in an application root of its own on the
 * chosen renderer, inside rui-core's Rui; `code` is shown under it.
 * @typedef {object} DemoRecord
 * @property {string} title
 * @property {string} code the example's source, as shown
 * @property {() => any} view a component: the example itself
 * @property {number=} height the demo's least height on every renderer, in CSS pixels (160 by default): it grows with what
 *   it holds
 * @property {boolean=} measured the view changes with its measured size (`onResize`: an Excerpt's control, a chart's axes):
 *   happy-dom lays nothing out, so the node check asks only that the DOM's text begin Skia's; the browser check lays both out
 * @property {boolean=} unordered the canvases paint some of its text after the rest (a sticky column, raised items): the node
 *   check compares the words the DOM and Skia show in any order
 * @property {boolean=} clipped a Scroll or a hidden overflow clips some of its text: Skia paints only what shows (a box
 *   narrower than a word breaks it across rows), happy-dom lays nothing out and shows it all, so the node check asks
 *   that every letter Skia paints be among the DOM's; with `measured` too, that Skia's text begin with the DOM's, cut at
 *   its clip, then what the measure adds (an Excerpt's control)
 */

/**
 * A page of the documentation.
 * @typedef {object} PageRecord
 * @property {string} id the file's name (src/pages/<id>.jsx), and the page's hash (`#<id>`)
 * @property {GroupId} group the sidebar group it belongs to
 * @property {string} title
 * @property {string} description one or two sentences under the title
 * @property {PropRow[]} props the props table (empty for pages without one)
 * @property {DemoRecord[]} demos
 */

/** @typedef {'foundations' | 'structure' | 'text' | 'actions' | 'entry' | 'choices' | 'time' | 'wayfinding' | 'layers' | 'status' | 'data' | 'charts' | 'forms' | 'behavior'} GroupId */

/** The sidebar's groups, by task, in order. @type {{ id: GroupId, title: string }[]} */
export const GROUPS = [
  { id: 'foundations', title: 'Foundations' },
  { id: 'structure', title: 'Structure' },
  { id: 'text', title: 'Text' },
  { id: 'actions', title: 'Actions' },
  { id: 'entry', title: 'Entry' },
  { id: 'choices', title: 'Choices' },
  { id: 'time', title: 'Time' },
  { id: 'wayfinding', title: 'Wayfinding' },
  { id: 'layers', title: 'Layers' },
  { id: 'status', title: 'Status' },
  { id: 'data', title: 'Data' },
  { id: 'charts', title: 'Charts' },
  { id: 'forms', title: 'Forms' },
  { id: 'behavior', title: 'Behavior' },
];

/**
 * Orders pages as the sidebar shows them: by group, then by title.
 * @param {PageRecord[]} pages
 */
export function ordered(pages) {
  const rank = (/** @type {PageRecord} */ p) => GROUPS.findIndex(g => g.id === p.group);
  return [...pages].sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title));
}

/** @typedef {'dom' | 'skia' | 'three' | 'panel'} RendererId */

/** The renderers a demo runs on. @type {{ id: RendererId, name: string, note: string }[]} */
export const RENDERERS = [
  { id: 'dom', name: 'DOM', note: 'ren-dom: elements and CSS, laid out by the browser' },
  { id: 'skia', name: 'Skia', note: 'ren-skia: drawn on a CanvasKit canvas, laid out by Taffy' },
  { id: 'three', name: 'three.js overlay', note: 'ren-three: drawn over a WebGL scene, pixel for pixel' },
  { id: 'panel', name: 'three.js panel', note: 'ren-three: a plane in a scene; drag around it to orbit, wheel to zoom' },
];

/**
 * A demo root's id: its renderer, then the demo's name (`<page>-<index>`),
 * the same on every load, so what the demo keeps in its root's storage
 * (`ren:<id>:*`) is there when it shows again. A stage made again on the
 * same renderer takes its predecessor's id: the region replacing the old
 * stage ends it first (ren-core hands a replaced nested root's id over).
 * @param {RendererId} renderer @param {string} name
 */
export const rootId = (renderer, name) => `${renderer}-${name}`;

/**
 * What the theme controls choose, passed to every demo root as its props.
 * @typedef {{ scheme: 'light' | 'dark', accent: string }} Settings
 */

/** @type {Settings} */
export const DEFAULTS = { scheme: 'light', accent: BASE_THEME.accent };

/** The accent colors offered: every palette color but the night grays. */
export const ACCENTS = Object.keys(BASE_THEME.colors).filter(name => name !== 'night');

/** One theme per accent color, made once. */
const THEMES = new Map(ACCENTS.map(name => [name, themeOf({ accent: name })]));

/** The theme for an accent color (the default theme for an unknown one). @param {string} accent */
export const themeFor = accent => THEMES.get(accent) ?? BASE_THEME;

/** Reads settings that may be partial or missing (a root's props). @param {any} value @returns {Settings} */
export const settled = value => ({
  scheme: value?.scheme === 'dark' ? 'dark' : 'light',
  accent: typeof value?.accent === 'string' && THEMES.has(value.accent) ? value.accent : DEFAULTS.accent,
});
