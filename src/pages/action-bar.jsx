// ActionBar: actions on a selection, shown while something is selected.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { ActionBar, Button, Checkbox, Stack, Text } from 'rui-core';

const FILES = ['report.pdf', 'budget.xlsx', 'photo.png'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'action-bar',
  group: 'layers',
  title: 'ActionBar',
  description: 'A bar near the bottom of the portal layer with the actions for a selection, shown while `open`; Escape in it closes it. ActionBar.Divider sets groups of actions apart by a gap, and ActionBar.Close closes it.',
  props: [
    { name: 'open', type: 'boolean | () => boolean', description: 'Whether it is shown.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Its first state, when it holds its own.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called with `false` by ActionBar.Close and by Escape.' },
    { name: 'at', type: '{ bottom?, left?, right? }', default: "{ bottom: 'lg' } (centered)", description: 'Its place: centered at the bottom, or against a side, in px or spacing steps.' },
    { name: 'dismiss', type: 'boolean | { escape }', default: '{ escape: true }', description: 'Escape in the bar closes it; `false` (or `{ escape: false }`) keeps it.' },
    { name: 'persistent', type: 'boolean', default: 'false', description: 'Keeps it built (hidden) while closed.' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: "'md'", description: 'Corner radius.' },
    { name: 'shadow', type: "'xs' … 'xl'", default: "'md'", description: 'Its shadow.' },
    { name: 'motion', type: "'quick' | 'base' | 'calm' | { effect, duration, exit, easing }", default: "'base' (190 ms), a grow", description: "How it comes and goes: a preset's name, or `{ effect, duration, exit, easing }`; `exit` is the closing’s ms (the duration by default); `easing` is 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'settle' or a function." },
    { name: 'portal', type: 'boolean', default: 'true', description: 'In the portal layer.' },
    { name: 'layer', type: 'number', default: 'LAYERS.sheet (20)', description: 'Its stacking order.' },
    { name: 'ActionBar.Divider', type: '{}', description: 'A gap (`spacing.sm`, no line) between groups of actions.' },
    { name: 'ActionBar.Close', type: '{ size, label, onPress }', description: 'A close button that closes the bar (or calls `onPress`).' },
  ],
  demos: [
    {
      title: 'Actions on the selected files',
      code: `
const FILES = ['report.pdf', 'budget.xlsx', 'photo.png'];

function Demo() {
  const selected = $signal($active(), []);
  const toggle = name => value => $write(selected, value ? [...$read(selected), name] : $read(selected).filter(n => n !== name));
  return (
    <>
      <Stack gap="xs">
        {FILES.map(name => (
          <Checkbox label={name} checked={() => $read(selected).includes(name)} onChange={toggle(name)} />
        ))}
      </Stack>
      <ActionBar open={() => $read(selected).length > 0} onOpenChange={open => !open && $write(selected, [])}>
        <Text size="sm" px="xs">{() => \`\${$read(selected).length} selected\`}</Text>
        <ActionBar.Divider />
        <Button variant="ghost" size="xs">Download</Button>
        <Button variant="ghost" size="xs" color="red" onPress={() => $write(selected, [])}>Delete</Button>
        <ActionBar.Divider />
        <ActionBar.Close />
      </ActionBar>
    </>
  );
}`,
      view: () => {
        const selected = $signal($active(), /** @type {string[]} */ ([]));
        const toggle = (/** @type {string} */ name) => (/** @type {boolean} */ value) => $write(selected, value ? [...$read(selected), name] : $read(selected).filter(n => n !== name));
        return (
          <>
            <Stack gap="xs">
              {FILES.map(name => (
                <Checkbox label={name} checked={() => $read(selected).includes(name)} onChange={toggle(name)} />
              ))}
            </Stack>
            <ActionBar open={() => $read(selected).length > 0} onOpenChange={(/** @type {boolean} */ open) => !open && $write(selected, [])}>
              <Text size="sm" px="xs">
                {() => `${$read(selected).length} selected`}
              </Text>
              <ActionBar.Divider />
              <Button variant="ghost" size="xs">
                Download
              </Button>
              <Button variant="ghost" size="xs" color="red" onPress={() => $write(selected, [])}>
                Delete
              </Button>
              <ActionBar.Divider />
              <ActionBar.Close />
            </ActionBar>
          </>
        );
      },
      height: 180,
    },
  ],
};
