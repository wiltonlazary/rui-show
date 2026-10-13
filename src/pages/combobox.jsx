// Combobox: the store and the parts every select is made of, a button
// trigger on each row of a list, a filter with groups, top and bottom parts
// and a no-match line, and Picker on a trigger of one's own.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $combobox, Combobox, Picker, Button, Row, Stack, Text } from 'rui-core';

const STATUSES = ['Waiting', 'Underway', 'Blocked', 'Shipped'];
/** @typedef {{ job: string, status: string }} Job */
/** @type {Job[]} */
const JOBS = [
  { job: 'Crate the ceramics', status: 'Underway' },
  { job: 'Book the ferry', status: 'Waiting' },
  { job: 'Print the customs forms', status: 'Blocked' },
];
/** @typedef {{ name: string, path: string }} Folder */
/** @type {Folder[]} */
const RECENT = [
  { name: 'Invoices', path: 'Work/Finance/Invoices' },
  { name: 'Trips', path: 'Home/Photos/Trips' },
];
/** @type {Folder[]} */
const ALL = [
  { name: 'Drafts', path: 'Work/Drafts' },
  { name: 'Taxes', path: 'Work/Finance/Taxes' },
  { name: 'Receipts', path: 'Home/Receipts' },
  { name: 'Photos', path: 'Home/Photos' },
  { name: 'Archive', path: 'Archive' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'combobox',
  group: 'choices',
  title: 'Combobox',
  description: 'The parts Select, MultiSelect, Autocomplete and the rest are built from, to build your own: a store (`$combobox`) holding the panel’s open state and the option the keyboard is on, a `Combobox.Trigger`, a `Combobox.Panel` placed as a Popover’s, and options walked with the arrow keys and chosen by Enter or a press; `Picker` puts options on a trigger of your own.',
  props: [
    { name: 'store', type: 'ComboboxHandle', default: '$combobox()', description: 'The state: `$combobox({ open, defaultOpen, onOpenChange, loop })` gives `isOpen`, `open`, `close`, `toggle`, `active`, `first`, `next`, `previous`, `pick`, `reset`, `focus`, `setFilter`, `focusFilter`, …' },
    { name: 'onPick', type: '(value: string, option) => void', description: 'Called when an option is chosen (a press, or Enter on the selected one), with the option’s data item.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The options’ size.' },
    { name: 'at', type: "'bottom' | 'top' | … with '-start' or '-end'", default: "'bottom'", description: 'The panel’s side of the trigger.' },
    { name: 'offset', type: 'number', default: '4', description: 'The gap from the trigger: the panel sits against its field.' },
    { name: 'width', type: "number | 'trigger'", default: "'trigger'", description: 'The panel’s width.' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'In the portal layer, or inline.' },
    { name: 'keys', type: 'boolean', default: 'true', description: 'The arrows, Enter, Escape and Tab on the trigger work the options.' },
    { name: 'others', type: 'Popover props', description: '`shadow`, `radius`, `arrow`, `layer` (`LAYERS.float`, 30), `motion` (the quick preset: 110 ms, fade), `dismiss` (`{ outside }`).' },
    { name: 'Combobox.Trigger', type: "{ kind: 'input' | 'button', children }", default: "kind 'input'", description: 'The field or button the panel opens from; it takes the keys (`button`: Enter and Space toggle).' },
    { name: 'Combobox.Panel', type: '{ shown, children }', default: 'shown true', description: 'The panel, 6 px inside its edge (`control.panelPad`), shown while the store is open (`shown` false keeps it out of sight, as when there is nothing to show).' },
    { name: 'Combobox.List', type: '{ children }', description: 'The options’ column, a listbox.' },
    { name: 'Combobox.Option', type: '{ value, option, disabled, chosen, index, onPress, children }', description: 'An option (`option`: its data item for `onPick`, `{ value, label, disabled }` by default); `chosen` says it is the value (`aria-selected`); where the keyboard is, it takes the accent’s soft tint.' },
    { name: 'Combobox.Filter', type: '{ value, onChange, placeholder }', description: 'A field at the top of the panel that narrows the options, a rule under it; it takes the trigger’s keys, and the store’s `focusFilter()` puts the focus there.' },
    { name: 'Combobox.Group / Top / Bottom / NoMatch', type: '{ label } / { children }', description: 'Options under a label (a type step below the options); content above or below the options, inside the panel with a rule between; the quiet line when nothing matches.' },
    { name: 'Combobox.Opener / Clear / Value', type: '{ size, color } / { onPress, label } / { value, separator, name, form, onChange }', description: 'A field’s chevron; a small clear button; the value as a form carries it (a list joined by `separator`, `\', \'` by default).' },
    { name: 'Picker', type: '{ data, value, onChange, multiple, searchable, match, limit, check, checkAt, width, at, popover, … }', description: 'Options from data on a trigger of your own (`Picker.Trigger`); `multiple` keeps it open and makes the value an array; `match(option, search)` and `limit` (the most options shown) shape what the search shows; the check sits at the end (`checkAt`).' },
  ],
  demos: [
    {
      title: 'A status picker on each row of a list',
      code: `
const STATUSES = ['Waiting', 'Underway', 'Blocked', 'Shipped'];
const JOBS = [
  { job: 'Crate the ceramics', status: 'Underway' },
  { job: 'Book the ferry', status: 'Waiting' },
  { job: 'Print the customs forms', status: 'Blocked' },
];

function Demo() {
  const R = $active();
  // One store and one value per row: each row's picker opens on its own.
  const row = item => {
    const store = $combobox();
    const status = $signal(R, item.status);
    return (
      <Row gap="sm" align="center" justify="between" w={320}>
        <Text size="sm">{item.job}</Text>
        <Combobox store={store} width={150} at="bottom-end" onPick={value => ($write(status, value), store.close())}>
          <Combobox.Trigger kind="button">
            <Button size="xs" variant="neutral" onPress={() => store.toggle()}>{() => $read(status)}</Button>
          </Combobox.Trigger>
          <Combobox.Panel>
            <Combobox.List>
              {STATUSES.map(s => <Combobox.Option value={s} chosen={() => $read(status) === s}>{s}</Combobox.Option>)}
            </Combobox.List>
          </Combobox.Panel>
        </Combobox>
      </Row>
    );
  };
  return <Stack gap="xs">{JOBS.map(row)}</Stack>;
}`,
      view: () => {
        const R = $active();
        const row = (/** @type {Job} */ item) => {
          const store = $combobox();
          const status = $signal(R, item.status);
          return (
            <Row gap="sm" align="center" justify="between" w={320}>
              <Text size="sm">{item.job}</Text>
              <Combobox store={store} width={150} at="bottom-end" onPick={(/** @type {string} */ value) => ($write(status, value), store.close())}>
                <Combobox.Trigger kind="button">
                  <Button size="xs" variant="neutral" onPress={() => store.toggle()}>
                    {() => $read(status)}
                  </Button>
                </Combobox.Trigger>
                <Combobox.Panel>
                  <Combobox.List>
                    {STATUSES.map(s => (
                      <Combobox.Option value={s} chosen={() => $read(status) === s}>
                        {s}
                      </Combobox.Option>
                    ))}
                  </Combobox.List>
                </Combobox.Panel>
              </Combobox>
            </Row>
          );
        };
        return <Stack gap="xs">{JOBS.map(row)}</Stack>;
      },
      height: 250,
    },
    {
      title: 'Move to a folder: a filter that also finds paths, groups, top and bottom parts and a no-match line',
      code: `
const RECENT = [
  { name: 'Invoices', path: 'Work/Finance/Invoices' },
  { name: 'Trips', path: 'Home/Photos/Trips' },
];
const ALL = [
  { name: 'Drafts', path: 'Work/Drafts' },
  { name: 'Taxes', path: 'Work/Finance/Taxes' },
  { name: 'Receipts', path: 'Home/Receipts' },
  { name: 'Photos', path: 'Home/Photos' },
  { name: 'Archive', path: 'Archive' },
];

function Demo() {
  // The filter is kept: it is still there when the panel opens again.
  const search = $signal($active(), '');
  const store = $combobox();
  const moved = $signal($active(), null);
  const match = folder => {
    const q = $read(search).toLowerCase().trim();
    return folder.name.toLowerCase().includes(q) || folder.path.toLowerCase().includes(q);
  };
  const shown = list => list.filter(match);
  const option = folder => (
    <Combobox.Option value={folder.path}>
      <Row gap="xs" align="center">
        <Text size="sm">{folder.name}</Text>
        <Text size="xs" fg="quiet">{folder.path}</Text>
      </Row>
    </Combobox.Option>
  );
  return (
    <Row gap="md" align="start">
      <Combobox store={store} width={280} at="bottom-start" onPick={value => ($write(moved, value), store.close())}>
        <Combobox.Trigger kind="button">
          <Button variant="neutral" onPress={() => store.toggle()}>Move to…</Button>
        </Combobox.Trigger>
        <Combobox.Panel>
          <Combobox.Filter value={search} onChange={e => $write(search, e.value)} placeholder="Folder or path" />
          <Combobox.Top>
            <Text size="xs" fg="quiet">Moving budget-2026.pdf</Text>
          </Combobox.Top>
          <Combobox.List>
            <Combobox.Group label="Recent">{() => shown(RECENT).map(option)}</Combobox.Group>
            <Combobox.Group label="All">{() => shown(ALL).map(option)}</Combobox.Group>
            {() => (shown([...RECENT, ...ALL]).length === 0 ? <Combobox.NoMatch>No folder or path matches</Combobox.NoMatch> : null)}
          </Combobox.List>
          <Combobox.Bottom>
            <Text size="xs" fg="quiet">{() => \`\${shown([...RECENT, ...ALL]).length} of 7 folders\`}</Text>
          </Combobox.Bottom>
        </Combobox.Panel>
      </Combobox>
      <Text size="sm" fg="quiet">{() => ($read(moved) ? \`moved to \${$read(moved)}\` : 'not moved yet')}</Text>
    </Row>
  );
}`,
      view: () => {
        const search = $signal($active(), '');
        const store = $combobox();
        const moved = $signal($active(), /** @type {string | null} */ (null));
        const match = (/** @type {Folder} */ folder) => {
          const q = $read(search).toLowerCase().trim();
          return folder.name.toLowerCase().includes(q) || folder.path.toLowerCase().includes(q);
        };
        const shown = (/** @type {Folder[]} */ list) => list.filter(match);
        const option = (/** @type {Folder} */ folder) => (
          <Combobox.Option value={folder.path}>
            <Row gap="xs" align="center">
              <Text size="sm">{folder.name}</Text>
              <Text size="xs" fg="quiet">
                {folder.path}
              </Text>
            </Row>
          </Combobox.Option>
        );
        return (
          <Row gap="md" align="start">
            <Combobox store={store} width={280} at="bottom-start" onPick={(/** @type {string} */ value) => ($write(moved, value), store.close())}>
              <Combobox.Trigger kind="button">
                <Button variant="neutral" onPress={() => store.toggle()}>
                  Move to…
                </Button>
              </Combobox.Trigger>
              <Combobox.Panel>
                <Combobox.Filter value={search} onChange={(/** @type {{ value: string }} */ e) => $write(search, e.value)} placeholder="Folder or path" />
                <Combobox.Top>
                  <Text size="xs" fg="quiet">
                    Moving budget-2026.pdf
                  </Text>
                </Combobox.Top>
                <Combobox.List>
                  <Combobox.Group label="Recent">{() => shown(RECENT).map(option)}</Combobox.Group>
                  <Combobox.Group label="All">{() => shown(ALL).map(option)}</Combobox.Group>
                  {() => (shown([...RECENT, ...ALL]).length === 0 ? <Combobox.NoMatch>No folder or path matches</Combobox.NoMatch> : null)}
                </Combobox.List>
                <Combobox.Bottom>
                  <Text size="xs" fg="quiet">
                    {() => `${shown([...RECENT, ...ALL]).length} of 7 folders`}
                  </Text>
                </Combobox.Bottom>
              </Combobox.Panel>
            </Combobox>
            <Text size="sm" fg="quiet">
              {() => ($read(moved) ? `moved to ${$read(moved)}` : 'not moved yet')}
            </Text>
          </Row>
        );
      },
      height: 460,
    },
    {
      title: 'Picker: many values on a button',
      code: `
function Demo() {
  const marks = $signal($active(), ['Bold']);
  return (
    <Row gap="md" align="start">
      <Picker multiple searchable data={['Bold', 'Italic', 'Underline', 'Strikethrough', 'Code']} value={marks} onChange={v => $write(marks, v)}>
        <Picker.Trigger>
          <Button variant="soft">Text marks</Button>
        </Picker.Trigger>
      </Picker>
      <Text size="sm" fg="quiet">{() => \`marks: \${$read(marks).join(', ') || 'none'}\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const marks = $signal($active(), /** @type {string[]} */ (['Bold']));
        return (
          <Row gap="md" align="start">
            <Picker multiple searchable data={['Bold', 'Italic', 'Underline', 'Strikethrough', 'Code']} value={marks} onChange={(/** @type {string[]} */ v) => $write(marks, v)}>
              <Picker.Trigger>
                <Button variant="soft">Text marks</Button>
              </Picker.Trigger>
            </Picker>
            <Text size="sm" fg="quiet">
              {() => `marks: ${$read(marks).join(', ') || 'none'}`}
            </Text>
          </Row>
        );
      },
      height: 260,
    },
  ],
};
