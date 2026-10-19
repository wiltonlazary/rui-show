// MultiSelect: many values as tags, searchable and clearable, a maximum
// and hidden picked options, held by a signal.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { MultiSelect, Stack, Text } from 'rui-core';

const INSTRUMENTS = ['Drums', 'Bass', 'Keys', 'Guitar'];
const TOPPINGS = ['Mushrooms', 'Olives', 'Peppers', 'Onions', 'Basil', 'Pineapple', 'Anchovies'];
const SPICES = ['Allspice', 'Cardamom', 'Cinnamon', 'Clove', 'Cumin', 'Fennel', 'Ginger', 'Mace', 'Nutmeg', 'Paprika', 'Saffron', 'Star anise', 'Sumac', 'Turmeric'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'multi-select',
  group: 'choices',
  title: 'MultiSelect',
  description: 'Many values from a list, shown as tags in the field, each with its remove button. The panel stays open as values are picked; typing filters the options; Backspace in the empty search removes the last value.',
  props: [
    { name: 'data', type: 'string[] | { value, label, disabled }[] | { label, options }[]', description: 'The options, or groups of them under a label.' },
    { name: 'value', type: 'string[] | (() => string[])', description: 'The chosen values, held by you (with `onChange`).' },
    { name: 'defaultValue', type: 'string[]', default: '[]', description: 'The values at first, when it holds its own.' },
    { name: 'onChange', type: '(values: string[]) => void', description: 'Called with the new values.' },
    { name: 'onPick', type: '(value: string, option) => void', description: 'Called as an option is chosen or unchosen, with its data item.' },
    { name: 'placeholder', type: 'string', description: 'Shown while nothing is chosen.' },
    { name: 'searchable', type: 'boolean', default: 'true', description: 'The search field is always there; false stops it filtering.' },
    { name: 'search / defaultSearch', type: 'string', description: 'The search text: held by you (with `onSearchChange`), or its first value.' },
    { name: 'match', type: '(option, search) => boolean', default: 'the label holds the search', description: 'Whether an option shows for the search.' },
    { name: 'max', type: 'number', description: 'The most values that can be chosen.' },
    { name: 'picked', type: 'boolean', default: 'true', description: '`false`: chosen options leave the list.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button while values are chosen.' },
    { name: 'empty', type: 'string | any', description: 'Shown when the search matches nothing; none by default.' },
    { name: 'panelHeight', type: 'number', default: '280', description: 'The options scroll past this height.' },
    { name: 'check / checkAt / renderOption', type: "boolean / 'start' | 'end' / (option, { picked }) => any", default: "true / 'end' / —", description: 'The options’ look: a check mark, where it sits, or your own content.' },
    { name: 'label / description / error', type: 'string', description: 'The field’s texts; an error message gives the invalid look.' },
    { name: 'invalid / required / asterisk', type: 'boolean / boolean / boolean | string | node', description: 'The invalid look without a message; `aria-required` only; the mark after the label (none by default).' },
    { name: 'size / radius / variant / start / end', type: 'as Select', description: 'The field’s look.' },
    { name: 'disabled / readOnly', type: 'boolean', default: 'false', description: 'Locked: no panel, no remove buttons, and neither a press nor the keys open it or pick.' },
    { name: 'lightbox', type: 'boolean | breakpoint key', default: 'theme.control.lightbox (null: never)', description: 'As Select’s: the options open in a centered lightbox titled by the label, picked and unpicked until its Done, a filter at its top past `control.typeahead` (10) options.' },
  ],
  demos: [
    {
      title: 'Choosing the band’s instruments',
      code: `
function Demo() {
  return <MultiSelect w={340} label="Instruments in the band" placeholder="Add instruments" data={['Drums', 'Bass', 'Keys', 'Guitar']} defaultValue={['Drums']} />;
}`,
      view: () => <MultiSelect w={340} label="Instruments in the band" placeholder="Add instruments" data={INSTRUMENTS} defaultValue={['Drums']} />,
      height: 250,
    },
    {
      title: 'Three toppings at most, picked ones hidden, clearable',
      code: `
const TOPPINGS = ['Mushrooms', 'Olives', 'Peppers', 'Onions', 'Basil', 'Pineapple', 'Anchovies'];

function Demo() {
  const values = $signal($active(), ['Basil']);
  return (
    <Stack gap="xs">
      <MultiSelect
        w={340}
        label="Pizza toppings"
        description={() => \`\${$read(values).length} of 3\`}
        placeholder="Pick your toppings"
        data={TOPPINGS}
        max={3}
        picked={false}
        clearable
        empty="No matches"
        value={values}
        onChange={v => $write(values, v)}
      />
      <Text size="sm" fg="quiet">{() => \`values: \${$read(values).join(', ') || 'none'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const values = $signal($active(), /** @type {string[]} */ (['Basil']));
        return (
          <Stack gap="xs">
            <MultiSelect
              w={340}
              label="Pizza toppings"
              description={() => `${$read(values).length} of 3`}
              placeholder="Pick your toppings"
              data={TOPPINGS}
              max={3}
              picked={false}
              clearable
              empty="No matches"
              value={values}
              onChange={(/** @type {string[]} */ v) => $write(values, v)}
            />
            <Text size="sm" fg="quiet">
              {() => `values: ${$read(values).join(', ') || 'none'}`}
            </Text>
          </Stack>
        );
      },
      height: 270,
    },
    {
      title: 'Sizes, read only and disabled',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <MultiSelect w={340} size="md" label="Medium" data={['Drums', 'Keys']} defaultValue={['Drums', 'Keys']} />
      <MultiSelect w={340} label="Read only" data={['Drums', 'Keys']} defaultValue={['Keys']} readOnly />
      <MultiSelect w={340} label="Disabled" data={['Drums', 'Keys']} defaultValue={['Drums']} disabled />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <MultiSelect w={340} size="md" label="Medium" data={['Drums', 'Keys']} defaultValue={['Drums', 'Keys']} />
          <MultiSelect w={340} label="Read only" data={['Drums', 'Keys']} defaultValue={['Keys']} readOnly />
          <MultiSelect w={340} label="Disabled" data={['Drums', 'Keys']} defaultValue={['Drums']} disabled />
        </Stack>
      ),
      height: 240,
    },
    {
      title: 'In a lightbox, picked until Done',
      code: `
const SPICES = ['Allspice', 'Cardamom', 'Cinnamon', 'Clove', 'Cumin', 'Fennel', 'Ginger', 'Mace', 'Nutmeg', 'Paprika', 'Saffron', 'Star anise', 'Sumac', 'Turmeric'];

function Demo() {
  return <MultiSelect w={340} label="Spices in the blend" placeholder="Add spices" data={SPICES} defaultValue={['Cumin', 'Ginger']} lightbox />;
}`,
      view: () => <MultiSelect w={340} label="Spices in the blend" placeholder="Add spices" data={SPICES} defaultValue={['Cumin', 'Ginger']} lightbox />,
      height: 480,
    },
  ],
};
