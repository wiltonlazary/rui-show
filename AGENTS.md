# rui-show

Standing rules for agents working in this checkout.

Read the workspace layer first: [`../../../AGENTS.md`](https://github.com/wiltonlazary/rui/blob/main/AGENTS.md) and [`../../../.ai/config/`](https://github.com/wiltonlazary/rui/tree/main/.ai/config)
(stability.md first, then javascript.md, design.md, concepts.md,
resources.md, git.md). Then [README.md](README.md) and [TODO.md](TODO.md).

## What this is

rui-show is rui-core's documentation and live showcase: a page per
component with its description, props table and demos, each demo live on
ren-dom, ren-skia and ren-three. It is a private application, never
published, depending on the sibling checkouts through `file:` links.

## Rules

- A page is a file: `src/pages/<id>.jsx` exports its page record (README,
  "Adding a page"). Add pages by adding files; never edit a shared list.
  `src/pages/index.generated.js` is generated (`scripts/pages.mjs`) and ignored.
- Pages import only public entries (`rui-core`, `ren-core`, `rrx-core`),
  never files inside the packages.
- The shell is written with rui-core's components. Where rui-core lacks one,
  the shell uses a DOM tag and TODO.md names the component that replaces it.
- Demos use rui-core only (no DOM tags): each renders on every renderer.
  What a demo cannot show on a canvas yet is a rui-core, ren-core or
  ren-canv gap, recorded in TODO.md, never worked around in the demo.
- Colors come from rui-core's theme only.
- A defect rui-show finds belongs to its owner (rui-core, ren-core or a
  renderer); report it with a repro and record it in TODO.md. A shim here is
  the exception, marked where it lives and listed in TODO.md for removal.
- `npm test` is the gate (the page registry, `scripts/pages.mjs`; tsc; both JSX
  passes; the build; and the server check, `test/serve.check.js`, over the
  built site). Run
  `npm run browser` (headless Chrome, under the machine-wide lock, never
  under `ulimit -v`) before claiming a change works in a browser.
- Build output goes to `artifact/dist` (the ignored link to
  `../../build/_repo__0.1.12`); scratch goes to `artifact/tmp/<task>/`.
