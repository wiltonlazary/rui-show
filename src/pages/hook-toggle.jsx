// $toggle: cycles through a list of values.

import { $read } from 'rrx-core';
import { $toggle } from 'rui-core/hooks';
import { Button, Row, Stack, Text, Badge } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-toggle',
  group: 'behavior',
  title: '$toggle',
  description: 'Cycles through a list of values, `[false, true]` by default. It returns one handle: `value`, `next()` for the next value (after the last, the first again) and `set(value)` to jump to one.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'options', type: 'readonly T[]', default: '[false, true]', description: 'The values, in order; the first is the value at first.' },
    { name: 'returns', type: 'ToggleHandle<T>: { value: Readable<T>, next(), set(value: T) }', description: 'The current value, the move to the next one, and a jump to the one given.' },
  ],
  demos: [
    {
      title: 'Cycling a text size',
      code: `
function Demo() {
  const size = $toggle(['sm', 'md', 'lg']);
  return (
    <Stack gap="sm" align="start">
      <Row gap="sm">
        <Button variant="neutral" onPress={size.next}>Aa</Button>
        <Button variant="ghost" size="xs" onPress={() => size.set('md')}>Default size</Button>
      </Row>
      <Text size={size.value}>{() => \`Reading at size \${$read(size.value)}: each press on Aa steps up, then back to the smallest.\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const size = $toggle(['sm', 'md', 'lg']);
        return (
          <Stack gap="sm" align="start">
            <Row gap="sm">
              <Button variant="neutral" onPress={size.next}>
                Aa
              </Button>
              <Button variant="ghost" size="xs" onPress={() => size.set('md')}>
                Default size
              </Button>
            </Row>
            <Text size={size.value}>{() => `Reading at size ${$read(size.value)}: each press on Aa steps up, then back to the smallest.`}</Text>
          </Stack>
        );
      },
      height: 100,
    },
    {
      title: 'A boolean',
      code: `
function Demo() {
  const on = $toggle();
  return (
    <Stack gap="xs">
      <Row gap="sm">
        <Button size="xs" variant="soft" onPress={on.next}>Toggle</Button>
        <Badge color={() => ($read(on.value) ? 'green' : 'red')}>{() => ($read(on.value) ? 'on' : 'off')}</Badge>
      </Row>
      <Text size="sm" fg="quiet">{() => \`The value is \${$read(on.value)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const on = $toggle();
        return (
          <Stack gap="xs">
            <Row gap="sm">
              <Button size="xs" variant="soft" onPress={on.next}>
                Toggle
              </Button>
              <Badge color={() => ($read(on.value) ? 'green' : 'red')}>{() => ($read(on.value) ? 'on' : 'off')}</Badge>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `The value is ${$read(on.value)}`}
            </Text>
          </Stack>
        );
      },
      height: 80,
    },
  ],
};
