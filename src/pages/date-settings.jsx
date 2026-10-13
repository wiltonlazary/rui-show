// DateSettings (rui-core/dates): settings for every date component inside.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Stack } from 'rui-core';
import { DateSettings, Calendar, DayStrip } from 'rui-core/dates';

const PT = {
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthsAbbr: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  weekdays: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  weekdaysAbbr: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  weekdaysNarrow: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
};

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'date-settings',
  group: 'time',
  title: 'DateSettings',
  description: 'Settings for every date component inside it (rui-core/dates): the first day of the week, the weekend days, six weeks in every month, the words, and the day that counts as today, each a prop that takes a value or an accessor (a change restyles the components in place). A component’s own props win over them.',
  props: [
    { name: 'weekStart', type: 'number | (() => number)', default: '1', description: '0 Sunday to 6 Saturday.' },
    { name: 'weekend', type: 'number[] | (() => number[])', default: '[0, 6]', description: 'Days drawn in the quiet text color.' },
    { name: 'sixWeeks', type: 'boolean | (() => boolean)', default: 'false', description: 'Six weeks in every month.' },
    { name: 'labels', type: 'Partial<DatesLabels> | (() => …)', description: 'The words over the English ones: `months`, `monthsAbbr`, `weekdays` (in each day’s full name), `weekdaysAbbr` (the calendar’s header), `weekdaysNarrow` (one letter each, DayStrip’s), `week` (the week numbers’ heading, ‘Wk’) and the controls’ labels.' },
    { name: 'today', type: "string ('YYYY-MM-DD') | (() => string)", default: 'the platform’s day', description: 'What `markToday` marks and pickers open on.' },
    { name: 'children', type: 'any', description: 'The date components it sets.' },
  ],
  demos: [
    {
      title: 'Portuguese words, Saturday first, a Friday–Saturday weekend, six weeks, a fixed today',
      code: `
const PT = {
  months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthsAbbr: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  weekdays: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  weekdaysAbbr: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  weekdaysNarrow: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
};

function Demo() {
  return (
    <DateSettings weekStart={6} weekend={[5, 6]} sixWeeks today="2026-09-26" labels={PT}>
      <Row gap="xl" align="start">
        <Calendar markToday size="xs" />
        <DayStrip days={4} size="xs" />
      </Row>
    </DateSettings>
  );
}`,
      view: () => (
        <DateSettings weekStart={6} weekend={[5, 6]} sixWeeks today="2026-09-26" labels={PT}>
          <Row gap="xl" align="start">
            <Calendar markToday size="xs" />
            <DayStrip days={4} size="xs" />
          </Row>
        </DateSettings>
      ),
      height: 280,
    },
    {
      title: 'A component’s own props win',
      code: `
function Demo() {
  return (
    <DateSettings weekStart={0} labels={PT}>
      <Calendar defaultPeriod="2026-09-01" weekStart={1} labels={{ months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] }} size="xs" />
    </DateSettings>
  );
}`,
      view: () => (
        <DateSettings weekStart={0} labels={PT}>
          <Calendar
            defaultPeriod="2026-09-01"
            weekStart={1}
            labels={{ months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] }}
            size="xs"
          />
        </DateSettings>
      ),
      height: 250,
    },
    {
      title: 'Settings that change',
      code: `
function Demo() {
  const pt = $signal($active(), true);
  return (
    <Stack gap="sm" align="start">
      <Button size="xs" variant="soft" onPress={() => $write(pt, !$read(pt))}>Switch the language</Button>
      <DateSettings weekStart={() => ($read(pt) ? 0 : 1)} labels={() => ($read(pt) ? PT : {})}>
        <Calendar defaultPeriod="2026-09-01" size="xs" />
      </DateSettings>
    </Stack>
  );
}`,
      view: () => {
        const pt = $signal($active(), true);
        return (
          <Stack gap="sm" align="start">
            <Button size="xs" variant="soft" onPress={() => $write(pt, !$read(pt))}>Switch the language</Button>
            <DateSettings weekStart={() => ($read(pt) ? 0 : 1)} labels={() => ($read(pt) ? PT : {})}>
              <Calendar defaultPeriod="2026-09-01" size="xs" />
            </DateSettings>
          </Stack>
        );
      },
      height: 300,
    },
  ],
};
