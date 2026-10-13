// Textarea: text on several lines, fixed rows or autosize.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Textarea, Stack, Row, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'textarea',
  group: 'entry',
  title: 'Textarea',
  description: 'Text on several lines, with a label, description and error: a fixed number of rows, or `autosize` between `minRows` and `maxRows`. Autosize grows with wrapped lines too, on every renderer.',
  props: [
    { name: 'value', type: 'string', description: 'The text shown (controlled); edits then only call `onChange`.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'The starting text when uncontrolled.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the new text on every edit.' },
    { name: 'rows', type: 'number', default: 'minRows ?? 3', description: 'The rows shown when not autosized.' },
    { name: 'autosize', type: 'boolean', default: 'false', description: 'Grows with the text’s lines, wrapped ones included.' },
    { name: 'minRows', type: 'number', default: '1 (autosize)', description: 'The fewest rows shown when autosized (and the rows when `rows` is not set).' },
    { name: 'maxRows', type: 'number', default: 'Infinity', description: 'The most rows shown when autosized.' },
    { name: 'label', type: 'string', description: 'The label above the field.' },
    { name: 'description', type: 'string', description: 'Quiet text between the label and the field.' },
    { name: 'error', type: 'string', description: 'A message under the field, with the invalid look (a red border).' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'The invalid look without a message.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'A value is needed: `aria-required` only.' },
    { name: 'asterisk', type: 'boolean | string | node', description: 'The mark after the label: `true` a red `*`; none by default.' },
    { name: 'placeholder', type: 'string', description: 'Shown while the field is empty.' },
    { name: 'variant', type: "'outline' | 'soft' | 'bare'", default: "'outline'", description: 'The field’s frame.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The font size (and the rows’ height).' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'The field’s corner radius.' },
    { name: 'disabled, readOnly', type: 'boolean', default: 'false', description: 'Not editable: disabled is dimmed and takes no focus; readOnly stays focusable and selectable.' },
    { name: 'onFocus, onBlur, onKey, onSubmit', type: '(event) => void', description: 'The Edit’s events.' },
    { name: 'm … flex, fieldStyle, outerStyle', type: 'style props', description: 'As TextInput’s.' },
  ],
  demos: [
    {
      title: 'Held by a signal, autosize',
      code: `
function Demo() {
  const notes = $signal($active(), '');
  return (
    <Stack gap="sm">
      <Textarea label="Notes" description="Grows from 2 to 4 rows" placeholder="Write something"
        autosize minRows={2} maxRows={4} value={notes} onChange={v => $write(notes, v)} />
      <Text size="sm" fg="quiet">{() => \`\${$read(notes).length} characters, \${$read(notes).split('\\n').length} lines\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const notes = $signal($active(), '');
        return (
          <Stack gap="sm">
            <Textarea
              label="Notes"
              description="Grows from 2 to 4 rows"
              placeholder="Write something"
              autosize
              minRows={2}
              maxRows={4}
              value={notes}
              onChange={(/** @type {string} */ v) => $write(notes, v)}
            />
            <Text size="sm" fg="quiet">
              {() => `${$read(notes).length} characters, ${$read(notes).split('\n').length} lines`}
            </Text>
          </Stack>
        );
      },
      height: 200,
    },
    {
      title: 'Rows, error and variants',
      code: `
function Demo() {
  return (
    <Row fill align="start">
      <Textarea label="Two rows" rows={2} placeholder="Fixed height" />
      <Textarea label="Soft" variant="soft" rows={2} placeholder="Soft" />
      <Textarea label="Comment" rows={2} error="Too short" defaultValue="ok" />
    </Row>
  );
}`,
      view: () => (
        <Row fill align="start">
          <Textarea label="Two rows" rows={2} placeholder="Fixed height" />
          <Textarea label="Soft" variant="soft" rows={2} placeholder="Soft" />
          <Textarea label="Comment" rows={2} error="Too short" defaultValue="ok" />
        </Row>
      ),
      height: 130,
    },
  ],
};
