// $counter: a number kept within bounds.

import { $read } from 'rrx-core';
import { $counter } from 'rui-core/hooks';
import { Button, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-counter',
  group: 'behavior',
  title: '$counter',
  description: 'A number kept within `min` and `max`, in one handle: its `value`, `add` (a negative step takes away), `set` and `reset`.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'initial', type: 'number', default: '0', description: 'The value at first (clamped), and what `reset` returns to.' },
    { name: 'options.min', type: 'number', description: 'The lowest value.' },
    { name: 'options.max', type: 'number', description: 'The highest value.' },
    { name: 'returns', type: '{ value, add(n = 1), set(n), reset() }', description: 'The count (a node) and its commands; each keeps it within the bounds.' },
  ],
  demos: [
    {
      title: 'A cart quantity, from 1 to 9',
      code: `
function Demo() {
  const quantity = $counter(1, { min: 1, max: 9 });
  return (
    <Stack gap="sm">
      <Text fontWeight={600}>Linen tea towel, 6 € each</Text>
      <Row gap="xs" align="center">
        <Button size="xs" variant="neutral" label="One less" disabled={() => $read(quantity.value) === 1} onPress={() => quantity.add(-1)}>−</Button>
        <Text w={32} textAlign="center">{() => String($read(quantity.value))}</Text>
        <Button size="xs" variant="neutral" label="One more" disabled={() => $read(quantity.value) === 9} onPress={() => quantity.add()}>+</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => \`Subtotal: \${$read(quantity.value) * 6} €\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const quantity = $counter(1, { min: 1, max: 9 });
        return (
          <Stack gap="sm">
            <Text fontWeight={600}>Linen tea towel, 6 € each</Text>
            <Row gap="xs" align="center">
              <Button size="xs" variant="neutral" label="One less" disabled={() => $read(quantity.value) === 1} onPress={() => quantity.add(-1)}>
                −
              </Button>
              <Text w={32} textAlign="center">
                {() => String($read(quantity.value))}
              </Text>
              <Button size="xs" variant="neutral" label="One more" disabled={() => $read(quantity.value) === 9} onPress={() => quantity.add()}>
                +
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `Subtotal: ${$read(quantity.value) * 6} €`}
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
  ],
};
