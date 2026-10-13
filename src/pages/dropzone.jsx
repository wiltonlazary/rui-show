// Dropzone (rui-core/dropzone): an attachments field that counts what it
// still takes, a receipt drop target in each row of a table opened through
// the handle, and the full-screen zone.

import { $signal, $read, $write } from 'rrx-core';
import { $active, For } from 'ren-core';
import { Link, Row, Stack, Table, Text } from 'rui-core';
import { $timeout } from 'rui-core/hooks';
import { Dropzone, REJECT_LABELS, imageTypes } from 'rui-core/dropzone';

/** Bytes as KB or MB. @param {number} n */
const size = n => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.round(n / 1e3)} KB`);

/** What the attachments field takes: notes as PDF, text or Markdown. */
const NOTES = ['.pdf', '.txt', '.md'];

/** The expenses whose receipts are dropped on their rows. */
const EXPENSES = [
  { what: 'Train to Porto', amount: '$42.10' },
  { what: 'Team lunch', amount: '$86.00' },
  { what: 'Printer ink', amount: '$23.45' },
];

/** An attachments field: up to three notes, each listed with a Remove link; a rejection says why in REJECT_LABELS' words. */
function Attachments() {
  const files = $signal($active(), /** @type {any[]} */ ([]));
  const problem = $signal($active(), '');
  const left = () => 3 - $read(files).length;
  const remove = (/** @type {string} */ name) => $write(files, $read(files).filter(f => f.name !== name));
  return (
    <Stack gap="xs" w={340}>
      <Text size="sm" fontWeight={600}>
        {() => `Attachments (${left()} more)`}
      </Text>
      <Dropzone
        accept={NOTES}
        maxSize={5e6}
        max={() => Math.max(1, left())}
        disabled={() => left() === 0}
        variant="soft"
        radius="sm"
        onDrop={(/** @type {any[]} */ f) => ($write(files, [...$read(files), ...f]), $write(problem, ''))}
        onReject={(/** @type {any[]} */ r) => $write(problem, `${r[0].file.name}: ${REJECT_LABELS[/** @type {'wrong-type'} */ (r[0].reasons[0])]({ accept: NOTES, maxSize: 5e6 })}`)}
      >
        <Row justify="center" py="sm">
          <Dropzone.Show when="idle">
            <Text size="sm" fg="quiet">
              {() => (left() === 0 ? 'Full: remove one to add another' : 'Drop notes here, or press to browse')}
            </Text>
          </Dropzone.Show>
          <Dropzone.Show when="valid">
            <Text size="sm" fontWeight={600}>
              Let go to attach
            </Text>
          </Dropzone.Show>
          <Dropzone.Show when="invalid">
            <Text size="sm" fontWeight={600}>
              PDF, text or Markdown only
            </Text>
          </Dropzone.Show>
        </Row>
      </Dropzone>
      <For each={files}>
        {(/** @type {() => any} */ f) => (
          <Row gap="sm" justify="between">
            <Text size="sm">{`${f().name}, ${size(f().size)}`}</Text>
            <Link size="sm" onPress={() => remove(f().name)}>
              Remove
            </Link>
          </Row>
        )}
      </For>
      <Text size="xs" fg="red">
        {() => $read(problem)}
      </Text>
    </Stack>
  );
}

/** An expense row whose last cell takes its receipt: dropped, or browsed through the handle; the upload shows the loading cover. @param {{ what: string, amount: string }} props */
function Expense(props) {
  /** @type {{ current: null | { open: () => void } }} */
  const handle = { current: null };
  const receipt = $signal($active(), '');
  const upload = $timeout((/** @type {string} */ name) => $write(receipt, name), 800);
  return (
    <Table.Row>
      <Table.Cell>{props.what}</Table.Cell>
      <Table.Cell w={80}>{props.amount}</Table.Cell>
      <Table.Cell w={230}>
        <Dropzone
          getHandle={(/** @type {{ open: () => void }} */ h) => (handle.current = h)}
          clickable={false}
          accept={[...imageTypes, '.pdf']}
          multiple={false}
          loading={() => $read(upload.value)}
          loader={{ size: 'xs' }}
          radius="sm"
          onDrop={(/** @type {any[]} */ f) => upload.start(f[0].name)}
        >
          <Row gap={4} justify="center" py={4}>
            <Text size="sm" fg="quiet">
              {() => $read(receipt) || 'Drop a receipt, or'}
            </Text>
            <Link size="sm" onPress={() => handle.current?.open()}>
              {() => ($read(receipt) ? 'replace' : 'browse')}
            </Link>
          </Row>
        </Dropzone>
      </Table.Cell>
    </Table.Row>
  );
}

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'dropzone',
  group: 'entry',
  title: 'Dropzone',
  description: 'A zone that takes files (rui-core/dropzone): dropped on it (the primitives’ `onDrop`) or picked from the platform’s file dialog on a press, checked by type, size and count. The drag states (Dropzone.Show `when` idle, valid or invalid) come from the primitives’ portable drag (`onDragEnter`, `onDragLeave`: the files’ count and MIME types), on the DOM and on the canvases alike; only a root in a worker hears no drag, and its zone stays idle until the drop.',
  props: [
    { name: 'onDrop', type: '(files: File[]) => void', description: 'The accepted files.' },
    { name: 'onReject', type: '(rejections: { file, reasons: string[] }[]) => void', description: 'The rejected ones and why, as codes (`wrong-type`, `too-large`, `too-small`, `too-many`) that `REJECT_LABELS` words.' },
    { name: 'onFiles', type: '({ accepted, rejected }) => void', description: 'Both.' },
    { name: 'accept', type: 'string[] | string', description: 'One list of MIME types (`application/pdf`, compared without parameters), families (`image/*`) and extensions (`.pdf`), or the same as comma-separated text; a file with no type matches by extension, and a list with no valid entry accepts everything.' },
    { name: 'maxSize / minSize', type: 'number', default: 'Infinity / 0', description: 'The files’ bounds, in bytes.' },
    { name: 'max / multiple', type: 'number / boolean', default: '— / true', description: 'How many files at most (the first ones are kept, those past it rejected as `too-many`; a file rejected for its type or size takes no room); several at once.' },
    { name: 'clickable', type: 'boolean', default: 'true', description: 'A press opens the file dialog.' },
    { name: 'getHandle', type: '(handle: { open }) => void', description: 'Gets the handle whose `open()` opens the dialog.' },
    { name: 'disabled / loading', type: 'boolean', default: 'false', description: 'No drops; `loading` shows a Busy cover.' },
    { name: 'onPickerOpen / onPickerCancel', type: '() => void', description: 'The dialog’s events.' },
    { name: 'onDragEnter / onDragOver / onDragLeave', type: '({ x, y, files, types }) => void', description: 'The portable drag’s events.' },
    { name: 'validColor / invalidColor / variant', type: "string / string / 'outline' | 'soft' | 'solid'", default: "'teal' / 'orange' / 'outline'", description: 'The colors a drag shows; an outline is a dashed edge in the color on the raised ground.' },
    { name: 'radius / interactive / loader', type: "… / boolean / Loader props", default: '… / true', description: 'The frame; whether controls inside take the pointer (the zone takes it while files are dragged over it, or always when false); the loader.' },
    { name: 'Dropzone.Show', type: "{ when: 'idle' | 'valid' | 'invalid', children }", description: 'Its children while the drag state is `when`: nothing dragged, files the zone takes, or files it turns away.' },
    { name: 'imageTypes / audioTypes / videoTypes / documentTypes / sheetTypes / slideTypes / archiveTypes / textTypes', type: 'readonly string[]', description: 'rui’s own set of the files an app most often takes, in eight kinds, each an accept list of MIME types (`[...imageTypes, \'.pdf\']`); `mimeTypes` maps each extension to its type.' },
    { name: 'REJECT_LABELS', type: 'Record<code, (checks) => string>', description: 'The words for each rejection code (`REJECT_LABELS[code]({ accept, maxSize, minSize })`); spread it and replace an entry to reword or translate one.' },
    { name: 'Dropzone.Screen', type: '{ active, layer, portal, … }', default: 'active true, layer LAYERS.top (50)', description: 'A zone over the viewport while files are dragged over the page.' },
  ],
  demos: [
    {
      title: 'An attachments field',
      code: `
const NOTES = ['.pdf', '.txt', '.md'];
const size = n => (n >= 1e6 ? \`\${(n / 1e6).toFixed(1)} MB\` : \`\${Math.round(n / 1e3)} KB\`);

function Demo() {
  const files = $signal($active(), []);
  const problem = $signal($active(), '');
  const left = () => 3 - $read(files).length;
  const remove = name => $write(files, $read(files).filter(f => f.name !== name));
  return (
    <Stack gap="xs" w={340}>
      <Text size="sm" fontWeight={600}>{() => \`Attachments (\${left()} more)\`}</Text>
      <Dropzone accept={NOTES} maxSize={5e6} max={() => Math.max(1, left())} disabled={() => left() === 0} variant="soft" radius="sm"
        onDrop={f => ($write(files, [...$read(files), ...f]), $write(problem, ''))}
        onReject={r => $write(problem, \`\${r[0].file.name}: \${REJECT_LABELS[r[0].reasons[0]]({ accept: NOTES, maxSize: 5e6 })}\`)}>
        <Row justify="center" py="sm">
          <Dropzone.Show when="idle">
            <Text size="sm" fg="quiet">{() => (left() === 0 ? 'Full: remove one to add another' : 'Drop notes here, or press to browse')}</Text>
          </Dropzone.Show>
          <Dropzone.Show when="valid"><Text size="sm" fontWeight={600}>Let go to attach</Text></Dropzone.Show>
          <Dropzone.Show when="invalid"><Text size="sm" fontWeight={600}>PDF, text or Markdown only</Text></Dropzone.Show>
        </Row>
      </Dropzone>
      <For each={files}>
        {f => (
          <Row gap="sm" justify="between">
            <Text size="sm">{\`\${f().name}, \${size(f().size)}\`}</Text>
            <Link size="sm" onPress={() => remove(f().name)}>Remove</Link>
          </Row>
        )}
      </For>
      <Text size="xs" fg="red">{() => $read(problem)}</Text>
    </Stack>
  );
}`,
      view: () => <Attachments />,
      height: 230,
    },
    {
      title: 'A receipt drop target in each row',
      code: `
const EXPENSES = [
  { what: 'Train to Porto', amount: '$42.10' },
  { what: 'Team lunch', amount: '$86.00' },
  { what: 'Printer ink', amount: '$23.45' },
];

function Expense(props) {
  const handle = { current: null };
  const receipt = $signal($active(), '');
  const upload = $timeout(name => $write(receipt, name), 800);
  return (
    <Table.Row>
      <Table.Cell>{props.what}</Table.Cell>
      <Table.Cell w={80}>{props.amount}</Table.Cell>
      <Table.Cell w={230}>
        <Dropzone getHandle={h => (handle.current = h)} clickable={false} accept={[...imageTypes, '.pdf']} multiple={false}
          loading={() => $read(upload.value)} loader={{ size: 'xs' }} radius="sm" onDrop={f => upload.start(f[0].name)}>
          <Row gap={4} justify="center" py={4}>
            <Text size="sm" fg="quiet">{() => $read(receipt) || 'Drop a receipt, or'}</Text>
            <Link size="sm" onPress={() => handle.current?.open()}>{() => ($read(receipt) ? 'replace' : 'browse')}</Link>
          </Row>
        </Dropzone>
      </Table.Cell>
    </Table.Row>
  );
}

function Demo() {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Heading>Expense</Table.Heading>
          <Table.Heading w={80}>Amount</Table.Heading>
          <Table.Heading w={230}>Receipt</Table.Heading>
        </Table.Row>
      </Table.Head>
      <Table.Body>{EXPENSES.map(e => <Expense {...e} />)}</Table.Body>
    </Table>
  );
}`,
      view: () => (
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Heading>Expense</Table.Heading>
              <Table.Heading w={80}>Amount</Table.Heading>
              <Table.Heading w={230}>Receipt</Table.Heading>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {EXPENSES.map(e => (
              <Expense {...e} />
            ))}
          </Table.Body>
        </Table>
      ),
      height: 320,
    },
    {
      title: 'Over the whole page',
      code: `
function Demo() {
  const count = $signal($active(), 0);
  return (
    <Stack gap="xs">
      <Text size="sm">Drag files anywhere over this page: the whole window takes them.</Text>
      <Text size="sm" fg="quiet">{() => \`\${$read(count)} files dropped\`}</Text>
      <Dropzone.Screen onDrop={f => $write(count, $read(count) + f.length)}>
        <Text size="xl" textAlign="center">Release to add them to the album</Text>
      </Dropzone.Screen>
    </Stack>
  );
}`,
      view: () => {
        const count = $signal($active(), 0);
        return (
          <Stack gap="xs">
            <Text size="sm">Drag files anywhere over this page: the whole window takes them.</Text>
            <Text size="sm" fg="quiet">
              {() => `${$read(count)} files dropped`}
            </Text>
            <Dropzone.Screen onDrop={(/** @type {any[]} */ f) => $write(count, $read(count) + f.length)}>
              <Text size="xl" textAlign="center">
                Release to add them to the album
              </Text>
            </Dropzone.Screen>
          </Stack>
        );
      },
      height: 90,
    },
  ],
};
