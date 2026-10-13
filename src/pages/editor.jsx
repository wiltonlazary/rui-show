// Editor (rui-core/editor): a toolbar and a document, the HTML
// it makes, and a read-only one.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { BASE_THEME, Button, Code, Row, Stack, Text } from 'rui-core';
import { Editor, $editor } from 'rui-core/editor';

const CONTENT =
  '<h2>Release 2.4</h2><p>This release makes search faster and fixes the export. Read the <a href="https://example.com/upgrade">upgrade guide</a> before you update.</p><h3>New</h3><ul><li><p>Search ranks recent files first</p></li><li><p>The <code>export</code> command takes <code>--since</code></p></li></ul><h3>Upgrade</h3><ol><li><p>Back up your settings</p></li><li><p>Run the update</p></li></ol><pre><code>app update --channel stable</code></pre>';

/** The text colors offered: the theme's four status hues (success, information, warning, danger) at shade 6. */
const COLORS = ['teal', 'blue', 'amber', 'red'].map(name => BASE_THEME.colors[name][6]);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'editor',
  group: 'entry',
  title: 'Editor',
  description: 'A rich text editor (rui-core/editor): a document model with marks, headings, lists, quotes, code blocks and links, HTML and JSON in and out, undo and redo. The block being edited is a portable Edit, the others are drawn; a press on a drawn block puts the caret at the pressed character.',
  props: [
    { name: 'store', type: '$editor({ content, editable, onChange })', description: 'The state and commands: `html`, `json`, `text`, `load`, `toggle(mark)`, `toggleBlock(type)`, `colorText`, `align`, `link`, `undo`, `marked`, `isBlock`, …; made from `content`, `editable` and `onChange` when absent.' },
    { name: 'content', type: 'string (HTML) | JSON | Doc', description: 'The document, when no `store` is given.' },
    { name: 'editable / onChange', type: 'boolean / (editor) => void', default: 'true', description: 'When no `store` is given: whether it can be edited, and called on each change.' },
    { name: 'labels', type: 'Partial<typeof LABELS>', description: 'The actions’ accessible labels, over `LABELS` (‘Bold’, ‘Strike out’, ‘Plain text’, ‘Ink’ for the colors, ‘Code’ for a code block, ‘Title 2’ for a heading, …).' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: 'theme.corner', description: 'The frame’s radius.' },
    { name: 'Editor.Toolbar / Group', type: '{ children }', description: 'The toolbar, its actions in groups; the link editor opens under it.' },
    { name: 'Editor.Bold, Italic, Underline, Strike, Clear, Code, Sub, Sup, Highlight, CodeBlock, Quote, Bullet, Ordered, Rule, Link, Unlink, Undo, Redo', type: 'actions', description: 'The actions bound to the editor, active as the selection is.' },
    { name: 'Editor.Heading', type: '{ level: 1 | 2 | 3 | 4 }', description: 'Makes the block a heading of that level, or a paragraph when it is one already.' },
    { name: 'Editor.Align', type: "{ value: 'start' | 'center' | 'end' | 'justify' }", description: 'Aligns the block’s text.' },
    { name: 'Editor.Swatch / Uncolor', type: '{ color } / {}', description: 'Sets `color` (a theme name or a CSS color: hex, a name, or rgb/hsl/hwb/lab/lch/oklab/oklch/color() of plain values, not var() or color-mix(); hex, rgb and hsl draw on every renderer, a name and the other functions on the DOM only) on the selection, its swatch as the icon; clears the color.' },
    { name: 'Editor.Colors', type: '{ colors, popover, picker, label }', description: 'An action showing the selection’s color that opens one panel: round swatches six a row, the no-color one first, then `colors` (every theme hue by default; each a theme name or a CSS color, resolved before it is stored); a swatch sets the color and closes. “Custom…” (`LABELS.colorsCustom`) opens a ColorPicker in the same panel that sets the color as it moves (Escape or a press outside closes).' },
    { name: 'Editor.Action', type: '{ onPress, active, label, disabled, children }', description: 'An action of your own.' },
    { name: 'Editor.Content', type: '{ placeholder, onLinkPress, aria-label, aria-labelledby }', description: 'The document, a textbox named by its own `aria-label`/`aria-labelledby`, else by the Field’s label, else by its placeholder; `onLinkPress(href)` hears links pressed while not editable.' },
  ],
  demos: [
    {
      title: 'Release notes: headings, lists, links and code',
      code: `
// CONTENT: release notes as HTML, '<h2>Release 2.4</h2><p>This release makes search faster …</p><h3>New</h3><ul>…</ul>…'

function Demo() {
  return (
    <Editor content={CONTENT}>
      <Editor.Toolbar>
        <Editor.Group>
          <Editor.Heading level={2} />
          <Editor.Heading level={3} />
        </Editor.Group>
        <Editor.Group>
          <Editor.Bullet />
          <Editor.Ordered />
        </Editor.Group>
        <Editor.Group>
          <Editor.Link />
          <Editor.Unlink />
        </Editor.Group>
        <Editor.Group>
          <Editor.Code />
          <Editor.CodeBlock />
        </Editor.Group>
      </Editor.Toolbar>
      <Editor.Content aria-label="Document" />
    </Editor>
  );
}`,
      view: () => (
        <Editor content={CONTENT}>
          <Editor.Toolbar>
            <Editor.Group>
              <Editor.Heading level={2} />
              <Editor.Heading level={3} />
            </Editor.Group>
            <Editor.Group>
              <Editor.Bullet />
              <Editor.Ordered />
            </Editor.Group>
            <Editor.Group>
              <Editor.Link />
              <Editor.Unlink />
            </Editor.Group>
            <Editor.Group>
              <Editor.Code />
              <Editor.CodeBlock />
            </Editor.Group>
          </Editor.Toolbar>
          <Editor.Content aria-label="Document" />
        </Editor>
      ),
      height: 420,
    },
    {
      title: 'Its HTML, from an editor of your own',
      code: `
function Demo() {
  const html = $signal($active(), '');
  const editor = $editor({ content: '<p>Type here, then press <strong>Bold</strong>.</p>', onChange: editor => $write(html, editor.html()) });
  return (
    <Stack gap="sm">
      <Editor store={editor}>
        <Editor.Toolbar>
          <Editor.Group>
            <Editor.Bold />
            <Editor.Italic />
            <Editor.Undo />
          </Editor.Group>
        </Editor.Toolbar>
        <Editor.Content placeholder="Write something" />
      </Editor>
      <Row gap="xs">
        <Button size="xs" variant="neutral" onPress={() => editor.load('<p>Replaced from code.</p>')}>Load content</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(html, editor.html())}>Read HTML</Button>
      </Row>
      <Code>{() => $read(html) || '(press Read HTML)'}</Code>
    </Stack>
  );
}`,
      view: () => {
        const html = $signal($active(), '');
        const editor = $editor({ content: '<p>Type here, then press <strong>Bold</strong>.</p>', onChange: (/** @type {any} */ editor) => $write(html, editor.html()) });
        return (
          <Stack gap="sm">
            <Editor store={editor}>
              <Editor.Toolbar>
                <Editor.Group>
                  <Editor.Bold />
                  <Editor.Italic />
                  <Editor.Undo />
                </Editor.Group>
              </Editor.Toolbar>
              <Editor.Content placeholder="Write something" />
            </Editor>
            <Row gap="xs">
              <Button size="xs" variant="neutral" onPress={() => editor.load('<p>Replaced from code.</p>')}>
                Load content
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(html, editor.html())}>
                Read HTML
              </Button>
            </Row>
            <Code>{() => $read(html) || '(press Read HTML)'}</Code>
          </Stack>
        );
      },
      height: 260,
    },
    {
      title: 'Read only, links pressed',
      code: `
function Demo() {
  const pressed = $signal($active(), 'none');
  const editor = $editor({ content: '<p>Read the <a href="https://example.com">docs</a> or the <a href="#button">Button page</a>.</p>', editable: false });
  return (
    <Stack gap="xs">
      <Editor store={editor}>
        <Editor.Content aria-label="Document" onLinkPress={href => $write(pressed, href)} />
      </Editor>
      <Text size="sm" fg="quiet">{() => \`link pressed: \${$read(pressed)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const pressed = $signal($active(), 'none');
        const editor = $editor({ content: '<p>Read the <a href="https://example.com">docs</a> or the <a href="#button">Button page</a>.</p>', editable: false });
        return (
          <Stack gap="xs">
            <Editor store={editor}>
              <Editor.Content aria-label="Document" onLinkPress={(/** @type {string} */ href) => $write(pressed, href)} />
            </Editor>
            <Text size="sm" fg="quiet">
              {() => `link pressed: ${$read(pressed)}`}
            </Text>
          </Stack>
        );
      },
      height: 130,
    },
    {
      title: 'Text colors: the four status hues',
      code: `
const COLORS = ['teal', 'blue', 'amber', 'red'].map(name => BASE_THEME.colors[name][6]);

function Demo() {
  const editor = $editor({ content: '<p>Build passed. Two tests are slow. The deploy failed.</p>' });
  return (
    <Editor store={editor}>
      <Editor.Toolbar>
        <Editor.Colors colors={COLORS} />
      </Editor.Toolbar>
      <Editor.Content aria-label="Document" />
    </Editor>
  );
}`,
      view: () => {
        const editor = $editor({ content: '<p>Build passed. Two tests are slow. The deploy failed.</p>' });
        return (
          <Editor store={editor}>
            <Editor.Toolbar>
              <Editor.Colors colors={COLORS} />
            </Editor.Toolbar>
            <Editor.Content aria-label="Document" />
          </Editor>
        );
      },
      height: 300,
    },
  ],
};
