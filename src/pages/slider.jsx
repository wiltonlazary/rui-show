// Slider: a value, marks, sizes, the readout, steps.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Slider, Stack, Text } from 'rui-core';

const MARKS = [
  { value: 15, label: 'hush' },
  { value: 50, label: 'room' },
  { value: 85, label: 'party' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'slider',
  group: 'choices',
  title: 'Slider',
  description: 'A value on a track, dragged with the portable pointer events and pointer capture, or stepped with the keys on its focused thumb, the same on every renderer. The readout shows on hover, drag and focus.',
  props: [
    { name: 'value', type: 'number | (() => number)', description: 'The value, controlled: a drag only calls `onChange`.' },
    { name: 'defaultValue', type: 'number', default: 'min', description: 'The first value when uncontrolled.' },
    { name: 'onChange', type: '(value: number) => void', description: 'Called while dragging and on keys.' },
    { name: 'onCommit', type: '(value: number) => void', description: 'Called at the release, and on a key.' },
    { name: 'min', type: 'number', default: '0', description: 'The smallest value.' },
    { name: 'max', type: 'number', default: '100', description: 'The largest value.' },
    { name: 'step', type: 'number', default: '1', description: 'The value moves by this, from `min`, without float noise; the arrows step onto that grid in the direction of travel (a step not above 0 is 1).' },
    { name: 'marks', type: '{ value: number, label?: string }[]', description: 'Dots on the track, with their labels under it.' },
    { name: 'snap', type: 'boolean', default: 'false', description: 'The value can only be a mark’s; keys go mark to mark, Home and End to the first and last.' },
    { name: 'format', type: '(value: number) => string', default: 'the value', description: 'The readout’s text.' },
    { name: 'readout', type: 'boolean', description: 'The value over the thumb: `true` always, `false` never; by default while dragged, focused or hovered.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The track’s height: 3 to 10 pixels, or pixels; the thumb is 10 to 26 (the track + 8 for a number), with a 2 px ring.' },
    { name: 'thumbSize', type: 'number', default: '10 to 26 (18 at md)', description: 'The thumb’s diameter; with a pixel `size`, the track’s plus 8.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'The track’s and bar’s corner radius.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The bar’s and thumb’s color.' },
    { name: 'fillEnd', type: 'boolean', default: 'false', description: 'The fill runs from the thumb to the end instead of from the start.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out, no readout; drags and keys are ignored.' },
    { name: 'thumbLabel', type: 'string', default: "'Slider thumb'", description: 'The thumb’s accessible name; inside a Field without one (or an `aria-label`), the Field’s label.' },
    { name: 'aria-label', type: 'string', description: 'Also names the thumb: after `thumbLabel`, before the Field’s label.' },
    { name: 'thumb', type: 'any', description: 'Content inside the thumb.' },
  ],
  demos: [
    {
      title: 'Volume, saved at release',
      code: `
function Demo() {
  const volume = $signal($active(), 40);
  const saved = $signal($active(), false);
  return (
    <Stack gap="md">
      <Slider thumbLabel="Volume" format={v => \`\${v} %\`} value={() => $read(volume)}
        onChange={v => { $write(volume, v); $write(saved, false); }} onCommit={() => $write(saved, true)} />
      <Text size="sm" fg="quiet">{() => \`Volume \${$read(volume)} %\${$read(saved) ? ', Saved' : ''}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const volume = $signal($active(), 40);
        const saved = $signal($active(), false);
        return (
          <Stack gap="md">
            <Slider
              thumbLabel="Volume"
              format={(/** @type {number} */ v) => `${v} %`}
              value={() => $read(volume)}
              onChange={(/** @type {number} */ v) => {
                $write(volume, v);
                $write(saved, false);
              }}
              onCommit={() => $write(saved, true)}
            />
            <Text size="sm" fg="quiet">
              {() => `Volume ${$read(volume)} %${$read(saved) ? ', Saved' : ''}`}
            </Text>
          </Stack>
        );
      },
      height: 100,
    },
    {
      title: 'Marks',
      code: `
const MARKS = [
  { value: 15, label: 'hush' },
  { value: 50, label: 'room' },
  { value: 85, label: 'party' },
];

function Demo() {
  const value = $signal($active(), 50);
  return (
    <Stack gap="lg">
      <Slider thumbLabel="Volume" defaultValue={40} marks={MARKS} />
      <Slider thumbLabel="Snapped volume" snap marks={MARKS} value={() => $read(value)} onChange={v => $write(value, v)} color="teal" />
      <Text size="sm" fg="quiet">{() => \`volume, snapped to a mark: \${$read(value)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), 50);
        return (
          <Stack gap="lg">
            <Slider thumbLabel="Volume" defaultValue={40} marks={MARKS} />
            <Slider thumbLabel="Snapped volume" snap marks={MARKS} value={() => $read(value)} onChange={(/** @type {number} */ v) => $write(value, v)} color="teal" />
            <Text size="sm" fg="quiet">
              {() => `volume, snapped to a mark: ${$read(value)}`}
            </Text>
          </Stack>
        );
      },
      height: 190,
    },
    {
      title: 'Sizes and colors',
      code: `
function Demo() {
  return (
    <Stack gap="lg">
      {['xs', 'sm', 'md', 'lg', 'xl'].map((size, i) => (
        <Slider thumbLabel={\`Size \${size}\`} size={size} defaultValue={20 + i * 15} color={['blue', 'cyan', 'teal', 'purple', 'orange'][i]} />
      ))}
      <Slider thumbLabel="Thin" size={2} thumbSize={14} radius={0} defaultValue={60} fillEnd />
      <Text size="sm" fg="quiet">xs to xl, then 2 pixels, filled to the end</Text>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="lg">
          {['xs', 'sm', 'md', 'lg', 'xl'].map((size, i) => (
            <Slider thumbLabel={`Size ${size}`} size={size} defaultValue={20 + i * 15} color={['blue', 'cyan', 'teal', 'purple', 'orange'][i]} />
          ))}
          <Slider thumbLabel="Thin" size={2} thumbSize={14} radius={0} defaultValue={60} fillEnd />
          <Text size="sm" fg="quiet">
            xs to xl, then 2 pixels, filled to the end
          </Text>
        </Stack>
      ),
      height: 280,
    },
    {
      title: 'Readout, step and range',
      code: `
function Demo() {
  const level = $signal($active(), 20);
  return (
    <Stack gap="xl">
      <Slider thumbLabel="Level" min={-10} max={40} step={0.5} readout mt="xl"
        format={v => \`\${v} m\`} value={() => $read(level)} onChange={v => $write(level, v)} />
      <Text size="sm" fg="quiet">{() => \`reservoir level: \${$read(level)} m\`}</Text>
      <Slider thumbLabel="Disabled" readout={false} defaultValue={30} disabled />
    </Stack>
  );
}`,
      view: () => {
        const level = $signal($active(), 20);
        return (
          <Stack gap="xl">
            <Slider thumbLabel="Level" min={-10} max={40} step={0.5} readout mt="xl" format={(/** @type {number} */ v) => `${v} m`} value={() => $read(level)} onChange={(/** @type {number} */ v) => $write(level, v)} />
            <Text size="sm" fg="quiet">
              {() => `reservoir level: ${$read(level)} m`}
            </Text>
            <Slider thumbLabel="Disabled" readout={false} defaultValue={30} disabled />
          </Stack>
        );
      },
      height: 190,
    },
  ],
};
