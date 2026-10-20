// BarChart (rui-core/charts): grouped, stacked, across, and a cascade.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Stack, Text } from 'rui-core';
import { BarChart } from 'rui-core/charts';
import { VISITS, CHANNELS } from '../chart-data.js';
import { CARTESIAN } from '../chart-props.js';

const BUDGET = [
  { step: 'Income', Amount: 3200 },
  { step: 'Rent', Amount: -1250 },
  { step: 'Food', Amount: -480 },
  { step: 'Transport', Amount: -190 },
  { step: 'Savings', Amount: -600, color: 'cyan' },
  { step: 'Left', Amount: 680, total: true, color: 'indigo' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'bar-chart',
  group: 'charts',
  title: 'BarChart',
  description: 'Bars by category (rui-core/charts), drawn with the portable Shape: side by side, stacked, as shares of 100 %, across (`across`) or as a cascade (a running total).',
  props: [
    { name: 'kind', type: "'group' | 'stack' | 'share' | 'cascade'", default: "'group'", description: 'Side by side, stacked, shares of 100 % (a negative value’s share below 0, the axis reaching down to it), or each bar starting where the last ended (a row with `total` starts at 0).' },
    { name: 'across', type: 'boolean', default: 'false', description: 'The bars run across, the categories down the y axis.' },
    { name: 'barWidth', type: 'number', description: 'The most a bar is wide.' },
    { name: 'fillOpacity', type: 'number', default: 'opacity.dense (0.88)', description: 'The bars’ opacity.' },
    { name: 'row color', type: 'string', description: 'A row’s own `color` for its bar (cascade).' },
    { name: 'values.at', type: "'inside' | 'outside' | 'center'", default: "'inside'", description: 'Where each bar’s value sits: inside its tip (past it when the bar is short), past the tip, or centered; inside in the body color, outside in the series’; `offset` theme.chart.labelOffset (6). `values` may also be a function of the series.' },
    ...CARTESIAN,
  ],
  demos: [
    {
      title: 'Visits by channel',
      code: `
// VISITS: [{ day: 'Mon', Search: 640, Direct: 310, Referral: 150 }, …]
// CHANNELS: [{ key: 'Search', color: 'indigo.5' }, { key: 'Direct', color: 'lime.6' }, { key: 'Referral', color: 'magenta.5' }]

function Demo() {
  return <BarChart w={640} h={260} data={VISITS} category="day" series={CHANNELS} legend />;
}`,
      view: () => <BarChart w={640} h={260} data={VISITS} category="day" series={CHANNELS} legend />,
      height: 300,
    },
    {
      title: 'Stacked, and across as shares',
      code: `
function Demo() {
  return (
    <Stack gap="lg">
      <BarChart w={640} h={200} data={VISITS} category="day" series={CHANNELS} kind="stack" barWidth={36} />
      <BarChart w={640} h={260} data={VISITS} category="day" series={CHANNELS} across kind="share" yAxis={{ width: 80 }} />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="lg">
          <BarChart w={640} h={200} data={VISITS} category="day" series={CHANNELS} kind="stack" barWidth={36} />
          <BarChart w={640} h={260} data={VISITS} category="day" series={CHANNELS} across kind="share" yAxis={{ width: 80 }} />
        </Stack>
      ),
      height: 520,
    },
    {
      title: 'A month’s budget, step by step',
      code: `
const BUDGET = [
  { step: 'Income', Amount: 3200 },
  { step: 'Rent', Amount: -1250 },
  { step: 'Food', Amount: -480 },
  { step: 'Transport', Amount: -190 },
  { step: 'Savings', Amount: -600, color: 'cyan' },
  { step: 'Left', Amount: 680, total: true, color: 'indigo' },
];

function Demo() {
  return <BarChart w={640} h={240} data={BUDGET} category="step" kind="cascade" series={[{ key: 'Amount', color: 'teal' }]} values />;
}`,
      view: () => <BarChart w={640} h={240} data={BUDGET} category="step" kind="cascade" series={[{ key: 'Amount', color: 'teal' }]} values />,
      height: 270,
    },
    {
      title: 'Choosing a day',
      code: `
function Demo() {
  const day = $signal($active(), null);
  return (
    <Stack gap="sm">
      <BarChart w={640} h={240} data={VISITS} category="day" series={CHANNELS} onSelect={(index, row) => $write(day, row.day)} />
      <Text size="sm" fg="quiet">{() => ($read(day) === null ? 'Press a day, or focus the chart and walk it with the arrows' : \`Chosen: \${$read(day)}\`)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const day = $signal($active(), /** @type {string | null} */ (null));
        return (
          <Stack gap="sm">
            <BarChart w={640} h={240} data={VISITS} category="day" series={CHANNELS} onSelect={(/** @type {number} */ index, /** @type {any} */ row) => $write(day, row.day)} />
            <Text size="sm" fg="quiet">
              {() => ($read(day) === null ? 'Press a day, or focus the chart and walk it with the arrows' : `Chosen: ${$read(day)}`)}
            </Text>
          </Stack>
        );
      },
      height: 300,
    },
  ],
};
