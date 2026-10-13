// Stack: children in a column.

import { Stack, Surface, Text } from 'rui-core';

/** @param {{ children?: any }} props */
const Item = props => (
  <Surface bordered p="xs">
    <Text size="sm">{props.children}</Text>
  </Surface>
);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'stack',
  group: 'structure',
  title: 'Stack',
  description: 'Children in a column with a theme gap, aligned and justified with the portable flex words (a CSS word is not read: the default holds).',
  props: [
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Space between children.' },
    { name: 'align', type: "'stretch' | 'center' | 'start' | 'end'", default: "'stretch'", description: 'Cross-axis alignment, in rui’s words.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Main-axis distribution, in rui’s words.' },
  ],
  demos: [
    {
      title: 'A stretched column',
      code: `
const Item = props => <Surface bordered p="xs"><Text size="sm">{props.children}</Text></Surface>;

function Demo() {
  return (
    <Stack gap="xs">
      <Item>First</Item>
      <Item>Second</Item>
      <Item>Third</Item>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          <Item>First</Item>
          <Item>Second</Item>
          <Item>Third</Item>
        </Stack>
      ),
      height: 160,
    },
    {
      title: 'Centered, in a fixed height',
      code: `
function Demo() {
  return (
    <Stack h={140} gap="xs" align="center" justify="center" bg="gray.1">
      <Item>First</Item>
      <Item>Second</Item>
    </Stack>
  );
}`,
      view: () => (
        <Stack h={140} gap="xs" align="center" justify="center" bg="gray.1">
          <Item>First</Item>
          <Item>Second</Item>
        </Stack>
      ),
      height: 180,
    },
  ],
};
