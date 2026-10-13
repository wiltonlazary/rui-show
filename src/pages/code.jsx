// Code: inline code and code blocks.

import { Code, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'code',
  group: 'text',
  title: 'Code',
  description: 'Code in the theme’s monospace face, at the extra small size, on the page’s sunken ground (or a tint of a color): inline, or a `block` that keeps its lines and wraps. Its text is selectable. Nested in Text it is a run of the Text’s Label, wrapping with the words.',
  props: [
    { name: 'children', type: 'string | (() => string)', description: 'The code; a block keeps its line breaks.' },
    { name: 'block', type: 'boolean', default: 'false', description: 'A block: padded 12 × 16, as wide as its parent, wrapping. Inline code is padded 1 × 9 (its sides `ratios.pad` of its font).' },
    { name: 'color', type: 'string', description: 'Tints the ground with the soft variant of the color’s hue (the page’s sunken ground by default): a shade is not kept, so `red.9` tints as `red`; a CSS color tints as itself.' },
  ],
  demos: [
    {
      title: 'Inline',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap={6}>
        <Text>Run</Text>
        <Code>npm test</Code>
        <Text>before you commit.</Text>
      </Row>
      <Row gap="xs">
        <Code color="blue">blue</Code>
        <Code color="teal">teal</Code>
        <Code color="red">red</Code>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap={6}>
            <Text>Run</Text>
            <Code>npm test</Code>
            <Text>before you commit.</Text>
          </Row>
          <Row gap="xs">
            <Code color="blue">blue</Code>
            <Code color="teal">teal</Code>
            <Code color="red">red</Code>
          </Row>
        </Stack>
      ),
      height: 70,
    },
    {
      title: 'Block',
      code: `
const SOURCE = \`import { Button } from 'rui-core';

function Demo() {
  return <Button>Hello</Button>;
}\`;

function Demo() {
  return <Code block>{SOURCE}</Code>;
}`,
      view: () => <Code block>{SOURCE}</Code>,
      height: 110,
    },
  ],
};

const SOURCE = `import { Button } from 'rui-core';

function Demo() {
  return <Button>Hello</Button>;
}`;
