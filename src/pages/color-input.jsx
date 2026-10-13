// ColorInput: a color field with a picker in a panel, its formats, and a
// field of brand swatches only.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { ColorInput, Row, Stack, Text } from 'rui-core';

const BRAND = ['#1b4f9c', '#2f8f83', '#e0a526', '#d9534f', '#3b3b46cc'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'color-input',
  group: 'entry',
  title: 'ColorInput',
  description: 'A color field: the color typed as text, with a swatch of it at its start, an eye dropper at its end, and a ColorPicker in a panel that opens on a press of the field or ArrowDown (not on focus) and closes by Escape, Tab or a press outside. The typed text is a draft: the value follows only once the draft reads as a color, or is emptied. Enter, leaving the field after a change, a picker gesture’s end, a swatch or an eye dropper pick commit it; leaving with a draft that is no color puts the value back.',
  props: [
    { name: 'value / defaultValue', type: 'string', default: "''", description: 'The color as text (`\'\'` for none): held by a signal with `onChange`, or a first value only.' },
    { name: 'onChange', type: '(value: string) => void', description: "Called only with a valid color, as typed or picked, or with '' once the text is emptied." },
    { name: 'onCommit', type: '(value: string) => void', description: 'Called on Enter and on leaving the field when the value changed since it took the focus (written in `format` first), and on a picker gesture’s end, a swatch or an eye dropper pick.' },
    { name: 'format', type: "'hex' | 'rgb' | 'hsl'", default: "'hex'", description: 'The text a commit writes; a new format alone leaves the value as it is.' },
    { name: 'alpha', type: 'boolean', default: 'false', description: 'The text carries the opacity (#rrggbbaa, rgba(), hsla()); a change alone leaves the value as it is.' },
    { name: 'swatches / swatchColumns', type: 'string[] / number', default: '— / 8', description: 'Colors to pick with a press, under the picker.' },
    { name: 'picker', type: 'boolean', default: 'true', description: '`false` shows only the swatches in the panel (no panel without them).' },
    { name: 'preview', type: 'boolean', default: 'true', description: 'A swatch of the value at its start (a transparent one while there is none).' },
    { name: 'eyedropper', type: 'boolean | node | { label, variant, color, … }', default: 'true', description: "A button at its end that picks a color from the screen ('Pick a color from the screen'), where the platform has one; disabled, not hidden, while the field is disabled or read-only: `false` for none, a node for its icon, or the button’s options." },
    { name: 'revert', type: 'boolean', default: 'true', description: 'Leaving with a draft that is no color shows the value again; `false` keeps the draft, invalid.' },
    { name: 'sticky', type: 'boolean', default: 'true', description: '`false`: a swatch pressed closes the panel.' },
    { name: 'typing', type: 'boolean', default: 'true', description: '`false`: the text is read-only; a press, Enter or Space opens the panel.' },
    { name: 'stretch', type: 'boolean', default: 'false', description: 'The panel as wide as the field.' },
    { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open: boolean) => void', default: '— / false / —', description: 'The panel, controlled or its own; it never opens while disabled or read-only.' },
    { name: 'popover', type: 'Popover props', description: 'The panel’s placement and look (at \'bottom-start\'); its `open`, `defaultOpen` and `onOpenChange` serve when the field’s are not given.' },
    { name: 'others', type: 'Input props', description: '`label`, `description`, `error`, `invalid`, `required`, `asterisk`, `placeholder`, `size` (also the start swatch, `theme.sizes.swatch`, and the picker: `sizes.picker` and `sizes.colorThumb`), `radius`, `variant`, `disabled`, `readOnly`, `start`, `end`.' },
  ],
  demos: [
    {
      title: 'A brand color',
      code: `
function Demo() {
  const color = $signal($active(), '#2d83db');
  const committed = $signal($active(), '#2d83db');
  return (
    <Row gap="lg" align="start">
      <ColorInput label="Brand color" placeholder="e.g. #2f78c9" w={240}
        value={() => $read(color)} onChange={v => $write(color, v)} onCommit={v => $write(committed, v)} />
      <Stack gap={4} mt={28}>
        <Text size="sm" fg="quiet">{() => \`value: \${$read(color) || '(none)'}\`}</Text>
        <Text size="sm" fg="quiet">{() => \`committed: \${$read(committed) || '(none)'}\`}</Text>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const color = $signal($active(), '#2d83db');
        const committed = $signal($active(), '#2d83db');
        return (
          <Row gap="lg" align="start">
            <ColorInput
              label="Brand color"
              placeholder="e.g. #2f78c9"
              w={240}
              value={() => $read(color)}
              onChange={(/** @type {string} */ v) => $write(color, v)}
              onCommit={(/** @type {string} */ v) => $write(committed, v)}
            />
            <Stack gap={4} mt={28}>
              <Text size="sm" fg="quiet">
                {() => `value: ${$read(color) || '(none)'}`}
              </Text>
              <Text size="sm" fg="quiet">
                {() => `committed: ${$read(committed) || '(none)'}`}
              </Text>
            </Stack>
          </Row>
        );
      },
      height: 300,
    },
    {
      title: 'Another format, and brand swatches only',
      code: `
const BRAND = ['#1b4f9c', '#2f8f83', '#e0a526', '#d9534f', '#3b3b46cc'];

function Demo() {
  return (
    <Row gap="lg" align="start">
      <ColorInput label="Accent (HSL)" format="hsl" defaultValue="hsl(212, 70%, 52%)" w={240} />
      <ColorInput label="Label color" picker={false} typing={false} swatches={BRAND} format="rgb" alpha sticky={false} defaultValue="rgba(27, 79, 156, 1)" w={240} />
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg" align="start">
          <ColorInput label="Accent (HSL)" format="hsl" defaultValue="hsl(212, 70%, 52%)" w={240} />
          <ColorInput label="Label color" picker={false} typing={false} swatches={BRAND} format="rgb" alpha sticky={false} defaultValue="rgba(27, 79, 156, 1)" w={240} />
        </Row>
      ),
      height: 340,
    },
  ],
};
