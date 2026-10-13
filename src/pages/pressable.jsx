// Pressable: a press target with no look of its own.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Pressable, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'pressable',
  group: 'actions',
  title: 'Pressable',
  description: 'A press target with no style of its own: focus, keyboard activation and presses on every renderer, and your style props.',
  props: [
    { name: 'onPress', type: '(event) => void', description: 'Called on a press.' },
    { name: 'label', type: 'string', description: 'The accessible name.' },
    { name: 'children', type: 'string | (() => string) | any', description: 'Its text, or content (primitives, painted on every renderer).' },
    { name: 'style props', type: 'm, p, w, h, bg, fg, fontSize, …', description: 'The style props, then `style`.' },
  ],
  demos: [
    {
      title: 'A plain press target',
      code: `
function Demo() {
  const count = $signal($active(), 0);
  return (
    <Stack gap="sm" align="start">
      <Pressable fg="blue" fontWeight={700} onPress={() => $write(count, $read(count) + 1)}>
        {() => \`Pressed \${$read(count)} times\`}
      </Pressable>
      <Text size="sm" fg="quiet">No background, border or padding: only what you give it.</Text>
    </Stack>
  );
}`,
      view: () => {
        const count = $signal($active(), 0);
        return (
          <Stack gap="sm" align="start">
            <Pressable fg="blue" fontWeight={700} onPress={() => $write(count, $read(count) + 1)}>
              {() => `Pressed ${$read(count)} times`}
            </Pressable>
            <Text size="sm" fg="quiet">
              No background, border or padding: only what you give it.
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
  ],
};
