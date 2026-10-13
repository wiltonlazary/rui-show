// Divider: a line between content, with an optional label.

import { Divider, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'divider',
  group: 'structure',
  title: 'Divider',
  description: 'A horizontal or vertical line between content, solid, dashed or dotted (a border), optionally labeled at the start, center or end (`labelAt`).',
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'A line across (in a column) or up and down (in a row, stretched to its height).' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'xs'", description: 'The thickness: 1, 1, 2, 3 and 4 pixels by step, or pixels.' },
    { name: 'color', type: 'string', description: 'A theme color, `name.shade` or CSS hex; the page’s rule color (gray.2, night.5 in the dark scheme) by default.' },
    { name: 'line', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", description: 'The line’s style.' },
    { name: 'label', type: 'string | number | any', description: 'Content in the line (horizontal only): text in the quiet color, or any view.' },
    { name: 'labelAt', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Where the label sits: a short line on that side.' },
    { name: 'style props', type: 'm, my, w, …', description: 'As Box.' },
  ],
  demos: [
    {
      title: 'A label in the middle',
      code: `
function Demo() {
  return (
    <Stack gap="md">
      <Text size="sm">Your order: 3 items</Text>
      <Divider label="Delivery" />
      <Text size="sm">Tomorrow, 9:00 to 12:00</Text>
      <Divider label="Payment" labelAt="center" line="dashed" />
      <Text size="sm">Card ending in 4417</Text>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <Text size="sm">Your order: 3 items</Text>
          <Divider label="Delivery" />
          <Text size="sm">Tomorrow, 9:00 to 12:00</Text>
          <Divider label="Payment" labelAt="center" line="dashed" />
          <Text size="sm">Card ending in 4417</Text>
        </Stack>
      ),
      height: 150,
    },
    {
      title: 'Labels at the start and end',
      code: `
function Demo() {
  return (
    <Stack gap="md">
      <Divider label="New since you left" labelAt="start" color="indigo.3" />
      <Divider label="Older" labelAt="end" />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <Divider label="New since you left" labelAt="start" color="indigo.3" />
          <Divider label="Older" labelAt="end" />
        </Stack>
      ),
      height: 80,
    },
    {
      title: 'Thickness and color',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Text size="sm">xs, the default: 1 pixel in the rule color</Text>
      <Divider />
      <Text size="sm">md in indigo: 2 pixels</Text>
      <Divider size="md" color="indigo" />
      <Text size="sm">xl in amber.5: 4 pixels</Text>
      <Divider size="xl" color="amber.5" />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Text size="sm">xs, the default: 1 pixel in the rule color</Text>
          <Divider />
          <Text size="sm">md in indigo: 2 pixels</Text>
          <Divider size="md" color="indigo" />
          <Text size="sm">xl in amber.5: 4 pixels</Text>
          <Divider size="xl" color="amber.5" />
        </Stack>
      ),
      height: 140,
    },
    {
      title: 'Vertical, in a status bar',
      code: `
function Demo() {
  return (
    <Row gap="sm" h={24}>
      <Text size="xs">Ln 12, Col 4</Text>
      <Divider orientation="vertical" />
      <Text size="xs">UTF-8</Text>
      <Divider orientation="vertical" />
      <Text size="xs">Spaces: 2</Text>
      <Divider orientation="vertical" size="md" color="teal" />
      <Text size="xs" fg="teal">Saved</Text>
    </Row>
  );
}`,
      view: () => (
        <Row gap="sm" h={24}>
          <Text size="xs">Ln 12, Col 4</Text>
          <Divider orientation="vertical" />
          <Text size="xs">UTF-8</Text>
          <Divider orientation="vertical" />
          <Text size="xs">Spaces: 2</Text>
          <Divider orientation="vertical" size="md" color="teal" />
          <Text size="xs" fg="teal">Saved</Text>
        </Row>
      ),
      height: 60,
    },
    {
      title: 'Solid, dashed and dotted',
      code: `
function Demo() {
  return (
    <Stack gap="md">
      <Divider line="solid" />
      <Divider line="dashed" size="md" />
      <Divider line="dotted" size="lg" color="violet" />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <Divider line="solid" />
          <Divider line="dashed" size="md" />
          <Divider line="dotted" size="lg" color="violet" />
        </Stack>
      ),
      height: 90,
    },
  ],
};
