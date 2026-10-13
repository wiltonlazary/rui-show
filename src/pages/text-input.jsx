// TextInput: Input inside a Field.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { TextInput, Stack, Row, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'text-input',
  group: 'entry',
  title: 'TextInput',
  description: 'A single-line text field with a label, description and error: an Input inside a Field. It edits through the portable Edit on every renderer.',
  props: [
    { name: 'value', type: 'string', description: 'The text shown (controlled); edits then only call `onChange`.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'The starting text when uncontrolled.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the new text on every edit.' },
    { name: 'label', type: 'string', description: 'The label above the field, at weight 600.' },
    { name: 'description', type: 'string', description: 'Quiet text between the label and the field, a type step below the field’s text.' },
    { name: 'error', type: 'string', description: 'A message under the field, with the invalid look (a red border, `aria-invalid`).' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'The invalid look without a message.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'A value is needed: `aria-required` only; `asterisk` shows the mark.' },
    { name: 'asterisk', type: 'boolean | string | node', description: 'The mark after the label, in the error color: `true` a `*`, a string or node that mark; none by default.' },
    { name: 'placeholder', type: 'string', description: 'Shown while the field is empty.' },
    { name: 'variant', type: "'outline' | 'soft' | 'bare'", default: "'outline'", description: 'The field’s frame.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The field’s height and the font sizes of every part.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'The field’s corner radius.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Dimmed (opacity .45) and not editable.' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Not editable.' },
    { name: 'start', type: 'any', description: 'Content before the text.' },
    { name: 'end', type: 'any', description: 'Content after the text.' },
    { name: 'startWidth', type: 'number', default: 'the field height', description: 'Width of the start content.' },
    { name: 'endWidth', type: 'number', default: 'the field height', description: 'Width of the end content.' },
    { name: 'onFocus, onBlur, onKey, onSubmit', type: '(event) => void', description: 'The Edit’s focus, blur, key and Enter.' },
    { name: 'm, mx, my, mt, mb, ml, mr, w, maxWidth, minWidth, flex', type: 'style props', description: 'Placed on the Field.' },
    { name: 'fieldStyle', type: 'object | () => object', description: 'Extra style on the field row.' },
    { name: 'outerStyle', type: 'object | () => object', description: 'Extra style on the Field around it.' },
    { name: 'ref', type: 'any', description: 'The Edit’s ref (`outerRef` for the Field’s).' },
  ],
  demos: [
    {
      title: 'Held by a signal',
      code: `
function Demo() {
  const name = $signal($active(), '');
  return (
    <Stack gap="sm">
      <TextInput label="Boat name" description="Painted on the stern" placeholder="e.g. Blue Heron" required asterisk
        value={name} onChange={v => $write(name, v)} />
      <Text size="sm" fg="quiet">{() => \`value: "\${$read(name)}"\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const name = $signal($active(), '');
        return (
          <Stack gap="sm">
            <TextInput label="Boat name" description="Painted on the stern" placeholder="e.g. Blue Heron" required asterisk value={name} onChange={(/** @type {string} */ v) => $write(name, v)} />
            <Text size="sm" fg="quiet">
              {() => `value: "${$read(name)}"`}
            </Text>
          </Stack>
        );
      },
      height: 140,
    },
    {
      title: 'Error, disabled and variants',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row fill align="start">
        <TextInput label="Email" defaultValue="kai@" error="Add the domain after @" />
        <TextInput label="Disabled" disabled value="Locked by the owner" />
      </Row>
      <Row fill align="start">
        <TextInput label="Soft" variant="soft" placeholder="Soft" />
        <TextInput label="Round, large" size="lg" radius="xl" placeholder="Large" />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row fill align="start">
            <TextInput label="Email" defaultValue="kai@" error="Add the domain after @" />
            <TextInput label="Disabled" disabled value="Locked by the owner" />
          </Row>
          <Row fill align="start">
            <TextInput label="Soft" variant="soft" placeholder="Soft" />
            <TextInput label="Round, large" size="lg" radius="xl" placeholder="Large" />
          </Row>
        </Stack>
      ),
      height: 190,
    },
    {
      title: 'Start and end',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <TextInput label="Website" start={<Text size="xs" fg="quiet">https://</Text>} startWidth={64} placeholder="example.com" />
      <TextInput label="Weight" end={<Text size="xs" fg="quiet">kg</Text>} placeholder="70" />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <TextInput
            label="Website"
            start={
              <Text size="xs" fg="quiet">
                https://
              </Text>
            }
            startWidth={64}
            placeholder="example.com"
          />
          <TextInput
            label="Weight"
            end={
              <Text size="xs" fg="quiet">
                kg
              </Text>
            }
            placeholder="70"
          />
        </Stack>
      ),
      height: 150,
    },
  ],
};
