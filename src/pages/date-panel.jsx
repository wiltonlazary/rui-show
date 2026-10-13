// DatePanel (rui-core/dates): one date, several, a range over two months,
// and presets beside it.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Stack, Text } from 'rui-core';
import { DatePanel } from 'rui-core/dates';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'date-panel',
  group: 'time',
  title: 'DatePanel',
  description: 'A calendar that picks (rui-core/dates): one date, several, or a range drawn as one band with round ends. Values are `YYYY-MM-DD` strings; the calendar’s props all apply.',
  props: [
    { name: 'mode', type: "'single' | 'multiple' | 'range'", default: "'single'", description: 'One date, an array of them, or `[start, end]`.' },
    { name: 'value / defaultValue / onChange', type: 'string | null | string[] | [string | null, string | null]', description: 'The picked value, as `mode` shapes it; a signal passed as `value` is written back.' },
    { name: 'deselectable', type: 'boolean', default: 'false', description: 'A press on the picked date clears it (`single`).' },
    { name: 'singleDay', type: 'boolean', default: 'false', description: 'A range may start and end on the same day.' },
    { name: 'presets', type: '{ value, label }[]', description: 'Named values in a column beside the calendar.' },
    { name: 'Calendar props', type: 'see Calendar', description: '`defaultPeriod`, `months`, `min`, `max`, `exclude`, `dayOf`, `weekStart`, `size` (md), `labels`, …' },
  ],
  demos: [
    {
      title: 'One date',
      code: `
function Demo() {
  const date = $signal($active(), '2026-09-18');
  return (
    <Stack gap="xs">
      <DatePanel value={date} onChange={d => $write(date, d)} deselectable defaultPeriod="2026-09-01" />
      <Text size="sm" fg="quiet">{() => \`value: \${$read(date) ?? 'null'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const date = $signal($active(), /** @type {string | null} */ ('2026-09-18'));
        return (
          <Stack gap="xs">
            <DatePanel value={date} onChange={(/** @type {string | null} */ d) => $write(date, d)} deselectable defaultPeriod="2026-09-01" />
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(date) ?? 'null'}`}
            </Text>
          </Stack>
        );
      },
      height: 370,
    },
    {
      title: 'A range over two months',
      code: `
function Demo() {
  const range = $signal($active(), ['2026-09-24', '2026-10-06']);
  return (
    <Stack gap="xs">
      <DatePanel mode="range" months={2} value={range} onChange={r => $write(range, r)} defaultPeriod="2026-09-01" size="xs" />
      <Text size="sm" fg="quiet">{() => \`from \${$read(range)[0] ?? '…'} to \${$read(range)[1] ?? '…'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const range = $signal($active(), /** @type {[string | null, string | null]} */ (['2026-09-24', '2026-10-06']));
        return (
          <Stack gap="xs">
            <DatePanel mode="range" months={2} value={range} onChange={(/** @type {any} */ r) => $write(range, r)} defaultPeriod="2026-09-01" size="xs" />
            <Text size="sm" fg="quiet">
              {() => `from ${$read(range)[0] ?? '…'} to ${$read(range)[1] ?? '…'}`}
            </Text>
          </Stack>
        );
      },
      height: 290,
    },
    {
      title: 'Several dates, and presets',
      code: `
function Demo() {
  return (
    <Stack gap="md">
      <DatePanel mode="multiple" defaultValue={['2026-09-08', '2026-09-10', '2026-09-15']} defaultPeriod="2026-09-01" size="xs" />
      <DatePanel
        mode="range"
        defaultPeriod="2026-09-01"
        size="xs"
        presets={[
          { value: ['2026-09-21', '2026-09-27'], label: 'This week' },
          { value: ['2026-09-28', '2026-10-04'], label: 'Next week' },
          { value: ['2026-09-01', '2026-09-30'], label: 'This month' },
        ]}
      />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <DatePanel mode="multiple" defaultValue={['2026-09-08', '2026-09-10', '2026-09-15']} defaultPeriod="2026-09-01" size="xs" />
          <DatePanel
            mode="range"
            defaultPeriod="2026-09-01"
            size="xs"
            presets={[
              { value: ['2026-09-21', '2026-09-27'], label: 'This week' },
              { value: ['2026-09-28', '2026-10-04'], label: 'Next week' },
              { value: ['2026-09-01', '2026-09-30'], label: 'This month' },
            ]}
          />
        </Stack>
      ),
      height: 560,
    },
  ],
};
