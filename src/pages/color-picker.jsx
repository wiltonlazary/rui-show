// ColorPicker: a value, formats, swatches, sizes.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { ColorPicker, BASE_THEME, Row, Stack, Text } from 'rui-core';

const SWATCHES = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'violet', 'magenta'].map(name => BASE_THEME.colors[name][4]);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'color-picker',
  group: 'entry',
  title: 'ColorPicker',
  description: 'A saturation panel on top; under it a round preview of the color beside the hue slider (and the alpha slider with `alpha`); then square swatches. Each thumb is a disc of the color it points at in a white ring. Dragged with portable pointer events on every renderer. The ramps are the portable style’s linear gradients: the saturation panel white to the hue with clear to black over it. The panel keeps the saturation and brightness it was given (only the numbers it shows round) and takes keys: the arrows step by 1 (10 with Shift), PageUp and PageDown move the brightness by 10, Home and End set the saturation to 0 and 100; it reads as \'Saturation N%, brightness N%\'.',
  props: [
    { name: 'value', type: 'string | null | (() => string | null)', description: 'The color as text, controlled: a drag only calls `onChange`. A value from outside moves the picker.' },
    { name: 'defaultValue', type: 'string | null', default: 'null', description: 'The first color when uncontrolled; null: no color chosen yet, and the picker starts on the theme accent.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the color in `format` while dragging, on keys and on a swatch.' },
    { name: 'onCommit', type: '(value: string) => void', description: 'Called at a release, a key or a swatch.' },
    { name: 'format', type: "'hex' | 'rgb' | 'hsl'", default: "'hex'", description: 'The text `onChange` gets. Values are read in any format.' },
    { name: 'alpha', type: 'boolean', default: 'false', description: 'Shows the alpha slider, and the value carries the alpha (#rrggbbaa, rgba(), hsla()).' },
    { name: 'picker', type: 'boolean', default: 'true', description: '`false` shows only the swatches.' },
    { name: 'swatches', type: 'string[]', description: 'Colors to pick with a press, in a grid under the picker.' },
    { name: 'swatchColumns', type: 'number', default: '8', description: 'Swatches in a row.' },
    { name: 'onSwatchPress', type: '(color: string) => void', description: 'Called with the pressed swatch’s color.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'The panel (`theme.sizes.picker`: 168 × 104, 192 × 120, 224 × 140, 264 × 164, 312 × 184) sets the width; the thumbs are `theme.sizes.colorThumb` (12, 14, 16, 20, 24).' },
    { name: 'stretch', type: 'boolean', default: 'false', description: 'Takes its parent’s width.' },
    { name: 'aria-label', type: 'string', description: 'Names the picker, a `group`; inside a Field without one, the Field’s label names it. Its hue and alpha sliders keep their own names (Hue, Alpha).' },
  ],
  demos: [
    {
      title: 'Picking a color',
      code: `
function Demo() {
  const color = $signal($active(), '#2d83db');
  return (
    <Row gap="lg" align="start">
      <ColorPicker value={() => $read(color)} onChange={v => $write(color, v)} />
      <Text size="sm" fg="quiet">{() => \`value: \${$read(color)}\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const color = $signal($active(), '#2d83db');
        return (
          <Row gap="lg" align="start">
            <ColorPicker value={() => $read(color)} onChange={(/** @type {string} */ v) => $write(color, v)} />
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(color)}`}
            </Text>
          </Row>
        );
      },
      height: 190,
    },
    {
      title: 'Formats',
      code: `
function Demo() {
  const rgba = $signal($active(), 'rgba(66, 180, 83, 0.7)');
  const hsl = $signal($active(), 'hsl(288, 54%, 49%)');
  return (
    <Row gap="lg" align="start">
      <Stack gap="xs">
        <ColorPicker size="sm" format="rgb" alpha value={() => $read(rgba)} onChange={v => $write(rgba, v)} />
        <Text size="sm" fg="quiet">{() => $read(rgba)}</Text>
      </Stack>
      <Stack gap="xs">
        <ColorPicker size="sm" format="hsl" value={() => $read(hsl)} onChange={v => $write(hsl, v)} />
        <Text size="sm" fg="quiet">{() => $read(hsl)}</Text>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const rgba = $signal($active(), 'rgba(66, 180, 83, 0.7)');
        const hsl = $signal($active(), 'hsl(288, 54%, 49%)');
        return (
          <Row gap="lg" align="start">
            <Stack gap="xs">
              <ColorPicker size="sm" format="rgb" alpha value={() => $read(rgba)} onChange={(/** @type {string} */ v) => $write(rgba, v)} />
              <Text size="sm" fg="quiet">
                {() => $read(rgba)}
              </Text>
            </Stack>
            <Stack gap="xs">
              <ColorPicker size="sm" format="hsl" value={() => $read(hsl)} onChange={(/** @type {string} */ v) => $write(hsl, v)} />
              <Text size="sm" fg="quiet">
                {() => $read(hsl)}
              </Text>
            </Stack>
          </Row>
        );
      },
      height: 220,
    },
    {
      title: 'Swatches and recent picks',
      code: `
const SWATCHES = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'violet', 'magenta']
  .map(name => BASE_THEME.colors[name][4]);

function Demo() {
  const color = $signal($active(), SWATCHES[4]);
  const recent = $signal($active(), []);
  const keep = c => $write(recent, [c, ...$read(recent).filter(r => r !== c)].slice(0, 8));
  return (
    <Row gap="lg" align="start">
      <Stack gap="xs">
        <ColorPicker swatches={SWATCHES} value={() => $read(color)} onChange={v => $write(color, v)} onCommit={keep} />
        <Text size="sm" fg="quiet">Recent</Text>
        <ColorPicker picker={false} swatches={() => $read(recent)} onSwatchPress={c => $write(color, c)} />
      </Stack>
      <Text size="sm" fg="quiet">{() => \`value: \${$read(color)}\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const color = $signal($active(), SWATCHES[4]);
        const recent = $signal($active(), /** @type {string[]} */ ([]));
        const keep = (/** @type {string} */ c) => $write(recent, [c, ...$read(recent).filter(r => r !== c)].slice(0, 8));
        return (
          <Row gap="lg" align="start">
            <Stack gap="xs">
              <ColorPicker swatches={SWATCHES} value={() => $read(color)} onChange={(/** @type {string} */ v) => $write(color, v)} onCommit={keep} />
              <Text size="sm" fg="quiet">
                Recent
              </Text>
              <ColorPicker picker={false} swatches={() => $read(recent)} onSwatchPress={(/** @type {string} */ c) => $write(color, c)} />
            </Stack>
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(color)}`}
            </Text>
          </Row>
        );
      },
      height: 300,
    },
    {
      title: 'Sizes',
      code: `
function Demo() {
  return (
    <Row gap="lg" align="start">
      <ColorPicker size="xs" defaultValue="#ff5e50" />
      <ColorPicker size="lg" format="hex" alpha defaultValue="#00b493cc" />
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg" align="start">
          <ColorPicker size="xs" defaultValue="#ff5e50" />
          <ColorPicker size="lg" format="hex" alpha defaultValue="#00b493cc" />
        </Row>
      ),
      height: 240,
    },
  ],
};
