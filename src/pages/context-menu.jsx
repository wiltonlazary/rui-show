// ContextMenu (rui-core/more): a menu at the pointer on a secondary press or a
// long press.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Menu, Surface, Stack, Text } from 'rui-core';
import { ContextMenu } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'context-menu',
  group: 'wayfinding',
  title: 'ContextMenu',
  description: 'A region with a context menu (rui-core/more): a secondary press (or a long primary press) opens a Menu at the pointer, with Menu’s items, keys and closing.',
  props: [
    { name: 'children', type: 'any', description: 'The region.' },
    { name: 'menu', type: 'Menu.Item | Menu.Label | Menu.Divider …', description: 'The menu’s content.' },
    { name: 'open / onOpenChange', type: 'boolean / (open, point) => void', description: 'Held by you (the point in the region when it opens), or its own state.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'The first state, when it holds its own.' },
    { name: 'longPress', type: 'boolean', default: 'true', description: 'A held primary press opens it too (canceled by a move past 10 px or a release).' },
    { name: 'hold', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: 'twice MOTION.calm (600)', description: 'How long a press is held before it opens: ms or a motion preset’s name.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Never opens.' },
    { name: 'popover', type: 'Menu props', default: "{ at: 'bottom-start' }", description: '`width`, `shadow`, …' },
  ],
  demos: [
    {
      title: 'A file’s actions',
      code: `
function Demo() {
  const last = $signal($active(), 'none');
  const run = name => () => $write(last, name);
  return (
    <Stack gap="xs">
      <ContextMenu
        popover={{ width: 180 }}
        menu={
          <>
            <Menu.Label>report.pdf</Menu.Label>
            <Menu.Item onPress={run('Open')}>Open</Menu.Item>
            <Menu.Item onPress={run('Rename')}>Rename</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" onPress={run('Delete')}>Delete</Menu.Item>
          </>
        }
      >
        <Surface bordered p="xl" w={360}>
          <Text textAlign="center" fg="quiet">Right-click here, or hold a press</Text>
        </Surface>
      </ContextMenu>
      <Text size="sm" fg="quiet">{() => \`last action: \${$read(last)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const last = $signal($active(), 'none');
        const run = (/** @type {string} */ name) => () => $write(last, name);
        return (
          <Stack gap="xs">
            <ContextMenu
              popover={{ width: 180 }}
              menu={
                <>
                  <Menu.Label>report.pdf</Menu.Label>
                  <Menu.Item onPress={run('Open')}>Open</Menu.Item>
                  <Menu.Item onPress={run('Rename')}>Rename</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" onPress={run('Delete')}>
                    Delete
                  </Menu.Item>
                </>
              }
            >
              <Surface bordered p="xl" w={360}>
                <Text textAlign="center" fg="quiet">
                  Right-click here, or hold a press
                </Text>
              </Surface>
            </ContextMenu>
            <Text size="sm" fg="quiet">
              {() => `last action: ${$read(last)}`}
            </Text>
          </Stack>
        );
      },
      height: 260,
    },
  ],
};
