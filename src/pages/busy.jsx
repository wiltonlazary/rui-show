// Busy: a loader over a card while it refreshes, and its backdrop and
// loader styled.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Busy, Box, Button, Card, Row, Stack, Table, Text } from 'rui-core';

const SHIPMENTS = {
  columns: ['Order', 'City', 'Items', 'Status'],
  rows: [
    ['#4102', 'Porto', '3', 'Packed'],
    ['#4103', 'Oslo', '1', 'On the way'],
    ['#4104', 'Quito', '5', 'Placed'],
    ['#4105', 'Nairobi', '2', 'Delivered'],
  ],
};

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'busy',
  group: 'layers',
  title: 'Busy',
  description: 'A Loader centered over its parent on a translucent backdrop of the page’s color, while `shown`; it fades in and out on the Clock (the `quick` preset by default).',
  props: [
    { name: 'shown', type: 'boolean | () => boolean', default: 'false', description: 'Whether it shows.' },
    { name: 'backdrop', type: 'boolean | { color, opacity, radius }', default: 'true', description: 'The backdrop’s look: the page’s body color at the theme’s opacity.muted (.7) by default; `false` for none.' },
    { name: 'loader', type: '{ kind, color, size }', description: 'The Loader’s props (`ring`, `bars` or `dots`; the accent color by default).' },
    { name: 'motion', type: "'quick' | 'base' | 'calm' | { duration, exit, easing }", default: "'quick' (110 ms)", description: "The fade: a preset’s name, or `duration` in ms (0: at once), `exit` for the closing (the duration by default), `easing` ('linear', 'ease', 'ease-in', 'ease-out' (default), 'ease-in-out', 'settle' or a function)." },
    { name: 'layer', type: 'number', default: 'LAYERS.raised (10)', description: 'Its stacking order: over its own container.' },
    { name: 'style props', type: 'm, p, w, …', description: 'As Box, on the covering box.' },
  ],
  demos: [
    {
      title: 'Dots over a refreshing card',
      code: `
function Demo() {
  const busy = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Row gap="sm">
        <Button onPress={() => $write(busy, !$read(busy))}>Refresh the forecast</Button>
        <Text size="sm" fg="quiet">{() => ($read(busy) ? 'refreshing' : 'up to date')}</Text>
      </Row>
      <Card bordered w={320}>
        <Busy shown={busy} loader={{ kind: 'dots' }} />
        <Text fontWeight={700}>Lisbon, tomorrow</Text>
        <Text size="sm" fg="quiet">Sunny spells, a light breeze from the west</Text>
        <Text size="xl">24° / 17°</Text>
      </Card>
    </Stack>
  );
}`,
      view: () => {
        const busy = $signal($active(), true);
        return (
          <Stack gap="sm">
            <Row gap="sm">
              <Button onPress={() => $write(busy, !$read(busy))}>Refresh the forecast</Button>
              <Text size="sm" fg="quiet">
                {() => ($read(busy) ? 'refreshing' : 'up to date')}
              </Text>
            </Row>
            <Card bordered w={320}>
              <Busy shown={busy} loader={{ kind: 'dots' }} />
              <Text fontWeight={700}>Lisbon, tomorrow</Text>
              <Text size="sm" fg="quiet">
                Sunny spells, a light breeze from the west
              </Text>
              <Text size="xl">24° / 17°</Text>
            </Card>
          </Stack>
        );
      },
      height: 190,
    },
    {
      title: 'A ring over a table',
      code: `
const SHIPMENTS = {
  columns: ['Order', 'City', 'Items', 'Status'],
  rows: [
    ['#4102', 'Porto', '3', 'Packed'],
    ['#4103', 'Oslo', '1', 'On the way'],
    ['#4104', 'Quito', '5', 'Placed'],
    ['#4105', 'Nairobi', '2', 'Delivered'],
  ],
};

function Demo() {
  const busy = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Row gap="sm">
        <Button variant="neutral" onPress={() => $write(busy, !$read(busy))}>{() => ($read(busy) ? 'Stop loading' : 'Load the next page')}</Button>
      </Row>
      <Box w={420}>
        <Table density="tight" data={SHIPMENTS} />
        <Busy shown={busy} loader={{ kind: 'ring' }} />
      </Box>
    </Stack>
  );
}`,
      view: () => {
        const busy = $signal($active(), true);
        return (
          <Stack gap="sm">
            <Row gap="sm">
              <Button variant="neutral" onPress={() => $write(busy, !$read(busy))}>
                {() => ($read(busy) ? 'Stop loading' : 'Load the next page')}
              </Button>
            </Row>
            <Box w={420}>
              <Table density="tight" data={SHIPMENTS} />
              <Busy shown={busy} loader={{ kind: 'ring' }} />
            </Box>
          </Stack>
        );
      },
      height: 200,
    },
  ],
};
