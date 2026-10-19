// Button: variants, colors, sizes, states, a counter.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Stack, Text, CheckIcon, ChevronIcon } from 'rui-core';

const VARIANTS = ['solid', 'soft', 'outline', 'ghost', 'neutral', 'plain', 'inverse'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'button',
  group: 'actions',
  title: 'Button',
  description: 'A press target with its variants (a gradient too), theme colors, sizes and `start`/`end` content, drawn the same on every renderer, with hover and press states.',
  props: [
    { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'ghost' | 'neutral' | 'plain' | 'inverse' | 'gradient'", default: "'solid'", description: 'How the color is applied: the theme’s variant colors, or a gradient.' },
    { name: 'gradient', type: '{ colors, angle }', default: "theme.gradient (teal to indigo, 120°)", description: 'The colors of the `gradient` variant: theme colors (their accent shade), `name.shade` or hex, and the angle.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'A theme color name (its accent shade), `name.shade`, or CSS hex.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Height, side padding and font size: a field’s height at each size (`theme.sizes.control`, 24 to 52), its side padding `theme.control.pad` (10 to 24).' },
    { name: 'dense', type: 'boolean', default: 'false', description: 'Lower and tighter at the same size: `theme.sizes.dense` (18 to 36) and `theme.control.densePad` (5 to 12).' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius: a scale step or pixels (in a Button.Group the group’s frame draws the corners).' },
    { name: 'stretch', type: 'boolean', default: 'false', description: 'Takes the full width of its parent.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out; presses are ignored.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Dimmed; presses are ignored.' },
    { name: 'start', type: 'any', description: 'Content before the label (an icon).' },
    { name: 'end', type: 'any', description: 'Content after the label.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'center'", description: 'Where the label, start and end sit along the button: the portable style\'s justify words.' },
    { name: 'onPress', type: '(event) => void', description: 'Called on a press.' },
    { name: 'children', type: 'string | number | (() => string)', description: 'The label; an accessor updates it in place.' },
  ],
  demos: [
    {
      title: 'Variants',
      code: `
const VARIANTS = ['solid', 'soft', 'outline', 'ghost', 'neutral', 'plain', 'inverse'];

function Demo() {
  return (
    <Row gap="xs">
      {VARIANTS.map(variant => <Button variant={variant}>{variant}</Button>)}
    </Row>
  );
}`,
      view: () => (
        <Row gap="xs">
          {VARIANTS.map(variant => (
            <Button variant={variant}>{variant}</Button>
          ))}
        </Row>
      ),
      height: 120,
    },
    {
      title: 'Colors and sizes',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button color="teal">Teal</Button>
        <Button color="purple" variant="soft">Purple</Button>
        <Button color="orange.4">orange.4</Button>
        <Button color="#2f78c9" variant="outline">Hex</Button>
      </Row>
      <Row gap="xs" align="center">
        {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <Button size={size}>{size}</Button>)}
        <Button size="sm" dense>dense</Button>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="xs">
            <Button color="teal">Teal</Button>
            <Button color="purple" variant="soft">
              Purple
            </Button>
            <Button color="orange.4">orange.4</Button>
            <Button color="#2f78c9" variant="outline">
              Hex
            </Button>
          </Row>
          <Row gap="xs" align="center">
            {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
              <Button size={size}>{size}</Button>
            ))}
            <Button size="sm" dense>dense</Button>
          </Row>
        </Stack>
      ),
      height: 150,
    },
    {
      title: 'States and a counter',
      code: `
function Demo() {
  const count = $signal($active(), 0);
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button onPress={() => $write(count, $read(count) + 1)}>Add one</Button>
        <Button variant="soft" color="red" onPress={() => $write(count, 0)}>Reset</Button>
        <Button disabled>Disabled</Button>
        <Button variant="ghost" disabled>Ghost, disabled</Button>
        <Button loading>Loading</Button>
      </Row>
      <Text fg="quiet">{() => \`pressed \${$read(count)} times\`}</Text>
      <Button stretch variant="neutral" radius="xl">Full width, round</Button>
    </Stack>
  );
}`,
      view: () => {
        const count = $signal($active(), 0);
        return (
          <Stack gap="sm">
            <Row gap="xs">
              <Button onPress={() => $write(count, $read(count) + 1)}>Add one</Button>
              <Button variant="soft" color="red" onPress={() => $write(count, 0)}>
                Reset
              </Button>
              <Button disabled>Disabled</Button>
              <Button variant="ghost" disabled>
                Ghost, disabled
              </Button>
              <Button loading>Loading</Button>
            </Row>
            <Text fg="quiet">{() => `pressed ${$read(count)} times`}</Text>
            <Button stretch variant="neutral" radius="xl">
              Full width, round
            </Button>
          </Stack>
        );
      },
      height: 170,
    },
    {
      title: 'Gradient, start and end',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button variant="gradient">Teal to indigo</Button>
        <Button variant="gradient" gradient={{ colors: ['violet', 'magenta'], angle: 135 }}>Violet to magenta</Button>
      </Row>
      <Row gap="xs">
        <Button start={<CheckIcon size={14} />}>Saved</Button>
        <Button variant="neutral" end={<ChevronIcon size={14} />}>Options</Button>
        <Button variant="soft" w={220} justify="between" end={<ChevronIcon size={14} rotate={-90} />}>Next step</Button>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="xs">
            <Button variant="gradient">Teal to indigo</Button>
            <Button variant="gradient" gradient={{ colors: ['violet', 'magenta'], angle: 135 }}>
              Violet to magenta
            </Button>
          </Row>
          <Row gap="xs">
            <Button start={<CheckIcon size={14} />}>Saved</Button>
            <Button variant="neutral" end={<ChevronIcon size={14} />}>
              Options
            </Button>
            <Button variant="soft" w={220} justify="between" end={<ChevronIcon size={14} rotate={-90} />}>
              Next step
            </Button>
          </Row>
        </Stack>
      ),
      height: 110,
    },
  ],
};
