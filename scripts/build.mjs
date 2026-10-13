// Builds rui-show into the build directory (artifact/dist, or ./dist
// without the artifact link):
//
//   compiled/  main.js, JSX compiled by ren-core/esbuild (templates)
//   runtime/   the same with the automatic JSX runtime
//   index.html, app.css, font.ttf and mono.ttf (from ren-skia), canvaskit/, taffy.wasm
//   (the layout engine of the drawn primitives) and harfbuzz.wasm (the shaper of
//   the text they measure); three.js is a chunk of its own
//
// The page registry (src/pages/index.generated.js) is generated first.
//
//   node scripts/build.mjs [--quiet]

import { build } from 'esbuild';
import { ren } from 'ren-core/esbuild';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { generate } from './pages.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const dist = existsSync(join(root, 'artifact')) ? join(root, 'artifact', 'dist') : join(root, 'dist');
const quiet = process.argv.includes('--quiet');

const pages = generate();

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
/** @type {Record<string, number>} */
const sizes = {};
for (const mode of /** @type {const} */ (['compiled', 'runtime'])) {
  const result = await build({
    entryPoints: { main: join(src, 'main.jsx') },
    outdir: join(dist, mode),
    bundle: true,
    splitting: true,
    format: 'esm',
    target: 'es2022',
    minify: true,
    sourcemap: 'linked',
    metafile: true,
    logLevel: 'warning',
    jsx: 'automatic',
    jsxImportSource: 'ren-core',
    plugins: mode === 'compiled' ? [ren()] : [],
  });
  for (const [file, meta] of Object.entries(result.metafile?.outputs ?? {})) if (file.endsWith('.js')) sizes[relative(dist, file)] = meta.bytes;
}

const require = createRequire(import.meta.url);
const canvaskit = dirname(require.resolve('canvaskit-wasm/bin/canvaskit.js'));
mkdirSync(join(dist, 'canvaskit'), { recursive: true });
for (const file of ['canvaskit.js', 'canvaskit.wasm']) copyFileSync(join(canvaskit, file), join(dist, 'canvaskit', file));
// The fonts ship with ren-skia (with their license): the typeface and the monospace one.
copyFileSync(require.resolve('ren-skia/font.ttf'), join(dist, 'font.ttf'));
copyFileSync(require.resolve('ren-skia/mono.ttf'), join(dist, 'mono.ttf'));
// ren-canv's WebAssembly, beside the page: Taffy's (loadLayout('./taffy.wasm'))
// and HarfBuzz's (loadShaper('./harfbuzz.wasm')). Their packages export only
// for import: look for each up from ren-canv, as node does.
const canv = dirname(createRequire(require.resolve('ren-skia')).resolve('ren-canv'));
/** A file of a package ren-canv depends on. @param {string} name @param {string} file */
const ofCanv = (name, file) => {
  let from = canv;
  while (!existsSync(join(from, 'node_modules', name))) {
    if (dirname(from) === from) throw new Error(`rui-show: ${name} not found above ren-canv`);
    from = dirname(from);
  }
  return join(from, 'node_modules', name, file);
};
copyFileSync(ofCanv('taffy-layout', 'pkg/taffy_wasm_bg.wasm'), join(dist, 'taffy.wasm'));
copyFileSync(ofCanv('harfbuzzjs', 'dist/harfbuzz.wasm'), join(dist, 'harfbuzz.wasm'));
writeFileSync(join(dist, 'app.css'), readFileSync(join(src, 'app.css'), 'utf8'));
writeFileSync(
  join(dist, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>rui-show</title>
<link rel="stylesheet" href="./app.css">
</head>
<body>
<div id="app"></div>
<script type="module">
// ?runtime loads the automatic-runtime bundle; the default is compiled templates.
const mode = new URLSearchParams(location.search).has('runtime') ? 'runtime' : 'compiled';
import(\`./\${mode}/main.js\`);
</script>
</body>
</html>
`,
);

if (!quiet) {
  for (const [file, bytes] of Object.entries(sizes)) console.log(`${file.padEnd(28)} ${(bytes / 1024).toFixed(1).padStart(7)} KiB`);
  console.log(`built ${pages.length} pages into ${dist}`);
}
