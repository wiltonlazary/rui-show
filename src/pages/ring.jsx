// Ring: segments on a ring, a label in the middle.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Ring, Button, Row, Stack, Text } from 'rui-core';
import { $interval } from 'rui-core/hooks';

/** A disk of 128 GB: what fills it, in GB. */
const STORAGE = [
  { name: 'Photos', gb: 34, color: 'indigo' },
  { name: 'Apps', gb: 18, color: 'teal' },
  { name: 'Other', gb: 9, color: 'amber' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'ring',
  group: 'status',
  title: 'Ring',
  description: 'Segments on a ring, clockwise from the top, with a label in the middle; the ring is drawn with Shape, the same on every renderer.',
  props: [
    { name: 'segments', type: '{ value: number, color: string }[]', default: '[]', description: 'The arcs, in percents of the ring, one after another.' },
    { name: 'size', type: 'number', default: 'sizes.box.ring (112)', description: 'The ring’s side in pixels.' },
    { name: 'thickness', type: "number | 'xs' … 'xl'", default: "'lg' (10)", description: 'The stroke’s width: pixels or a `theme.sizes.progress` step.' },
    { name: 'label', type: 'string | (() => string) | any', description: 'Centered inside the ring, clear of it by its thickness plus `spacing.xs` (8 px): text becomes a Label (and the value’s `aria-valuetext`), other children show as they are.' },
    { name: 'round', type: 'boolean', default: 'false', description: 'Round ends on each segment.' },
    { name: 'trackColor', type: 'string', default: 'the page’s track', description: 'The unfilled part’s color.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'calm' (300)", description: 'How long the segments take to follow new values: ms or a motion preset.' },
  ],
  demos: [
    {
      title: 'Segments and a label',
      code: `
const STORAGE = [
  { name: 'Photos', gb: 34, color: 'indigo' },
  { name: 'Apps', gb: 18, color: 'teal' },
  { name: 'Other', gb: 9, color: 'amber' },
];

function Demo() {
  const left = $signal($active(), 60);
  const timer = $interval(() => {
    $write(left, Math.max(0, $read(left) - 1));
    if ($read(left) === 0) timer.stop();
  }, 1000);
  return (
    <Row gap="xl">
      <Row gap="sm">
        <Ring
          segments={STORAGE.map(s => ({ value: (s.gb / 128) * 100, color: s.color }))}
          label={<Stack gap={0} align="center"><Text size="sm" fontWeight={700}>61 GB</Text><Text size="xs" fg="quiet">of 128</Text></Stack>}
        />
        <Stack gap={2}>
          {STORAGE.map(s => <Text size="xs" fg={s.color}>{\`\${s.name} \${s.gb} GB\`}</Text>)}
        </Stack>
      </Row>
      <Row gap="sm">
        <Ring round segments={() => [{ value: ($read(left) / 60) * 100, color: 'red' }]} label={() => \`\${$read(left)} s\`} />
        <Button size="xs" variant="soft" onPress={() => { if ($read(left) === 0) $write(left, 60); timer.toggle(); }}>
          {() => ($read(timer.value) ? 'Hold' : 'Count down')}
        </Button>
      </Row>
    </Row>
  );
}`,
      view: () => {
        const left = $signal($active(), 60);
        const timer = $interval(() => {
          $write(left, Math.max(0, $read(left) - 1));
          if ($read(left) === 0) timer.stop();
        }, 1000);
        return (
          <Row gap="xl">
            <Row gap="sm">
              <Ring
                segments={STORAGE.map(s => ({ value: (s.gb / 128) * 100, color: s.color }))}
                label={
                  <Stack gap={0} align="center">
                    <Text size="sm" fontWeight={700}>
                      61 GB
                    </Text>
                    <Text size="xs" fg="quiet">
                      of 128
                    </Text>
                  </Stack>
                }
              />
              <Stack gap={2}>
                {STORAGE.map(s => (
                  <Text size="xs" fg={s.color}>{`${s.name} ${s.gb} GB`}</Text>
                ))}
              </Stack>
            </Row>
            <Row gap="sm">
              <Ring round segments={() => [{ value: ($read(left) / 60) * 100, color: 'red' }]} label={() => `${$read(left)} s`} />
              <Button
                size="xs"
                variant="soft"
                onPress={() => {
                  if ($read(left) === 0) $write(left, 60);
                  timer.toggle();
                }}
              >
                {() => ($read(timer.value) ? 'Hold' : 'Count down')}
              </Button>
            </Row>
          </Row>
        );
      },
      height: 130,
    },
    {
      title: 'Size, thickness and track color',
      code: `
function Demo() {
  return (
    <Row gap="lg" align="center">
      <Ring size={60} segments={[{ value: 30, color: 'blue' }]} />
      <Ring size={90} thickness={4} segments={[{ value: 50, color: 'red' }]} />
      <Ring size={120} thickness={20} round segments={[{ value: 64, color: 'amber.6' }]} trackColor="amber.1" label="64%" />
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg" align="center">
          <Ring size={60} segments={[{ value: 30, color: 'blue' }]} />
          <Ring size={90} thickness={4} segments={[{ value: 50, color: 'red' }]} />
          <Ring size={120} thickness={20} round segments={[{ value: 64, color: 'amber.6' }]} trackColor="amber.1" label="64%" />
        </Row>
      ),
      height: 130,
    },
    {
      title: 'A value that changes',
      code: `
function Demo() {
  const value = $signal($active(), 25);
  return (
    <Row gap="lg">
      <Ring round segments={() => [{ value: $read(value), color: 'indigo' }]} label={() => \`\${$read(value)}%\`} />
      <Stack gap="xs">
        <Button size="xs" onPress={() => $write(value, Math.min(100, $read(value) + 25))}>Add 25</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(value, 0)}>Reset</Button>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const value = $signal($active(), 25);
        return (
          <Row gap="lg">
            <Ring round segments={() => [{ value: $read(value), color: 'indigo' }]} label={() => `${$read(value)}%`} />
            <Stack gap="xs">
              <Button size="xs" onPress={() => $write(value, Math.min(100, $read(value) + 25))}>
                Add 25
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(value, 0)}>
                Reset
              </Button>
            </Stack>
          </Row>
        );
      },
      height: 130,
    },
  ],
};
