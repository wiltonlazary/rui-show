// $shortcuts: a key handler for any primitive's onKey.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $os, $shortcuts } from 'rui-core/hooks';
import { Row, Stack, Text, TextInput, Key, Badge } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-shortcuts',
  group: 'behavior',
  title: '$shortcuts',
  description: 'A key handler for `onKey` that runs the handlers whose keys match. Portable: it listens where it is given (a field, a panel, the application’s outer view), not on the document, so it works the same on every renderer; with `global: true` it hears every key of the application root instead.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument; no root is needed.' },
    { name: 'shortcuts', type: 'ShortcutMap: { [chord]: (event) => void | { run: (event) => void, allowDefault?: boolean } }', description: 'A map from chords to what runs, read at once: a malformed chord (empty, no key, two keys, a modifier twice) throws. A chord is parts joined by `+`, case and spaces ignored: modifiers `ctrl` (`control`), `alt` (`option`, `opt`), `shift`, `meta` (`cmd`, `command`, `win`, `super`) and `primary` (Cmd on macOS and iOS, Ctrl elsewhere), and one key as the event names it (`Enter`, `ArrowUp`, `F5`, a character) or `space`, `plus`, `esc`, `del`: `primary+K`, `shift+Enter`, `primary+plus`, `Escape`. A key runs every entry it matches, in the map’s order; it is matched by the key it types first, and by its position (`code`) only when no chord for that key is bound.' },
    { name: 'options.allowDefault', type: 'boolean', default: 'false', description: 'True: a key that runs an entry keeps its default action (an entry’s own `allowDefault` overrides it); by default the default is prevented first.' },
    { name: 'options.os', type: "'macos' | 'ios' | 'windows' | 'android' | 'linux' | 'chromeos' | 'unknown'", default: 'the running one ($os)', description: 'The platform `primary` resolves on.' },
    { name: 'options.global', type: 'boolean', default: 'false', description: 'Called in a component: hears every key of the application root, nothing focused too; returns their removal.' },
    { name: 'options.fields', type: 'boolean', default: 'false', description: 'With `global`: keys typed in a text field count too.' },
    { name: 'returns', type: '(event) => void | () => void', description: 'The handler: pass it as `onKey` of a field or a primitive (with `global`, the removal).' },
  ],
  demos: [
    {
      title: 'Shortcuts in a field',
      code: `
function Demo() {
  const R = $active();
  const last = $signal(R, 'none yet');
  const count = $signal(R, 0);
  const seen = name => () => ($write(last, name), $write(count, $read(count) + 1));
  // primary: Cmd on macOS and iOS, Ctrl elsewhere.
  const primary = ['macos', 'ios'].includes($os().value) ? 'Cmd' : 'Ctrl';
  const onKey = $shortcuts({
    'primary+B': seen('primary+B'),
    'primary+shift+S': seen('primary+shift+S'),
    'alt+ArrowUp': seen('alt+ArrowUp'),
    Escape: { run: seen('Escape'), allowDefault: true },
  });
  return (
    <Stack gap="sm">
      <TextInput label="Focus here and press a shortcut" placeholder="Type, or press a shortcut" onKey={onKey} />
      <Row gap={6}>
        <Key>{primary}</Key><Text size="sm">+</Text><Key>B</Key>
        <Text size="sm" fg="quiet">·</Text>
        <Key>{primary}</Key><Text size="sm">+</Text><Key>Shift</Key><Text size="sm">+</Text><Key>S</Key>
        <Text size="sm" fg="quiet">·</Text>
        <Key>Alt</Key><Text size="sm">+</Text><Key>↑</Key>
        <Text size="sm" fg="quiet">·</Text>
        <Key>Esc</Key>
      </Row>
      <Row gap="sm">
        <Text size="sm">{() => \`Last shortcut: \${$read(last)}\`}</Text>
        <Badge variant="soft">{() => \`\${$read(count)} matched\`}</Badge>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const R = $active();
        const last = $signal(R, 'none yet');
        const count = $signal(R, 0);
        const seen = (/** @type {string} */ name) => () => ($write(last, name), $write(count, $read(count) + 1));
        const primary = ['macos', 'ios'].includes($os().value) ? 'Cmd' : 'Ctrl';
        const onKey = $shortcuts({
          'primary+B': seen('primary+B'),
          'primary+shift+S': seen('primary+shift+S'),
          'alt+ArrowUp': seen('alt+ArrowUp'),
          Escape: { run: seen('Escape'), allowDefault: true },
        });
        return (
          <Stack gap="sm">
            <TextInput label="Focus here and press a shortcut" placeholder="Type, or press a shortcut" onKey={onKey} />
            <Row gap={6}>
              <Key>{primary}</Key>
              <Text size="sm">+</Text>
              <Key>B</Key>
              <Text size="sm" fg="quiet">
                ·
              </Text>
              <Key>{primary}</Key>
              <Text size="sm">+</Text>
              <Key>Shift</Key>
              <Text size="sm">+</Text>
              <Key>S</Key>
              <Text size="sm" fg="quiet">
                ·
              </Text>
              <Key>Alt</Key>
              <Text size="sm">+</Text>
              <Key>↑</Key>
              <Text size="sm" fg="quiet">
                ·
              </Text>
              <Key>Esc</Key>
            </Row>
            <Row gap="sm">
              <Text size="sm">{() => `Last shortcut: ${$read(last)}`}</Text>
              <Badge variant="soft">{() => `${$read(count)} matched`}</Badge>
            </Row>
          </Stack>
        );
      },
      height: 150,
    },
  ],
};
