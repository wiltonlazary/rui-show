// $debounced, $debounce and $throttled.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $debounced, $debounce, $throttled } from 'rui-core/hooks';
import { Button, Row, Stack, Text, TextInput } from 'rui-core';

const RECIPES = ['Lentil soup', 'Mushroom risotto', 'Pumpkin bread', 'Lemon tart', 'Green curry', 'Tomato salad', 'Pea and mint soup'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-debounced',
  group: 'behavior',
  title: '$debounced',
  description: 'Follows a value once it has kept still for `wait` ms. `$debounce` delays a function the same way, `$throttled` follows at most once per period. The timers are the platform’s and end with their owner.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'source', type: 'Readable<T> | (() => T)', description: 'The value to follow: a node or an accessor.' },
    { name: 'wait', type: 'number', description: 'How long it must keep still, in ms.' },
    { name: 'options.leading', type: 'boolean', default: 'false', description: 'The first change of a quiet period shows at once.' },
    { name: 'returns', type: '{ value: Readable<T>, cancel(): void }', description: 'A handle: `value`, the debounced value, and `cancel()`, which drops the pending update.' },
    { name: '$debounce(callback, wait)', type: '(fn, number | { wait, flushOnEnd?, leading? }) => Debounced', description: 'The callback called `wait` ms after the last call, with its arguments; `cancel()`, `flush()`, `pending()`; `flushOnEnd` flushes it when the owner ends.' },
    { name: '$throttled(source, wait)', type: '(Source<T>, number) => { value: Readable<T> }', description: 'The first change shows at once, the latest of the rest when the period ends.' },
  ],
  demos: [
    {
      title: 'A live search',
      code: `
const RECIPES = ['Lentil soup', 'Mushroom risotto', 'Pumpkin bread', 'Lemon tart', 'Green curry', 'Tomato salad', 'Pea and mint soup'];

function Demo() {
  const query = $signal($active(), '');
  const settled = $debounced(query, 400);
  const found = () => RECIPES.filter(r => r.toLowerCase().includes($read(settled.value).trim().toLowerCase()));
  return (
    <Stack gap="xs">
      <TextInput label="Search recipes" placeholder="e.g. soup" value={query} onChange={v => $write(query, v)} />
      <Text size="sm" fg="quiet">{() => ($read(query) !== $read(settled.value) ? 'searching…' : \`\${found().length} found\`)}</Text>
      <Text size="sm">{() => found().join(', ')}</Text>
    </Stack>
  );
}`,
      view: () => {
        const query = $signal($active(), '');
        const settled = $debounced(query, 400);
        const found = () => RECIPES.filter(r => r.toLowerCase().includes($read(settled.value).trim().toLowerCase()));
        return (
          <Stack gap="xs">
            <TextInput label="Search recipes" placeholder="e.g. soup" value={query} onChange={(/** @type {string} */ v) => $write(query, v)} />
            <Text size="sm" fg="quiet">
              {() => ($read(query) !== $read(settled.value) ? 'searching…' : `${found().length} found`)}
            </Text>
            <Text size="sm">{() => found().join(', ')}</Text>
          </Stack>
        );
      },
      height: 150,
    },
    {
      title: 'A draft saved at most once a second',
      code: `
function Demo() {
  const draft = $signal($active(), '');
  const saved = $throttled(draft, 1000);
  return (
    <Stack gap="xs">
      <TextInput label="Note" placeholder="Type quickly" value={draft} onChange={v => $write(draft, v)} />
      <Text size="sm" fg="quiet">{() => \`Saved: \${$read(saved.value)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const draft = $signal($active(), '');
        const saved = $throttled(draft, 1000);
        return (
          <Stack gap="xs">
            <TextInput label="Note" placeholder="Type quickly" value={draft} onChange={(/** @type {string} */ v) => $write(draft, v)} />
            <Text size="sm" fg="quiet">
              {() => `Saved: ${$read(saved.value)}`}
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'Saved once the edits stop, or now',
      code: `
function Demo() {
  const R = $active();
  const status = $signal(R, 'No changes');
  const save = $debounce(
    name => $write(status, \`Saved "\${name}"\`),
    { wait: 800, flushOnEnd: true },
  );
  return (
    <Stack gap="xs">
      <TextInput
        label="Project name"
        placeholder="e.g. Harbor"
        onChange={v => (save(v), $write(status, 'Unsaved changes'))}
      />
      <Row gap="sm">
        <Button size="xs" variant="soft" onPress={() => save.flush()}>Save now</Button>
        <Text size="sm">{() => $read(status)}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const R = $active();
        const status = $signal(R, 'No changes');
        const save = $debounce((/** @type {string} */ name) => $write(status, `Saved "${name}"`), { wait: 800, flushOnEnd: true });
        return (
          <Stack gap="xs">
            <TextInput label="Project name" placeholder="e.g. Harbor" onChange={(/** @type {string} */ v) => (save(v), $write(status, 'Unsaved changes'))} />
            <Row gap="sm">
              <Button size="xs" variant="soft" onPress={() => save.flush()}>
                Save now
              </Button>
              <Text size="sm">{() => $read(status)}</Text>
            </Row>
          </Stack>
        );
      },
      height: 120,
    },
  ],
};
