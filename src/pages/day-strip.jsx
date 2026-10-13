// DayStrip (rui-core/dates): days in a row, one chosen, turning by the
// number shown.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Stack, Text } from 'rui-core';
import { DayStrip } from 'rui-core/dates';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'day-strip',
  group: 'time',
  title: 'DayStrip',
  description: 'A few days in a row (rui-core/dates), each its weekday’s initial over its number (on a month’s 1st, the month’s name, so the strip shows where a month begins), one of them chosen. The square side controls turn by the number of days shown; the arrows move by a day, Home and End to the first and last. Each day carries its date as `datetime`.',
  props: [
    { name: 'value / defaultValue / onChange', type: "string | null ('YYYY-MM-DD')", description: 'The chosen day.' },
    { name: 'period / defaultPeriod / onPeriodChange', type: 'string', default: 'the value’s day, or today', description: 'The first day shown.' },
    { name: 'days', type: 'number', default: '7', description: 'How many days are shown.' },
    { name: 'min / max', type: 'string', description: 'The days that may be chosen (and reached).' },
    { name: 'dayOf', type: '(date) => ControlProps', description: 'A day’s state (disabled, …).' },
    { name: 'weekdayFormat / monthFormat', type: 'string', default: "'EEEEE' / 'MMM'", description: 'The small line over each number: the weekday (one letter), or on a month’s 1st the month.' },
    { name: 'markToday / today', type: "boolean / 'YYYY-MM-DD'", default: 'false / DateSettings’, else the platform’s day', description: 'Marks today with a dot under its number; `today` sets the day.' },
    { name: 'size', type: "'xs' … 'xl'", default: "'md' (36 px)", description: 'The days’ size.' },
    { name: 'labels', type: 'Partial<DatesLabels>', description: 'The words: weekday and month names, the side controls’ labels (`previousDays`, `nextDays`).' },
  ],
  demos: [
    {
      title: 'A week',
      code: `
function Demo() {
  const day = $signal($active(), '2026-09-26');
  return (
    <Stack gap="xs">
      <DayStrip value={day} onChange={d => $write(day, d)} defaultPeriod="2026-09-23" />
      <Text size="sm" fg="quiet">{() => \`chosen: \${$read(day) ?? 'none'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const day = $signal($active(), /** @type {string | null} */ ('2026-09-26'));
        return (
          <Stack gap="xs">
            <DayStrip value={day} onChange={(/** @type {string | null} */ d) => $write(day, d)} defaultPeriod="2026-09-23" />
            <Text size="sm" fg="quiet">
              {() => `chosen: ${$read(day) ?? 'none'}`}
            </Text>
          </Stack>
        );
      },
      height: 120,
    },
    {
      title: 'Five days, bounded, larger, a month’s start and today marked',
      code: `
function Demo() {
  return <DayStrip days={5} defaultPeriod="2026-09-28" min="2026-09-28" max="2026-10-12" size="lg" markToday today="2026-09-29" />;
}`,
      view: () => <DayStrip days={5} defaultPeriod="2026-09-28" min="2026-09-28" max="2026-10-12" size="lg" markToday today="2026-09-29" />,
      height: 120,
    },
  ],
};
