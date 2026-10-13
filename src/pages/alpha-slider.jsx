// AlphaSlider: an alpha over a color, sizes.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { AlphaSlider, BASE_THEME, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'alpha-slider',
  group: 'choices',
  title: 'AlphaSlider',
  description: 'An alpha from 0 to 1 over a color and a checkerboard, ColorPicker’s alpha slider on its own, dragged or stepped with the keys on every renderer. The ramp is a portable linear gradient from clear to the color.',
  props: [
    { name: 'value', type: 'number | (() => number)', description: 'The alpha, controlled: a drag only calls `onChange`.' },
    { name: 'defaultValue', type: 'number', default: '1', description: 'The first alpha when uncontrolled.' },
    { name: 'onChange', type: '(value: number) => void', description: 'Called while dragging and on keys (steps of 0.01).' },
    { name: 'onCommit', type: '(value: number) => void', description: 'Called at the release, and on a key.' },
    { name: 'color', type: 'string', default: "'#000000'", description: 'The color the alpha applies to: hex, rgb(a) or hsl(a).' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'The track’s height and the thumb: 12 to 24 pixels (`theme.sizes.colorThumb`).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out; drags are ignored.' },
    { name: 'aria-label', type: 'string', default: "'Alpha'", description: 'The accessible name; inside a Field without one, the Field’s label.' },
  ],
  demos: [
    {
      title: 'An alpha over indigo',
      code: `
function Demo() {
  const alpha = $signal($active(), 0.55);
  return (
    <Stack gap="sm">
      <AlphaSlider color={BASE_THEME.colors.indigo[6]} value={() => $read(alpha)} onChange={v => $write(alpha, v)} />
      <Text size="sm" fg="quiet">{() => \`alpha: \${$read(alpha)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const alpha = $signal($active(), 0.55);
        return (
          <Stack gap="sm">
            <AlphaSlider color={BASE_THEME.colors.indigo[6]} value={() => $read(alpha)} onChange={(/** @type {number} */ v) => $write(alpha, v)} />
            <Text size="sm" fg="quiet">
              {() => `alpha: ${$read(alpha)}`}
            </Text>
          </Stack>
        );
      },
      height: 90,
    },
    {
      title: 'Colors and sizes',
      code: `
function Demo() {
  return (
    <Stack gap="md">
      {['xs', 'sm', 'md', 'lg', 'xl'].map((size, i) => (
        <AlphaSlider size={size} defaultValue={0.2 + i * 0.2}
          color={BASE_THEME.colors[['red', 'purple', 'teal', 'orange', 'night'][i]][6]} />
      ))}
      <Text size="sm" fg="quiet">xs to xl</Text>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          {['xs', 'sm', 'md', 'lg', 'xl'].map((size, i) => (
            <AlphaSlider size={size} defaultValue={0.2 + i * 0.2} color={BASE_THEME.colors[['red', 'purple', 'teal', 'orange', 'night'][i]][6]} />
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
