// MonthPanel and YearPanel (rui-core/dates): a year's months and a
// decade's years, picked alone, several or as a range.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Row, Stack, Text } from 'rui-core';
import { MonthPanel, YearPanel } from 'rui-core/dates';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'month-panel',
  group: 'time',
  title: 'MonthPanel and YearPanel',
  description: 'Panels at the year and decade levels (rui-core/dates): MonthPanel picks months (their 1st days), YearPanel years (their January 1st), each alone, several or as a range.',
  props: [
    { name: 'mode', type: "'single' | 'multiple' | 'range'", default: "'single'", description: 'One value, an array, or `[start, end]`.' },
    { name: 'value / defaultValue / onChange', type: "string ('YYYY-MM-01' or 'YYYY-01-01') | …", description: 'The picked value, as `mode` shapes it.' },
    { name: 'deselectable / singleDay', type: 'boolean', default: 'false', description: 'As DatePanel.' },
    { name: 'Calendar props', type: 'see Calendar', description: '`defaultPeriod`, `min`, `max`, `months`, `monthOf`, `yearOf`, `size`, `labels`, …' },
  ],
  demos: [
    {
      title: 'A month, and a range of years',
      code: `
function Demo() {
  const month = $signal($active(), '2026-09-01');
  const years = $signal($active(), ['2024-01-01', '2027-01-01']);
  return (
    <Stack gap="xs">
      <Row gap="xl" align="start">
        <MonthPanel value={month} onChange={m => $write(month, m)} defaultPeriod="2026-01-01" />
        <YearPanel mode="range" value={years} onChange={y => $write(years, y)} defaultPeriod="2026-01-01" />
      </Row>
      <Text size="sm" fg="quiet">{() => \`month: \${$read(month) ?? 'none'}; years: \${$read(years).map(y => y?.slice(0, 4) ?? '…').join(' to ')}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const month = $signal($active(), /** @type {string | null} */ ('2026-09-01'));
        const years = $signal($active(), /** @type {[string | null, string | null]} */ (['2024-01-01', '2027-01-01']));
        return (
          <Stack gap="xs">
            <Row gap="xl" align="start">
              <MonthPanel value={month} onChange={(/** @type {string | null} */ m) => $write(month, m)} defaultPeriod="2026-01-01" />
              <YearPanel mode="range" value={years} onChange={(/** @type {any} */ y) => $write(years, y)} defaultPeriod="2026-01-01" />
            </Row>
            <Text size="sm" fg="quiet">
              {() => `month: ${$read(month) ?? 'none'}; years: ${$read(years).map(y => y?.slice(0, 4) ?? '…').join(' to ')}`}
            </Text>
          </Stack>
        );
      },
      height: 280,
    },
    {
      title: 'Several months, bounded',
      code: `
function Demo() {
  return <MonthPanel mode="multiple" defaultValue={['2026-03-01', '2026-06-01']} defaultPeriod="2026-01-01" min="2026-02-01" max="2026-10-31" />;
}`,
      view: () => <MonthPanel mode="multiple" defaultValue={['2026-03-01', '2026-06-01']} defaultPeriod="2026-01-01" min="2026-02-01" max="2026-10-31" />,
      height: 250,
    },
  ],
};
