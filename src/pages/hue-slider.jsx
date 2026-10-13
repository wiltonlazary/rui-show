// HueSlider: a hue, sizes.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { HueSlider, Stack, Text, formatColor } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hue-slider',
  group: 'choices',
  title: 'HueSlider',
  description: 'A hue from 0 to 360 on a rainbow track, ColorPicker’s hue slider on its own: dragged with the portable pointer events or stepped with the keys on its thumb, on every renderer. The ramp is a portable linear gradient through the hue’s six primaries.',
  props: [
    { name: 'value', type: 'number | (() => number)', description: 'The hue, controlled: a drag only calls `onChange`.' },
    { name: 'defaultValue', type: 'number', default: '0', description: 'The first hue when uncontrolled.' },
    { name: 'onChange', type: '(value: number) => void', description: 'Called while dragging and on keys.' },
    { name: 'onCommit', type: '(value: number) => void', description: 'Called at the release, and on a key.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'The track’s height and the thumb: 12 to 24 pixels (`theme.sizes.colorThumb`).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out; drags are ignored.' },
    { name: 'aria-label', type: 'string', default: "'Hue'", description: 'The accessible name; inside a Field without one, the Field’s label.' },
  ],
  demos: [
    {
      title: 'A dragged hue',
      code: `
function Demo() {
  const hue = $signal($active(), 210);
  return (
    <Stack gap="sm">
      <HueSlider value={() => $read(hue)} onChange={v => $write(hue, v)} />
      <Text size="sm" fg="quiet">
        {() => \`hue: \${$read(hue)}, \${formatColor({ h: $read(hue), s: 100, v: 100, a: 1 })}\`}
      </Text>
    </Stack>
  );
}`,
      view: () => {
        const hue = $signal($active(), 210);
        return (
          <Stack gap="sm">
            <HueSlider value={() => $read(hue)} onChange={(/** @type {number} */ v) => $write(hue, v)} />
            <Text size="sm" fg="quiet">
              {() => `hue: ${$read(hue)}, ${formatColor({ h: $read(hue), s: 100, v: 100, a: 1 })}`}
            </Text>
          </Stack>
        );
      },
      height: 90,
    },
    {
      title: 'Sizes',
      code: `
function Demo() {
  return (
    <Stack gap="md">
      {['xs', 'sm', 'md', 'lg', 'xl'].map((size, i) => <HueSlider size={size} defaultValue={i * 72} />)}
      <Text size="sm" fg="quiet">xs to xl</Text>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          {['xs', 'sm', 'md', 'lg', 'xl'].map((size, i) => (
            <HueSlider size={size} defaultValue={i * 72} />
          ))}
          <Text size="sm" fg="quiet">
            xs to xl
          </Text>
        </Stack>
      ),
      height: 220,
    },
  ],
};
