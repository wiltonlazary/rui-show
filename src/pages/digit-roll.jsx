// DigitRoll: digits that roll, as an odometer, to each new value.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, DigitRoll, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'digit-roll',
  group: 'text',
  title: 'DigitRoll',
  description: 'A number whose digit columns roll to each new value, as an odometer (a column turns while the ones below it roll over), with NumberText’s prefix, suffix and separators. Frames come from the Clock context, so the same frame shows on every renderer.',
  props: [
    { name: 'value', type: 'number', default: '0', description: 'The number; a change rolls to it.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'calm' (300)", description: 'How long a roll takes: ms or a motion preset.' },
    { name: 'easing', type: "'settle' | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | ((t: number) => number)", default: "'settle'", description: 'The roll’s curve: rui’s `settle` lands most of the way early, then gently; a curve name or function.' },
    { name: 'fontSize', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Font size; each digit column is `theme.lineHeights.xs` (1.3) times as high.' },
    { name: 'prefix, suffix', type: 'string', description: 'Text before and after the number, as NumberText.' },
    { name: 'locale', type: 'string', default: 'the platform’s', description: 'A BCP 47 tag whose group and decimal marks the number takes, as NumberText.' },
    { name: 'groupMark', type: 'boolean | string', description: 'Groups thousands: true for the locale’s mark, or a mark as given.' },
    { name: 'decimalMark', type: 'string', default: 'the locale’s', description: 'The separator before the decimals.' },
    { name: 'decimals', type: 'number', default: '0', description: 'Decimal digits; each rolls as a column too.' },
    { name: 'negative', type: 'boolean', default: 'true', description: '`false` drops the sign.' },
  ],
  demos: [
    {
      title: 'A counter',
      code: `
function Demo() {
  const value = $signal($active(), 1234);
  return (
    <Stack gap="sm" align="start">
      <Row gap="xs">
        <Button size="xs" onPress={() => $write(value, $read(value) + 1)}>+1</Button>
        <Button size="xs" onPress={() => $write(value, $read(value) + 25)}>+25</Button>
        <Button size="xs" variant="soft" onPress={() => $write(value, $read(value) - 10)}>-10</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(value, $read(value) + 1000)}>+1000</Button>
      </Row>
      <DigitRoll value={() => $read(value)} groupMark fontSize={40} />
      <Text size="sm" fg="quiet">{() => \`value \${$read(value)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), 1234);
        return (
          <Stack gap="sm" align="start">
            <Row gap="xs">
              <Button size="xs" onPress={() => $write(value, $read(value) + 1)}>
                +1
              </Button>
              <Button size="xs" onPress={() => $write(value, $read(value) + 25)}>
                +25
              </Button>
              <Button size="xs" variant="soft" onPress={() => $write(value, $read(value) - 10)}>
                -10
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(value, $read(value) + 1000)}>
                +1000
              </Button>
            </Row>
            <DigitRoll value={() => $read(value)} groupMark fontSize={40} />
            <Text size="sm" fg="quiet">
              {() => `value ${$read(value)}`}
            </Text>
          </Stack>
        );
      },
      height: 140,
    },
    {
      title: 'A price, slower',
      code: `
function Demo() {
  const price = $signal($active(), 19.99);
  return (
    <Row align="center">
      <DigitRoll value={() => $read(price)} prefix="$" decimals={2} fontSize="xl" duration={1200} easing="ease-out" />
      <Button size="xs" variant="soft" onPress={() => $write(price, $read(price) === 19.99 ? 24.5 : 19.99)}>Change the price</Button>
    </Row>
  );
}`,
      view: () => {
        const price = $signal($active(), 19.99);
        return (
          <Row align="center">
            <DigitRoll value={() => $read(price)} prefix="$" decimals={2} fontSize="xl" duration={1200} easing="ease-out" />
            <Button size="xs" variant="soft" onPress={() => $write(price, $read(price) === 19.99 ? 24.5 : 19.99)}>
              Change the price
            </Button>
          </Row>
        );
      },
      height: 60,
    },
  ],
};
