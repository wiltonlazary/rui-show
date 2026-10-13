// $open: a boolean with open, close and toggle.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $open } from 'rui-core/hooks';
import { Button, Row, Stack, Text, Surface, Badge, Collapse } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-open',
  group: 'behavior',
  title: '$open',
  description: 'A boolean with `open`, `close` and `toggle`, for anything that opens: collapses, panels, menus. It returns one handle; its `value` is a node that JSX binds, and `onChange(open)` runs only when it changes.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on (the building view’s root otherwise), as every hook takes.' },
    { name: 'initial', type: 'boolean', default: 'false', description: 'The state at first.' },
    { name: 'options.onChange', type: '(open: boolean) => void', description: 'Runs with the new state when it changes.' },
    { name: 'returns', type: 'OpenHandle: { value: Readable<boolean>, open(), close(), toggle() }', description: 'The state as `value` (read it with `$read(panel.value)` or bind it) and its commands.' },
  ],
  demos: [
    {
      title: 'Open, close and toggle',
      code: `
function Demo() {
  const panel = $open(false);
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button size="xs" onPress={panel.open}>Open</Button>
        <Button size="xs" variant="neutral" onPress={panel.close}>Close</Button>
        <Button size="xs" variant="soft" onPress={panel.toggle}>Toggle</Button>
        <Badge color={() => ($read(panel.value) ? 'teal' : 'gray')}>{() => ($read(panel.value) ? 'open' : 'closed')}</Badge>
      </Row>
      <Collapse open={panel.value}>
        <Surface bordered p="sm"><Text size="sm">The content it shows.</Text></Surface>
      </Collapse>
    </Stack>
  );
}`,
      view: () => {
        const panel = $open(false);
        return (
          <Stack gap="sm">
            <Row gap="xs">
              <Button size="xs" onPress={panel.open}>
                Open
              </Button>
              <Button size="xs" variant="neutral" onPress={panel.close}>
                Close
              </Button>
              <Button size="xs" variant="soft" onPress={panel.toggle}>
                Toggle
              </Button>
              <Badge color={() => ($read(panel.value) ? 'teal' : 'gray')}>{() => ($read(panel.value) ? 'open' : 'closed')}</Badge>
            </Row>
            <Collapse open={panel.value}>
              <Surface bordered p="sm">
                <Text size="sm">The content it shows.</Text>
              </Surface>
            </Collapse>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'Hearing each change',
      code: `
function Demo() {
  const R = $active();
  const log = $signal(R, 'Nothing yet');
  const count = $signal(R, 0);
  const panel = $open(true, {
    onChange: open => ($write(count, $read(count) + 1), $write(log, \`onChange(\${open}) ran\`)),
  });
  return (
    <Row gap="sm">
      <Button size="xs" variant="soft" onPress={panel.toggle}>{() => ($read(panel.value) ? 'Close' : 'Open')}</Button>
      <Text size="sm">{() => \`\${$read(log)} (\${$read(count)} changes)\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const R = $active();
        const log = $signal(R, 'Nothing yet');
        const count = $signal(R, 0);
        const panel = $open(true, {
          onChange: (/** @type {boolean} */ open) => ($write(count, $read(count) + 1), $write(log, `onChange(${open}) ran`)),
        });
        return (
          <Row gap="sm">
            <Button size="xs" variant="soft" onPress={panel.toggle}>
              {() => ($read(panel.value) ? 'Close' : 'Open')}
            </Button>
            <Text size="sm">{() => `${$read(log)} (${$read(count)} changes)`}</Text>
          </Row>
        );
      },
      height: 60,
    },
  ],
};
