// The application's own menus (rui-core theme settings): in text fields and
// over static text, in place of the browser's.

import { Stack, Text, TextInput, Textarea, PasswordInput } from 'rui-core';

/** The settings this page shows, on: both menus. */
const ON = { control: { editMenu: 'app', textMenu: true } };

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'app-menus',
  group: 'behavior',
  title: 'App menus',
  description: 'The application’s own context menus, set in the theme: in text fields (Undo, Redo, Cut, Copy, Paste, Select all) and over static text (Copy, Select text), the same on every renderer. Both are off by default.',
  props: [
    { name: 'control.editMenu', type: "'browser' | 'app'", default: "'browser'", description: 'A right press (or a touch long press, or Shift+F10) in a field opens the app’s menu instead of the browser’s. A field’s own `editMenu` prop wins.' },
    { name: 'control.textMenu', type: 'boolean', default: 'false', description: 'A right press over static text opens Copy and Select text (which selects that text, a drag inside it keeping a part, until a press elsewhere or Escape); over a selection, Copy.' },
  ],
  demos: [
    {
      title: 'Both menus on',
      theme: ON,
      height: 300,
      code: `
const theme = themeOf({ control: { editMenu: 'app', textMenu: true } });

function Demo() {
  return (
    <Rui theme={theme}>
      <Stack gap="sm">
        <Text>Right-click this text: copy it, or select a part of it.</Text>
        <TextInput label="Name" defaultValue="Ada Lovelace" />
        <Textarea label="Note" defaultValue="Right-click in a field: undo, cut, copy, paste, select all." />
        <PasswordInput label="Secret" defaultValue="hidden" />
      </Stack>
    </Rui>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Text>Right-click this text: copy it, or select a part of it.</Text>
          <TextInput label="Name" defaultValue="Ada Lovelace" />
          <Textarea label="Note" defaultValue="Right-click in a field: undo, cut, copy, paste, select all." />
          <PasswordInput label="Secret" defaultValue="hidden" />
        </Stack>
      ),
    },
  ],
};
