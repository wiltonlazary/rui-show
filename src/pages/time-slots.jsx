// TimeSlots (rui-core/dates): time slots in a grid, some disabled, in 12
// hours.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Stack, Text } from 'rui-core';
import { TimeSlots, timeRange } from 'rui-core/dates';

const SLOTS = timeRange('09:00', '12:00', 30);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'time-slots',
  group: 'time',
  title: 'TimeSlots',
  description: 'Time slots in a grid to press one of (rui-core/dates). `timeRange` makes the slots; some can be disabled, and the arrows move between them. Each slot carries its time as `datetime`.',
  props: [
    { name: 'data', type: 'string[]', description: 'The times, `HH:mm` or `HH:mm:ss` (`timeRange(from, to, minutes)` makes them, every that many minutes).' },
    { name: 'value / defaultValue / onChange', type: 'string | null', description: 'The time pressed, as given in `data`.' },
    { name: 'format', type: "'24h' | '12h'", default: "'24h'", description: 'How the times read.' },
    { name: 'seconds', type: 'boolean', default: 'false', description: 'Shows the seconds.' },
    { name: 'periods', type: '{ am, pm }', description: 'The 12-hour labels.' },
    { name: 'min / max', type: 'string', description: 'Slots outside are disabled.' },
    { name: 'exclude', type: 'string[] | ((time) => boolean)', description: 'Slots disabled.' },
    { name: 'deselectable', type: 'boolean', default: 'false', description: 'A press on the value deselects it: it clears.' },
    { name: 'grid', type: 'Tiles props', default: "{ columns: 4, gap: 'sm' }", description: 'The grid.' },
    { name: 'timeOf', type: '(time) => props', description: 'A slot’s props.' },
    { name: 'size / radius / color', type: "'xs' … 'xl' / … / string", description: 'The slots’ look.' },
  ],
  demos: [
    {
      title: 'Half-hour slots, some taken',
      code: `
const SLOTS = timeRange('09:00', '12:00', 30);

function Demo() {
  const slot = $signal($active(), '10:00:00');
  return (
    <Stack gap="xs" w={360}>
      <TimeSlots data={SLOTS} value={slot} onChange={v => $write(slot, v)} exclude={['09:30:00', '11:00:00']} deselectable />
      <Text size="sm" fg="quiet">{() => \`booked: \${$read(slot) ?? 'none'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const slot = $signal($active(), /** @type {string | null} */ ('10:00:00'));
        return (
          <Stack gap="xs" w={360}>
            <TimeSlots data={SLOTS} value={slot} onChange={(/** @type {string | null} */ v) => $write(slot, v)} exclude={['09:30:00', '11:00:00']} deselectable />
            <Text size="sm" fg="quiet">
              {() => `booked: ${$read(slot) ?? 'none'}`}
            </Text>
          </Stack>
        );
      },
      height: 180,
    },
    {
      title: 'Lunch hours in 12-hour time, five columns, teal',
      code: `
function Demo() {
  return <TimeSlots w={560} data={timeRange('11:00', '14:30', 30)} format="12h" grid={{ columns: 5, gap: 6 }} color="teal" radius="xl" defaultValue="12:30:00" />;
}`,
      view: () => <TimeSlots w={560} data={timeRange('11:00', '14:30', 30)} format="12h" grid={{ columns: 5, gap: 6 }} color="teal" radius="xl" defaultValue="12:30:00" />,
      height: 110,
    },
  ],
};
