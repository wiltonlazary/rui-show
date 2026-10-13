// Menubar: a row of menus, one open at a time, moved between by hovering
// or the arrow keys.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Menubar, Menu, Surface, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'menubar',
  group: 'wayfinding',
  title: 'Menubar',
  description: 'An application’s row of menus: at most one open; while one is, hovering another trigger opens that one. On a trigger ArrowLeft and ArrowRight move between the menus (the open one follows), Home and End go to the first and last, ArrowDown, Enter or Space open the focused one on its first item and ArrowUp on its last; inside an open menu ArrowLeft and ArrowRight open its neighbors. Typing finds a trigger by its text, accents and case ignored, and starts over 750 ms after the last key. Its menus have no backdrop, so a press outside leaves them open (Escape, a choice, Tab or the trigger close them).',
  props: [
    { name: 'value', type: 'number | null | (() => number | null)', description: 'The open menu’s index in shown order, or null; held by you (with `onChange`, which reports the open menu’s new index when a menu shown later re-sorts the bar).' },
    { name: 'defaultValue', type: 'number | null', default: 'null', description: 'The menu open at first, when it holds its own.' },
    { name: 'onChange', type: '(index: number | null) => void', description: 'Called when a menu opens or they all close.' },
    { name: 'openOn', type: "'press' | 'hover'", default: "'press'", description: "`press`: a press opens a menu and, while one is open, hovering another trigger switches to it; `hover`: hovering any trigger opens its menu." },
    { name: 'loop', type: 'boolean', default: 'true', description: 'The arrows wrap: ArrowRight from the last menu goes to the first.' },
    { name: 'at', type: "'bottom-start' | …", default: "'bottom-start'", description: 'Where each menu opens; a menu’s own `at` wins.' },
    { name: 'aria-label / aria-labelledby', type: 'string', description: 'The bar’s name (none by default); the other `aria-*` and `data-*` props reach it too.' },
    { name: 'Menubar.Menu', type: 'Menu props', description: 'A menu in the bar.' },
    { name: 'Menubar.Trigger', type: '{ children }', description: 'Its trigger: text on a ghost button.' },
    { name: 'Menubar.Panel', type: 'Menu.Panel', description: 'Its items: Menu.Item, Menu.Label, Menu.Divider.' },
  ],
  demos: [
    {
      title: 'An editor’s menus',
      code: `
function Demo() {
  const last = $signal($active(), 'none');
  const run = name => () => $write(last, name);
  return (
    <Stack gap="sm">
      <Surface bordered radius="sm">
        <Menubar aria-label="Editor">
          <Menubar.Menu>
            <Menubar.Trigger>File</Menubar.Trigger>
            <Menubar.Panel>
              <Menu.Item onPress={run('New file')}>New file</Menu.Item>
              <Menu.Item onPress={run('Open')}>Open…</Menu.Item>
              <Menu.Divider />
              <Menu.Item onPress={run('Save')}>Save</Menu.Item>
            </Menubar.Panel>
          </Menubar.Menu>
          <Menubar.Menu>
            <Menubar.Trigger>Edit</Menubar.Trigger>
            <Menubar.Panel>
              <Menu.Item onPress={run('Undo')}>Undo</Menu.Item>
              <Menu.Item onPress={run('Redo')}>Redo</Menu.Item>
              <Menu.Item disabled>Paste</Menu.Item>
            </Menubar.Panel>
          </Menubar.Menu>
          <Menubar.Menu>
            <Menubar.Trigger>View</Menubar.Trigger>
            <Menubar.Panel>
              <Menu.Label>Appearance</Menu.Label>
              <Menu.Item onPress={run('Zoom in')}>Zoom in</Menu.Item>
              <Menu.Item onPress={run('Zoom out')}>Zoom out</Menu.Item>
            </Menubar.Panel>
          </Menubar.Menu>
        </Menubar>
      </Surface>
      <Text size="sm" fg="quiet">{() => \`last command: \${$read(last)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const last = $signal($active(), 'none');
        const run = (/** @type {string} */ name) => () => $write(last, name);
        return (
          <Stack gap="sm">
            <Surface bordered radius="sm">
              <Menubar aria-label="Editor">
                <Menubar.Menu>
                  <Menubar.Trigger>File</Menubar.Trigger>
                  <Menubar.Panel>
                    <Menu.Item onPress={run('New file')}>New file</Menu.Item>
                    <Menu.Item onPress={run('Open')}>Open…</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item onPress={run('Save')}>Save</Menu.Item>
                  </Menubar.Panel>
                </Menubar.Menu>
                <Menubar.Menu>
                  <Menubar.Trigger>Edit</Menubar.Trigger>
                  <Menubar.Panel>
                    <Menu.Item onPress={run('Undo')}>Undo</Menu.Item>
                    <Menu.Item onPress={run('Redo')}>Redo</Menu.Item>
                    <Menu.Item disabled>Paste</Menu.Item>
                  </Menubar.Panel>
                </Menubar.Menu>
                <Menubar.Menu>
                  <Menubar.Trigger>View</Menubar.Trigger>
                  <Menubar.Panel>
                    <Menu.Label>Appearance</Menu.Label>
                    <Menu.Item onPress={run('Zoom in')}>Zoom in</Menu.Item>
                    <Menu.Item onPress={run('Zoom out')}>Zoom out</Menu.Item>
                  </Menubar.Panel>
                </Menubar.Menu>
              </Menubar>
            </Surface>
            <Text size="sm" fg="quiet">
              {() => `last command: ${$read(last)}`}
            </Text>
          </Stack>
        );
      },
      height: 200,
    },
    {
      title: 'Open on hover, held by a signal',
      code: `
function Demo() {
  const open = $signal($active(), null);
  return (
    <Stack gap="sm">
      <Menubar aria-label="Shop" openOn="hover" value={open} onChange={i => $write(open, i)}>
        <Menubar.Menu>
          <Menubar.Trigger>Shop</Menubar.Trigger>
          <Menubar.Panel>
            <Menu.Item>Bicycles</Menu.Item>
            <Menu.Item>Spare parts</Menu.Item>
          </Menubar.Panel>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>Workshop</Menubar.Trigger>
          <Menubar.Panel>
            <Menu.Item>Opening hours</Menu.Item>
            <Menu.Item>Book a repair</Menu.Item>
          </Menubar.Panel>
        </Menubar.Menu>
      </Menubar>
      <Text size="sm" fg="quiet">{() => \`open menu: \${$read(open) ?? 'none'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const open = $signal($active(), /** @type {number | null} */ (null));
        return (
          <Stack gap="sm">
            <Menubar aria-label="Shop" openOn="hover" value={open} onChange={(/** @type {number | null} */ i) => $write(open, i)}>
              <Menubar.Menu>
                <Menubar.Trigger>Shop</Menubar.Trigger>
                <Menubar.Panel>
                  <Menu.Item>Bicycles</Menu.Item>
                  <Menu.Item>Spare parts</Menu.Item>
                </Menubar.Panel>
              </Menubar.Menu>
              <Menubar.Menu>
                <Menubar.Trigger>Workshop</Menubar.Trigger>
                <Menubar.Panel>
                  <Menu.Item>Opening hours</Menu.Item>
                  <Menu.Item>Book a repair</Menu.Item>
                </Menubar.Panel>
              </Menubar.Menu>
            </Menubar>
            <Text size="sm" fg="quiet">
              {() => `open menu: ${$read(open) ?? 'none'}`}
            </Text>
          </Stack>
        );
      },
      height: 150,
    },
  ],
};
