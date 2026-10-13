// Flex: flexbox with every property as a prop.

import { Flex, Surface, Text } from 'rui-core';

/** @param {{ children?: any }} props */
const Item = props => (
  <Surface bordered p="xs">
    <Text size="sm">{props.children}</Text>
  </Surface>
);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'flex',
  group: 'structure',
  title: 'Flex',
  description: 'Flexbox with its every property as a prop: direction, wrap, gaps, alignment and distribution.',
  props: [
    { name: 'direction', type: "'row' | 'column'", default: "'row'", description: 'The main axis.' },
    { name: 'wrap', type: 'boolean', default: 'false', description: 'Whether children wrap.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", description: 'Space between children.' },
    { name: 'rowGap', type: "'xs' | … | number", description: 'Space between rows.' },
    { name: 'columnGap', type: "'xs' | … | number", description: 'Space between columns.' },
    { name: 'align', type: "'stretch' | 'center' | 'start' | 'end'", default: "'stretch'", description: 'Cross-axis alignment.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Main-axis distribution.' },
  ],
  demos: [
    {
      title: 'Row, spread and centered',
      code: `
const Item = props => <Surface bordered p="xs"><Text size="sm">{props.children}</Text></Surface>;

function Demo() {
  return (
    <Flex h={100} gap="sm" justify="evenly" align="center" bg="teal.0">
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Flex>
  );
}`,
      view: () => (
        <Flex h={100} gap="sm" justify="evenly" align="center" bg="teal.0">
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Flex>
      ),
      height: 140,
    },
    {
      title: 'Column, aligned to the end',
      code: `
function Demo() {
  return (
    <Flex direction="column" gap="xs" align="end">
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Flex>
  );
}`,
      view: () => (
        <Flex direction="column" gap="xs" align="end">
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Flex>
      ),
      height: 160,
    },
  ],
};
