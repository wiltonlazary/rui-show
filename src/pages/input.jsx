// Input: the bare field, and Field with its Label, Description and Error.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Field, Input, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'input',
  group: 'entry',
  title: 'Input',
  description: 'The bare field every text input is built on: a row of a start slot, the portable Edit and an end slot, bordered by focus and by the invalid look. Field (with Field.Label, Field.Description and Field.Error) stacks a label, a description and an error around any field.',
  props: [
    { name: 'value', type: 'string', description: 'The text shown (controlled); an accessor updates it in place. Edits then only call `onChange`.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'The starting text when uncontrolled.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the new text on every edit.' },
    { name: 'placeholder', type: 'string', description: 'Shown while the field is empty (in the renderer’s muted color).' },
    { name: 'variant', type: "'outline' | 'soft' | 'bare'", default: "'outline'", description: 'Bordered on the field color, on the sunken ground without a border, or no frame at all.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Height (24 to 52) and font size.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius: a scale step or pixels.' },
    { name: 'error', type: 'string', description: 'A message: a non-empty one turns the border and text red (the invalid look, `aria-invalid`); the message itself is shown by the Field.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'The invalid look without a message.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'A value is needed: `aria-required` only; the mark is the Field’s `asterisk`.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Faded to the disabled opacity (.45) and not editable.' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Not editable.' },
    { name: 'start', type: 'any', description: 'Content before the text, centered in a square of the field’s height.' },
    { name: 'end', type: 'any', description: 'Content after the text.' },
    { name: 'startWidth', type: 'number', default: 'the field height', description: 'Width of the start slot.' },
    { name: 'endWidth', type: 'number', default: 'the field height', description: 'Width of the end slot.' },
    { name: 'onFocus', type: '(event) => void', description: 'The Edit took focus.' },
    { name: 'onBlur', type: '(event) => void', description: 'The Edit lost focus.' },
    { name: 'onKey', type: '(event) => void', description: 'A key on the Edit.' },
    { name: 'onSubmit', type: '(event) => void', description: 'Enter in the Edit.' },
    { name: 'ref', type: 'any', description: 'The Edit’s ref.' },
    { name: 'Field label', type: 'string', description: 'The label above the field, in the strong weight (600); the parts sit 6 px apart. It names the control inside: every text input (Input, TextInput, Textarea, PasswordInput, MaskInput, JsonArea, ColorInput), NumberInput, PinInput, the selects and combobox fields (Select, PlainSelect, Autocomplete, MultiSelect, TagInput, TreeSelect, Cascader), FileInput, the date and time fields (DateInput, DateSelect, DateTimeSelect, MonthSelect, YearSelect, TimeInput, TimePicker), the sliders (Slider, RangeSlider, AngleSlider, HueSlider, AlphaSlider, Rating), ColorPicker, SegmentedControl, Switch, Checkbox, Checkbox.Group and Radio.Group; an inner Field or the control’s own `aria-label` or `aria-labelledby` wins.' },
    { name: 'Field description', type: 'string', description: 'Quiet text between the label and the field, one type step below it.' },
    { name: 'Field error', type: 'string', description: 'A message under the field, one type step below it (`null`, `false`, `true` and `\'\'` show none; pass the same `error` to the Input for the red border).' },
    { name: 'Field asterisk', type: 'boolean | string | node', description: 'The mark after the label, in the error color: `true` a `*`, a string or node that mark; none by default. `required` does not show it.' },
    { name: 'Field size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The font size of the label, description and error (passed to the parts inside).' },
    { name: 'Field.Label size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Its font size; a Field passes its own.' },
    { name: 'Field.Label asterisk', type: 'boolean | string | node', description: 'Field.Label alone: the mark after its text, as Field’s. Its children are the text.' },
  ],
  demos: [
    {
      title: 'Variants',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Input placeholder="Outline: search the catalog" />
      <Input variant="soft" placeholder="Soft: filter by author" />
      <Input variant="bare" placeholder="Bare: add a note" />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Input placeholder="Outline: search the catalog" />
          <Input variant="soft" placeholder="Soft: filter by author" />
          <Input variant="bare" placeholder="Bare: add a note" />
        </Stack>
      ),
      height: 150,
    },
    {
      title: 'Sizes and radius',
      code: `
function Demo() {
  return (
    <Stack gap="xs">
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <Input size={size} radius={size} placeholder={\`Size \${size}\`} />)}
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
            <Input size={size} radius={size} placeholder={`Size ${size}`} />
          ))}
        </Stack>
      ),
      height: 270,
    },
    {
      title: 'Slots, invalid and disabled',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Input start={<Text size="sm" fg="quiet">@</Text>} placeholder="handle" />
      <Input end={<Text size="xs" fg="quiet">USD</Text>} endWidth={48} placeholder="Ticket price" />
      <Input aria-label="Handle" invalid defaultValue="two words" />
      <Row fill>
        <Input aria-label="Disabled" disabled value="Disabled" />
        <Input aria-label="Read only" readOnly value="Read only" />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Input
            start={
              <Text size="sm" fg="quiet">
                @
              </Text>
            }
            placeholder="handle"
          />
          <Input
            end={
              <Text size="xs" fg="quiet">
                USD
              </Text>
            }
            endWidth={48}
            placeholder="Ticket price"
          />
          <Input aria-label="Handle" invalid defaultValue="two words" />
          <Row fill>
            <Input aria-label="Disabled" disabled value="Disabled" />
            <Input aria-label="Read only" readOnly value="Read only" />
          </Row>
        </Stack>
      ),
      height: 200,
    },
    {
      title: 'Field, held by a signal',
      code: `
function Demo() {
  const value = $signal($active(), '');
  const error = () => ($read(value).length > 8 ? 'At most 8 characters' : undefined);
  return (
    <Stack gap="sm">
      <Field label="Call sign" description="Letters and digits, up to 8" asterisk error={error}>
        <Input required placeholder="orbit7" value={value} onChange={v => $write(value, v)} error={error} />
      </Field>
      <Text size="sm" fg="quiet">{() => \`value: "\${$read(value)}"\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), '');
        const error = () => ($read(value).length > 8 ? 'At most 8 characters' : undefined);
        return (
          <Stack gap="sm">
            <Field label="Call sign" description="Letters and digits, up to 8" asterisk error={error}>
              <Input required placeholder="orbit7" value={value} onChange={(/** @type {string} */ v) => $write(value, v)} error={error} />
            </Field>
            <Text size="sm" fg="quiet">
              {() => `value: "${$read(value)}"`}
            </Text>
          </Stack>
        );
      },
      height: 150,
    },
    {
      title: 'The Field’s parts alone',
      code: `
function Demo() {
  const query = $signal($active(), '');
  const checked = $signal($active(), false);
  const problem = () => ($read(query).trim() === '' ? 'Type a query first' : $read(query).includes(':') ? null : 'Use a field:value pair, such as status:shipped');
  return (
    <Stack gap={4} align="start">
      <Field.Label>Search orders</Field.Label>
      <Input w={320} aria-label="Search orders" placeholder="status:shipped" value={query} onChange={v => $write(query, v)} invalid={() => $read(checked) && problem() !== null} />
      <Field.Description>For example: status:shipped since:2026-09-01</Field.Description>
      {() => ($read(checked) && problem() !== null ? <Field.Error>{problem()}</Field.Error> : null)}
      <Button size="xs" variant="neutral" onPress={() => $write(checked, true)}>Check</Button>
    </Stack>
  );
}`,
      view: () => {
        const query = $signal($active(), '');
        const checked = $signal($active(), false);
        const problem = () => ($read(query).trim() === '' ? 'Type a query first' : $read(query).includes(':') ? null : 'Use a field:value pair, such as status:shipped');
        return (
          <Stack gap={4} align="start">
            <Field.Label>Search orders</Field.Label>
            <Input w={320} aria-label="Search orders" placeholder="status:shipped" value={query} onChange={(/** @type {string} */ v) => $write(query, v)} invalid={() => $read(checked) && problem() !== null} />
            <Field.Description>For example: status:shipped since:2026-09-01</Field.Description>
            {() => ($read(checked) && problem() !== null ? <Field.Error>{problem()}</Field.Error> : null)}
            <Button size="xs" variant="neutral" onPress={() => $write(checked, true)}>
              Check
            </Button>
          </Stack>
        );
      },
      height: 160,
    },
  ],
};
