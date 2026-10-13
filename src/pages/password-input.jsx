// PasswordInput: a masked field with a visibility toggle.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { PasswordInput, Progress, Stack, Row, Switch } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'password-input',
  group: 'entry',
  title: 'PasswordInput',
  description: 'A password field with an eye toggle that shows or hides the text. The field is a secret Edit: a password input on the DOM, a bullet per character on the canvases.',
  props: [
    { name: 'value', type: 'string', description: 'The password, held by you; edits then only call `onChange`.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'The starting password, when it holds its own.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the new password on every edit.' },
    { name: 'shown', type: 'boolean', description: 'Whether the text is shown, held by you.' },
    { name: 'defaultShown', type: 'boolean', default: 'false', description: 'Whether the text starts shown, when it holds its own.' },
    { name: 'onShownChange', type: '(shown: boolean) => void', description: 'Called when the toggle is pressed.' },
    { name: 'revealable', type: 'boolean', default: 'true', description: "`false` drops the toggle at the end (`end` then applies). The toggle is named for what a press does: 'Show password' while hidden, 'Hide password' while shown." },
    { name: 'label, description, error, invalid, required, asterisk', type: 'as TextInput', description: 'The field’s parts.' },
    { name: 'placeholder', type: 'string', description: 'Shown while the field is empty.' },
    { name: 'variant, size, radius, disabled, readOnly', type: 'as Input', description: 'The field’s frame and states.' },
    { name: 'onFocus, onBlur, onKey, onSubmit', type: '(event) => void', description: 'The Edit’s events.' },
  ],
  demos: [
    {
      title: 'A new passphrase',
      code: `
function Demo() {
  const R = $active();
  const phrase = $signal(R, '');
  const shown = $signal(R, false);
  const strength = () => Math.min(100, $read(phrase).length * 6.25);
  const tone = () => (strength() < 40 ? 'red' : strength() < 75 ? 'amber' : 'teal');
  return (
    <Stack gap="xs" w={340}>
      <PasswordInput
        label="New passphrase"
        description="16 characters or more is strong"
        placeholder="A few words you remember"
        value={phrase}
        onChange={v => $write(phrase, v)}
        shown={shown}
        onShownChange={v => $write(shown, v)}
      />
      <Progress value={strength} color={tone} size="sm" label="Strength" />
      <Switch label="Show characters" checked={shown} onChange={v => $write(shown, v)} />
    </Stack>
  );
}`,
      view: () => {
        const R = $active();
        const phrase = $signal(R, '');
        const shown = $signal(R, false);
        const strength = () => Math.min(100, $read(phrase).length * 6.25);
        const tone = () => (strength() < 40 ? 'red' : strength() < 75 ? 'amber' : 'teal');
        return (
          <Stack gap="xs" w={340}>
            <PasswordInput
              label="New passphrase"
              description="16 characters or more is strong"
              placeholder="A few words you remember"
              value={phrase}
              onChange={(/** @type {string} */ v) => $write(phrase, v)}
              shown={shown}
              onShownChange={(/** @type {boolean} */ v) => $write(shown, v)}
            />
            <Progress value={strength} color={tone} size="sm" label="Strength" />
            <Switch label="Show characters" checked={shown} onChange={(/** @type {boolean} */ v) => $write(shown, v)} />
          </Stack>
        );
      },
      height: 170,
    },
    {
      title: 'Without a toggle, variants',
      code: `
function Demo() {
  return (
    <Row fill align="start">
      <PasswordInput label="No toggle" revealable={false} defaultValue="1234" />
      <PasswordInput label="Soft" variant="soft" placeholder="Password" />
      <PasswordInput label="Disabled" disabled defaultValue="1234" />
    </Row>
  );
}`,
      view: () => (
        <Row fill align="start">
          <PasswordInput label="No toggle" revealable={false} defaultValue="1234" />
          <PasswordInput label="Soft" variant="soft" placeholder="Password" />
          <PasswordInput label="Disabled" disabled defaultValue="1234" />
        </Row>
      ),
      height: 90,
    },
  ],
};
