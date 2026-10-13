// PlainSelect: a native select's role and look, the same on every
// renderer.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { PlainSelect, Row, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'plain-select',
  group: 'choices',
  title: 'PlainSelect',
  description: 'A native select’s role: the first option chosen at first, no search, no clearing, no deselecting. A canvas has no native select, so this is a Select in that role on every renderer, its panel drawn the same everywhere (the DOM’s own picker is not used).',
  props: [
    { name: 'data', type: 'string[] | { value, label, disabled }[] | { label, options }[]', description: 'The options.' },
    { name: 'value', type: 'string | (() => string)', description: 'Controlled: the chosen value (with `onChange`).' },
    { name: 'defaultValue', type: 'string', default: 'the first enabled option', description: 'Uncontrolled: the value at first.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the new value.' },
    { name: 'label / description / error', type: 'string', description: 'The field’s texts; an error message gives the invalid look.' },
    { name: 'invalid / required / asterisk', type: 'boolean / boolean / boolean | string | node', description: 'The invalid look without a message; `aria-required` only; the mark after the label (none by default).' },
    { name: 'size / radius / variant', type: 'as Select', description: 'The field’s look.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'No panel.' },
  ],
  demos: [
    {
      title: 'Choosing a delivery',
      code: `
function Demo() {
  const value = $signal($active(), 'Overnight');
  return (
    <Row gap="md" align="end">
      <PlainSelect w={260} label="Delivery" description="Controlled: it starts at Overnight" data={['Standard', 'Express', 'Overnight', 'Pickup']} value={value} onChange={v => $write(value, v)} />
      <Text size="sm" fg="quiet">{() => \`value: \${$read(value)}\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const value = $signal($active(), 'Overnight');
        return (
          <Row gap="md" align="end">
            <PlainSelect
              w={260}
              label="Delivery"
              description="Controlled: it starts at Overnight"
              data={['Standard', 'Express', 'Overnight', 'Pickup']}
              value={value}
              onChange={(/** @type {string} */ v) => $write(value, v)}
            />
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(value)}`}
            </Text>
          </Row>
        );
      },
      height: 270,
    },
    {
      title: 'Labels apart from values, groups, disabled',
      code: `
function Demo() {
  return (
    <Row gap="md" align="end">
      <PlainSelect
        w={220}
        label="Country"
        data={[
          { label: 'Europe', options: [{ value: 'pt', label: 'Portugal' }, { value: 'fr', label: 'France' }] },
          { label: 'Americas', options: [{ value: 'br', label: 'Brazil' }, { value: 'ca', label: 'Canada', disabled: true }] },
        ]}
      />
      <PlainSelect w={180} label="Disabled" data={['One', 'Two']} disabled />
    </Row>
  );
}`,
      view: () => (
        <Row gap="md" align="end">
          <PlainSelect
            w={220}
            label="Country"
            data={[
              {
                label: 'Europe',
                options: [
                  { value: 'pt', label: 'Portugal' },
                  { value: 'fr', label: 'France' },
                ],
              },
              {
                label: 'Americas',
                options: [
                  { value: 'br', label: 'Brazil' },
                  { value: 'ca', label: 'Canada', disabled: true },
                ],
              },
            ]}
          />
          <PlainSelect w={180} label="Disabled" data={['One', 'Two']} disabled />
        </Row>
      ),
      height: 300,
    },
  ],
};
