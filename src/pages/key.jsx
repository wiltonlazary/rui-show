// Key: a keyboard key.

import { Row, Key, Stack, Text } from 'rui-core';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'key',
  group: 'text',
  title: 'Key',
  description: 'A keyboard key: semibold text on the page’s sunken ground, a thin border and a 2 px bottom lip, in five sizes, for shortcuts in text and menus.',
  props: [
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'xs'", description: 'The theme’s font size: 12 to 19 px, or pixels.' },
    { name: 'children', type: 'string | (() => string)', description: 'The key’s text.' },
  ],
  demos: [
    {
      title: 'Shortcuts',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap={6} align="center">
        <Key>Ctrl</Key><Text>+</Text><Key>D</Key>
        <Text size="sm" fg="quiet">bookmarks the page</Text>
      </Row>
      <Row gap={6} align="center">
        <Key>Alt</Key><Text>+</Text><Key>Shift</Key><Text>+</Text><Key>Down</Key>
        <Text size="sm" fg="quiet">copies the line below</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap={6} align="center">
            <Key>Ctrl</Key>
            <Text>+</Text>
            <Key>D</Key>
            <Text size="sm" fg="quiet">
              bookmarks the page
            </Text>
          </Row>
          <Row gap={6} align="center">
            <Key>Alt</Key>
            <Text>+</Text>
            <Key>Shift</Key>
            <Text>+</Text>
            <Key>Down</Key>
            <Text size="sm" fg="quiet">
              copies the line below
            </Text>
          </Row>
        </Stack>
      ),
      height: 90,
    },
    {
      title: 'Sizes',
      code: `
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

function Demo() {
  return (
    <Row align="center">
      {SIZES.map(size => <Key size={size}>{\`Esc \${size}\`}</Key>)}
    </Row>
  );
}`,
      view: () => (
        <Row align="center">
          {SIZES.map(size => (
            <Key size={size}>{`Esc ${size}`}</Key>
          ))}
        </Row>
      ),
      height: 60,
    },
  ],
};
