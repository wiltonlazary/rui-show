// AngleSlider: an angle, steps, marks, format, sizes.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { AngleSlider, Row, Stack, Text } from 'rui-core';

const DIAL = Array.from({ length: 12 }, (_, i) => ({ value: i * 30 }));

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'angle-slider',
  group: 'choices',
  title: 'AngleSlider',
  description: 'An angle from 0 to 359 degrees, 0 at the top and clockwise, dragged around a round press area or stepped with the arrow keys onto the step grid; End is the last grid value below 360. It is the same on every renderer.',
  props: [
    { name: 'value', type: 'number | (() => number)', description: 'The angle, controlled: a drag only calls `onChange`.' },
    { name: 'defaultValue', type: 'number', default: '0', description: 'The first angle when uncontrolled.' },
    { name: 'onChange', type: '(value: number) => void', description: 'Called while dragging and on keys.' },
    { name: 'onCommit', type: '(value: number) => void', description: 'Called at the release, and on a key.' },
    { name: 'step', type: 'number', default: '1', description: 'The angle moves by this (a step not above 0 is 1).' },
    { name: 'size', type: 'number', default: '64', description: 'The diameter, in pixels.' },
    { name: 'thumbSize', type: 'number', default: '6', description: 'The thumb’s diameter.' },
    { name: 'color', type: 'string', default: 'the page’s text color', description: 'The thumb’s color.' },
    { name: 'readout', type: 'boolean', default: 'true', description: 'Shows the angle in the middle.' },
    { name: 'format', type: '(value: number) => string', default: '`${value}°`', description: 'The readout’s text.' },
    { name: 'marks', type: '{ value: number }[]', description: 'Dots on the rim.' },
    { name: 'snap', type: 'boolean', default: 'false', description: 'The angle can only be a mark’s; keys go mark to mark, Home and End to the first and last.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out; drags and keys are ignored.' },
    { name: 'aria-label', type: 'string', default: "'Angle'", description: 'The accessible name; inside a Field without one, the Field’s label.' },
  ],
  demos: [
    {
      title: 'A dragged angle',
      code: `
function Demo() {
  const angle = $signal($active(), 90);
  return (
    <Row gap="lg">
      <AngleSlider value={() => $read(angle)} onChange={v => $write(angle, v)} />
      <Text size="sm" fg="quiet">{() => \`angle: \${$read(angle)} degrees\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const angle = $signal($active(), 90);
        return (
          <Row gap="lg">
            <AngleSlider value={() => $read(angle)} onChange={(/** @type {number} */ v) => $write(angle, v)} />
            <Text size="sm" fg="quiet">
              {() => `angle: ${$read(angle)} degrees`}
            </Text>
          </Row>
        );
      },
      height: 100,
    },
    {
      title: 'Marks, steps and sizes',
      code: `
const DIAL = Array.from({ length: 12 }, (_, i) => ({ value: i * 30 }));

function Demo() {
  const hour = $signal($active(), 60);
  return (
    <Stack gap="sm">
      <Row gap="lg" align="center">
        <AngleSlider size={40} thumbSize={6} step={15} defaultValue={30} />
        <AngleSlider size={80} marks={DIAL} snap color="blue"
          value={() => $read(hour)} onChange={v => $write(hour, v)} />
        <AngleSlider size={100} thumbSize={12} color="teal" defaultValue={200}
          format={v => \`\${Math.round(v / 3.6)}%\`} />
        <AngleSlider readout={false} defaultValue={300} />
        <AngleSlider disabled defaultValue={120} />
      </Row>
      <Text size="sm" fg="quiet">{() => \`dial: \${$read(hour)}°\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const hour = $signal($active(), 60);
        return (
          <Stack gap="sm">
            <Row gap="lg" align="center">
              <AngleSlider size={40} thumbSize={6} step={15} defaultValue={30} />
              <AngleSlider size={80} marks={DIAL} snap color="blue" value={() => $read(hour)} onChange={(/** @type {number} */ v) => $write(hour, v)} />
              <AngleSlider size={100} thumbSize={12} color="teal" defaultValue={200} format={(/** @type {number} */ v) => `${Math.round(v / 3.6)}%`} />
              <AngleSlider readout={false} defaultValue={300} />
              <AngleSlider disabled defaultValue={120} />
            </Row>
            <Text size="sm" fg="quiet">
              {() => `dial: ${$read(hour)}°`}
            </Text>
          </Stack>
        );
      },
      height: 180,
    },
  ],
};
