// Arc: an arc of a ring as a gauge (a half by default), colored by its value, with its label inside, under or beside it.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Arc, Button, Row, Stack, Text } from 'rui-core';

/** The fill's color for a percent: calm, then a warning, then full. @param {number} v */
const toneOf = v => (v < 60 ? 'teal' : v < 85 ? 'amber' : 'red');

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'arc',
  group: 'status',
  title: 'Arc',
  description: 'An arc of a ring filled to a percent: a half standing over the top by default, or any `sweep` from any `start`, with a label in its middle, under it or beside it; drawn with Shape, the same on every renderer, and able to follow a new value over `duration`.',
  props: [
    { name: 'value', type: 'number | (() => number)', default: '0', description: 'The filled percent, 0 to 100.' },
    { name: 'size', type: 'number', default: 'sizes.box.arc (180)', description: 'The side of the ring the arc is part of; the component takes the arc’s own bounds (180 × 90 for the default half).' },
    { name: 'thickness', type: "number | 'xs' … 'xl'", default: "'xl' (14)", description: 'The stroke’s width: pixels or a `theme.sizes.progress` step.' },
    { name: 'sweep', type: 'number', default: '180', description: 'The degrees the arc spans, up to 360 either way; a negative sweep runs counterclockwise, so the fill starts from the other end.' },
    { name: 'start', type: 'number', default: '-sweep / 2', description: 'The angle the arc and its fill start at, in degrees clockwise from the top; by default the arc stands centered over the top (-90 for the half ring). 90 for `sweep={-180}`.' },
    { name: 'fillColor', type: 'string | (() => string)', default: 'theme.accent', description: 'The fill’s color (`color` is read when it is unset).' },
    { name: 'trackColor', type: 'string', default: 'the page’s track', description: 'The unfilled part’s color.' },
    { name: 'label', type: "false | true | string | (() => string) | any | { at?: 'center' | 'bottom' | 'end', text?: any }", default: 'false', description: 'A part: true shows the value as a percent; text or a node goes in the middle; options place it at `center`, `bottom` (under the arc) or `end` (beside it), `theme.spacing.xs` away. Text is at the small font size in the text color and names the value for assistive tech.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'calm' (300)", description: 'How long a new value takes to be reached: ms or a motion preset.' },
  ],
  demos: [
    {
      title: 'A gauge',
      code: `
function Demo() {
  const speed = $signal($active(), 3);
  return (
    <Row gap="lg">
      <Arc value={() => $read(speed) * 20} size={200} thickness={18} label={{ at: 'bottom', text: () => \`Fan speed \${$read(speed)} of 5\` }} />
      <Stack gap="xs">
        <Button size="xs" onPress={() => $write(speed, Math.min(5, $read(speed) + 1))}>Faster</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(speed, Math.max(0, $read(speed) - 1))}>Slower</Button>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const speed = $signal($active(), 3);
        return (
          <Row gap="lg">
            <Arc value={() => $read(speed) * 20} size={200} thickness={18} label={{ at: 'bottom', text: () => `Fan speed ${$read(speed)} of 5` }} />
            <Stack gap="xs">
              <Button size="xs" onPress={() => $write(speed, Math.min(5, $read(speed) + 1))}>
                Faster
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(speed, Math.max(0, $read(speed) - 1))}>
                Slower
              </Button>
            </Stack>
          </Row>
        );
      },
      height: 140,
    },
    {
      title: 'Color by value',
      code: `
const toneOf = v => (v < 60 ? 'teal' : v < 85 ? 'amber' : 'red');

function Demo() {
  const disk = $signal($active(), 71);
  return (
    <Row gap="lg">
      <Arc value={34} size={140} fillColor={toneOf(34)} label="Memory 34%" />
      <Arc value={disk} size={140} fillColor={() => toneOf($read(disk))} label={() => \`Disk \${$read(disk)}%\`} />
      <Button size="xs" variant="neutral" onPress={() => $write(disk, $read(disk) >= 95 ? 40 : $read(disk) + 8)}>Fill the disk</Button>
    </Row>
  );
}`,
      view: () => {
        const disk = $signal($active(), 71);
        return (
          <Row gap="lg">
            <Arc value={34} size={140} fillColor={toneOf(34)} label="Memory 34%" />
            <Arc value={disk} size={140} fillColor={() => toneOf($read(disk))} label={() => `Disk ${$read(disk)}%`} />
            <Button size="xs" variant="neutral" onPress={() => $write(disk, $read(disk) >= 95 ? 40 : $read(disk) + 8)}>
              Fill the disk
            </Button>
          </Row>
        );
      },
      height: 90,
    },
    {
      title: 'Label inside',
      code: `
function Demo() {
  return (
    <Arc value={58} size={200} thickness={10} label={
      <Stack gap={0} align="center">
        <Text size="xl" fontWeight={700}>58</Text>
        <Text size="xs" fg="quiet">of 100 points</Text>
      </Stack>
    } />
  );
}`,
      view: () => (
        <Arc
          value={58}
          size={200}
          thickness={10}
          label={
            <Stack gap={0} align="center">
              <Text size="xl" fontWeight={700}>
                58
              </Text>
              <Text size="xs" fg="quiet">
                of 100 points
              </Text>
            </Stack>
          }
        />
      ),
      height: 110,
    },
    {
      title: 'Sweep, start and a sweep the other way',
      code: `
function Demo() {
  return (
    <Row gap="xl" align="start">
      <Arc value={72} size={140} sweep={270} label />
      <Arc value={25} size={160} start={90} fillColor="violet" label={{ at: 'end', text: '25% left' }} />
      <Arc value={40} size={120} sweep={90} start={0} fillColor="teal" label={{ at: 'bottom', text: 'A quarter' }} />
      <Arc value={30} size={120} sweep={-180} fillColor="orange" label={{ at: 'bottom', text: 'From the right' }} />
    </Row>
  );
}`,
      view: () => (
        <Row gap="xl" align="start">
          <Arc value={72} size={140} sweep={270} label />
          <Arc value={25} size={160} start={90} fillColor="violet" label={{ at: 'end', text: '25% left' }} />
          <Arc value={40} size={120} sweep={90} start={0} fillColor="teal" label={{ at: 'bottom', text: 'A quarter' }} />
          <Arc value={30} size={120} sweep={-180} fillColor="orange" label={{ at: 'bottom', text: 'From the right' }} />
        </Row>
      ),
      height: 150,
    },
  ],
};
