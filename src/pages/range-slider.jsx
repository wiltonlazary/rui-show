// RangeSlider: two values, minSpan, push, marks.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { RangeSlider, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'range-slider',
  group: 'choices',
  title: 'RangeSlider',
  description: 'Two values on one track: a press moves the nearer thumb, and the thumbs keep `minSpan` between them, pushing each other by default. Slider’s props apply, on every renderer.',
  props: [
    { name: 'value', type: '[number, number] | (() => [number, number])', description: 'The range, controlled: a drag only calls `onChange`.' },
    { name: 'defaultValue', type: '[number, number]', default: '[min, max]', description: 'The first range when uncontrolled.' },
    { name: 'onChange', type: '(value: [number, number]) => void', description: 'Called while dragging and on keys.' },
    { name: 'onCommit', type: '(value: [number, number]) => void', description: 'Called at the release, and on a key.' },
    { name: 'minSpan', type: 'number', default: 'step', description: 'The smallest distance between the thumbs: one step by default, so any two distinct values; 0 lets them meet.' },
    { name: 'maxSpan', type: 'number', default: 'Infinity', description: 'The largest distance between the thumbs.' },
    { name: 'push', type: 'boolean', default: 'true', description: 'The moved thumb pushes or pulls the other to keep the spans; else it stops at them.' },
    { name: 'min, max, step', type: 'number', default: '0, 100, 1', description: 'The bounds and the step, as Slider’s.' },
    { name: 'marks, snap', type: '{ value: number, label?: string }[], boolean', description: 'Marks on the track, and snapping to them, as Slider’s.' },
    { name: 'format, readout', type: '(value: number) => string, boolean', description: 'Each thumb’s readout: its text, and `true` always, `false` never (else while dragged or focused: with two thumbs, not on hover as Slider’s).' },
    { name: 'thumbLabel', type: 'string | [string, string]', default: "['Lower value', 'Upper value']", description: 'The thumbs’ names: one for both, or a pair.' },
    { name: 'size, thumbSize, radius, color, disabled, thumb', type: 'as Slider', description: 'The looks and states, as Slider’s. `fillEnd` is ignored: the bar always runs between the thumbs.' },
    { name: 'aria-label', type: 'string', description: 'Names the slider, a `group` of its thumbs; inside a Field without one, the Field’s label names it. Each thumb keeps its own name (`thumbLabel`).' },
  ],
  demos: [
    {
      title: 'An age range',
      code: `
function Demo() {
  const range = $signal($active(), [18, 64]);
  return (
    <Stack gap="md">
      <RangeSlider value={() => $read(range)} onChange={v => $write(range, v)} />
      <Text size="sm" fg="quiet">{() => \`range: \${$read(range)[0]} to \${$read(range)[1]}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const range = $signal($active(), /** @type {[number, number]} */ ([18, 64]));
        return (
          <Stack gap="md">
            <RangeSlider value={() => $read(range)} onChange={(/** @type {[number, number]} */ v) => $write(range, v)} />
            <Text size="sm" fg="quiet">
              {() => `range: ${$read(range)[0]} to ${$read(range)[1]}`}
            </Text>
          </Stack>
        );
      },
      height: 100,
    },
    {
      title: 'Marks, minSpan and maxSpan',
      code: `
function Demo() {
  const range = $signal($active(), [30, 55]);
  return (
    <Stack gap="lg">
      <RangeSlider color="teal" minSpan={20} maxSpan={50} step={5}
        marks={[{ value: 0, label: '0°' }, { value: 25, label: '25°' }, { value: 50, label: '50°' }, { value: 75, label: '75°' }, { value: 100, label: '100°' }]}
        value={() => $read(range)} onChange={v => $write(range, v)} />
      <Text size="sm" fg="quiet">{() => \`\${$read(range).join(' – ')} (20 to 50 apart)\`}</Text>
      <RangeSlider size="xs" push={false} defaultValue={[40, 70]} readout={false} />
    </Stack>
  );
}`,
      view: () => {
        const range = $signal($active(), /** @type {[number, number]} */ ([30, 55]));
        return (
          <Stack gap="lg">
            <RangeSlider
              color="teal"
              minSpan={20}
              maxSpan={50}
              step={5}
              marks={[
                { value: 0, label: '0°' },
                { value: 25, label: '25°' },
                { value: 50, label: '50°' },
                { value: 75, label: '75°' },
                { value: 100, label: '100°' },
              ]}
              value={() => $read(range)}
              onChange={(/** @type {[number, number]} */ v) => $write(range, v)}
            />
            <Text size="sm" fg="quiet">
              {() => `${$read(range).join(' – ')} (20 to 50 apart)`}
            </Text>
            <RangeSlider size="xs" push={false} defaultValue={[40, 70]} readout={false} />
          </Stack>
        );
      },
      height: 160,
    },
    {
      title: 'Readouts always on, named thumbs',
      code: `
function Demo() {
  return (
    <RangeSlider mt="xl" min={0} max={180} step={15} defaultValue={[45, 120]}
      readout format={v => \`\${v} min\`} color="purple" size="lg"
      thumbLabel={['Shortest talk', 'Longest talk']} />
  );
}`,
      view: () => <RangeSlider mt="xl" min={0} max={180} step={15} defaultValue={[45, 120]} readout format={(/** @type {number} */ v) => `${v} min`} color="purple" size="lg" thumbLabel={['Shortest talk', 'Longest talk']} />,
      height: 100,
    },
  ],
};
