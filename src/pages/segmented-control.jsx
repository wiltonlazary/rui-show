// SegmentedControl: a value, sizes, colors, vertical, disabled items.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { SegmentedControl, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'segmented-control',
  group: 'choices',
  title: 'SegmentedControl',
  description: 'One of several segments, with an indicator that slides between them on the Clock. Segments share the width equally (a grid), so the indicator is placed by percentages, the same on every renderer.',
  props: [
    { name: 'data', type: 'Array<string | { value: string, label?: string, disabled?: boolean }>', description: 'The segments.' },
    { name: 'value', type: 'string | (() => string)', description: 'The selected segment, held by you: a press only calls `onChange`.' },
    { name: 'defaultValue', type: 'string', default: 'the first', description: 'The first selection, when it holds its own.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the pressed segment’s value.' },
    { name: 'stretch', type: 'boolean', default: 'false', description: 'Takes its parent’s width.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Segments in a row or a column (vertical also takes the full width).' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Padding and font size of the segments.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius of the root, the segments and the indicator.' },
    { name: 'color', type: 'string', description: 'The indicator’s color (the selected text turns white); the page’s raised surface, with a small shadow, by default.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Dimmed; presses are ignored.' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Presses are ignored, drawn as usual.' },
    { name: 'aria-label', type: 'string', description: 'The group’s accessible name: what it chooses.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'base' (190)", description: 'The indicator’s slide: ms (0: no slide) or a motion preset.' },
  ],
  demos: [
    {
      title: 'Choosing a view',
      code: `
function Demo() {
  const value = $signal($active(), 'Board');
  return (
    <Stack gap="sm">
      <SegmentedControl aria-label="View" data={['List', 'Board', 'Calendar', 'Timeline']}
        value={() => $read(value)} onChange={v => $write(value, v)} />
      <Text size="sm" fg="quiet">{() => \`value: \${$read(value)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), 'Board');
        return (
          <Stack gap="sm">
            <SegmentedControl aria-label="View" data={['List', 'Board', 'Calendar', 'Timeline']} value={() => $read(value)} onChange={(/** @type {string} */ v) => $write(value, v)} />
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(value)}`}
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'Sizes, colors, stretched',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="sm" align="center">
        <SegmentedControl aria-label="Size xs" size="xs" data={['xs', 'one', 'two']} />
        <SegmentedControl aria-label="Size md" size="md" radius="xl" data={['md', 'one', 'two']} />
        <SegmentedControl aria-label="Size lg" size="lg" color="teal" data={['lg', 'teal', 'two']} />
      </Row>
      <SegmentedControl aria-label="Map type" stretch color="purple" data={[
        { value: 'map', label: 'Map' },
        { value: 'satellite', label: 'Satellite' },
        { value: 'terrain', label: 'Terrain', disabled: true },
      ]} />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="sm" align="center">
            <SegmentedControl aria-label="Size xs" size="xs" data={['xs', 'one', 'two']} />
            <SegmentedControl aria-label="Size md" size="md" radius="xl" data={['md', 'one', 'two']} />
            <SegmentedControl aria-label="Size lg" size="lg" color="teal" data={['lg', 'teal', 'two']} />
          </Row>
          <SegmentedControl
            aria-label="Map type"
            stretch
            color="purple"
            data={[
              { value: 'map', label: 'Map' },
              { value: 'satellite', label: 'Satellite' },
              { value: 'terrain', label: 'Terrain', disabled: true },
            ]}
          />
        </Stack>
      ),
      height: 150,
    },
    {
      title: 'Vertical, disabled, read-only',
      code: `
function Demo() {
  return (
    <Row gap="lg" align="start">
      <SegmentedControl aria-label="Period" orientation="vertical" data={['Day', 'Week', 'Month']} defaultValue="Week" />
      <Stack gap="sm">
        <SegmentedControl aria-label="Disabled" disabled data={['Disabled', 'Control']} />
        <SegmentedControl aria-label="Read-only" readOnly data={['Read', 'Only']} defaultValue="Only" />
      </Stack>
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg" align="start">
          <SegmentedControl aria-label="Period" orientation="vertical" data={['Day', 'Week', 'Month']} defaultValue="Week" />
          <Stack gap="sm">
            <SegmentedControl aria-label="Disabled" disabled data={['Disabled', 'Control']} />
            <SegmentedControl aria-label="Read-only" readOnly data={['Read', 'Only']} defaultValue="Only" />
          </Stack>
        </Row>
      ),
      height: 140,
    },
  ],
};
