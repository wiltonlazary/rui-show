// Rating: a value, fractions, a hover preview, read-only, sizes and colors.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Card, Rating, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'rating',
  group: 'choices',
  title: 'Rating',
  description: 'Stars drawn as portable shapes: a press sets the value, the pointer previews the value it would set, and the arrow keys step by a fraction, on every renderer.',
  props: [
    { name: 'value', type: 'number | (() => number)', description: 'The value, controlled: a press only calls `onChange`.' },
    { name: 'defaultValue', type: 'number', default: '0', description: 'The first value when uncontrolled.' },
    { name: 'onChange', type: '(value: number) => void', description: 'Called with the pressed value, and on keys.' },
    { name: 'onHover', type: '(value: number | null) => void', description: 'Called with the value under the pointer, or null when it leaves.' },
    { name: 'count', type: 'number', default: '5', description: 'How many symbols.' },
    { name: 'divisions', type: 'number', default: '1', description: 'Parts of a symbol that can be picked: 2 for halves, 4 for quarters.' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Only shows the value: no presses, previews or keys.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'A symbol’s size: a `theme.sizes.rating` step (16 to 36 pixels), or pixels.' },
    { name: 'color', type: 'string', default: "'amber'", description: 'The full symbols’ color.' },
    { name: 'empty', type: 'any | ((index: number) => any)', default: 'a star in the page’s track color', description: 'What an empty symbol draws.' },
    { name: 'full', type: 'any | ((index: number) => any)', default: 'a star in `color`', description: 'What a full symbol draws, clipped to the fraction.' },
    { name: 'solo', type: 'boolean', default: 'false', description: 'Fills only the selected symbol, not the ones before it.' },
    { name: 'label', type: 'string', default: "'Rating'", description: 'The accessible name.' },
  ],
  demos: [
    {
      title: 'A value held by a signal',
      code: `
function Demo() {
  const value = $signal($active(), 3);
  return (
    <Row gap="lg">
      <Rating size="lg" value={() => $read(value)} onChange={v => $write(value, v)} />
      <Text size="sm" fg="quiet">{() => \`value: \${$read(value)} of 5\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const value = $signal($active(), 3);
        return (
          <Row gap="lg">
            <Rating size="lg" value={() => $read(value)} onChange={(/** @type {number} */ v) => $write(value, v)} />
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(value)} of 5`}
            </Text>
          </Row>
        );
      },
      height: 70,
    },
    {
      title: 'Fractions, a hover preview and read-only',
      code: `
function Demo() {
  const value = $signal($active(), 7 / 3);
  const hover = $signal($active(), null);
  const two = v => String(Math.round(v * 100) / 100);
  return (
    <Card bordered w={300}>
      <Text fontWeight="bold" mb="xs">Rate this recipe</Text>
      <Rating divisions={3} size="lg" color="amber" value={() => $read(value)}
        onChange={v => $write(value, v)} onHover={v => $write(hover, v)} />
      <Text size="sm" fg="quiet" mt={4}>
        {() => \`yours: \${two($read(value))}, under the pointer: \${$read(hover) == null ? 'none' : two($read(hover))}\`}
      </Text>
      <Row gap="sm" align="center" mt="md">
        <Rating value={4.2} divisions={10} readOnly size="sm" />
        <Text size="sm" fg="quiet">4.2 from 37 cooks</Text>
      </Row>
    </Card>
  );
}`,
      view: () => {
        const value = $signal($active(), 7 / 3);
        const hover = $signal($active(), /** @type {number | null} */ (null));
        const two = (/** @type {number} */ v) => String(Math.round(v * 100) / 100);
        return (
          <Card bordered w={300}>
            <Text fontWeight="bold" mb="xs">
              Rate this recipe
            </Text>
            <Rating divisions={3} size="lg" color="amber" value={() => $read(value)} onChange={(/** @type {number} */ v) => $write(value, v)} onHover={(/** @type {number | null} */ v) => $write(hover, v)} />
            <Text size="sm" fg="quiet" mt={4}>
              {() => {
                const h = $read(hover);
                return `yours: ${two($read(value))}, under the pointer: ${h == null ? 'none' : two(h)}`;
              }}
            </Text>
            <Row gap="sm" align="center" mt="md">
              <Rating value={4.2} divisions={10} readOnly size="sm" />
              <Text size="sm" fg="quiet">
                4.2 from 37 cooks
              </Text>
            </Row>
          </Card>
        );
      },
      height: 190,
    },
    {
      title: 'Sizes, colors and count',
      code: `
function Demo() {
  return (
    <Stack gap="xs">
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <Rating size={size} defaultValue={3} />)}
      <Rating color="red" count={10} defaultValue={7} />
      <Rating color="teal" solo defaultValue={4} />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
            <Rating size={size} defaultValue={3} />
          ))}
          <Rating color="red" count={10} defaultValue={7} />
          <Rating color="teal" solo defaultValue={4} />
        </Stack>
      ),
      height: 290,
    },
  ],
};
