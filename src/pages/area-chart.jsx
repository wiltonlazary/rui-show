// AreaChart (rui-core/charts): areas overlapping, stacked, as shares, diverging at zero.

import { Stack } from 'rui-core';
import { AreaChart } from 'rui-core/charts';
import { ORDERS, REGIONS } from '../chart-data.js';
import { CARTESIAN } from '../chart-props.js';

const TEMPERATURE = [
  { month: 'Jan', Mean: -5 },
  { month: 'Feb', Mean: -4 },
  { month: 'Mar', Mean: 0 },
  { month: 'Apr', Mean: 5 },
  { month: 'May', Mean: 11 },
  { month: 'Jun', Mean: 15 },
  { month: 'Jul', Mean: 18 },
  { month: 'Aug', Mean: 16 },
  { month: 'Sep', Mean: 11 },
  { month: 'Oct', Mean: 5 },
  { month: 'Nov', Mean: -1 },
  { month: 'Dec', Mean: -4 },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'area-chart',
  group: 'charts',
  title: 'AreaChart',
  description: 'Areas under lines (rui-core/charts), drawn with the portable Shape (no SVG), the same on every renderer. Overlapping, stacked, as shares of 100 %, or one series diverging in two colors at zero.',
  props: [
    { name: 'kind', type: "'overlap' | 'stack' | 'share' | 'diverge'", default: "'overlap'", description: 'Areas over each other, stacked, as shares of 100 % (a negative value’s share below 0, the axis reaching down to it), or one series split at zero.' },
    { name: 'signColors', type: '{ up, down }', default: "{ up: 'teal', down: 'orange' }", description: 'Above and below zero (`diverge`).' },
    { name: 'fillOpacity', type: 'number', default: 'opacity.faint (0.16)', description: 'The fill’s opacity at its top.' },
    { name: 'fade', type: 'boolean', default: 'false', description: 'The fill fades from `fillOpacity` at its top to clear at its bottom.' },
    { name: 'lineWidth', type: 'number', default: '2', description: 'The lines’ width.' },
    { name: 'points', type: 'boolean | { radius }', default: 'false', description: 'A dot at each value; without it, dots show on hover.' },
    { name: 'bridge', type: 'boolean', default: 'false', description: 'A line across missing values; without it, a gap shows.' },
    ...CARTESIAN,
  ],
  demos: [
    {
      title: 'Orders by region, with a legend',
      code: `
// ORDERS: [{ week: 'W1', North: 1480, East: 920, West: 1310 }, …]
// REGIONS: [{ key: 'North', color: 'cyan.6' }, { key: 'East', color: 'orange.6' }, { key: 'West', color: 'purple.6' }]

function Demo() {
  return <AreaChart w={640} h={260} data={ORDERS} category="week" series={REGIONS} legend />;
}`,
      view: () => <AreaChart w={640} h={260} data={ORDERS} category="week" series={REGIONS} legend />,
      height: 300,
    },
    {
      title: 'Stacked, and as shares',
      code: `
function Demo() {
  return (
    <Stack gap="lg">
      <AreaChart w={640} h={200} data={ORDERS} category="week" series={REGIONS} kind="stack" fade />
      <AreaChart w={640} h={200} data={ORDERS} category="week" series={REGIONS} kind="share" />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="lg">
          <AreaChart w={640} h={200} data={ORDERS} category="week" series={REGIONS} kind="stack" fade />
          <AreaChart w={640} h={200} data={ORDERS} category="week" series={REGIONS} kind="share" />
        </Stack>
      ),
      height: 460,
    },
    {
      title: 'A temperature band around freezing',
      code: `
const TEMPERATURE = [
  { month: 'Jan', Mean: -5 },
  { month: 'Feb', Mean: -4 },
  { month: 'Mar', Mean: 0 },
  { month: 'Apr', Mean: 5 },
  { month: 'May', Mean: 11 },
  { month: 'Jun', Mean: 15 },
  { month: 'Jul', Mean: 18 },
  { month: 'Aug', Mean: 16 },
  { month: 'Sep', Mean: 11 },
  { month: 'Oct', Mean: 5 },
  { month: 'Nov', Mean: -1 },
  { month: 'Dec', Mean: -4 },
];

function Demo() {
  return (
    <AreaChart
      w={640}
      h={240}
      data={TEMPERATURE}
      category="month"
      series={[{ key: 'Mean', label: 'Mean temperature', color: 'gray.7' }]}
      kind="diverge"
      signColors={{ up: 'orange.6', down: 'cyan.6' }}
      unit="°C"
      references={[{ y: 0, label: 'Freezing', color: 'cyan.7' }]}
    />
  );
}`,
      view: () => (
        <AreaChart
          w={640}
          h={240}
          data={TEMPERATURE}
          category="month"
          series={[{ key: 'Mean', label: 'Mean temperature', color: 'gray.7' }]}
          kind="diverge"
          signColors={{ up: 'orange.6', down: 'cyan.6' }}
          unit="°C"
          references={[{ y: 0, label: 'Freezing', color: 'cyan.7' }]}
        />
      ),
      height: 270,
    },
  ],
};
