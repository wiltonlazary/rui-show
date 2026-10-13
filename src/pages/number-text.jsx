// NumberText: a number written with a prefix, marks and decimals.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, NumberText, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'number-text',
  group: 'text',
  title: 'NumberText',
  description: 'A number as text: a prefix and suffix, group and decimal marks (a locale’s, or given), decimals (fixed or at most), and the sign kept or dropped. A plain Label, so every renderer shows the same string.',
  props: [
    { name: 'value', type: 'number | string', description: 'The number; empty shows nothing, a non-number shows as it is.' },
    { name: 'prefix', type: 'string', description: 'Text before the number, after the sign.' },
    { name: 'suffix', type: 'string', description: 'Text after the number.' },
    { name: 'locale', type: 'string', default: 'the platform’s', description: 'A BCP 47 tag (`de-DE`) whose group and decimal marks it takes.' },
    { name: 'groupMark', type: 'boolean | string', description: '`true` groups thousands with the locale’s mark; a string groups them with it.' },
    { name: 'decimalMark', type: 'string', default: 'the locale’s', description: 'The mark before the decimals.' },
    { name: 'decimals', type: 'number', description: 'Digits after the mark, at most (rounded).' },
    { name: 'fixedDecimals', type: 'boolean', default: 'false', description: 'Always `decimals` digits, with trailing zeros.' },
    { name: 'negative', type: 'boolean', default: 'true', description: '`false` drops the sign.' },
  ],
  demos: [
    {
      title: 'A price, a count and a percent',
      code: `
function Demo() {
  return (
    <Stack gap="xs">
      <NumberText value={1249.9} prefix="€ " locale="de-DE" groupMark decimals={2} fixedDecimals />
      <NumberText value={3840000} groupMark suffix=" visitors" />
      <NumberText value={12.5} suffix=" %" decimals={1} />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          <NumberText value={1249.9} prefix="€ " locale="de-DE" groupMark decimals={2} fixedDecimals />
          <NumberText value={3840000} groupMark suffix=" visitors" />
          <NumberText value={12.5} suffix=" %" decimals={1} />
        </Stack>
      ),
      height: 110,
    },
    {
      title: 'Decimals and sign',
      code: `
function Demo() {
  return (
    <Stack gap="xs">
      <Row gap="xs"><Text fg="quiet" w={180}>decimals 2</Text><NumberText value={7.4861} decimals={2} /></Row>
      <Row gap="xs"><Text fg="quiet" w={180}>at most 2</Text><NumberText value={2.5} decimals={2} /></Row>
      <Row gap="xs"><Text fg="quiet" w={180}>fixed 2</Text><NumberText value={2.5} decimals={2} fixedDecimals /></Row>
      <Row gap="xs"><Text fg="quiet" w={180}>negative</Text><NumberText value={-1500} groupMark suffix=" m" /></Row>
      <Row gap="xs"><Text fg="quiet" w={180}>negative false</Text><NumberText value={-1500} groupMark suffix=" m" negative={false} /></Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          <Row gap="xs">
            <Text fg="quiet" w={180}>
              decimals 2
            </Text>
            <NumberText value={7.4861} decimals={2} />
          </Row>
          <Row gap="xs">
            <Text fg="quiet" w={180}>
              at most 2
            </Text>
            <NumberText value={2.5} decimals={2} />
          </Row>
          <Row gap="xs">
            <Text fg="quiet" w={180}>
              fixed 2
            </Text>
            <NumberText value={2.5} decimals={2} fixedDecimals />
          </Row>
          <Row gap="xs">
            <Text fg="quiet" w={180}>
              negative
            </Text>
            <NumberText value={-1500} groupMark suffix=" m" />
          </Row>
          <Row gap="xs">
            <Text fg="quiet" w={180}>
              negative false
            </Text>
            <NumberText value={-1500} groupMark suffix=" m" negative={false} />
          </Row>
        </Stack>
      ),
      height: 180,
    },
    {
      title: 'A live value',
      code: `
function Demo() {
  const value = $signal($active(), 1234.5);
  return (
    <Stack gap="sm" align="start">
      <Row gap="xs">
        <Button size="xs" onPress={() => $write(value, $read(value) * 10)}>× 10</Button>
        <Button size="xs" variant="soft" onPress={() => $write(value, -$read(value))}>Negate</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(value, 1234.5)}>Reset</Button>
      </Row>
      <NumberText value={() => $read(value)} groupMark decimals={2} fixedDecimals suffix=" pts" fontSize="xl" fontWeight="bold" />
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), 1234.5);
        return (
          <Stack gap="sm" align="start">
            <Row gap="xs">
              <Button size="xs" onPress={() => $write(value, $read(value) * 10)}>
                × 10
              </Button>
              <Button size="xs" variant="soft" onPress={() => $write(value, -$read(value))}>
                Negate
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(value, 1234.5)}>
                Reset
              </Button>
            </Row>
            <NumberText value={() => $read(value)} groupMark decimals={2} fixedDecimals suffix=" pts" fontSize="xl" fontWeight="bold" />
          </Stack>
        );
      },
      height: 100,
    },
  ],
};
