// Snippet (rui-core/snippet): code in rui's syntax palettes, line
// numbers, several files in tabs, the expand control, inline code.

import { Row, Text } from 'rui-core';
import { Snippet, SnippetTabs, InlineSnippet } from 'rui-core/snippet';

const SNIPPET = `import { Button } from 'rui-core';

function Demo() {
  const count = $signal($active(), 0);
  // One press adds one.
  return <Button onPress={() => $write(count, $read(count) + 1)}>Add one</Button>;
}`;

const CSS = `.button {
  color: #2d83db;
  padding: 8px 16px;
}`;

const JSON_CODE = `{
  "name": "rui-core",
  "version": "0.1.0",
  "private": true
}`;

const SHELL = `npm install
npm test`;

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'snippet',
  group: 'text',
  title: 'Snippet',
  description: 'Highlighted code (rui-core/snippet) with rui’s own tokenizer (JavaScript, TypeScript, JSX, JSON, CSS, HTML, shell) and rui’s own light and dark syntax palettes, as rows of colored Labels in a monospace face, padded 8 × 12 in a block rounded by the theme’s corner: long lines scroll across. Its controls sit at the end of a header strip above the code, copy first (`copyable`), then the expand control (`expandable`; closed, a fade row over the code’s bottom edge holds a button that opens it), then `actions`; line numbers (`numbered`); several files in tabs (SnippetTabs); code inline (InlineSnippet). rui-show’s own code blocks use it.',
  props: [
    { name: 'code', type: 'string', description: 'The code.' },
    { name: 'language', type: "'js' | 'jsx' | 'ts' | 'tsx' | 'json' | 'css' | 'html' | 'bash' | …", description: 'Its language (aliases too); anything else is plain.' },
    { name: 'copyable', type: 'boolean', default: 'true', description: 'A button that copies the code.' },
    { name: 'copyLabel / doneLabel / hold', type: "string / string / MOTION name | number", default: "'Copy' / 'Done' / MOTION.hold (1500 ms)", description: 'The copy button’s labels, and how long the done state shows (a MOTION name or ms).' },
    { name: 'numbered', type: 'boolean', default: 'false', description: 'Numbers before the lines.' },
    { name: 'expandable', type: 'boolean', default: 'false', description: 'A control that collapses the code to `height`.' },
    { name: 'open / defaultOpen / onOpenChange', type: 'boolean', default: 'true', description: 'Whether it shows whole.' },
    { name: 'height', type: 'number', default: 'theme.sizes.box.snippet (240)', description: 'Its height collapsed (about eleven lines).' },
    { name: 'moreLabel / lessLabel', type: 'string', default: "'Show all lines' / 'Fold'", description: 'The expand control’s labels: `moreLabel` on the text button in the fade row while closed.' },
    { name: 'actions', type: 'any', description: 'More IconButtons in the header strip, after the copy and expand buttons.' },
    { name: 'scheme', type: "'light' | 'dark'", default: 'the page’s', description: 'The palette’s scheme.' },
    { name: 'background / radius / bordered', type: 'string / … / boolean', default: 'the page’s sunken role / theme.corner / false', description: 'The frame.' },
    { name: 'SnippetTabs files', type: '{ name, code, language, icon }[]', description: 'Several files under their names, the tabs keyed by name: `value`, `onChange(name)`, `defaultValue` (the first tab’s name), `iconOf(name)`.' },
    { name: 'SnippetTabs aria-label / aria-labelledby', type: 'string', description: 'The tab list’s name; none by default.' },
    { name: 'InlineSnippet', type: '{ code, language, scheme, radius, background }', description: 'Code in a line of text.' },
  ],
  demos: [
    {
      title: 'JSX with line numbers, done shown for 3 s',
      code: `
const SNIPPET = \`import { Button } from 'rui-core';

function Demo() {
  const count = $signal($active(), 0);
  // One press adds one.
  return <Button onPress={() => $write(count, $read(count) + 1)}>Add one</Button>;
}\`;

function Demo() {
  return <Snippet code={SNIPPET} language="jsx" numbered radius="md" bordered hold={3000} />;
}`,
      view: () => <Snippet code={SNIPPET} language="jsx" numbered radius="md" bordered hold={3000} />,
      height: 200,
    },
    {
      title: 'Files in tabs, one chosen by name, dark',
      code: `
// CSS: a stylesheet's text, '.button {\\n  color: #2d83db;\\n  padding: 8px 16px;\\n}'
// JSON_CODE: a package.json's text, '{\\n  "name": "rui-core",\\n  "version": "0.1.0",\\n  "private": true\\n}'
// SHELL: a shell script's text, 'npm install\\nnpm test'

function Demo() {
  return (
    <SnippetTabs
      aria-label="Files"
      scheme="dark"
      radius="md"
      defaultValue="package.json"
      files={[
        { name: 'button.css', code: CSS, language: 'css' },
        { name: 'package.json', code: JSON_CODE, language: 'json' },
        { name: 'install.sh', code: SHELL, language: 'bash' },
      ]}
    />
  );
}`,
      view: () => (
        <SnippetTabs
          aria-label="Files"
          scheme="dark"
          radius="md"
          defaultValue="package.json"
          files={[
            { name: 'button.css', code: CSS, language: 'css' },
            { name: 'package.json', code: JSON_CODE, language: 'json' },
            { name: 'install.sh', code: SHELL, language: 'bash' },
          ]}
        />
      ),
      height: 190,
    },
    {
      title: 'A collapse control, and inline code',
      code: `
function Demo() {
  return (
    <>
      <Snippet code={SNIPPET} language="jsx" expandable defaultOpen={false} height={80} copyable={false} />
      <Row gap={6} mt="md">
        <Text size="sm">Call</Text>
        <InlineSnippet code="$write(count, 0)" language="js" />
        <Text size="sm">to reset the counter.</Text>
      </Row>
    </>
  );
}`,
      view: () => (
        <>
          <Snippet code={SNIPPET} language="jsx" expandable defaultOpen={false} height={80} copyable={false} />
          <Row gap={6} mt="md">
            <Text size="sm">Call</Text>
            <InlineSnippet code="$write(count, 0)" language="js" />
            <Text size="sm">to reset the counter.</Text>
          </Row>
        </>
      ),
      height: 230,
      clipped: true,
    },
  ],
};
