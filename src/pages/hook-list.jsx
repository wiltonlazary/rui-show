// $list: a list with the array verbs, in one handle.

import { $read } from 'rrx-core';
import { For } from 'ren-core';
import { $list } from 'rui-core/hooks';
import { Button, Row, Stack, Text, Surface, Checkbox, CloseButton, Code } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-list',
  group: 'behavior',
  title: '$list',
  description: 'A list in one handle: its `value` and JavaScript’s array verbs (push, unshift, insert, pop, shift, removeAt, move, swap, replace, setField, map, filter). Each verb makes a new array, so views bound to the list follow it; a verb that changes nothing writes nothing. Indices are truncated, and a negative one counts from the end (-1 is the last item).',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'initial', type: 'T[] | (() => T[])', default: '[]', description: 'The items at first.' },
    { name: 'returns', type: 'ListHandle<T>: { value, set, push, unshift, insert, pop, shift, removeAt, move, swap, replace, setField, filter, map, mapWhere }', description: 'The list (`value`, a node) and its verbs.' },
    { name: 'push / unshift', type: '(...items: T[]) => void', description: 'Adds items at the end or the start.' },
    { name: 'insert', type: '(index: number, ...items: T[]) => void', description: 'Adds items before `index` (clamped: past the end appends).' },
    { name: 'removeAt', type: '(...indices: number[]) => void', description: 'Removes the items at those indices; one outside the list is skipped.' },
    { name: 'pop / shift', type: '() => void', description: 'Removes the last or the first item.' },
    { name: 'move', type: '(from: number, to: number) => void', description: 'Takes the item at `from` out so it ends at `to` (clamped).' },
    { name: 'swap', type: '(a: number, b: number) => void', description: 'Exchanges the items at `a` and `b`; nothing when either is outside.' },
    { name: 'replace', type: '(index: number, item: T) => void', description: 'Puts `item` at `index`, an index inside the list.' },
    { name: 'setField', type: '(index: number, key: K, value: T[K]) => void', description: 'Sets one field of an item, on a shallow copy.' },
    { name: 'map / mapWhere', type: '(fn) / (test, fn) => void', description: 'Maps every item, or those passing `test`; it writes only when an item changed by identity (an item mutated in place is not a change).' },
    { name: 'filter', type: '(fn: (item: T, index: number) => boolean) => void', description: 'Keeps the items passing `fn`.' },
    { name: 'set', type: '(value: T[] | ((current: T[]) => T[])) => void', description: 'Replaces the whole list with a copy; it writes when an item changed by identity, and always when handed the list’s own array.' },
  ],
  demos: [
    {
      title: 'A task list',
      code: `
function Demo() {
  const tasks = $list([
    { label: 'Write the docs', done: true },
    { label: 'Ship the release', done: false },
  ]);
  let n = 0;
  return (
    <Stack gap="xs">
      <For each={tasks.value}>
        {(task, i) => (
          <Row gap="xs">
            <Checkbox label={() => task().label} checked={() => task().done} onChange={done => tasks.setField(i(), 'done', done)} />
            <CloseButton size="sm" onPress={() => tasks.removeAt(i())} />
          </Row>
        )}
      </For>
      <Row gap="xs">
        <Button size="xs" onPress={() => tasks.push({ label: \`Task \${++n}\`, done: false })}>Push</Button>
        <Button size="xs" variant="soft" onPress={() => tasks.move(0, -1)}>First to last</Button>
        <Button size="xs" variant="soft" onPress={() => tasks.map(task => ({ ...task, done: true }))}>Check all</Button>
        <Button size="xs" variant="neutral" onPress={() => tasks.filter(task => !task.done)}>Clear done</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => \`\${$read(tasks.value).filter(t => t.done).length} of \${$read(tasks.value).length} done\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const tasks = $list([
          { label: 'Write the docs', done: true },
          { label: 'Ship the release', done: false },
        ]);
        let n = 0;
        return (
          <Stack gap="xs">
            <For each={tasks.value}>
              {(/** @type {any} */ task, /** @type {() => number} */ i) => (
                <Row gap="xs">
                  <Checkbox label={() => task().label} checked={() => task().done} onChange={(/** @type {boolean} */ done) => tasks.setField(i(), 'done', done)} />
                  <CloseButton size="sm" onPress={() => tasks.removeAt(i())} />
                </Row>
              )}
            </For>
            <Row gap="xs">
              <Button size="xs" onPress={() => tasks.push({ label: `Task ${++n}`, done: false })}>
                Push
              </Button>
              <Button size="xs" variant="soft" onPress={() => tasks.move(0, -1)}>
                First to last
              </Button>
              <Button size="xs" variant="soft" onPress={() => tasks.map(task => ({ ...task, done: true }))}>
                Check all
              </Button>
              <Button size="xs" variant="neutral" onPress={() => tasks.filter(task => !task.done)}>
                Clear done
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `${$read(tasks.value).filter(t => t.done).length} of ${$read(tasks.value).length} done`}
            </Text>
          </Stack>
        );
      },
      height: 240,
    },
    {
      title: 'Unshift, insert, swap (-1 is the last) and pop',
      code: `
function Demo() {
  const letters = $list(['b', 'c', 'd']);
  return (
    <Stack gap="sm">
      <Surface bordered p="xs"><Code>{() => \`[\${$read(letters.value).join(', ')}]\`}</Code></Surface>
      <Row gap="xs">
        <Button size="xs" variant="soft" onPress={() => letters.unshift('a')}>Unshift a</Button>
        <Button size="xs" variant="soft" onPress={() => letters.insert(1, 'x')}>Insert x at 1</Button>
        <Button size="xs" variant="soft" onPress={() => letters.swap(0, 1)}>Swap 0 and 1</Button>
        <Button size="xs" variant="soft" onPress={() => letters.swap(0, -1)}>Swap the ends</Button>
        <Button size="xs" variant="soft" onPress={() => letters.pop()}>Pop</Button>
        <Button size="xs" variant="neutral" onPress={() => letters.set(['b', 'c', 'd'])}>Reset</Button>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const letters = $list(['b', 'c', 'd']);
        return (
          <Stack gap="sm">
            <Surface bordered p="xs">
              <Code>{() => `[${$read(letters.value).join(', ')}]`}</Code>
            </Surface>
            <Row gap="xs">
              <Button size="xs" variant="soft" onPress={() => letters.unshift('a')}>
                Unshift a
              </Button>
              <Button size="xs" variant="soft" onPress={() => letters.insert(1, 'x')}>
                Insert x at 1
              </Button>
              <Button size="xs" variant="soft" onPress={() => letters.swap(0, 1)}>
                Swap 0 and 1
              </Button>
              <Button size="xs" variant="soft" onPress={() => letters.swap(0, -1)}>
                Swap the ends
              </Button>
              <Button size="xs" variant="soft" onPress={() => letters.pop()}>
                Pop
              </Button>
              <Button size="xs" variant="neutral" onPress={() => letters.set(['b', 'c', 'd'])}>
                Reset
              </Button>
            </Row>
          </Stack>
        );
      },
      height: 110,
    },
  ],
};
