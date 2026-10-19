# rui-show

Live at <https://wiltonlazary.github.io/rui-show/>.

[rui-core](https://github.com/wiltonlazary/rui-core)'s documentation and live
showcase: a sidebar of pages grouped by task (Foundations, Structure,
Text, Actions, Entry, Choices, Time, Wayfinding, Layers, Status, Data,
Charts, Forms, Behavior; the extensions sit with their task, their entry
named on the page), and for each component its description, live demos with their code, and its props
table.

Every demo renders in an application root of its own, on the renderer the
page's switch picks, named for its renderer, page and place
(`skia-menu-1`): the same on every load, so what a demo keeps in its root's
storage (`ren:<id>:*`, the $localStorage demo) is there when it shows again:

| Renderer | What draws it |
| --- | --- |
| DOM | ren-dom: elements and CSS, the browser lays it out |
| Skia | ren-skia: a CanvasKit canvas, ren-canv lays it out with Taffy and shapes its text with HarfBuzz |
| three.js overlay | ren-three: primitives over a WebGL scene, pixel for pixel |
| three.js panel | ren-three: the demo as a plane in a small scene; drag around it to orbit, wheel to zoom |

The header's color scheme (light or dark) and accent color (any color of
rui-core's BASE_THEME but the night grays) reach every demo root as its
props; the demo renders inside rui-core's `Rui`, so a change
restyles it in place (a three.js scene's background is its renderer's, so
those roots are made again on a new scheme). The choices are kept in the
root's storage (`ren:rui-show:*`).

The shell itself is written with rui-core (Surface, Row, Stack, Container,
Heading, Text, Button, Pressable, TextInput for the search, NavItem for
the sidebar, Launcher for Ctrl K, Table and Code for the props,
Rui, and Snippet for the code under each demo) and rendered
by ren-dom in the `rui-show` root.

On a phone or a narrow window (below the theme's `md` breakpoint, 60em, as `$fits`
reads it) the header keeps the brand and the scheme, and a NavToggle opens the
pages, the search and the accent colors in a Drawer from the left, which
choosing a page closes; the props are a card each instead of a table, and
the home page's grids stack. A demo is at least its `height` and grows
with what it holds (its rows wrap taller on a narrow screen): its Surface
reports its size, and a Skia or three.js canvas follows it (a three.js
panel's plane and frame grow, its camera steps back), so none of them cuts
a demo off. The shell marks its landmarks (the header `banner`, the page
list `navigation` "Pages", the content `main`), a skip link first in the
tab order (out of sight until focused) moves the focus to the content (a
ScrollBox at `tabIndex` -1, focused through its ref on every renderer), and
its outline is the page's title (level 1), then a level 2 heading per demo
and the props; the brand is text, not a heading. The document is named after
the page (`Button · rui-show`). The shell has no DOM tags: the page and each demo's stage are
ren-core Views (the page's with the `article` role) carrying the data
attributes the tests and the browser check read (`data-page`, `data-demos`,
`data-demo`, `data-renderer`), which ren-dom writes as attributes. They are
Views rather than rui-core Boxes to keep the shell’s structure plain;
rui-core passes `data-*` on too.

Under each demo a Code and Data switch shows its code, or its data: the
demo rendered once through ren-json's `$json` in a root of its own (on a
clock that never moves, after its tasks settle), what it means as JSON,
nodes by ARIA role and microdata items (rui-core's components carry them).
It renders only once asked for, and again each time.

## Adding a page

One module per page, `src/pages/<id>.jsx`, whose default export is the page
record (typed as `PageRecord` in `src/site.js`):

```jsx
import { Badge, Row } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'badge',                 // the file's name, and the page's hash (#badge)
  group: 'data',               // a GROUPS id in src/site.js
  title: 'Badge',
  description: 'One or two sentences under the title.',
  props: [
    // name, type, optional default (as code), description; `code` in descriptions shows as code
    { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'dot'", default: "'solid'", description: 'How the color is applied.' },
  ],
  demos: [
    {
      title: 'Variants',
      code: `
function Demo() {
  return <Row><Badge>Solid</Badge><Badge variant="soft">Soft</Badge></Row>;
}`,
      view: () => (
        <Row>
          <Badge>Solid</Badge>
          <Badge variant="soft">Soft</Badge>
        </Row>
      ),
      height: 80,                // optional: the demo's least height, on every renderer (160)
    },
  ],
};
```

- `view` is a component (it may make signals with `$active()`); it renders
  inside `Rui` on a Surface as wide as its stage (680 pixels until
  measured), on every renderer.
- `code` is shown under the demo as written (highlighted by rui-core's
  Snippet); keep it the view's source, valid JavaScript with JSX. Every
  name it uses that is not a public export of the libraries or a platform
  global (a constant, a helper, a picture) is declared in the page's demo
  codes or described there by a comment line, `// READING: minutes read
  per day, { … }` or `// landscape, sunset: small PNG data: URIs` (a test
  checks it with TypeScript: a name it cannot find is free).
- The node check compares each demo's text on the DOM and on Skia. Three
  flags loosen it where happy-dom (no layout) cannot match a canvas, each
  for a stated reason: `measured` (the view changes with its `onResize`
  size: the DOM's text begins Skia's), `clipped` (a Scroll, a hidden
  overflow or a Label's ellipsis clips text: Skia's letters, its ellipses left
  out, are among the DOM's; with `measured`,
  Skia's text begins with the DOM's, cut at its clip, then what the measure
  adds) and `unordered`
  (the canvas paints a sticky or raised part last: the same words in any
  order). The browser check lays every demo out for real.
- The group ids, by task: `foundations`, `structure`, `text`, `actions`,
  `entry`, `choices`, `time`, `wayfinding`, `layers`, `status`, `data`,
  `charts`, `forms`, `behavior`. Pages sort by group, then title.
- Nothing else changes: `scripts/pages.mjs` regenerates
  `src/pages/index.generated.js` from the folder (the build, `npm run
  check` and `npm test` run it first), the tests render every demo on the
  DOM and on Skia, and the browser check visits the new page on every
  renderer.

## Pages

| Group | Pages |
| --- | --- |
| Foundations | $motion, Colors, Icons, Style props, Theme |
| Structure | AspectRatio, Box, Center, Container, Divider, Flex, Grid, Panes, Row, ScrollBox, ScrollRow, Shell, Spacer, Stack, Surface, Tiles |
| Text | Code, DigitRoll, Heading, Highlight, Key, List, Mark, NumberText, Prose, Quote, Snippet, Text, TextAnimate |
| Actions | Button, Button.Group, CloseButton, CopyButton, FileButton, IconButton, Link, NavToggle, Pressable |
| Entry | ColorInput, ColorPicker, CurrencyInput, Dropzone, Editor, FieldGroup, FileInput, Input, JsonArea, MaskInput, NumberInput, PasswordInput, PinInput, Textarea, TextInput |
| Choices | AlphaSlider, AngleSlider, Autocomplete, Cascader, Checkbox, Chip, Combobox, HueSlider, MultiSelect, PlainSelect, Radio, RangeSlider, Rating, SegmentedControl, Select, Slider, Switch, Tag, TagBox, TagInput, TreeSelect |
| Time | AnalogClock, Calendar, DateInput, DatePanel, DateSelect, DateSettings, DateTimeSelect, DayStrip, Gantt, MonthPanel and YearPanel, TimeInput, TimePicker, TimeSlots |
| Wayfinding | Breadcrumbs, ContextMenu, Launcher, Menu, Menubar, NavItem, Onboarding, Outline, Pagination, Stepper, Tabs, Tree |
| Layers | ActionBar, Backdrop, Busy, Dialog, Drawer, Floater, Glider, HoverCard, Modal, Modals, Pin, Popover, Tooltip, Window |
| Status | Alert, Arc, EmptyState, Led, LoadBar, Loader, Notification, Notifications, Progress, Ring, Rings, Skeleton, Spinner |
| Data | Accordion, Avatar, Badge, Book, Card, Carousel, Collapse, Compare, Cover, DataList, DataTable, Dot, Excerpt, Flip, IconBox, Image, JsonTree, OverflowList, Parallax, QrCode, Swatch, Table, Timeline |
| Charts | AreaChart, BarChart, Bars, BubbleChart, DonutChart, FunnelChart, Heatmap, LineChart, MixedChart, PieChart, RadarChart, RadialBarChart, ScatterChart, Sparkline |
| Forms | $form, Validators |
| Behavior | $counter, $debounced, $history, $hover, $idle, $interval, $list, $localStorage, $move, $open, $outside, $pages, $shortcuts, $toggle, FocusTrap, Marquee, Platform hooks, State hooks, Transition, VisuallyHidden |

Pictures in demos (Image, Avatar, Cover, Card, Carousel, Compare,
Skeleton and the $move page) are small PNG
`data:` URIs made by `src/pictures.js`: no network, and ren-skia decodes
them (its default loader fetches the source).

## Layout

| Path | What |
| --- | --- |
| `src/main.jsx` | the browser entry: the `rui-show` root, CanvasKit, three.js and the fonts loaded on first use, with ren-canv's `taffy.wasm` (`loadLayout`) and `harfbuzz.wasm` (`loadShaper`) loaded together before a canvas renders |
| `src/app.jsx` | the shell: header (search, scheme, accent), sidebar (a Drawer on a phone), the current page |
| `src/page.jsx` | a component's page: renderer switch, demos with their code or data (`dataOf`, through ren-json), props table, previous and next |
| `src/home.jsx` | the home page (First view): what rui is, one component on three renderers, the groups by task |
| `src/stage.jsx` | a view on a renderer, in a root of its own, themed by the settings (`Stage`, `Themed`) |
| `src/site.js` | the page record's types, the groups, the renderers, the settings and themes |
| `src/env.js` | `Env`: what the page loads (CanvasKit, three.js, the fonts), as an rrx-core context |
| `src/pages/` | one module per page; `index.generated.js` is generated |
| `src/pictures.js` | the demos' pictures: PNG `data:` URIs made at load |
| `src/app.css` | the page’s viewport and the theme’s `--rui-*` colors for the body |
| `src/chart-data.js`, `src/chart-props.js` | the chart pages' sample data and shared props rows |
| `scripts/` | `pages.mjs` (the registry), `build.mjs`, `serve.mjs`, `browser.mjs` (headless Chrome check) |
| `test/` | node:test suites on happy-dom and headless CanvasKit |

## Commands

Install rrx-core, ren-core, ren-canv, ren-dom, ren-json, ren-skia,
ren-three and rui-core first (their declarations are what `tsc` reads), then:

```sh
npm install
npm test                  # the registry, tsc, the suites twice (runtime JSX and ren-core/esbuild templates), the build, the server check
npm run build             # artifact/dist: compiled/ and runtime/ bundles (three.js a chunk of its own), page, CanvasKit, Taffy, HarfBuzz
npm run serve             # http://127.0.0.1:5174/ (?runtime for the automatic-runtime bundle)
npm run browser           # headless Chrome, both bundles, every page on every renderer (takes the machine-wide Chrome lock)
```

Run node commands under the workspace caps ([`../../../.ai/config/resources.md`](https://github.com/wiltonlazary/rui/blob/main/.ai/config/resources.md));
CanvasKit needs `--disable-wasm-trap-handler` under `ulimit -v`. Never run
Chrome under `ulimit -v`.

## Tests

- `test/site.test.jsx`: the registry holds one record per file in
  `src/pages`, each with its fields (and demo root ids ren-core takes); the
  loaders keep what loaded and try a failure again; the shell opens, lists
  every page, follows the hash (the document named after its page), steps
  previous and next, searches (Enter and
  the Launcher rank a title the search names first), opens its
  Launcher with Ctrl K (not over a key a demo took), and opens every page
  with only that page's demo roots alive and a props Table row per prop; a
  demo's Data switch shows its ren-json data in place of its code, rendered
  only when asked, and every demo's data is plain JSON; the
  renderer switch makes each demo's root on DOM, Skia, three.js overlay and
  panel (three.js with a drawer stub); a demo root keeps its id across
  visits, and its storage; a panel orbits while its backdrop is dragged, not
  once no button is held; the theme controls restyle the demos on the DOM
  and on Skia; every demo shows the same text on the DOM and on Skia
  (rui-core's parity approach, `test/harness.jsx`); the interactive demos
  answer the same presses and animate the same on the Clock; the shell on a
  phone (below the theme's `md` breakpoint) opens the pages, search and
  colors in a Drawer from its NavToggle and closes it on the page chosen, and a
  wide screen keeps the sidebar and the header search.
- `test/serve.check.js`: the static server answers a malformed path with
  400 and keeps serving, and refuses a path out of the build (run once,
  after the build).
- `test/timers.test.js`: every timer in src, test and scripts says why it
  is one (a `timer:` kind), and none sleeps a guessed time.
- `scripts/browser.mjs`: headless Chrome over both bundles, every page on
  each renderer (each demo has its root; a DOM demo's containers are laid
  out as flex or grid boxes; a Skia canvas painted; a three.js canvas holds
  a live WebGL context), the theme controls on each renderer, and a
  demo's Data switch (its data by role, then its code again), and the
  Grid's first demo is as high on Skia and the three.js overlay as on the
  DOM, and the Button page's props table fits the content and the page
  prints on more than one sheet, within the sheet's width on the DOM and
  Skia (demos, canvases and code), and the keyboard's Tab reaches the skip
  link first and its Enter focuses the main region; then, as
  a phone (390 x 844, touch, loaded again), every page on the DOM and one
  on each canvas renderer fit its width (no sideways scroll of the page or
  its content, canvases made at their size) and the Drawer opens, takes a
  page and closes. It drags for real on the DOM (CDP input): a mouse swipe
  over the Carousel's picture moves it on, and a touch drag moves a Slider
  on the DOM, and on Skia and the three.js overlay keeps the touch (no
  `pointercancel`, no pan); a right press on the ContextMenu
  demo opens the app's own menu on the DOM and cancels the browser's on
  the canvases. Any page
  error, console error or console warning fails it, WebGL's included. It
  runs Chrome without `--disable-gpu`: a software compositor reads back
  every WebGL frame shown ("GPU stall due to ReadPixels"), which a GPU
  never does.
