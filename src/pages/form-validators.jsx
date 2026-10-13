// The form validators: rules for $form's `rules`.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $form, required, email, pattern, range, length, same } from 'rui-core/form';
import { Button, Row, Stack, Text, TextInput, NumberInput, Code, Tiles } from 'rui-core';

/** The phone's two rules, run in turn, and the optional email's. */
const phoneGiven = required('A number to call');
const phoneShape = pattern(/^\+?[\d ()-]{7,}$/, 'Digits, spaces and + ( ) -');
const mailShape = email();

/** A ticket check: each rule meets the value a clerk typed, with the whole order beside it. */
const ORDER = { seat: '14C', row: '14', code: 'KX7-204' };
const CHECKS = [
  ['required()', required(), ORDER.seat],
  ['required()', required(), '  '],
  ["pattern(/^[A-Z]{2}\\d-\\d{3}$/)", pattern(/^[A-Z]{2}\d-\d{3}$/, 'Code like KX7-204'), ORDER.code],
  ['range(1, 6)', range(1, 6), '8'],
  ['length(3)', length(3), ORDER.seat],
  ['length(4, 8)', length(4, 8), 'KX7'],
  ['email()', email(), 'desk@depot'],
  ["same('row')", same('row'), ORDER.seat],
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'form-validators',
  group: 'forms',
  title: 'Validators',
  description: 'The form validators: each makes a rule `(value, values, path)` that gives its error, or null when the value passes. The error is the one given, or the rule’s own short message when none is named: \'Fill this in\', \'Not an email address\', \'Wrong format\', \'Does not match\', or the bounds (\'From 1 to 6\', \'4 to 8 characters\'). Use them in `$form`’s `rules`, or call a rule directly.',
  props: [
    { name: 'required(error?)', type: 'Rule', default: "'Fill this in'", description: 'Fails null, undefined, NaN, a blank string and an empty array; `false` and 0 are answers and pass.' },
    { name: 'email(error?)', type: 'Rule', default: "'Not an email address'", description: 'Fails what does not have an email address’s shape (`emailTest`).' },
    { name: 'emailTest(text)', type: 'boolean', description: 'The shape of an email address: one `@`, a non-empty part before it, after it a domain of non-empty labels joined by dots (at least two), no spaces. It checks the shape only.' },
    { name: 'pattern(regex, error?)', type: 'Rule', default: "'Wrong format'", description: 'Fails a string that does not match `regex`, and anything not a string.' },
    { name: 'range(min, max, error?)', type: 'Rule', default: "'From min to max', 'min or more', 'max or less'", description: 'Fails a number (or numeric string) outside `min`…`max`, both inclusive (`undefined` leaves a side open), and anything not a number.' },
    { name: 'length(min, max?, error?, options?)', type: 'Rule', default: "'min to max characters' (or items), 'N characters', 'At least N …', 'At most N …'", description: 'Fails a string or array shorter than `min` or longer than `max`; without `max` the length must be exactly `min` (`Infinity` leaves it open). Text counts user-perceived characters, untrimmed unless `{ trim: true }`. With `max` left out the error may come second: `length(6, \'Six digits\')`.' },
    { name: 'same(field, error?)', type: 'Rule', default: "'Does not match'", description: 'Fails a value that is not the same (`Object.is`) as the value at the path `field` (`password`, `a.b.0`).' },
  ],
  demos: [
    {
      title: 'Holding a table, checked as each field is left',
      code: `
const phoneGiven = required('A number to call');
const phoneShape = pattern(/^\\+?[\\d ()-]{7,}$/, 'Digits, spaces and + ( ) -');
const mailShape = email();

function Demo() {
  const result = $signal($active(), '');
  const form = $form({
    values: { guests: 2, time: '', phone: '', email: '' },
    rules: {
      guests: range(1, 12, 'Parties of 1 to 12'),
      time: pattern(/^([01]\\d|2[0-3]):[0-5]\\d$/, 'A time like 19:30'),
      phone: (value, values, path) => phoneGiven(value, values, path) ?? phoneShape(value, values, path),
      email: (value, values, path) => (value === '' ? null : mailShape(value, values, path)),
    },
    validateOn: { blur: true },
  });
  const hold = () => {
    $write(result, form.validate().ok ? \`Held for \${form.get('guests')} at \${form.get('time')}\` : 'Check the marked fields');
  };
  return (
    <Stack gap="xs">
      <Row gap="sm" align="start">
        <NumberInput label="Guests" w={96} {...form.bind('guests')} />
        <TextInput label="Time" placeholder="19:30" w={110} {...form.bind('time')} />
        <TextInput label="Phone" placeholder="+1 (555) 010-4477" flex={1} {...form.bind('phone')} />
      </Row>
      <TextInput label="Email" description="Optional, for a reminder" placeholder="you@example.com" {...form.bind('email')} />
      <Row gap="sm" align="center">
        <Button size="xs" onPress={hold}>Hold the table</Button>
        <Button size="xs" variant="neutral" onPress={form.reset}>Reset</Button>
        <Text size="sm" fg="quiet">{() => $read(result)}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const result = $signal($active(), '');
        const form = $form({
          values: { guests: 2, time: '', phone: '', email: '' },
          rules: {
            guests: range(1, 12, 'Parties of 1 to 12'),
            time: pattern(/^([01]\d|2[0-3]):[0-5]\d$/, 'A time like 19:30'),
            phone: (/** @type {any} */ value, /** @type {any} */ values, /** @type {string} */ path) => phoneGiven(value, values, path) ?? phoneShape(value, values, path),
            email: (/** @type {any} */ value, /** @type {any} */ values, /** @type {string} */ path) => (value === '' ? null : mailShape(value, values, path)),
          },
          validateOn: { blur: true },
        });
        const hold = () => {
          $write(result, form.validate().ok ? `Held for ${form.get('guests')} at ${form.get('time')}` : 'Check the marked fields');
        };
        return (
          <Stack gap="xs">
            <Row gap="sm" align="start">
              <NumberInput label="Guests" w={96} {...form.bind('guests')} />
              <TextInput label="Time" placeholder="19:30" w={110} {...form.bind('time')} />
              <TextInput label="Phone" placeholder="+1 (555) 010-4477" flex={1} {...form.bind('phone')} />
            </Row>
            <TextInput label="Email" description="Optional, for a reminder" placeholder="you@example.com" {...form.bind('email')} />
            <Row gap="sm" align="center">
              <Button size="xs" onPress={hold}>
                Hold the table
              </Button>
              <Button size="xs" variant="neutral" onPress={form.reset}>
                Reset
              </Button>
              <Text size="sm" fg="quiet">
                {() => $read(result)}
              </Text>
            </Row>
          </Stack>
        );
      },
      height: 260,
    },
    {
      title: 'Rules called directly, on a ticket',
      code: `
const ORDER = { seat: '14C', row: '14', code: 'KX7-204' };
const CHECKS = [
  ['required()', required(), ORDER.seat],
  ['required()', required(), '  '],
  ["pattern(/^[A-Z]{2}\\\\d-\\\\d{3}$/)", pattern(/^[A-Z]{2}\\d-\\d{3}$/, 'Code like KX7-204'), ORDER.code],
  ['range(1, 6)', range(1, 6), '8'],
  ['length(3)', length(3), ORDER.seat],
  ['length(4, 8)', length(4, 8), 'KX7'],
  ['email()', email(), 'desk@depot'],
  ["same('row')", same('row'), ORDER.seat],
];

function Demo() {
  return (
    <Tiles columns={2} gap="sm" rowGap={4}>
      {CHECKS.map(([name, rule, value]) => {
        const error = rule(value, ORDER, 'field');
        return (
          <Stack gap={0}>
            <Code>{\`\${name} on \${JSON.stringify(value)}\`}</Code>
            <Text size="sm" fg={error === null ? 'quiet' : 'red'}>{error === null ? 'passes (null)' : \`fails: \${JSON.stringify(error)}\`}</Text>
          </Stack>
        );
      })}
    </Tiles>
  );
}`,
      view: () => (
        <Tiles columns={2} gap="sm" rowGap={4}>
          {CHECKS.map(([name, rule, value]) => {
            const error = /** @type {any} */ (rule)(value, ORDER, 'field');
            return (
              <Stack gap={0}>
                <Code>{`${name} on ${JSON.stringify(value)}`}</Code>
                <Text size="sm" fg={error === null ? 'quiet' : 'red'}>
                  {error === null ? 'passes (null)' : `fails: ${JSON.stringify(error)}`}
                </Text>
              </Stack>
            );
          })}
        </Tiles>
      ),
      height: 230,
    },
  ],
};
