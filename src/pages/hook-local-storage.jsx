// $localStorage and $sessionStorage: values kept in storage.

import { $read } from 'rrx-core';
import { $localStorage, $sessionStorage } from 'rui-core/hooks';
import { Button, Row, Stack, Text, TextInput, SegmentedControl } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-local-storage',
  group: 'behavior',
  title: '$localStorage',
  description: 'A value kept in local storage under a key, with its setter and removal in one handle; `$sessionStorage` is the same in session storage. Inside an application root it is the root’s Storage (followed across tabs and the worker); elsewhere the platform’s storage, or memory where there is none (node, a worker), so the same component runs everywhere.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'options.key', type: 'string', description: 'The storage key (prefixed `ren:<id>:` inside an application root, so roots never share one).' },
    { name: 'options.fallback', type: 'T', description: 'The value while the key holds none, or one that does not parse.' },
    { name: 'options.print', type: '(value: T) => string', default: 'JSON.stringify', description: 'How a value is written.' },
    { name: 'options.parse', type: '(text: string) => T', default: 'JSON.parse', description: 'How it is read back.' },
    { name: 'returns', type: '{ value: Readable<T>, set(value: T | ((current: T) => T)), remove() }', description: 'A handle: the `value`, `set` (a value or a function of the current one), and `remove()`, which clears the key (the value falls back). Hooks on one key in one root agree.' },
  ],
  demos: [
    {
      title: 'A remembered choice',
      code: `
function Demo() {
  const density = $localStorage({ key: 'rui-show-density', fallback: 'comfortable' });
  return (
    <Stack gap="sm">
      <SegmentedControl aria-label="Density" data={['compact', 'comfortable', 'spacious']} value={density.value} onChange={density.set} />
      <Row gap="sm">
        <Text size="sm">{() => \`Stored: \${$read(density.value)} (reload to see it kept)\`}</Text>
        <Button size="xs" variant="neutral" onPress={density.remove}>Remove</Button>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const density = $localStorage({ key: 'rui-show-density', fallback: 'comfortable' });
        return (
          <Stack gap="sm">
            <SegmentedControl aria-label="Density" data={['compact', 'comfortable', 'spacious']} value={density.value} onChange={density.set} />
            <Row gap="sm">
              <Text size="sm">{() => `Stored: ${$read(density.value)} (reload to see it kept)`}</Text>
              <Button size="xs" variant="neutral" onPress={density.remove}>
                Remove
              </Button>
            </Row>
          </Stack>
        );
      },
      height: 90,
    },
    {
      title: 'Two hooks on one key agree; $sessionStorage',
      code: `
function Demo() {
  const note = $sessionStorage({ key: 'rui-show-note', fallback: '' });
  const same = $sessionStorage({ key: 'rui-show-note', fallback: '' });
  const visits = $sessionStorage({ key: 'rui-show-visits', fallback: 0 });
  return (
    <Stack gap="xs">
      <TextInput label="A note for this session" placeholder="Write something" value={note.value} onChange={note.set} />
      <Text size="sm">{() => \`A second hook on the key reads: \${$read(same.value) || '(empty)'}\`}</Text>
      <Row gap="sm">
        <Button size="xs" variant="soft" onPress={() => visits.set(n => n + 1)}>Count a visit</Button>
        <Text size="sm">{() => \`\${$read(visits.value)} visits this session\`}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const note = $sessionStorage({ key: 'rui-show-note', fallback: '' });
        const same = $sessionStorage({ key: 'rui-show-note', fallback: '' });
        const visits = $sessionStorage({ key: 'rui-show-visits', fallback: 0 });
        return (
          <Stack gap="xs">
            <TextInput label="A note for this session" placeholder="Write something" value={note.value} onChange={note.set} />
            <Text size="sm">{() => `A second hook on the key reads: ${$read(same.value) || '(empty)'}`}</Text>
            <Row gap="sm">
              <Button size="xs" variant="soft" onPress={() => visits.set((/** @type {number} */ n) => n + 1)}>
                Count a visit
              </Button>
              <Text size="sm">{() => `${$read(visits.value)} visits this session`}</Text>
            </Row>
          </Stack>
        );
      },
      height: 140,
    },
  ],
};
