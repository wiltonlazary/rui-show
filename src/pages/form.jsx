// $form: values, validation, list fields and input props.

import { $signal, $read, $write } from 'rrx-core';
import { $active, For } from 'ren-core';
import { $form, EACH, required, email, pattern, length } from 'rui-core/form';
import { Alert, Badge, Button, Checkbox, CloseButton, Row, Select, Stack, Text, TextInput } from 'rui-core';

const COUNTRIES = ['Brazil', 'Canada', 'Germany', 'Japan', 'Portugal', 'Kenya'];
const NAMES = /** @type {Record<string, string>} */ ({ name: 'Full name', postcode: 'Postcode', country: 'Country' });

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'form',
  group: 'forms',
  title: '$form',
  description: 'A form on rrx-core: the values are a store (one field’s readers follow only that field), errors, touched and dirty marks are records by path (`members.0.name`), and `bind(path)` gives the props rui-core’s inputs take. Rules validate on submit, on change or on blur; list fields insert, remove and reorder with their errors and dirty marks.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on (the running one by default).' },
    { name: 'values', type: 'V', description: 'The values at first, and what `reset` returns to.' },
    { name: 'rules', type: 'Rules | ((values: V) => FormErrors)', description: 'Rules by field (`rule(value, values, path)`; an object of rules under a list applies to each item), or a function of all values giving errors by path.' },
    { name: 'validateOn', type: '{ change?: boolean | (string | PathPattern)[], blur?: boolean | (string | PathPattern)[] }', description: 'Validates a field as it changes, or when it loses focus: every field (`true`), or those paths, each an exact path (`\'email\'`) or a pattern of segments where the `EACH` symbol stands for any list index (`[\'items\', EACH, \'name\']`); otherwise on submit.' },
    { name: 'afterError', type: "'check' | 'clear' | 'keep'", default: "'check'", description: 'What a change does to a field that shows an error: check it again, clear the error, or keep it.' },
    { name: 'errors / touched / dirty', type: 'Record<string, any>', description: 'Errors and marks at first, by path.' },
    { name: 'touchOn', type: "'input' | 'blur'", default: "'blur'", description: 'What marks a field touched: leaving it, or any input into it.' },
    { name: 'keyed', type: 'boolean', default: 'false', description: 'The inputs keep their own state, and `keyOf(path)` re-mounts them when the form sets a value.' },
    { name: 'transform', type: '(values: V) => any', description: 'What `submit` hands over.' },
    { name: 'onChange', type: '(values: V, previous: V) => void', description: 'Called after each change of the values.' },
    { name: 'returns', type: 'Form<V>', description: '`values` and `errors` (stores), `busy`, `keyed`; `bind(path, { as?: \'value\' | \'checked\', error?, focus? })`, `submit(handler, onInvalid?)`, `reset`; `get()`, `get(path)`, `merge`, `set`, `keyOf(path)`, `rebase`, `output`; `validate()` → `{ ok, errors }`, `check(path)` → `{ ok, error }`, `valid`, `setError(path, error)` or `setError(map)`, `clear(path?)`, `allErrors`; `touched`, `dirty`, `touch(path, bool)` or `touch(map)`, `markDirty`, `untouch`, `settle`; `insert`, `remove`, `move(path, from, to)`, `replace` (carrying the items’ errors and marks); `watch(path, (value, previous) => …)`. Rules: `required`, `email`, `pattern`, `range(min, max, error)`, `length(min, max?, error, { trim })`, `same`.' },
  ],
  demos: [
    {
      title: 'A shipping form checked on blur',
      code: `
const COUNTRIES = ['Brazil', 'Canada', 'Germany', 'Japan', 'Portugal', 'Kenya'];
const NAMES = { name: 'Full name', postcode: 'Postcode', country: 'Country' };

function Demo() {
  const result = $signal($active(), 'Not sent yet');
  const form = $form({
    values: { name: '', postcode: '', country: null, save: false },
    rules: {
      name: length(2, 60, 'Two to sixty letters'),
      postcode: pattern(/^[0-9]{4,5}(-[0-9]{3})?$/, 'Digits, as 1000 or 12345-678'),
      country: required('Pick a country'),
    },
    validateOn: { blur: true },
  });
  const errors = () => Object.entries(form.allErrors()).filter(([, error]) => error);
  const send = form.submit(values => $write(result, \`Shipping to \${values.name}, \${values.postcode}, \${values.country}\`));
  return (
    <Stack gap="xs" w={320}>
      {() => errors().length === 0 ? null : (
        <Alert color="red" title={\`\${errors().length} to fix\`}>
          <Stack gap={2}>{errors().map(([path, error]) => <Text size="sm">{\`\${NAMES[path]}: \${error}\`}</Text>)}</Stack>
        </Alert>
      )}
      <TextInput label="Full name" placeholder="e.g. Noor Haddad" {...form.bind('name')} />
      <TextInput label="Postcode" placeholder="12345-678" {...form.bind('postcode')} />
      <Select label="Country" placeholder="Pick one" data={COUNTRIES} {...form.bind('country')} />
      <Checkbox label="Save this address" {...form.bind('save', { as: 'checked' })} />
      <Row gap="sm">
        <Button size="xs" onPress={send}>Ship here</Button>
        <Button size="xs" variant="neutral" onPress={() => (form.reset(), $write(result, 'Not sent yet'))}>Reset</Button>
      </Row>
      <Text size="sm">{() => $read(result)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const result = $signal($active(), 'Not sent yet');
        const form = $form({
          values: { name: '', postcode: '', country: /** @type {string | null} */ (null), save: false },
          rules: {
            name: length(2, 60, 'Two to sixty letters'),
            postcode: pattern(/^[0-9]{4,5}(-[0-9]{3})?$/, 'Digits, as 1000 or 12345-678'),
            country: required('Pick a country'),
          },
          validateOn: { blur: true },
        });
        const errors = () => Object.entries(form.allErrors()).filter(([, error]) => error);
        const send = form.submit(values => $write(result, `Shipping to ${values.name}, ${values.postcode}, ${values.country}`));
        return (
          <Stack gap="xs" w={320}>
            {() =>
              errors().length === 0 ? null : (
                <Alert color="red" title={`${errors().length} to fix`}>
                  <Stack gap={2}>
                    {errors().map(([path, error]) => (
                      <Text size="sm">{`${NAMES[path]}: ${error}`}</Text>
                    ))}
                  </Stack>
                </Alert>
              )
            }
            <TextInput label="Full name" placeholder="e.g. Noor Haddad" {...form.bind('name')} />
            <TextInput label="Postcode" placeholder="12345-678" {...form.bind('postcode')} />
            <Select label="Country" placeholder="Pick one" data={COUNTRIES} {...form.bind('country')} />
            <Checkbox label="Save this address" {...form.bind('save', { as: 'checked' })} />
            <Row gap="sm">
              <Button size="xs" onPress={send}>
                Ship here
              </Button>
              <Button size="xs" variant="neutral" onPress={() => (form.reset(), $write(result, 'Not sent yet'))}>
                Reset
              </Button>
            </Row>
            <Text size="sm">{() => $read(result)}</Text>
          </Stack>
        );
      },
      height: 460,
    },
    {
      title: 'A list field, each name checked on blur',
      code: `
function Demo() {
  const result = $signal($active(), 'Nothing packed yet');
  const form = $form({
    values: { items: [{ name: 'Tent' }, { name: '' }] },
    rules: { items: { name: required('Name the item') } },
    validateOn: { blur: [['items', EACH, 'name']] },
  });
  const pack = form.submit(
    values => $write(result, \`Packed: \${values.items.map(item => item.name).join(', ')}\`),
    errors => $write(result, \`\${Object.keys(errors).length} to fix: \${Object.keys(errors).join(', ')}\`),
  );
  return (
    <Stack gap="xs">
      <Text size="sm" fontWeight={700}>Parcel contents</Text>
      <For each={() => form.get('items')}>
        {(_, i) => (
          <Row gap="xs" align="start">
            <TextInput placeholder="Item" w={260} {...form.bind(\`items.\${i()}.name\`)} />
            <CloseButton mt={4} label={\`Remove item \${i() + 1}\`} onPress={() => form.remove('items', i())} />
          </Row>
        )}
      </For>
      <Row gap="sm">
        <Button size="xs" variant="soft" onPress={() => form.insert('items', { name: '' })}>Add item</Button>
        <Button size="xs" onPress={pack}>Pack</Button>
      </Row>
      <Text size="sm">{() => $read(result)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const result = $signal($active(), 'Nothing packed yet');
        const form = $form({
          values: { items: [{ name: 'Tent' }, { name: '' }] },
          rules: { items: { name: required('Name the item') } },
          validateOn: { blur: [['items', EACH, 'name']] },
        });
        const pack = form.submit(
          values => $write(result, `Packed: ${values.items.map((/** @type {any} */ item) => item.name).join(', ')}`),
          errors => $write(result, `${Object.keys(errors).length} to fix: ${Object.keys(errors).join(', ')}`),
        );
        return (
          <Stack gap="xs">
            <Text size="sm" fontWeight={700}>
              Parcel contents
            </Text>
            <For each={() => form.get('items')}>
              {(/** @type {any} */ _, /** @type {() => number} */ i) => (
                <Row gap="xs" align="start">
                  <TextInput placeholder="Item" w={260} {...form.bind(`items.${i()}.name`)} />
                  <CloseButton mt={4} label={`Remove item ${i() + 1}`} onPress={() => form.remove('items', i())} />
                </Row>
              )}
            </For>
            <Row gap="sm">
              <Button size="xs" variant="soft" onPress={() => form.insert('items', { name: '' })}>
                Add item
              </Button>
              <Button size="xs" onPress={pack}>
                Pack
              </Button>
            </Row>
            <Text size="sm">{() => $read(result)}</Text>
          </Stack>
        );
      },
      height: 240,
    },
    {
      title: 'Validation on change and on blur',
      code: `
function Demo() {
  const form = $form({
    values: { username: '', email: '' },
    rules: { username: length(3, 12), email: email('Enter an address like name@host.example') },
    validateOn: { change: ['username'], blur: ['email'] },
  });
  return (
    <Stack gap="xs">
      <Row gap="sm" align="start">
        <TextInput label="Username (checked as you type)" placeholder="jo" w={300} {...form.bind('username')} />
        <TextInput label="Email (checked when you leave it)" placeholder="you@example.com" w={300} {...form.bind('email')} />
      </Row>
      <Row gap="xs">
        <Badge variant="soft" color={() => (form.dirty() ? 'orange' : 'gray')}>{() => (form.dirty() ? 'dirty' : 'clean')}</Badge>
        <Badge variant="soft" color={() => (form.touched() ? 'blue' : 'gray')}>{() => (form.touched() ? 'touched' : 'untouched')}</Badge>
        <Button size="xs" variant="neutral" onPress={form.reset}>Reset</Button>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const form = $form({
          values: { username: '', email: '' },
          rules: { username: length(3, 12), email: email('Enter an address like name@host.example') },
          validateOn: { change: ['username'], blur: ['email'] },
        });
        return (
          <Stack gap="xs">
            <Row gap="sm" align="start">
              <TextInput label="Username (checked as you type)" placeholder="jo" w={300} {...form.bind('username')} />
              <TextInput label="Email (checked when you leave it)" placeholder="you@example.com" w={300} {...form.bind('email')} />
            </Row>
            <Row gap="xs">
              <Badge variant="soft" color={() => (form.dirty() ? 'orange' : 'gray')}>
                {() => (form.dirty() ? 'dirty' : 'clean')}
              </Badge>
              <Badge variant="soft" color={() => (form.touched() ? 'blue' : 'gray')}>
                {() => (form.touched() ? 'touched' : 'untouched')}
              </Badge>
              <Button size="xs" variant="neutral" onPress={form.reset}>
                Reset
              </Button>
            </Row>
          </Stack>
        );
      },
      height: 120,
    },
  ],
};
