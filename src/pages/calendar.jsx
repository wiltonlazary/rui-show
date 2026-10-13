// Calendar (rui-core/dates): a month that selects nothing by itself,
// open seats drawn through renderDay and pressed through dayOf, views, and
// two months with week numbers.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Box, Row, Stack, Text } from 'rui-core';
import { Calendar } from 'rui-core/dates';

/** A class's seats, and the seats still open on each evening it meets. */
const SEATS = 8;
/** @type {Record<string, number>} */
const OPEN = { '2026-10-02': 5, '2026-10-06': 0, '2026-10-09': 2, '2026-10-13': 8, '2026-10-16': 1, '2026-10-20': 6, '2026-10-23': 0, '2026-10-27': 3, '2026-10-30': 7 };

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'calendar',
  group: 'time',
  title: 'Calendar',
  description: 'rui-core/dates’ base: a month (or a year’s months, a decade’s years) that shows and moves but selects nothing by itself; `dayOf(date)` gives each day its state and press. Dates are `YYYY-MM-DD` strings, with date arithmetic of rui-core’s own. The arrows, Home, End and Page keys move among the days; the header’s back and forward controls move by `monthsPerMove`. Each day is named by its full date (Tuesday, 29 September 2026) and carries its date as `datetime` (a month `YYYY-MM`, a year `YYYY`), and its Data is a record per week keyed by the weekdays. The year and decade grids are named by their header (‘2026’, ‘2020…2029’).',
  props: [
    { name: 'period / defaultPeriod / onPeriodChange', type: "string ('YYYY-MM-DD')", default: 'today', description: 'The month (year, decade) shown first.' },
    { name: 'view / defaultView / onViewChange', type: "'month' | 'year' | 'decade'", default: "'month'", description: 'What it shows: a month’s days, a year’s months, or a decade’s years in four rows of three (the year before and after it quiet); the header goes up a view.' },
    { name: 'minView / maxView', type: "'month' | 'year' | 'decade'", default: "'month' / 'decade'", description: 'The views it may show.' },
    { name: 'months', type: 'number', default: '1', description: 'Months side by side.' },
    { name: 'monthsPerMove', type: 'number', default: 'months', description: 'How many the arrows move.' },
    { name: 'min / max', type: 'string', description: 'The days that may be pressed.' },
    { name: 'exclude', type: '(date: string) => boolean', description: 'Days that may not be pressed.' },
    { name: 'dayOf', type: '(date) => { selected, span, disabled, onPress, … }', description: 'Each day’s state and press.' },
    { name: 'monthOf / yearOf', type: '(date) => ControlProps', description: 'The same for the year and decade views.' },
    { name: 'onDayPress / onMonthPress / onYearPress', type: '(date: string) => void', description: 'Called on a press on each view.' },
    { name: 'renderDay', type: '(date: string) => any', description: 'A day’s content.' },
    { name: 'weekStart', type: 'number', default: '1', description: '0 Sunday to 6 Saturday.' },
    { name: 'weekend', type: 'number[]', default: '[0, 6]', description: 'Days drawn in the quiet text color.' },
    { name: 'sixWeeks', type: 'boolean', default: 'false', description: 'Six weeks in every month.' },
    { name: 'outside / weekdays', type: 'boolean', default: 'true', description: 'Other months’ days; the weekday names.' },
    { name: 'weekNumbers', type: 'boolean', default: 'false', description: 'ISO week numbers in a column headed ‘Wk’ (`labels.week`).' },
    { name: 'markToday / today', type: 'boolean / string', default: 'false / the platform’s day', description: 'Marks today with a dot under its number; `today` sets the day.' },
    { name: 'inert', type: 'boolean', default: 'false', description: 'No presses and no keys.' },
    { name: 'monthFormat / yearFormat / decadeFormat / monthCellFormat / yearCellFormat / weekdayFormat', type: 'string', default: "'MMM YYYY' / 'YYYY' / 'YYYY' / 'MMM' / 'YYYY' / 'EEE'", description: 'formatDate’s tokens for each label; a decade reads as its two ends, YYYY…YYYY; the weekday header reads abbreviated names (Mon), `EEEEE` one letter.' },
    { name: 'labels', type: 'Partial<DatesLabels>', description: 'The words: month and weekday names, the controls’ labels, the week numbers’ heading (`week`, ‘Wk’).' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Days of 28 to 48 px (36 at md).' },
    { name: 'radius / color', type: "'xs' … 'xl' | number / string", description: 'The controls’ radius and the selected color.' },
  ],
  demos: [
    {
      title: 'Open seats drawn in each day, pressed through dayOf',
      code: `
const SEATS = 8;
const OPEN = { '2026-10-02': 5, '2026-10-06': 0, '2026-10-09': 2, '2026-10-13': 8, '2026-10-16': 1, '2026-10-20': 6, '2026-10-23': 0, '2026-10-27': 3, '2026-10-30': 7 };

function Demo() {
  const picked = $signal($active(), '');
  const day = date => (
    <Stack gap={2} align="center">
      <Text size="sm">{String(Number(date.slice(8)))}</Text>
      <Box w={OPEN[date] ? OPEN[date] * 3 : 0} h={3} bg="amber" style={{ radius: 1 }} />
    </Stack>
  );
  const dayOf = date => (OPEN[date] ? { selected: $read(picked) === date, onPress: () => $write(picked, date) } : { disabled: true });
  return (
    <Row gap="lg" align="start">
      <Calendar defaultPeriod="2026-10-01" size="lg" dayOf={dayOf} renderDay={day} />
      <Stack gap={4} w={170}>
        <Text size="sm" fontWeight={600}>Wheel throwing, 6 pm</Text>
        <Text size="sm" fg="quiet">The bar under a day is its open seats; full evenings and days without a class stay dim.</Text>
        <Text size="sm">{() => ($read(picked) === '' ? 'No evening picked' : \`\${$read(picked)}: \${OPEN[$read(picked)]} of \${SEATS} seats open\`)}</Text>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const picked = $signal($active(), '');
        const day = (/** @type {string} */ date) => (
          <Stack gap={2} align="center">
            <Text size="sm">{String(Number(date.slice(8)))}</Text>
            <Box w={OPEN[date] ? OPEN[date] * 3 : 0} h={3} bg="amber" style={{ radius: 1 }} />
          </Stack>
        );
        const dayOf = (/** @type {string} */ date) => (OPEN[date] ? { selected: $read(picked) === date, onPress: () => $write(picked, date) } : { disabled: true });
        return (
          <Row gap="lg" align="start">
            <Calendar defaultPeriod="2026-10-01" size="lg" dayOf={dayOf} renderDay={day} />
            <Stack gap={4} w={170}>
              <Text size="sm" fontWeight={600}>
                Wheel throwing, 6 pm
              </Text>
              <Text size="sm" fg="quiet">
                The bar under a day is its open seats; full evenings and days without a class stay dim.
              </Text>
              <Text size="sm">{() => ($read(picked) === '' ? 'No evening picked' : `${$read(picked)}: ${OPEN[$read(picked)]} of ${SEATS} seats open`)}</Text>
            </Stack>
          </Row>
        );
      },
      height: 380,
    },
    {
      title: 'Two months, week numbers, Sunday first',
      code: `
function Demo() {
  return <Calendar defaultPeriod="2026-09-01" months={2} weekNumbers weekStart={0} markToday today="2026-09-26" size="xs" />;
}`,
      view: () => <Calendar defaultPeriod="2026-09-01" months={2} weekNumbers weekStart={0} markToday today="2026-09-26" size="xs" />,
      height: 280,
    },
    {
      title: 'Views, held by a signal',
      code: `
function Demo() {
  const view = $signal($active(), 'year');
  return (
    <Stack gap="xs">
      <Calendar defaultPeriod="2026-09-01" view={view} onViewChange={v => $write(view, v)} />
      <Text size="sm" fg="quiet">{() => \`view: \${$read(view)} (press the header to go up, a month to go down)\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const view = $signal($active(), 'year');
        return (
          <Stack gap="xs">
            <Calendar defaultPeriod="2026-09-01" view={view} onViewChange={(/** @type {string} */ v) => $write(view, v)} />
            <Text size="sm" fg="quiet">
              {() => `view: ${$read(view)} (press the header to go up, a month to go down)`}
            </Text>
          </Stack>
        );
      },
      height: 380,
    },
  ],
};
