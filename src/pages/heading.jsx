// Heading: headings.

import { Card, Heading, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'heading',
  group: 'text',
  title: 'Heading',
  description: 'A heading: `level` 1 to 6 takes the theme’s heading size and line height; `size` overrides it.',
  props: [
    { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: 'The heading level: its size and leading from the theme’s `headings.levels` (36, 29, 23, 19, 17 and 15 px from level 1 to 6).' },
    { name: 'size', type: "1 | 2 | 3 | 4 | 5 | 6 | 'xs' … 'xl'", description: 'Another size: a level’s size and leading (a number, 1 to 6, as `level`), or a font size step. The level, and what assistive technology reads, stay.' },
    { name: 'lines', type: 'number', description: 'Clamps it to this many lines.' },
    { name: 'fg', type: 'string', description: 'Color, as Text.' },
    { name: 'children', type: 'string | (() => string)', description: 'The heading’s text.' },
  ],
  demos: [
    {
      title: 'Levels',
      code: `
function Demo() {
  return (
    <Stack gap="xs">
      {[1, 2, 3, 4, 5, 6].map(level => <Heading level={level}>{\`Heading \${level}\`}</Heading>)}
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          {[1, 2, 3, 4, 5, 6].map(level => (
            <Heading level={level}>{`Heading ${level}`}</Heading>
          ))}
        </Stack>
      ),
      height: 290,
    },
    {
      title: 'Visual size apart from level',
      code: `
function Demo() {
  return (
    <Card bordered w={320}>
      <Stack gap={6}>
        <Heading level={2} size={5}>Billing details</Heading>
        <Text size="sm" fg="quiet">A section heading at level 2 in the outline, drawn at level 5’s size to suit the card.</Text>
      </Stack>
    </Card>
  );
}`,
      view: () => (
        <Card bordered w={320}>
          <Stack gap={6}>
            <Heading level={2} size={5}>
              Billing details
            </Heading>
            <Text size="sm" fg="quiet">
              A section heading at level 2 in the outline, drawn at level 5’s size to suit the card.
            </Text>
          </Stack>
        </Card>
      ),
      height: 130,
    },
  ],
};
