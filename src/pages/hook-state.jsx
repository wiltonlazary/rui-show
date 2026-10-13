// The remaining state hooks, one short demo each.

import { $signal, $read, $write } from 'rrx-core';
import { $active, For } from 'ren-core';
import { $patch, $bound, $model, $previous, $validated, $map, $set, $queue, $selection } from 'rui-core/hooks';
import { Button, Row, Stack, Text, TextInput, Badge, Checkbox, Chip } from 'rui-core';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Mango'];

/** A username: 3 to 16 letters, digits or _; a string names what is wrong. @param {string} v */
const username = v => (!/^[A-Za-z0-9_]*$/.test(v) ? 'Only letters, digits and _' : v.length < 3 || v.length > 16 ? '3 to 16 characters' : true);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-state',
  group: 'behavior',
  title: 'State hooks',
  description: 'The other state helpers as nodes a view binds: patched objects, input values, values held by a signal or kept inside, the previous value, validated values, reactive Map and Set, a queue and a selection. Each takes a root first, or runs on the building view’s root.',
  props: [
    { name: '$patch(initial)', type: 'PatchHandle<T>: { value, set(part | (current) => part) }', description: 'An object updated by patches, one level deep: `set` lays the part’s own keys over the current ones (nested objects are replaced), a key given as `undefined` is removed, and a part that changes nothing writes nothing.' },
    { name: '$bound(initial)', type: 'BoundHandle<T>: { value, set(change) }', description: 'A value and the `onChange` an input takes (`onChange={name.set}`): ren-core’s `{ value }`, a DOM event or a plain value.' },
    { name: '$model({ value?, defaultValue?, fallback?, onChange? })', type: 'ModelHandle<T>: { value, set(value, ...payload), controlled: boolean }', description: 'A component’s value, held by its `value` prop when given (`controlled`, decided once), else kept inside from `defaultValue`, else `fallback`; `set` writes only when kept inside and calls `onChange(value, ...payload)` in both modes; setting the value shown now does neither.' },
    { name: '$previous(source)', type: '{ value: Readable<T | undefined> }', description: 'The value `source` held before its current one, undefined at first.' },
    { name: '$validated(initial, { check, valid? })', type: 'ValidatedHandle<T>: { value, valid, good, reason, set(value) }', description: 'A value with its validity, `good` (the last value that passed, undefined before any) and `reason`. `check` passes on `true`; a string it returns fails with that reason (`reason`, null otherwise); anything else fails. Each `set` checks again; `valid` states the first value’s validity instead of checking it.' },
    { name: '$map(entries?) / $set(values?)', type: 'Map<K, V> / Set<T>', description: 'A Map or Set whose reads track and whose writes notify.' },
    { name: '$queue({ initial?, limit })', type: 'QueueHandle<T>: { shown, waiting, push(...items), update(fn), clearWaiting() }', description: 'Items shown up to `limit` (required: a value, accessor or node), the rest waiting in order; a change of the limit moves items between the two. `update(fn)` gets every item, shown then waiting, and gives the new queue.' },
    { name: '$selection({ items, initial?, resetOnItems? })', type: 'SelectionHandle<T>: { value, has, add, delete, toggle, all, some, set, clear }', description: 'A selection among `items`, with a Set’s verbs; `all` and `some` are nodes. Items outside `items` are never selected.' },
  ],
  demos: [
    {
      title: '$patch (undefined removes a key) and $bound',
      code: `
function Demo() {
  const user = $patch({ name: 'Mira', role: 'editor', visits: 1 });
  const name = $bound('Mira');
  return (
    <Stack gap="xs">
      <Row gap="sm" align="end">
        <TextInput label="Name" value={name.value} onChange={name.set} w={200} />
        <Button size="sm" onPress={() => user.set({ name: $read(name.value) })}>Merge the name</Button>
      </Row>
      <Row gap="sm">
        <Button size="sm" variant="soft" onPress={() => user.set(u => ({ visits: u.visits + 1 }))}>Add a visit</Button>
        <Button size="sm" variant="neutral" onPress={() => user.set({ role: undefined })}>Drop the role</Button>
      </Row>
      <Text size="sm">{() => \`State: \${JSON.stringify($read(user.value))}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const user = $patch({ name: 'Mira', role: 'editor', visits: 1 });
        const name = $bound('Mira');
        return (
          <Stack gap="xs">
            <Row gap="sm" align="end">
              <TextInput label="Name" value={name.value} onChange={name.set} w={200} />
              <Button size="sm" onPress={() => user.set({ name: $read(name.value) })}>
                Merge the name
              </Button>
            </Row>
            <Row gap="sm">
              <Button size="sm" variant="soft" onPress={() => user.set(u => ({ visits: u.visits + 1 }))}>
                Add a visit
              </Button>
              <Button size="sm" variant="neutral" onPress={() => user.set({ role: undefined })}>
                Drop the role
              </Button>
            </Row>
            <Text size="sm">{() => `State: ${JSON.stringify($read(user.value))}`}</Text>
          </Stack>
        );
      },
      height: 140,
    },
    {
      title: '$model and $previous',
      code: `
function Stepper(props) {
  const model = $model({
    value: props.value,
    defaultValue: props.defaultValue,
    fallback: 0,
    onChange: props.onChange,
  });
  return (
    <Row gap="xs">
      <Button size="xs" variant="neutral" onPress={() => model.set($read(model.value) + 1)}>+1</Button>
      <Text size="sm">{() => \`\${$read(model.value)} (\${model.controlled ? 'held by a signal' : 'kept inside'})\`}</Text>
    </Row>
  );
}

function Demo() {
  const count = $signal($active(), 10);
  const previous = $previous(count);
  return (
    <Stack gap="xs">
      <Stepper defaultValue={3} />
      <Stepper value={count} onChange={v => $write(count, v)} />
      <Text size="sm" fg="quiet">{() => \`The signal holds \${$read(count)}, before \${$read(previous.value) ?? 'nothing'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        /** @param {Record<string, any>} props */
        const Stepper = props => {
          const model = $model({
            value: props.value,
            defaultValue: props.defaultValue,
            fallback: 0,
            onChange: props.onChange,
          });
          return (
            <Row gap="xs">
              <Button size="xs" variant="neutral" onPress={() => model.set($read(model.value) + 1)}>
                +1
              </Button>
              <Text size="sm">{() => `${$read(model.value)} (${model.controlled ? 'held by a signal' : 'kept inside'})`}</Text>
            </Row>
          );
        };
        const count = $signal($active(), 10);
        const previous = $previous(count);
        return (
          <Stack gap="xs">
            <Stepper defaultValue={3} />
            <Stepper value={count} onChange={(/** @type {number} */ v) => $write(count, v)} />
            <Text size="sm" fg="quiet">
              {() => `The signal holds ${$read(count)}, before ${$read(previous.value) ?? 'nothing'}`}
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: '$validated, with a reason',
      code: `
const username = v =>
  !/^[A-Za-z0-9_]*$/.test(v) ? 'Only letters, digits and _' : v.length < 3 || v.length > 16 ? '3 to 16 characters' : true;

function Demo() {
  const name = $validated('', { check: username, valid: false });
  return (
    <Stack gap="xs">
      <TextInput
        label="Username"
        description="3–16 letters, digits or _"
        placeholder="sea_otter"
        value={name.value}
        onChange={name.set}
        error={() => ($read(name.value) === '' ? undefined : $read(name.reason) ?? undefined)}
        w={320}
      />
      <Text size="sm">{() => \`Last good username: \${$read(name.good) ?? '(none)'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const name = $validated('', { check: username, valid: false });
        return (
          <Stack gap="xs">
            <TextInput
              label="Username"
              description="3–16 letters, digits or _"
              placeholder="sea_otter"
              value={name.value}
              onChange={name.set}
              error={() => ($read(name.value) === '' ? undefined : $read(name.reason) ?? undefined)}
              w={320}
            />
            <Text size="sm">{() => `Last good username: ${$read(name.good) ?? '(none)'}`}</Text>
          </Stack>
        );
      },
      height: 130,
    },
    {
      title: '$map and $set',
      code: `
function Demo() {
  const votes = $map([['Apple', 0], ['Banana', 0]]);
  const liked = $set(['Apple']);
  return (
    <Stack gap="xs">
      <Row gap="xs">
        {['Apple', 'Banana'].map(fruit => (
          <Button size="xs" variant="soft" onPress={() => votes.set(fruit, (votes.get(fruit) ?? 0) + 1)}>
            {() => \`\${fruit}: \${votes.get(fruit)} votes\`}
          </Button>
        ))}
        {['Apple', 'Banana'].map(fruit => (
          <Checkbox label={\`Like \${fruit}\`} checked={() => liked.has(fruit)} onChange={on => (on ? liked.add(fruit) : liked.delete(fruit))} />
        ))}
      </Row>
      <Text size="sm">{() => \`Liked: \${[...liked].join(', ') || 'nothing'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const votes = $map([
          ['Apple', 0],
          ['Banana', 0],
        ]);
        const liked = $set(['Apple']);
        return (
          <Stack gap="xs">
            <Row gap="xs">
              {['Apple', 'Banana'].map(fruit => (
                <Button size="xs" variant="soft" onPress={() => votes.set(fruit, (votes.get(fruit) ?? 0) + 1)}>
                  {() => `${fruit}: ${votes.get(fruit)} votes`}
                </Button>
              ))}
              {['Apple', 'Banana'].map(fruit => (
                <Checkbox label={`Like ${fruit}`} checked={() => liked.has(fruit)} onChange={(/** @type {boolean} */ on) => (on ? liked.add(fruit) : liked.delete(fruit))} />
              ))}
            </Row>
            <Text size="sm">{() => `Liked: ${[...liked].join(', ') || 'nothing'}`}</Text>
          </Stack>
        );
      },
      height: 90,
    },
    {
      title: '$queue: a print queue, its limit a signal',
      code: `
function Demo() {
  const printers = $signal($active(), 1);
  const printer = $queue({ initial: ['Invoice 1041.pdf', 'Floor plan.png', 'Menu.pdf'], limit: printers });
  let n = 0;
  return (
    <Stack gap="xs">
      <Row gap="xs">
        <Button size="xs" onPress={() => printer.push(\`Letter \${++n}.docx\`)}>Send a job</Button>
        <Button size="xs" variant="neutral" onPress={() => printer.update(jobs => jobs.slice(1))}>Finish one</Button>
        <Button size="xs" variant="soft" color="red" onPress={printer.clearWaiting}>Cancel waiting</Button>
        <Button size="xs" variant="soft" onPress={() => $write(printers, 3 - $read(printers))}>{() => ($read(printers) === 1 ? 'Two printers' : 'One printer')}</Button>
      </Row>
      <Text size="sm">{() => \`Printing: \${$read(printer.shown).join(', ') || 'nothing'}\`}</Text>
      <Row gap="xs">
        <Text size="sm" fg="quiet">{() => \`Waiting (\${$read(printer.waiting).length}):\`}</Text>
        <For each={printer.waiting}>{job => <Badge variant="soft" color="gray">{job()}</Badge>}</For>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const printers = $signal($active(), 1);
        const printer = $queue({ initial: ['Invoice 1041.pdf', 'Floor plan.png', 'Menu.pdf'], limit: printers });
        let n = 0;
        return (
          <Stack gap="xs">
            <Row gap="xs">
              <Button size="xs" onPress={() => printer.push(`Letter ${++n}.docx`)}>
                Send a job
              </Button>
              <Button size="xs" variant="neutral" onPress={() => printer.update(jobs => jobs.slice(1))}>
                Finish one
              </Button>
              <Button size="xs" variant="soft" color="red" onPress={printer.clearWaiting}>
                Cancel waiting
              </Button>
              <Button size="xs" variant="soft" onPress={() => $write(printers, 3 - $read(printers))}>
                {() => ($read(printers) === 1 ? 'Two printers' : 'One printer')}
              </Button>
            </Row>
            <Text size="sm">{() => `Printing: ${$read(printer.shown).join(', ') || 'nothing'}`}</Text>
            <Row gap="xs">
              <Text size="sm" fg="quiet">
                {() => `Waiting (${$read(printer.waiting).length}):`}
              </Text>
              <For each={printer.waiting}>
                {(/** @type {() => string} */ job) => (
                  <Badge variant="soft" color="gray">
                    {job()}
                  </Badge>
                )}
              </For>
            </Row>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: '$selection',
      code: `
const FRUITS = ['Apple', 'Banana', 'Cherry', 'Mango'];

function Demo() {
  const selected = $selection({ items: FRUITS, initial: ['Cherry'] });
  return (
    <Stack gap="xs">
      <Row gap="sm">
        <Checkbox
          label="All"
          checked={selected.all}
          indeterminate={selected.some}
          onChange={() => ($read(selected.all) ? selected.clear() : selected.set(FRUITS))}
        />
        <For each={FRUITS}>
          {fruit => <Chip checked={() => selected.has(fruit())} onChange={() => selected.toggle(fruit())}>{fruit()}</Chip>}
        </For>
      </Row>
      <Row gap="xs">
        <Text size="sm">Selected:</Text>
        <For each={selected.value}>{fruit => <Badge variant="soft">{fruit()}</Badge>}</For>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const selected = $selection({ items: FRUITS, initial: ['Cherry'] });
        return (
          <Stack gap="xs">
            <Row gap="sm">
              <Checkbox
                label="All"
                checked={selected.all}
                indeterminate={selected.some}
                onChange={() => ($read(selected.all) ? selected.clear() : selected.set(FRUITS))}
              />
              <For each={FRUITS}>
                {(/** @type {() => string} */ fruit) => (
                  <Chip checked={() => selected.has(fruit())} onChange={() => selected.toggle(fruit())}>
                    {fruit()}
                  </Chip>
                )}
              </For>
            </Row>
            <Row gap="xs">
              <Text size="sm">Selected:</Text>
              <For each={selected.value}>{(/** @type {() => string} */ fruit) => <Badge variant="soft">{fruit()}</Badge>}</For>
            </Row>
          </Stack>
        );
      },
      height: 90,
    },
  ],
};
