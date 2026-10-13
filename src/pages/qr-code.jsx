// QrCode (rui-core/more): a QR code drawn with Shape, sizes, levels, colors.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Row, Stack, Text, TextInput } from 'rui-core';
import { QrCode } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'qr-code',
  group: 'data',
  title: 'QrCode',
  description: 'A QR code (rui-core/more) encoded by rui-core’s own encoder (byte mode, UTF-8, Reed–Solomon error correction, the lowest-penalty mask) and drawn with the portable Shape: no canvas or SVG of its own.',
  props: [
    { name: 'value', type: 'string', description: 'What it encodes.' },
    { name: 'level', type: "'L' | 'M' | 'Q' | 'H'", default: "'M'", description: 'Error correction: 7 %, 15 %, 25 % or 30 % of the code can be lost.' },
    { name: 'size', type: 'number', default: 'sizes.box.qr (160)', description: 'The side in pixels (modules are whole pixels where it allows).' },
    { name: 'quietZone', type: 'number', default: '4', description: 'The margin, in modules.' },
    { name: 'color / bg', type: 'string', default: "'#000000' / '#ffffff'", description: 'The dark modules and the background.' },
    { name: 'versions', type: '[number, number]', default: '[1, 40]', description: 'The least and greatest version (size) used.' },
    { name: 'raise', type: 'boolean', default: 'false', description: 'Lifts the level while the chosen version still holds the value.' },
    { name: 'mask', type: 'number', description: 'Forces a mask pattern (0 to 7).' },
    { name: 'onEncode', type: '(matrix) => void', description: 'Hears the encoded matrix.' },
  ],
  demos: [
    {
      title: 'A link, typed',
      code: `
function Demo() {
  const value = $signal($active(), 'https://example.com');
  return (
    <Row gap="lg" align="start">
      <QrCode value={() => $read(value)} size={140} />
      <Stack gap="xs" w={320}>
        <TextInput label="Value" value={value} onChange={e => $write(value, e.currentTarget?.value ?? e.value ?? e)} />
        <Text size="sm" fg="quiet">{() => \`\${$read(value).length} characters\`}</Text>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const value = $signal($active(), 'https://example.com');
        return (
          <Row gap="lg" align="start">
            <QrCode value={() => $read(value)} size={140} />
            <Stack gap="xs" w={320}>
              <TextInput label="Value" value={value} onChange={(/** @type {any} */ e) => $write(value, e.currentTarget?.value ?? e.value ?? e)} />
              <Text size="sm" fg="quiet">
                {() => `${$read(value).length} characters`}
              </Text>
            </Stack>
          </Row>
        );
      },
      height: 180,
    },
    {
      title: 'Levels and colors',
      code: `
function Demo() {
  return (
    <Row gap="lg">
      <QrCode value="rui" level="L" size={100} />
      <QrCode value="rui" level="H" size={100} />
      <QrCode value="rui" size={100} color="#24579c" bg="#f5faff" quietZone={2} />
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg">
          <QrCode value="rui" level="L" size={100} />
          <QrCode value="rui" level="H" size={100} />
          <QrCode value="rui" size={100} color="#24579c" bg="#f5faff" quietZone={2} />
        </Row>
      ),
      height: 130,
    },
  ],
};
