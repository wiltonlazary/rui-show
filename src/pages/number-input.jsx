// NumberInput: parsing, bounds, steps and formats.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { NumberInput, Stack, Row, Button, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'number-input',
  group: 'entry',
  title: 'NumberInput',
  description: 'A number field: it accepts only what can become a number, steps with its chevrons and ArrowUp/ArrowDown, keeps the value within `min` and `max`, and formats it with a prefix, suffix, the locale’s group and decimal marks and decimal digits. The value is a number, or `\'\'` when empty.',
  props: [
    { name: 'value', type: "number | ''", description: 'The number (controlled); edits then only call `onChange`.' },
    { name: 'defaultValue', type: "number | ''", default: "''", description: 'The starting number when uncontrolled.' },
    { name: 'onChange', type: "(value: number | '') => void", description: 'Called with the new number (or `\'\'` when cleared).' },
    { name: 'min', type: 'number', default: '-Infinity', description: 'The smallest value.' },
    { name: 'max', type: 'number', default: 'Infinity', description: 'The largest value.' },
    { name: 'step', type: 'number', default: '1', description: 'What the chevrons and arrow keys add or take, stepping onto the grid of `step` from `min` (0 without one) in the direction of travel (a step not above 0 is 1).' },
    { name: 'clamp', type: "'commit' | 'always' | false", default: "'commit'", description: 'Clamp to the bounds on blur and Enter, as typed, or never (the chevrons always clamp).' },
    { name: 'negative', type: 'boolean', default: 'true', description: 'Accepts a minus sign; false also floors the value, its steps and aria-valuemin at 0.' },
    { name: 'decimal', type: 'boolean', default: 'true', description: 'Accepts a decimal part.' },
    { name: 'decimals', type: 'number', description: 'The most decimal digits (0 disallows decimals).' },
    { name: 'fixedDecimals', type: 'boolean', default: 'false', description: 'Always shows `decimals` digits.' },
    { name: 'prefix', type: 'string', description: 'Shown before the number.' },
    { name: 'suffix', type: 'string', description: 'Shown after the number.' },
    { name: 'locale', type: 'string', default: 'the platform’s', description: 'A BCP 47 tag (\'de-DE\'): where the default marks come from.' },
    { name: 'groupMark', type: 'boolean | string', description: 'Groups thousands; `true` uses the locale’s group mark, a string is used as given.' },
    { name: 'decimalMark', type: 'string', default: 'the locale’s', description: 'The decimal mark shown and typed.' },
    { name: 'controls', type: 'boolean', default: 'true', description: 'The chevrons at the end; false drops them.' },
    { name: 'end', type: 'any', description: 'Replaces the chevrons.' },
    { name: 'endWidth', type: 'number', default: 'the chevrons’ width', description: 'Width of the end content.' },
    { name: 'label, description, error, invalid, required, asterisk', type: 'as TextInput', description: 'The field’s label, texts and state.' },
    { name: 'placeholder, variant, size, radius, disabled, readOnly, start', type: 'as Input', description: 'The field’s frame and states; disabled and read-only fields do not step.' },
    { name: 'onFocus, onBlur, onKey, onSubmit', type: '(event) => void', description: 'The Edit’s events.' },
  ],
  demos: [
    {
      title: 'Held by a signal, with bounds',
      code: `
function Demo() {
  const count = $signal($active(), 5);
  return (
    <Stack gap="sm">
      <NumberInput label="Guests" description="From 1 to 10" min={1} max={10}
        value={count} onChange={v => $write(count, v)} />
      <Row gap="xs">
        <Button size="xs" variant="soft" onPress={() => $write(count, 1)}>Min</Button>
        <Button size="xs" variant="soft" onPress={() => $write(count, 10)}>Max</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(count, '')}>Clear</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => \`value: \${JSON.stringify($read(count))}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const count = $signal($active(), /** @type {number | string} */ (5));
        return (
          <Stack gap="sm">
            <NumberInput label="Guests" description="From 1 to 10" min={1} max={10} value={count} onChange={(/** @type {number | string} */ v) => $write(count, v)} />
            <Row gap="xs">
              <Button size="xs" variant="soft" onPress={() => $write(count, 1)}>
                Min
              </Button>
              <Button size="xs" variant="soft" onPress={() => $write(count, 10)}>
                Max
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(count, '')}>
                Clear
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `value: ${JSON.stringify($read(count))}`}
            </Text>
          </Stack>
        );
      },
      height: 180,
    },
    {
      title: 'A unit and a currency',
      code: `
function Demo() {
  return (
    <Row fill align="start">
      <NumberInput label="Flour" suffix=" kg" step={0.5} decimals={1} min={0} defaultValue={2.5} />
      <NumberInput label="Price, in de-DE" locale="de-DE" groupMark suffix=" €" decimals={2} fixedDecimals defaultValue={1249.9} controls={false} />
    </Row>
  );
}`,
      view: () => (
        <Row fill align="start">
          <NumberInput label="Flour" suffix=" kg" step={0.5} decimals={1} min={0} defaultValue={2.5} />
          <NumberInput label="Price, in de-DE" locale="de-DE" groupMark suffix=" €" decimals={2} fixedDecimals defaultValue={1249.9} controls={false} />
        </Row>
      ),
      height: 90,
    },
    {
      title: 'Integers only, states',
      code: `
function Demo() {
  return (
    <Row fill align="start">
      <NumberInput label="Whole, positive" decimal={false} negative={false} placeholder="0" />
      <NumberInput label="Error" error="Out of stock" defaultValue={0} />
      <NumberInput label="Disabled" disabled defaultValue={7} />
    </Row>
  );
}`,
      view: () => (
        <Row fill align="start">
          <NumberInput label="Whole, positive" decimal={false} negative={false} placeholder="0" />
          <NumberInput label="Error" error="Out of stock" defaultValue={0} />
          <NumberInput label="Disabled" disabled defaultValue={7} />
        </Row>
      ),
      height: 100,
    },
  ],
};
