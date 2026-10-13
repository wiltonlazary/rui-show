// PinInput: one character per cell.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { PinInput, Stack, Row, Button, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'pin-input',
  group: 'entry',
  title: 'PinInput',
  description: 'A code entered one character per cell: typing moves to the next cell, Backspace in an empty cell to the previous one, and pasted text fills the cells from the one it lands in. Each cell is a portable Edit, so it works the same on every renderer.',
  props: [
    { name: 'value', type: 'string', description: 'The characters (controlled); edits then only call `onChange`.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'The starting characters when uncontrolled.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the cells joined on every edit.' },
    { name: 'onComplete', type: '(value: string) => void', description: 'Called when every cell is filled.' },
    { name: 'length', type: 'number', default: '6', description: 'The number of cells (read once).' },
    { name: 'accept', type: "'digits' | 'letters' | 'any' | RegExp", default: "'digits'", description: 'What a cell accepts: digits, letters, any letter or digit, or a pattern each character must match.' },
    { name: 'secret', type: 'boolean', default: 'false', description: 'Shows bullets instead of the characters.' },
    { name: 'placeholder', type: 'string', default: "'·'", description: 'Shown in an empty cell.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'xs'", description: 'Space between the cells.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Each cell is a square of the input height.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Each cell’s corner radius.' },
    { name: 'variant', type: "'outline' | 'soft' | 'bare'", default: "'outline'", description: 'Each cell’s frame.' },
    { name: 'error', type: 'string', description: 'A message: a non-empty one gives the cells red borders.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Red borders without a message.' },
    { name: 'disabled, readOnly', type: 'boolean', default: 'false', description: 'Not editable.' },
    { name: 'onFocus, onBlur', type: '(event) => void', description: 'A cell took or lost focus.' },
    { name: 'aria-label', type: 'string', description: 'The group’s accessible name: the code it asks for; each cell is named by its place (\'2 of 6\').' },
    { name: 'ref', type: 'any', description: 'The row’s ref; style props apply to the row.' },
  ],
  demos: [
    {
      title: 'Held by a signal, with completion',
      code: `
function Demo() {
  const code = $signal($active(), '');
  const done = $signal($active(), '');
  return (
    <Stack gap="sm">
      <PinInput aria-label="Verification code" length={4} value={code} onChange={v => $write(code, v)} onComplete={v => $write(done, v)} />
      <Row gap="xs">
        <Button size="xs" variant="soft" onPress={() => $write(code, '1234')}>Fill 1234</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(code, '')}>Clear</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => \`value: "\${$read(code)}", completed: "\${$read(done)}"\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const code = $signal($active(), '');
        const done = $signal($active(), '');
        return (
          <Stack gap="sm">
            <PinInput aria-label="Verification code" length={4} value={code} onChange={(/** @type {string} */ v) => $write(code, v)} onComplete={(/** @type {string} */ v) => $write(done, v)} />
            <Row gap="xs">
              <Button size="xs" variant="soft" onPress={() => $write(code, '1234')}>
                Fill 1234
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(code, '')}>
                Clear
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `value: "${$read(code)}", completed: "${$read(done)}"`}
            </Text>
          </Stack>
        );
      },
      height: 130,
    },
    {
      title: 'Length, accept, secret, placeholder, invalid',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <PinInput aria-label="Four-digit code" length={4} placeholder="-" />
      <PinInput aria-label="Letters and digits" accept="any" defaultValue="A7" />
      <PinInput aria-label="Secret code" secret defaultValue="42" />
      <PinInput aria-label="Invalid code" invalid defaultValue="9" variant="soft" />
      <PinInput aria-label="Disabled code" disabled defaultValue="12" />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <PinInput aria-label="Four-digit code" length={4} placeholder="-" />
          <PinInput aria-label="Letters and digits" accept="any" defaultValue="A7" />
          <PinInput aria-label="Secret code" secret defaultValue="42" />
          <PinInput aria-label="Invalid code" invalid defaultValue="9" variant="soft" />
          <PinInput aria-label="Disabled code" disabled defaultValue="12" />
        </Stack>
      ),
      height: 240,
    },
    {
      title: 'Sizes',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <PinInput aria-label="Size xs" size="xs" radius="xl" />
      <PinInput aria-label="Size md" size="md" />
      <PinInput aria-label="Size lg" size="lg" gap="lg" />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <PinInput aria-label="Size xs" size="xs" radius="xl" />
          <PinInput aria-label="Size md" size="md" />
          <PinInput aria-label="Size lg" size="lg" gap="lg" />
        </Stack>
      ),
      height: 160,
    },
  ],
};
