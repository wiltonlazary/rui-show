// Menu: a file menu with a branch, a divider and a destructive item; open
// on hover and kept open after a choice; nested branches; checkbox and
// radio items.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Menu, Button, Row, Key, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'menu',
  group: 'wayfinding',
  title: 'Menu',
  description: 'A Popover of items: a press, a hover or either opens it; it is walked with the arrow keys, Home and End or by typing an item’s first letters (accents and case ignored, starting over 750 ms after the last key), an item chosen by a press, Enter or Space; Escape, Tab or a choice closes it. Menu.Branch opens a menu of its own beside its item (a hover, ArrowRight, Enter or Space; ArrowLeft or Escape closes it); checkbox and radio items toggle and keep the menu open.',
  props: [
    { name: 'openOn', type: "'press' | 'hover' | 'both'", default: "'press'", description: 'What opens it: a press, a hover, or both (a press toggles, a hover opens).' },
    { name: 'sticky', type: 'boolean', default: 'false', description: 'It stays open after a choice (false: a choice closes it).' },
    { name: 'loop', type: 'boolean', default: 'true', description: 'The arrow keys wrap from the last item to the first.' },
    { name: 'tabbable', type: 'boolean', default: 'false', description: 'false: Tab closes the menu; true: Tab moves among the items, as the focus order, and keeps it open.' },
    { name: 'openDelay', type: 'number', default: '0', description: 'With `openOn="hover"`: the hover time before it opens.' },
    { name: 'closeDelay', type: 'number', default: '240', description: 'With `openOn="hover"`: the time before it closes (time to reach the menu).' },
    { name: 'at', type: "'top' | 'right' | 'bottom' | 'left', each with '-start' or '-end'", default: "'bottom'", description: 'Its side of the trigger.' },
    { name: 'width', type: "number | 'trigger'", description: 'Its width, or `trigger`’s (160 at least otherwise).' },
    { name: 'shadow', type: "'xs' … 'xl'", default: "'md'", description: 'Its shadow.' },
    { name: 'others', type: 'Popover props', description: '`open`, `defaultOpen`, `onOpenChange`, `offset` (6), `arrow`, `radius`, `layer` (LAYERS.float), `portal`, `collision`, `persistent`, as Popover.' },
    { name: 'motion', type: "'quick' | 'base' | 'calm' | { effect, duration, exit, easing }", default: "'quick' (110), a fade from the trigger’s side", description: 'How it comes and goes, as Popover: a motion preset, or options: `exit` the closing’s time (the duration by default), `easing` \'linear\' | \'ease\' | \'ease-in\' | \'ease-out\' | \'ease-in-out\' | \'settle\' or a function (ease-out by default).' },
    { name: 'Menu.Item', type: '{ children, start, end, color, disabled, onPress, sticky }', description: 'An item: its label, content at its start and end, a color (red for danger), and whether choosing it keeps the menu open (the menu’s `sticky` by default; a choice in a branch closes every menu up to the root).' },
    { name: 'Menu.Branch', type: '{ label, start, end, color, disabled, at, offset, width, openDelay, closeDelay, children }', description: 'An item named `label` (a chevron at its end unless `end` is given) that opens a menu of its own holding its children, beside it (`at` `right-start`, `offset` half of `theme.control.panelPad`, `openDelay` MOTION.quick (110) so a pass over it does not open it, `closeDelay` 240). The parent’s placement props carry down.' },
    { name: 'Menu.CheckboxItem', type: '{ checked, defaultChecked, onChange, value, check, sticky, … }', description: 'An item that toggles: a check at its start while checked (`check`: your own node); alone (`checked`/`onChange`) or by `value` in a `Menu.CheckboxGroup` (`value`/`onChange` of a list, or `defaultValue`). Keeps the menu open by default.' },
    { name: 'Menu.RadioItem', type: '{ value, check, sticky, … }', description: 'An item choosing its `Menu.RadioGroup`’s value (`value`/`onChange`, or `defaultValue`): a dot at its start while chosen. Keeps the menu open by default.' },
    { name: 'Menu.Label', type: '{ children }', description: 'A section’s title: small, quiet and strong (weight 600).' },
    { name: 'Menu.Divider', type: '{}', description: 'A line between sections.' },
    { name: 'Menu.Trigger / Menu.Panel', type: 'Popover.Trigger / Popover.Panel', description: 'The trigger and the list (padded 6, its items 6 × 12); the trigger’s button says `aria-haspopup="menu"` and `aria-expanded` while the menu is open.' },
  ],
  demos: [
    {
      title: 'A file menu',
      code: `
function Demo() {
  const chosen = $signal($active(), 'nothing yet');
  const choose = name => () => $write(chosen, name);
  return (
    <Row gap="md" align="start">
      <Menu width={220} at="bottom-start">
        <Menu.Trigger>
          <Button variant="neutral">File</Button>
        </Menu.Trigger>
        <Menu.Panel>
          <Menu.Item onPress={choose('New sketch')} end={<Key size="xs">Ctrl N</Key>}>New sketch</Menu.Item>
          <Menu.Item onPress={choose('Duplicate')}>Duplicate</Menu.Item>
          <Menu.Branch label="Export as">
            <Menu.Item onPress={choose('Export as PDF')}>PDF</Menu.Item>
            <Menu.Item onPress={choose('Export as PNG')}>PNG</Menu.Item>
            <Menu.Item onPress={choose('Export as Markdown')}>Markdown</Menu.Item>
          </Menu.Branch>
          <Menu.Item disabled>Share (offline)</Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" onPress={choose('Move to bin')}>Move to bin</Menu.Item>
        </Menu.Panel>
      </Menu>
      <Text size="sm" fg="quiet">{() => \`chosen: \${$read(chosen)}\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const chosen = $signal($active(), 'nothing yet');
        const choose = (/** @type {string} */ name) => () => $write(chosen, name);
        return (
          <Row gap="md" align="start">
            <Menu width={220} at="bottom-start">
              <Menu.Trigger>
                <Button variant="neutral">File</Button>
              </Menu.Trigger>
              <Menu.Panel>
                <Menu.Item onPress={choose('New sketch')} end={<Key size="xs">Ctrl N</Key>}>
                  New sketch
                </Menu.Item>
                <Menu.Item onPress={choose('Duplicate')}>Duplicate</Menu.Item>
                <Menu.Branch label="Export as">
                  <Menu.Item onPress={choose('Export as PDF')}>PDF</Menu.Item>
                  <Menu.Item onPress={choose('Export as PNG')}>PNG</Menu.Item>
                  <Menu.Item onPress={choose('Export as Markdown')}>Markdown</Menu.Item>
                </Menu.Branch>
                <Menu.Item disabled>Share (offline)</Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onPress={choose('Move to bin')}>
                  Move to bin
                </Menu.Item>
              </Menu.Panel>
            </Menu>
            <Text size="sm" fg="quiet">
              {() => `chosen: ${$read(chosen)}`}
            </Text>
          </Row>
        );
      },
      height: 280,
    },
    {
      title: 'Open on hover, kept open after a choice',
      code: `
function Demo() {
  const count = $signal($active(), 0);
  return (
    <Row gap="md" align="start">
      <Menu openOn="hover" openDelay={150} closeDelay={250} sticky at="right-start" arrow>
        <Menu.Trigger>
          <Button variant="soft">Hover me</Button>
        </Menu.Trigger>
        <Menu.Panel>
          <Menu.Item onPress={() => $write(count, $read(count) + 1)}>Add one</Menu.Item>
          <Menu.Item onPress={() => $write(count, 0)}>Reset</Menu.Item>
        </Menu.Panel>
      </Menu>
      <Stack gap={0} ml={160}>
        <Text size="sm" fg="quiet">{() => \`count: \${$read(count)}\`}</Text>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const count = $signal($active(), 0);
        return (
          <Row gap="md" align="start">
            <Menu openOn="hover" openDelay={150} closeDelay={250} sticky at="right-start" arrow>
              <Menu.Trigger>
                <Button variant="soft">Hover me</Button>
              </Menu.Trigger>
              <Menu.Panel>
                <Menu.Item onPress={() => $write(count, $read(count) + 1)}>Add one</Menu.Item>
                <Menu.Item onPress={() => $write(count, 0)}>Reset</Menu.Item>
              </Menu.Panel>
            </Menu>
            <Stack gap={0} ml={160}>
              <Text size="sm" fg="quiet">
                {() => `count: ${$read(count)}`}
              </Text>
            </Stack>
          </Row>
        );
      },
      height: 120,
    },
    {
      title: 'Branches inside branches',
      code: `
function Demo() {
  const chosen = $signal($active(), 'nothing yet');
  const choose = name => () => $write(chosen, name);
  return (
    <Row gap="md" align="start">
      <Menu width={180} at="bottom-start">
        <Menu.Trigger>
          <Button>Insert</Button>
        </Menu.Trigger>
        <Menu.Panel>
          <Menu.Item onPress={choose('Text box')}>Text box</Menu.Item>
          <Menu.Branch label="Shape">
            <Menu.Item onPress={choose('Rectangle')}>Rectangle</Menu.Item>
            <Menu.Item onPress={choose('Oval')}>Oval</Menu.Item>
          </Menu.Branch>
          <Menu.Branch label="Chart">
            <Menu.Item onPress={choose('Bars')}>Bars</Menu.Item>
            <Menu.Branch label="Round charts">
              <Menu.Item onPress={choose('Donut')}>Donut</Menu.Item>
              <Menu.Item onPress={choose('Radar')}>Radar</Menu.Item>
            </Menu.Branch>
          </Menu.Branch>
        </Menu.Panel>
      </Menu>
      <Text size="sm" fg="quiet">{() => \`chosen: \${$read(chosen)}\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const chosen = $signal($active(), 'nothing yet');
        const choose = (/** @type {string} */ name) => () => $write(chosen, name);
        return (
          <Row gap="md" align="start">
            <Menu width={180} at="bottom-start">
              <Menu.Trigger>
                <Button>Insert</Button>
              </Menu.Trigger>
              <Menu.Panel>
                <Menu.Item onPress={choose('Text box')}>Text box</Menu.Item>
                <Menu.Branch label="Shape">
                  <Menu.Item onPress={choose('Rectangle')}>Rectangle</Menu.Item>
                  <Menu.Item onPress={choose('Oval')}>Oval</Menu.Item>
                </Menu.Branch>
                <Menu.Branch label="Chart">
                  <Menu.Item onPress={choose('Bars')}>Bars</Menu.Item>
                  <Menu.Branch label="Round charts">
                    <Menu.Item onPress={choose('Donut')}>Donut</Menu.Item>
                    <Menu.Item onPress={choose('Radar')}>Radar</Menu.Item>
                  </Menu.Branch>
                </Menu.Branch>
              </Menu.Panel>
            </Menu>
            <Text size="sm" fg="quiet">
              {() => `chosen: ${$read(chosen)}`}
            </Text>
          </Row>
        );
      },
      height: 200,
    },
    {
      title: 'Checkbox and radio items',
      code: `
function Demo() {
  const columns = $signal($active(), ['name']);
  const sort = $signal($active(), 'newest');
  const wrap = $signal($active(), false);
  return (
    <Row gap="md" align="start">
      <Menu width={180} at="bottom-start">
        <Menu.Trigger>
          <Button variant="neutral">View</Button>
        </Menu.Trigger>
        <Menu.Panel>
          <Menu.Label>Columns</Menu.Label>
          <Menu.CheckboxGroup value={columns} onChange={v => $write(columns, v)}>
            <Menu.CheckboxItem value="name">Name</Menu.CheckboxItem>
            <Menu.CheckboxItem value="email">Email</Menu.CheckboxItem>
          </Menu.CheckboxGroup>
          <Menu.Divider />
          <Menu.Label>Sort</Menu.Label>
          <Menu.RadioGroup value={sort} onChange={v => $write(sort, v)}>
            <Menu.RadioItem value="newest">Newest</Menu.RadioItem>
            <Menu.RadioItem value="oldest">Oldest</Menu.RadioItem>
          </Menu.RadioGroup>
          <Menu.Divider />
          <Menu.CheckboxItem checked={wrap} onChange={v => $write(wrap, v)}>Wrap lines</Menu.CheckboxItem>
        </Menu.Panel>
      </Menu>
      <Text size="sm" fg="quiet">{() => \`columns: \${$read(columns).join(', ') || 'none'}; sort: \${$read(sort)}; wrap: \${$read(wrap) ? 'on' : 'off'}\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const columns = $signal($active(), /** @type {string[]} */ (['name']));
        const sort = $signal($active(), 'newest');
        const wrap = $signal($active(), false);
        return (
          <Row gap="md" align="start">
            <Menu width={180} at="bottom-start">
              <Menu.Trigger>
                <Button variant="neutral">View</Button>
              </Menu.Trigger>
              <Menu.Panel>
                <Menu.Label>Columns</Menu.Label>
                <Menu.CheckboxGroup value={columns} onChange={(/** @type {string[]} */ v) => $write(columns, v)}>
                  <Menu.CheckboxItem value="name">Name</Menu.CheckboxItem>
                  <Menu.CheckboxItem value="email">Email</Menu.CheckboxItem>
                </Menu.CheckboxGroup>
                <Menu.Divider />
                <Menu.Label>Sort</Menu.Label>
                <Menu.RadioGroup value={sort} onChange={(/** @type {string} */ v) => $write(sort, v)}>
                  <Menu.RadioItem value="newest">Newest</Menu.RadioItem>
                  <Menu.RadioItem value="oldest">Oldest</Menu.RadioItem>
                </Menu.RadioGroup>
                <Menu.Divider />
                <Menu.CheckboxItem checked={wrap} onChange={(/** @type {boolean} */ v) => $write(wrap, v)}>
                  Wrap lines
                </Menu.CheckboxItem>
              </Menu.Panel>
            </Menu>
            <Text size="sm" fg="quiet">
              {() => `columns: ${$read(columns).join(', ') || 'none'}; sort: ${$read(sort)}; wrap: ${$read(wrap) ? 'on' : 'off'}`}
            </Text>
          </Row>
        );
      },
      height: 320,
    },
  ],
};
