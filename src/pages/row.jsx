// Row: children in a row.

import { Row, Surface, Stack, Text } from 'rui-core';

/** @param {{ children?: any }} props */
const Item = props => (
  <Surface bordered p="xs">
    <Text size="sm">{props.children}</Text>
  </Surface>
);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'row',
  group: 'structure',
  title: 'Row',
  description: 'Children in a row that wraps, with a theme gap; `fill` gives each an equal share of the width.',
  props: [
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Space between children.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Main-axis distribution, in rui’s words.' },
    { name: 'align', type: "'center' | 'start' | 'end' | 'stretch'", default: "'center'", description: 'Cross-axis alignment.' },
    { name: 'wrap', type: 'boolean', default: 'true', description: 'Whether children wrap onto new lines.' },
    { name: 'fill', type: 'boolean', default: 'false', description: 'Each child as rendered takes an equal share of the row: each of a `For`’s items or an accessor’s parts, and none for a `Show` showing nothing.' },
  ],
  demos: [
    {
      title: 'Justify and fill',
      code: `
const Item = props => <Surface bordered p="xs"><Text size="sm">{props.children}</Text></Surface>;

function Demo() {
  return (
    <Stack gap="md">
      <Row><Item>Start</Item><Item>of</Item><Item>row</Item></Row>
      <Row justify="center"><Item>Centered</Item><Item>items</Item></Row>
      <Row justify="between"><Item>Between</Item><Item>the</Item><Item>ends</Item></Row>
      <Row fill><Item>Fill</Item><Item>equal</Item><Item>shares</Item></Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <Row>
            <Item>Start</Item>
            <Item>of</Item>
            <Item>row</Item>
          </Row>
          <Row justify="center">
            <Item>Centered</Item>
            <Item>items</Item>
          </Row>
          <Row justify="between">
            <Item>Between</Item>
            <Item>the</Item>
            <Item>ends</Item>
          </Row>
          <Row fill>
            <Item>Fill</Item>
            <Item>equal</Item>
            <Item>shares</Item>
          </Row>
        </Stack>
      ),
      height: 250,
    },
  ],
};
