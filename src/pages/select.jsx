// Select: one value from data, searchable and clearable, grouped data with
// disabled options, and a value held by a signal.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Select, Row, Stack, Text, SettingsIcon } from 'rui-core';

const CITIES = ['Lisbon', 'Oslo', 'Kyoto', 'Quito'];
const COUNTRIES = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'Germany', 'India', 'Japan', 'Kenya', 'Mexico', 'Norway', 'Portugal', 'South Africa', 'United Kingdom'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'select',
  group: 'choices',
  title: 'Select',
  description: 'One value from a list of options in a panel: data as strings, `{ value, label, disabled }` or groups `{ label, options }`, chosen by a press or the keyboard (the arrows, Enter; Escape closes). `searchable` turns the field into a search.',
  props: [
    { name: 'data', type: 'string[] | { value, label, disabled, action, icon }[] | { label, options }[]', description: 'The options, or groups of them. An option with `action: true` does something rather than stand for a value (a list’s “Manage…”): drawn apart, under a rule, as a soft button with its `icon`, and chosen as any option.' },
    { name: 'value', type: 'string | null | (() => string | null)', description: 'Controlled: the chosen value (with `onChange`).' },
    { name: 'defaultValue', type: 'string | null', default: 'null', description: 'Uncontrolled: the value at first.' },
    { name: 'onChange', type: '(value: string | null) => void', description: 'Called with the new value.' },
    { name: 'onPick', type: '(value: string, option) => void', description: 'Called as an option is chosen, with its data item.' },
    { name: 'placeholder', type: 'string', description: 'Shown while nothing is chosen.' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'Typing filters the options.' },
    { name: 'search / defaultSearch', type: 'string', description: 'The search text, controlled (with `onSearchChange`) or at first.' },
    { name: 'match', type: '(option: Option, search: string) => boolean', description: 'Whether an option matches the search: by default its label holds the search, ignoring case. `option` is `{ value, label, disabled, group }`.' },
    { name: 'limit', type: 'number', description: 'At most this many options shown, after matching.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button replaces the chevron while a value is chosen.' },
    { name: 'deselectable', type: 'boolean', default: 'true', description: 'Choosing the value again clears it.' },
    { name: 'empty', type: 'string | any', description: 'Shown when the search matches nothing; unset, the panel hides instead.' },
    { name: 'panelHeight', type: 'number', default: '280', description: 'The options scroll past this height.' },
    { name: 'check', type: 'boolean', default: 'true', description: 'A check beside the chosen option.' },
    { name: 'checkAt', type: "'start' | 'end'", default: "'end'", description: 'The check’s side: after the label, or before it.' },
    { name: 'renderOption', type: '(option, { picked }) => any', description: 'An option’s content; `picked` is whether it is the chosen one.' },
    { name: 'label / description / error', type: 'string', description: 'The field’s texts; an error message gives the invalid look.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'The invalid look without a message (`aria-invalid`).' },
    { name: 'required', type: 'boolean', default: 'false', description: 'A value is needed: `aria-required` only.' },
    { name: 'asterisk', type: 'boolean | string | node', description: 'The mark after the label: `true` a red `*`; none by default.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The field’s height and text size.' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: 'theme.corner', description: 'Corner radius.' },
    { name: 'variant', type: "'outline' | 'soft' | 'bare'", default: "'outline'", description: 'The field’s look.' },
    { name: 'start / end', type: 'any', description: 'Content at the field’s sides (the chevron by default at the end).' },
    { name: 'disabled / readOnly', type: 'boolean', default: 'false', description: 'Locked: no panel, and neither a press nor the keys open it or choose; disabled is also dimmed and marked `aria-disabled`, and stays focusable, so a screen reader still reaches it.' },
    { name: 'popover', type: 'Combobox props', description: 'The panel’s placement and look (`at`, `shadow`, `portal`, …).' },
    { name: 'open / defaultOpen', type: 'boolean', description: 'The panel’s state, controlled or at first.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called as the panel opens and closes.' },
    { name: 'lightbox', type: 'boolean | breakpoint key', default: 'theme.control.lightbox (null: never)', description: 'The options open in a centered lightbox titled by the label, always or below a breakpoint (`sm`, followed as the viewport changes): the field is pressed rather than typed in, and a filter tops the list past `control.typeahead` (10) options, or when `searchable`.' },
  ],
  demos: [
    {
      title: 'Choosing a departure city',
      code: `
function Demo() {
  return (
    <Select w={300} label="Departure city" placeholder="Where from?" data={['Lisbon', 'Oslo', 'Kyoto', 'Quito']} />
  );
}`,
      view: () => <Select w={300} label="Departure city" placeholder="Where from?" data={CITIES} />,
      height: 260,
    },
    {
      title: 'Searchable and clearable, with no matches',
      code: `
function Demo() {
  return (
    <Select
      w={300}
      label="Arrival city"
      placeholder="Start typing a city"
      data={['Lisbon', 'Oslo', 'Kyoto', 'Quito']}
      defaultValue="Kyoto"
      searchable
      clearable
      empty="No matches"
    />
  );
}`,
      view: () => <Select w={300} label="Arrival city" placeholder="Start typing a city" data={CITIES} defaultValue="Kyoto" searchable clearable empty="No matches" />,
      height: 260,
    },
    {
      title: 'Groups, disabled options and the check at the start',
      code: `
function Demo() {
  return (
    <Select
      w={300}
      label="Drink with breakfast"
      placeholder="Choose a drink"
      checkAt="start"
      panelHeight={200}
      data={[
        { label: 'Hot', options: ['Espresso', 'Chai', { value: 'cocoa', label: 'Cocoa', disabled: true }] },
        { label: 'Cold', options: ['Lemonade', 'Iced tea', 'Kombucha'] },
      ]}
    />
  );
}`,
      view: () => (
        <Select
          w={300}
          label="Drink with breakfast"
          placeholder="Choose a drink"
          checkAt="start"
          panelHeight={200}
          data={[
            { label: 'Hot', options: ['Espresso', 'Chai', { value: 'cocoa', label: 'Cocoa', disabled: true }] },
            { label: 'Cold', options: ['Lemonade', 'Iced tea', 'Kombucha'] },
          ]}
        />
      ),
      height: 300,
    },
    {
      title: 'Held by a signal, sizes and states',
      code: `
function Demo() {
  const value = $signal($active(), 'Lisbon');
  return (
    <Stack gap="sm">
      <Row gap="sm" align="end">
        <Select w={200} label="Home base" data={['Lisbon', 'Oslo', 'Kyoto', 'Quito']} value={value} onChange={v => $write(value, v)} deselectable={false} />
        <Text size="sm" fg="quiet">{() => \`value: \${$read(value)}\`}</Text>
      </Row>
      <Row gap="sm" align="end">
        <Select w={150} size="xs" label="Seat" data={['Aisle', 'Window']} defaultValue="Aisle" />
        <Select w={150} variant="soft" label="Class" placeholder="Any class" data={['Economy', 'Business']} />
        <Select w={150} label="Meal" placeholder="Not on this route" data={['Vegetarian', 'Regular']} disabled />
        <Select w={150} label="Luggage" placeholder="Bags" data={['Cabin', 'Checked']} required asterisk error="Choose a luggage option" />
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), /** @type {string | null} */ ('Lisbon'));
        return (
          <Stack gap="sm">
            <Row gap="sm" align="end">
              <Select w={200} label="Home base" data={CITIES} value={value} onChange={(/** @type {string | null} */ v) => $write(value, v)} deselectable={false} />
              <Text size="sm" fg="quiet">
                {() => `value: ${$read(value)}`}
              </Text>
            </Row>
            <Row gap="sm" align="end">
              <Select w={150} size="xs" label="Seat" data={['Aisle', 'Window']} defaultValue="Aisle" />
              <Select w={150} variant="soft" label="Class" placeholder="Any class" data={['Economy', 'Business']} />
              <Select w={150} label="Meal" placeholder="Not on this route" data={['Vegetarian', 'Regular']} disabled />
              <Select w={150} label="Luggage" placeholder="Bags" data={['Cabin', 'Checked']} required asterisk error="Choose a luggage option" />
            </Row>
          </Stack>
        );
      },
      height: 180,
      // the Meal field cuts its placeholder with an ellipsis
      clipped: true,
    },
    {
      title: 'In a lightbox, as on a phone',
      code: `
const COUNTRIES = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'Germany', 'India', 'Japan', 'Kenya', 'Mexico', 'Norway', 'Portugal', 'South Africa', 'United Kingdom'];

function Demo() {
  return (
    <Row align="start">
      <Select w={240} label="Country" placeholder="Choose a country" data={COUNTRIES} lightbox />
      <Select w={120} label="Narrow" data={COUNTRIES} defaultValue="United Kingdom" lightbox />
    </Row>
  );
}`,
      view: () => (
        <Row align="start">
          <Select w={240} label="Country" placeholder="Choose a country" data={COUNTRIES} lightbox />
          <Select w={120} label="Narrow" data={COUNTRIES} defaultValue="United Kingdom" lightbox />
        </Row>
      ),
      height: 440,
      clipped: true,
    },
    {
      title: 'An action under the options',
      code: `
function Demo() {
  const list = $signal($active(), 'Groceries');
  const managed = $signal($active(), 0);
  const data = ['Groceries', 'Hardware', 'Pharmacy', { value: 'manage', label: 'Manage lists…', action: true, icon: SettingsIcon }];
  return (
    <Stack gap="sm">
      <Select w={260} label="Shopping list" data={data} value={list} deselectable={false}
        onChange={v => (v === 'manage' ? $write(managed, $read(managed) + 1) : $write(list, v))} />
      <Text size="sm" fg="quiet">{() => \`list: \${$read(list)}, managed \${$read(managed)} times\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const list = $signal($active(), /** @type {string | null} */ ('Groceries'));
        const managed = $signal($active(), 0);
        const data = ['Groceries', 'Hardware', 'Pharmacy', { value: 'manage', label: 'Manage lists…', action: true, icon: SettingsIcon }];
        return (
          <Stack gap="sm">
            <Select
              w={260}
              label="Shopping list"
              data={data}
              value={list}
              deselectable={false}
              onChange={(/** @type {string | null} */ v) => (v === 'manage' ? $write(managed, $read(managed) + 1) : $write(list, v))}
            />
            <Text size="sm" fg="quiet">
              {() => `list: ${$read(list)}, managed ${$read(managed)} times`}
            </Text>
          </Stack>
        );
      },
      height: 260,
    },
  ],
};
