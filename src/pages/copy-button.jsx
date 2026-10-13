// CopyButton: a Button that copies and says so for `hold`, its handle, a
// trigger of one's own through $clipboard, and an honest failure where the
// platform has no clipboard.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Code, CopyButton, Row, Stack, Text } from 'rui-core';
import { $clipboard } from 'rui-core/hooks';

/** A setting's name and value. @type {[string, string][]} */
const SETTINGS = [
  ['Region', 'us-east-2'],
  ['Build hook', 'https://hooks.rui.example/b/91c2'],
  ['Deploy key', 'dk-7Q2M-ZT4P'],
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'copy-button',
  group: 'actions',
  title: 'CopyButton',
  description: 'A Button that copies `value` to the platform clipboard and shows `done` in place of `label` for `hold`. The clipboard is `navigator.clipboard` where the platform has one (a browser page or worker in a secure context); elsewhere (node, an insecure page, a refused permission) the label stays and `onError` hears the failure: nothing is faked. A trigger of your own reads the handle (`getHandle`) or uses `$clipboard` directly.',
  props: [
    { name: 'value', type: 'any', description: 'What to copy (a value, an accessor or a signal, read at the press), as a string.' },
    { name: 'label', type: 'string | (() => string)', default: "'Copy'", description: 'The button’s text at rest.' },
    { name: 'done', type: 'string | (() => string)', default: "'Done'", description: 'The button’s text after a copy.' },
    { name: 'hold', type: "'quick' | 'base' | 'calm' | 'hold' | number", default: "MOTION.hold (1500 ms)", description: 'How long `done` shows: a MOTION name or ms.' },
    { name: 'onCopy', type: '(text: string) => void', description: 'Called with the text once it is copied.' },
    { name: 'onError', type: '(error: Error) => void', description: 'Called when the clipboard is missing or refuses.' },
    { name: 'getHandle', type: '(handle: { copy, copied, error }) => void', description: 'Receives `copy()` (resolves to whether it copied) and the accessors `copied()` and `error()`.' },
    { name: 'variant, color, size, start, end, disabled …', type: 'Button props', description: 'As on Button.' },
  ],
  demos: [
    {
      title: 'A copy button beside each setting',
      code: `
const SETTINGS = [
  ['Region', 'us-east-2'],
  ['Build hook', 'https://hooks.rui.example/b/91c2'],
  ['Deploy key', 'dk-7Q2M-ZT4P'],
];

function Demo() {
  return (
    <Stack gap="xs" align="start">
      {SETTINGS.map(([name, value]) => (
        <Row gap="sm" align="center">
          <Text size="sm" fg="quiet" w={90}>{name}</Text>
          <Code>{value}</Code>
          <CopyButton value={value} size="xs" variant="plain" label={\`Copy \${name.toLowerCase()}\`} done="On the clipboard" hold={2400} />
        </Row>
      ))}
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs" align="start">
          {SETTINGS.map(([name, value]) => (
            <Row gap="sm" align="center">
              <Text size="sm" fg="quiet" w={90}>
                {name}
              </Text>
              <Code>{value}</Code>
              <CopyButton value={value} size="xs" variant="plain" label={`Copy ${name.toLowerCase()}`} done="On the clipboard" hold={2400} />
            </Row>
          ))}
        </Stack>
      ),
      height: 120,
    },
    {
      title: 'Hearing the result, and copying through the handle',
      code: `
function Demo() {
  const log = $signal($active(), 'nothing copied yet');
  let handle;
  return (
    <Stack gap="sm" align="start">
      <Row gap="xs">
        <CopyButton
          value="#2f78c9"
          variant="soft"
          label="Copy the color"
          onCopy={text => $write(log, 'copied ' + text)}
          onError={e => $write(log, 'failed: ' + e.message)}
          getHandle={h => (handle = h)}
        />
        <Button variant="neutral" onPress={() => handle.copy()}>Copy from here</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => $read(log)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const log = $signal($active(), 'nothing copied yet');
        /** @type {{ copy: () => Promise<boolean> } | null} */
        let handle = null;
        return (
          <Stack gap="sm" align="start">
            <Row gap="xs">
              <CopyButton
                value="#2f78c9"
                variant="soft"
                label="Copy the color"
                onCopy={(/** @type {string} */ text) => $write(log, 'copied ' + text)}
                onError={(/** @type {Error} */ e) => $write(log, 'failed: ' + e.message)}
                getHandle={(/** @type {{ copy: () => Promise<boolean> }} */ h) => (handle = h)}
              />
              <Button variant="neutral" onPress={() => void handle?.copy()}>
                Copy from here
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => $read(log)}
            </Text>
          </Stack>
        );
      },
      height: 90,
    },
    {
      title: 'An invite code with a trigger of your own and $clipboard',
      code: `
function Demo() {
  const clipboard = $clipboard({ hold: 5000 });
  const code = 'ROWAN-4821';
  const status = () =>
    $read(clipboard.error)
      ? 'No clipboard here: select the code and copy it by hand.'
      : $read(clipboard.value)
        ? 'On your clipboard: paste it into the join form.'
        : 'Good for seven days and up to five people.';
  return (
    <Stack gap="xs" align="start">
      <Text size="sm">Invite your team with this code</Text>
      <Row gap="sm" align="center">
        <Code>{code}</Code>
        <Button size="xs" variant="outline" onPress={() => clipboard.copy(code)}>Copy code</Button>
      </Row>
      <Text size="xs" fg="quiet">{status}</Text>
    </Stack>
  );
}`,
      view: () => {
        const clipboard = $clipboard({ hold: 5000 });
        const code = 'ROWAN-4821';
        const status = () =>
          $read(clipboard.error)
            ? 'No clipboard here: select the code and copy it by hand.'
            : $read(clipboard.value)
              ? 'On your clipboard: paste it into the join form.'
              : 'Good for seven days and up to five people.';
        return (
          <Stack gap="xs" align="start">
            <Text size="sm">Invite your team with this code</Text>
            <Row gap="sm" align="center">
              <Code>{code}</Code>
              <Button size="xs" variant="outline" onPress={() => clipboard.copy(code)}>
                Copy code
              </Button>
            </Row>
            <Text size="xs" fg="quiet">
              {status}
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
  ],
};
