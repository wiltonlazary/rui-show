// Autocomplete: free text with suggestions, groups and a cap, and held
// by a signal.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Autocomplete, Row, Stack, Text } from 'rui-core';

const CITIES = ['Lisbon', 'Nairobi', 'Oslo', 'Kyoto'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'autocomplete',
  group: 'choices',
  title: 'Autocomplete',
  description: 'A text input with suggestions: any text is a value, and the panel offers the suggestions that match what is typed (while any do). Choosing one puts it in the field.',
  props: [
    { name: 'data', type: 'string[] | { value, label }[] | { label, options }[]', description: 'The suggestions.' },
    { name: 'value', type: 'string | (() => string)', description: 'Controlled: the text (with `onChange`).' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'Uncontrolled: the text at first.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the new text.' },
    { name: 'onPick', type: '(value: string, option) => void', description: 'Called when a suggestion is chosen, with its data item.' },
    { name: 'placeholder', type: 'string', description: 'Shown while empty.' },
    { name: 'match', type: '(option: Option, search: string) => boolean', description: 'Whether a suggestion matches the text; by default its label holds it, ignoring case.' },
    { name: 'limit', type: 'number', description: 'At most this many suggestions shown, counted after matching.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button while there is text.' },
    { name: 'panelHeight', type: 'number', default: '280', description: 'The suggestions scroll past this height.' },
    { name: 'renderOption', type: '(option, { picked }) => any', description: 'A suggestion’s content.' },
    { name: 'label / description / error', type: 'string', description: 'The field’s texts; an error message gives the invalid look.' },
    { name: 'invalid / required / asterisk', type: 'boolean / boolean / boolean | string | node', description: 'The invalid look without a message; `aria-required` only; the mark after the label (none by default).' },
    { name: 'disabled / readOnly', type: 'boolean', default: 'false', description: 'Locked: no typing, and neither a press nor the keys open it or choose, no Clear; disabled is also dimmed and takes no focus.' },
    { name: 'size / radius / variant / start / end', type: 'as Select', description: 'The field’s look.' },
    { name: 'popover / open / defaultOpen / onOpenChange', type: 'as Select', description: 'The panel’s placement and state.' },
  ],
  demos: [
    {
      title: 'A destination with suggestions',
      code: `
function Demo() {
  return <Autocomplete w={300} label="Destination" placeholder="Start typing a city" data={['Lisbon', 'Nairobi', 'Oslo', 'Kyoto']} />;
}`,
      view: () => <Autocomplete w={300} label="Destination" placeholder="Start typing a city" data={CITIES} />,
      height: 240,
    },
    {
      title: 'Groups, a cap, held by a signal and clearable',
      code: `
function Demo() {
  const text = $signal($active(), '');
  return (
    <Stack gap="xs">
      <Autocomplete
        w={300}
        label="An instrument"
        placeholder="Try “o”"
        limit={4}
        clearable
        value={text}
        onChange={v => $write(text, v)}
        data={[
          { label: 'Strings', options: ['Banjo', 'Cello', 'Mandolin', 'Viola'] },
          { label: 'Winds', options: ['Bassoon', 'Horn', 'Oboe'] },
        ]}
      />
      <Text size="sm" fg="quiet">{() => \`text: \${$read(text) || '(empty)'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const text = $signal($active(), '');
        return (
          <Stack gap="xs">
            <Autocomplete
              w={300}
              label="An instrument"
              placeholder="Try “o”"
              limit={4}
              clearable
              value={text}
              onChange={(/** @type {string} */ v) => $write(text, v)}
              data={[
                { label: 'Strings', options: ['Banjo', 'Cello', 'Mandolin', 'Viola'] },
                { label: 'Winds', options: ['Bassoon', 'Horn', 'Oboe'] },
              ]}
            />
            <Text size="sm" fg="quiet">
              {() => `text: ${$read(text) || '(empty)'}`}
            </Text>
          </Stack>
        );
      },
      height: 300,
    },
    {
      title: 'Sizes and states',
      code: `
function Demo() {
  return (
    <Row gap="sm" align="end">
      <Autocomplete w={150} size="xs" label="Extra small" placeholder="xs" data={['One', 'Two']} />
      <Autocomplete w={150} size="md" label="Medium" placeholder="md" data={['One', 'Two']} />
      <Autocomplete w={150} variant="soft" label="Soft" placeholder="soft" data={['One', 'Two']} />
      <Autocomplete w={150} label="Disabled" placeholder="disabled" data={['One', 'Two']} disabled />
    </Row>
  );
}`,
      view: () => (
        <Row gap="sm" align="end">
          <Autocomplete w={150} size="xs" label="Extra small" placeholder="xs" data={['One', 'Two']} />
          <Autocomplete w={150} size="md" label="Medium" placeholder="md" data={['One', 'Two']} />
          <Autocomplete w={150} variant="soft" label="Soft" placeholder="soft" data={['One', 'Two']} />
          <Autocomplete w={150} label="Disabled" placeholder="disabled" data={['One', 'Two']} disabled />
        </Row>
      ),
      height: 100,
    },
  ],
};
