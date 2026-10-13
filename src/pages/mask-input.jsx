// MaskInput: text entered through a mask.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { MaskInput, Stack, Row, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'mask-input',
  group: 'entry',
  title: 'MaskInput',
  description: 'Text entered through a mask: characters that do not fit a slot are dropped and the mask’s literals are inserted as you type; with no `placeholder` the mask itself is the hint, `_` for each slot. When the mask rewrites the text, the caret moves past the inserted literals, on every renderer.',
  props: [
    { name: 'mask', type: 'string', description: "The pattern, e.g. `'+1 (###) ###-####'`. Slots: `#` a digit, `@` a letter, `^` a letter shown upper-case, `&` a letter or digit (add others through `slots`, e.g. `{ h: /[0-9a-f]/i }`); `{…}` is literal text; `[…]` is an optional tail; any other character is itself." },
    { name: 'slots', type: 'Record<string, RegExp>', description: 'More slot characters, or replacements for the built-in ones, each tested against one character.' },
    { name: 'transform', type: '(ch: string) => string', description: 'Applied to each typed character before it is checked (e.g. to upper case).' },
    { name: 'value', type: 'string', description: 'The masked text (controlled); edits then only call `onChange`.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'The starting text when uncontrolled, read through the mask (\'5551234567\' shows +1 (555) 123-4567).' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the masked text when it changes.' },
    { name: 'onRawChange', type: '(raw: string) => void', description: 'Called with the characters the slots took.' },
    { name: 'onComplete', type: '(value: string) => void', description: 'Called each time every slot outside the optional tail becomes filled.' },
    { name: 'placeholder', type: 'string', default: 'the mask, `_` for each slot', description: 'The hint while empty.' },
    { name: 'label, description, error, invalid, required, asterisk', type: 'as TextInput', description: 'The field’s parts.' },
    { name: 'variant, size, radius, disabled, readOnly, start, end', type: 'as Input', description: 'The field’s frame and states.' },
    { name: 'onFocus, onBlur, onKey, onSubmit', type: '(event) => void', description: 'The Edit’s events.' },
  ],
  demos: [
    {
      title: 'Phone, held by a signal',
      code: `
function Demo() {
  const phone = $signal($active(), '');
  const raw = $signal($active(), '');
  const complete = $signal($active(), false);
  return (
    <Stack gap="sm">
      <MaskInput label="Phone" mask="+1 (###) ###-####"
        value={phone} onChange={v => { $write(phone, v); $write(complete, false); }}
        onRawChange={r => $write(raw, r)} onComplete={() => $write(complete, true)} />
      <Text size="sm" fg="quiet">{() => \`value: "\${$read(phone)}", raw: "\${$read(raw)}"\${$read(complete) ? ', complete' : ''}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const phone = $signal($active(), '');
        const raw = $signal($active(), '');
        const complete = $signal($active(), false);
        return (
          <Stack gap="sm">
            <MaskInput
              label="Phone"
              mask="+1 (###) ###-####"
              value={phone}
              onChange={(/** @type {string} */ v) => {
                $write(phone, v);
                $write(complete, false);
              }}
              onRawChange={(/** @type {string} */ r) => $write(raw, r)}
              onComplete={() => $write(complete, true)}
            />
            <Text size="sm" fg="quiet">
              {() => `value: "${$read(phone)}", raw: "${$read(raw)}"${$read(complete) ? ', complete' : ''}`}
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'Masks, slots and transform',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row fill align="start">
        <MaskInput label="Date" mask="##/##/####" placeholder="MM/DD/YYYY" />
        <MaskInput label="Plate" mask="^^^-####" />
      </Row>
      <Row fill align="start">
        <MaskInput label="Hex color" mask="{#}HHHHHH" slots={{ H: /[0-9a-fA-F]/ }} transform={ch => ch.toLowerCase()} />
        <MaskInput label="Extension optional" mask="(###) ###-####[ x####]" />
      </Row>
      <Row fill align="start">
        <MaskInput label="Offset, signed" mask="~##.#" slots={{ '~': /[-+0-9]/ }} />
        <MaskInput label="Room" mask="@-###" />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row fill align="start">
            <MaskInput label="Date" mask="##/##/####" placeholder="MM/DD/YYYY" />
            <MaskInput label="Plate" mask="^^^-####" />
          </Row>
          <Row fill align="start">
            <MaskInput label="Hex color" mask="{#}HHHHHH" slots={{ H: /[0-9a-fA-F]/ }} transform={(/** @type {string} */ ch) => ch.toLowerCase()} />
            <MaskInput label="Extension optional" mask="(###) ###-####[ x####]" />
          </Row>
          <Row fill align="start">
            <MaskInput label="Offset, signed" mask="~##.#" slots={{ '~': /[-+0-9]/ }} />
            <MaskInput label="Room" mask="@-###" />
          </Row>
        </Stack>
      ),
      height: 220,
    },
  ],
};
