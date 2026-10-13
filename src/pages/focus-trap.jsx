// FocusTrap: Tab kept among the fields inside while active, and the focus
// moved to FocusTrap.Start.

import { $signal, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { FocusTrap, Button, Popover, PasswordInput, Stack, Switch, Text, TextInput } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'focus-trap',
  group: 'behavior',
  title: 'FocusTrap',
  description: 'Keeps the focus among its children while `active`: Tab and Shift+Tab cycle inside (the primitives’ `trap`, on every renderer). When it activates the focus moves in: to FocusTrap.Start, or else to its first focusable.',
  props: [
    { name: 'active', type: 'boolean | () => boolean', default: 'true', description: 'Whether it traps the focus; turning on moves the focus in.' },
    { name: 'children', type: 'any', description: 'The content the focus stays in.' },
    { name: 'FocusTrap.Start', type: '{ label }', description: 'A hidden stop inside: where the focus goes when it activates.' },
    { name: '$trap(active?)', type: '{ props: { trap, ref }, start(node), active() }', description: 'The hook under it (rui-core/hooks): spread `props` on a View, Layout or Scroll to trap Tab there while `active` (true; a value, accessor or signal); on activating, the focus moves at the next frame to the ref given to `start`, else to the first focusable.' },
    { name: 'style props', type: 'm, p, w, …', description: 'As Box, on the trapping box.' },
  ],
  demos: [
    {
      title: 'A sign-in panel that starts at the password',
      code: `
function Demo() {
  const active = $signal($active(), true);
  return (
    <Popover width={300} at="bottom-start">
      <Popover.Trigger>
        <Button>Sign in</Button>
      </Popover.Trigger>
      <Popover.Panel>
        <FocusTrap active={active}>
          <Stack gap="xs">
            <Text size="sm" fg="quiet">Welcome back: your email is known, so the focus starts at the password.</Text>
            <TextInput label="Email" defaultValue="maya@example.com" />
            <FocusTrap.Start label="Password" />
            <PasswordInput label="Password" />
            <Switch label="Keep Tab inside this panel" checked={active} onChange={v => $write(active, v)} />
            <Button stretch>Sign in</Button>
          </Stack>
        </FocusTrap>
      </Popover.Panel>
    </Popover>
  );
}`,
      view: () => {
        const active = $signal($active(), true);
        return (
          <Popover width={300} at="bottom-start">
            <Popover.Trigger>
              <Button>Sign in</Button>
            </Popover.Trigger>
            <Popover.Panel>
              <FocusTrap active={active}>
                <Stack gap="xs">
                  <Text size="sm" fg="quiet">
                    Welcome back: your email is known, so the focus starts at the password.
                  </Text>
                  <TextInput label="Email" defaultValue="maya@example.com" />
                  <FocusTrap.Start label="Password" />
                  <PasswordInput label="Password" />
                  <Switch label="Keep Tab inside this panel" checked={active} onChange={(/** @type {boolean} */ v) => $write(active, v)} />
                  <Button stretch>Sign in</Button>
                </Stack>
              </FocusTrap>
            </Popover.Panel>
          </Popover>
        );
      },
      height: 360,
    },
  ],
};
