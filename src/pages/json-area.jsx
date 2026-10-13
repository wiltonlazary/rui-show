// JsonArea: a Textarea for JSON, validated and formatted on blur.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, JsonArea, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'json-area',
  group: 'entry',
  title: 'JsonArea',
  description: 'A Textarea for JSON: on leaving it checks the text, shows `parseError` while it does not parse, calls `onParse` with the value when it does, and with `pretty` rewrites valid JSON with `indent` (two spaces by default, or your `print`).',
  props: [
    { name: 'value', type: 'string | (() => string)', description: 'The JSON text, held by the caller: edits then only call `onChange`.' },
    { name: 'defaultValue', type: 'string', default: "''", description: 'The starting text when uncontrolled.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Called with the new text on every edit, and with the tidied text on leaving.' },
    { name: 'onParse', type: '(value: any) => void', description: 'Called with the parsed value each time valid, non-empty text is left (after any tidy).' },
    { name: 'pretty', type: 'boolean', default: 'false', description: 'Leaving valid text rewrites it as `print(parse(text))`.' },
    { name: 'indent', type: 'number | string', default: '2', description: 'The indent `print` writes by default: a count of spaces, or a string such as a tab.' },
    { name: 'parseError', type: 'string | false', default: "'Not valid JSON'", description: 'The message while the text does not parse; false shows none, and the invalid look stays.' },
    { name: 'print', type: '(value: any) => string', default: 'JSON with `indent`', description: 'How a value is written back.' },
    { name: 'parse', type: '(text: string) => any', default: 'JSON.parse', description: 'How the text is read; a throw means not valid.' },
    { name: 'error', type: 'string', description: 'A message of your own; it wins over the parse message.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'The invalid look without a message.' },
    { name: 'rows', type: 'number', default: '4', description: 'The rows shown when not autosized.' },
    { name: 'autosize, minRows, maxRows', type: 'boolean, number, number', description: 'As Textarea’s.' },
    { name: 'label, description, required, asterisk', type: 'as TextInput', description: 'The field’s parts.' },
    { name: 'placeholder, variant, size, radius, disabled, readOnly, fieldStyle, outerStyle', type: 'as Input', description: 'The field’s frame and states.' },
    { name: 'onFocus, onBlur, onKey, onSubmit', type: '(event) => void', description: 'The Edit’s events.' },
  ],
  demos: [
    {
      title: 'A settings editor, formatted on demand',
      code: `
function Demo() {
  const json = $signal($active(), '{"theme":"night","fontSize":15}');
  const note = $signal($active(), 'Edit, then press Format');
  const format = () => {
    try {
      $write(json, JSON.stringify(JSON.parse($read(json)), null, 2));
      $write(note, 'Formatted');
    } catch {
      $write(note, 'Not valid JSON: nothing to format');
    }
  };
  return (
    <Stack gap="sm">
      <JsonArea label="Settings" rows={8} parseError="This is not JSON yet"
        value={json} onChange={v => ($write(json, v), $write(note, 'Edited'))}
        onParse={v => $write(note, \`Valid: \${Object.keys(v ?? {}).length} keys\`)} />
      <Row gap="sm" align="center">
        <Button size="xs" variant="soft" onPress={format}>Format</Button>
        <Text size="sm" fg="quiet">{() => $read(note)}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const json = $signal($active(), '{"theme":"night","fontSize":15}');
        const note = $signal($active(), 'Edit, then press Format');
        const format = () => {
          try {
            $write(json, JSON.stringify(JSON.parse($read(json)), null, 2));
            $write(note, 'Formatted');
          } catch {
            $write(note, 'Not valid JSON: nothing to format');
          }
        };
        return (
          <Stack gap="sm">
            <JsonArea
              label="Settings"
              rows={8}
              parseError="This is not JSON yet"
              value={json}
              onChange={(/** @type {string} */ v) => ($write(json, v), $write(note, 'Edited'))}
              onParse={(/** @type {any} */ v) => $write(note, `Valid: ${Object.keys(v ?? {}).length} keys`)}
            />
            <Row gap="sm" align="center">
              <Button size="xs" variant="soft" onPress={format}>
                Format
              </Button>
              <Text size="sm" fg="quiet">
                {() => $read(note)}
              </Text>
            </Row>
          </Stack>
        );
      },
      height: 270,
    },
    {
      title: 'An error of your own',
      code: `
function Demo() {
  return <JsonArea label="Payload" rows={3} defaultValue="[1, 2, 3]" error="The server rejected it" />;
}`,
      view: () => <JsonArea label="Payload" rows={3} defaultValue="[1, 2, 3]" error="The server rejected it" />,
      height: 130,
    },
    {
      title: 'Tidied on leaving, four-space indent',
      code: `
function Demo() {
  return <JsonArea label="Tidy" pretty indent={4} defaultValue='{"name":"rui","tags":["ui","jsx"]}' />;
}`,
      view: () => <JsonArea label="Tidy" pretty indent={4} defaultValue='{"name":"rui","tags":["ui","jsx"]}' />,
      height: 150,
    },
  ],
};
