// FileInput: a field whose press opens the file dialog; one file or
// several, clearable, by type.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { FileInput, Row, Stack, Text } from 'rui-core';

/** The meter photos, counted instead of named. @param {{ value: any }} props */
const count = ({ value }) => `${value.length} photo${value.length === 1 ? '' : 's'} of the meters`;

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'file-input',
  group: 'entry',
  title: 'FileInput',
  description: 'A field whose press (or Enter, Space) opens the platform’s file dialog (through FileButton): it shows the picked file’s name, or a count for several (`2 files`). The dialog is the browser’s, where a DOM document is on the thread (ren-dom, or a canvas in the page); in a worker the field stays inert.',
  props: [
    { name: 'value / defaultValue', type: 'File | File[] | null', description: 'The file (with `multiple`, a non-empty list); null when empty, in every mode. Controlled with `onChange`, or uncontrolled.' },
    { name: 'onChange', type: '(value: File | File[] | null) => void', description: 'Called with the file picked (or the list), or null when cleared; a dialog closed with no file changes nothing.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Several files at once.' },
    { name: 'accept', type: 'string', description: 'The types the dialog offers: MIME types and extensions (`image/png,.pdf`).' },
    { name: 'capture', type: "boolean | 'user' | 'environment'", description: 'A camera instead of the files, where the platform has one.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button while it holds a file and is neither disabled nor read-only; a clear sets null.' },
    { name: 'renderValue', type: '(props: { value }) => any', description: 'Renders the value while it holds files (by default one file’s name, or `countText` for several).' },
    { name: 'countText', type: '(n: number) => string', default: 'n => `${n} files`', description: 'The text for two or more files, for other languages.' },
    { name: 'picker', type: 'FileButton props', description: 'The FileButton’s options (`document` among them).' },
    { name: 'others', type: 'Input props', description: '`label`, `description`, `error`, `invalid`, `required`, `asterisk`, `placeholder`, `size`, `radius`, `variant`, `disabled`, `readOnly`, `start`, `end`, `fieldStyle`.' },
  ],
  demos: [
    {
      title: 'A signed lease',
      code: `
function Demo() {
  const file = $signal($active(), null);
  return (
    <Row gap="lg" align="start">
      <FileInput label="Lease agreement" description="The signed copy, as a PDF" placeholder="Attach the lease" accept="application/pdf" clearable w={260} value={() => $read(file)} onChange={f => $write(file, f)} />
      <Text size="sm" fg="quiet" mt={48}>{() => \`picked: \${$read(file)?.name ?? 'none'}\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const file = $signal($active(), /** @type {any} */ (null));
        return (
          <Row gap="lg" align="start">
            <FileInput label="Lease agreement" description="The signed copy, as a PDF" placeholder="Attach the lease" accept="application/pdf" clearable w={260} value={() => $read(file)} onChange={(/** @type {any} */ f) => $write(file, f)} />
            <Text size="sm" fg="quiet" mt={48}>
              {() => `picked: ${$read(file)?.name ?? 'none'}`}
            </Text>
          </Row>
        );
      },
      height: 110,
    },
    {
      title: 'A move-in checklist: several photos counted, and the states',
      code: `
const count = ({ value }) => \`\${value.length} photo\${value.length === 1 ? '' : 's'} of the meters\`;

function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="sm" align="start">
        <FileInput label="Meter readings" placeholder="Snap each meter" accept="image/*,.heic" multiple clearable renderValue={count} w={230} />
        <FileInput label="Proof of address" placeholder="A bill or a bank letter" error="Needed before the keys are handed over" w={230} />
      </Row>
      <FileInput label="Deposit receipt" description="Issued once the lease is countersigned" placeholder="Not issued yet" disabled w={230} />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="sm" align="start">
            <FileInput label="Meter readings" placeholder="Snap each meter" accept="image/*,.heic" multiple clearable renderValue={count} w={230} />
            <FileInput label="Proof of address" placeholder="A bill or a bank letter" error="Needed before the keys are handed over" w={230} />
          </Row>
          <FileInput label="Deposit receipt" description="Issued once the lease is countersigned" placeholder="Not issued yet" disabled w={230} />
        </Stack>
      ),
      height: 210,
    },
  ],
};
