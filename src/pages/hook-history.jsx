// $history: a value with undo and redo.

import { $read } from 'rrx-core';
import { $history } from 'rui-core/hooks';
import { Button, Row, Stack, Text, Code, Swatch } from 'rui-core';

const COLORS = ['blue', 'teal', 'purple', 'orange', 'red'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-history',
  group: 'behavior',
  title: '$history',
  description: 'A value with undo and redo: `set` drops the values ahead of the current one and adds the new one, `back` and `forward` move through them. It keeps at most `limit` entries; past it the oldest drop.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'initial', type: 'T', description: 'The first value.' },
    { name: 'options.limit', type: 'number', default: '100', description: 'The most entries kept; past it the oldest drop. `Infinity` keeps all.' },
    { name: 'returns', type: 'HistoryHandle<T>: { value, entries, index, set, back, forward, reset }', description: 'One handle: `value` (the current entry), `entries` (every value kept, oldest first) and `index` (where `value` is) are nodes; the rest are commands.' },
    { name: 'set', type: '(value: T) => void', description: 'Drops the entries ahead, then adds `value` and makes it current; setting the current value adds nothing.' },
    { name: 'back / forward', type: '(steps?: number) => void', description: 'Moves that many steps (1), clamped to the history.' },
    { name: 'reset', type: '() => void', description: 'Back to the first value alone.' },
  ],
  demos: [
    {
      title: 'Undo and redo, six entries kept',
      code: `
const COLORS = ['blue', 'teal', 'purple', 'orange', 'red'];

function Demo() {
  const color = $history('blue', { limit: 6 });
  return (
    <Stack gap="sm">
      <Row gap="xs">
        {COLORS.map(name => <Button size="xs" color={name} variant="soft" onPress={() => color.set(name)}>{name}</Button>)}
      </Row>
      <Row gap="xs">
        <Button size="xs" variant="neutral" onPress={() => color.back()}>Undo</Button>
        <Button size="xs" variant="neutral" onPress={() => color.forward()}>Redo</Button>
        <Button size="xs" variant="neutral" onPress={() => color.reset()}>Reset</Button>
        <Swatch color={color.value} size={24} />
        <Text size="sm">{() => \`Current: \${$read(color.value)}\`}</Text>
      </Row>
      <Code>{() => {
        const index = $read(color.index);
        return $read(color.entries).map((c, i) => (i === index ? \`[\${c}]\` : c)).join(' → ');
      }}</Code>
    </Stack>
  );
}`,
      view: () => {
        const color = $history('blue', { limit: 6 });
        return (
          <Stack gap="sm">
            <Row gap="xs">
              {COLORS.map(name => (
                <Button size="xs" color={name} variant="soft" onPress={() => color.set(name)}>
                  {name}
                </Button>
              ))}
            </Row>
            <Row gap="xs">
              <Button size="xs" variant="neutral" onPress={() => color.back()}>
                Undo
              </Button>
              <Button size="xs" variant="neutral" onPress={() => color.forward()}>
                Redo
              </Button>
              <Button size="xs" variant="neutral" onPress={() => color.reset()}>
                Reset
              </Button>
              <Swatch color={color.value} size={24} />
              <Text size="sm">{() => `Current: ${$read(color.value)}`}</Text>
            </Row>
            <Code>
              {() => {
                const index = $read(color.index);
                return $read(color.entries).map((c, i) => (i === index ? `[${c}]` : c)).join(' → ');
              }}
            </Code>
          </Stack>
        );
      },
      height: 120,
    },
  ],
};
