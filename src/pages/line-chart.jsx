// LineChart (rui-core/charts): lines, then one feature a demo: gaps,
// bridging them, a dashed series, steps and axis titles.

import { LineChart } from 'rui-core/charts';
import { ORDERS, REGIONS } from '../chart-data.js';
import { CARTESIAN } from '../chart-props.js';

const GAPS = [
  { month: 'Jan', North: 12, South: 8 },
  { month: 'Feb', North: 18, South: 11 },
  { month: 'Mar', North: null, South: 15 },
  { month: 'Apr', North: 22, South: 13 },
  { month: 'May', North: 26, South: null },
  { month: 'Jun', North: 24, South: 19 },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'line-chart',
  group: 'charts',
  title: 'LineChart',
  description: 'Lines through values by category (rui-core/charts), drawn with the portable Shape; a series may be dashed, and a missing value shows as a gap unless `bridge`.',
  props: [
    { name: 'series[].dash', type: 'string', description: 'A series’ dashes (`\'4 4\'`).' },
    { name: 'lineWidth', type: 'number', default: '2', description: 'The lines’ width.' },
    { name: 'points', type: 'boolean | { radius }', default: 'true', description: 'A dot at each value.' },
    { name: 'bridge', type: 'boolean', default: 'false', description: 'A line across missing values; by default a gap shows.' },
    ...CARTESIAN,
    { name: 'Legend', type: '{ items: () => { name, label, color }[], onActiveChange?, justify? }', description: 'The charts’ legend on its own (rui-core/charts): a row of tone dots and quiet labels; the item under the pointer takes the text color and `onActiveChange(key | null)` reports its `name`, null when the pointer leaves. `justify` (\'start\', \'center\' or \'end\'; a value or accessor) moves it along the row.' },
    { name: 'Tip', type: '{ tip: () => { label, rows: { name, color, value }[], at } }', description: 'The charts’ tooltip box on its own: a heading (none for \'\'), then each row’s tone dot and name over its value, on the sunken ground, placed absolutely by `at` (its insets).' },
  ],
  demos: [
    {
      title: 'Weekly orders by region, the legend over the plot at its end',
      code: `
// ORDERS: [{ week: 'W1', North: 1480, East: 920, West: 1310 }, …]
// REGIONS: [{ key: 'North', color: 'cyan.6' }, { key: 'East', color: 'orange.6' }, { key: 'West', color: 'purple.6' }]
function Demo() {
  return <LineChart w={640} h={260} data={ORDERS} category="week" series={REGIONS} legend={{ at: 'top-end' }} />;
}`,
      view: () => <LineChart w={640} h={260} data={ORDERS} category="week" series={REGIONS} legend={{ at: 'top-end' }} />,
      height: 300,
    },
    {
      title: 'Gaps in the data',
      code: `
const GAPS = [
  { month: 'Jan', North: 12, South: 8 },
  { month: 'Feb', North: 18, South: 11 },
  { month: 'Mar', North: null, South: 15 },
  { month: 'Apr', North: 22, South: 13 },
  { month: 'May', North: 26, South: null },
  { month: 'Jun', North: 24, South: 19 },
];

function Demo() {
  return (
    <LineChart
      w={640}
      h={260}
      data={GAPS}
      category="month"
      series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan' }]}
    />
  );
}`,
      view: () => (
        <LineChart
          w={640}
          h={260}
          data={GAPS}
          category="month"
          series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan' }]}
        />
      ),
      height: 290,
    },
    {
      title: 'Bridging the gaps',
      code: `
const GAPS = [
  { month: 'Jan', North: 12, South: 8 },
  { month: 'Feb', North: 18, South: 11 },
  { month: 'Mar', North: null, South: 15 },
  { month: 'Apr', North: 22, South: 13 },
  { month: 'May', North: 26, South: null },
  { month: 'Jun', North: 24, South: 19 },
];

function Demo() {
  return (
    <LineChart
      w={640}
      h={260}
      data={GAPS}
      category="month"
      bridge
      series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan' }]}
    />
  );
}`,
      view: () => (
        <LineChart
          w={640}
          h={260}
          data={GAPS}
          category="month"
          bridge
          series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan' }]}
        />
      ),
      height: 290,
    },
    {
      title: 'A dashed series',
      code: `
const GAPS = [
  { month: 'Jan', North: 12, South: 8 },
  { month: 'Feb', North: 18, South: 11 },
  { month: 'Mar', North: null, South: 15 },
  { month: 'Apr', North: 22, South: 13 },
  { month: 'May', North: 26, South: null },
  { month: 'Jun', North: 24, South: 19 },
];

function Demo() {
  return (
    <LineChart
      w={640}
      h={260}
      data={GAPS}
      category="month"
      series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan', dash: '6 3' }]}
    />
  );
}`,
      view: () => (
        <LineChart
          w={640}
          h={260}
          data={GAPS}
          category="month"
          series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan', dash: '6 3' }]}
        />
      ),
      height: 290,
    },
    {
      title: 'Steps',
      code: `
const GAPS = [
  { month: 'Jan', North: 12, South: 8 },
  { month: 'Feb', North: 18, South: 11 },
  { month: 'Mar', North: null, South: 15 },
  { month: 'Apr', North: 22, South: 13 },
  { month: 'May', North: 26, South: null },
  { month: 'Jun', North: 24, South: 19 },
];

function Demo() {
  return (
    <LineChart
      w={640}
      h={260}
      data={GAPS}
      category="month"
      curve="step"
      series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan' }]}
    />
  );
}`,
      view: () => (
        <LineChart
          w={640}
          h={260}
          data={GAPS}
          category="month"
          curve="step"
          series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan' }]}
        />
      ),
      height: 290,
    },
    {
      title: 'Axis titles',
      code: `
const GAPS = [
  { month: 'Jan', North: 12, South: 8 },
  { month: 'Feb', North: 18, South: 11 },
  { month: 'Mar', North: null, South: 15 },
  { month: 'Apr', North: 22, South: 13 },
  { month: 'May', North: 26, South: null },
  { month: 'Jun', North: 24, South: 19 },
];

function Demo() {
  return (
    <LineChart
      w={640}
      h={260}
      data={GAPS}
      category="month"
      xAxis={{ title: 'Month' }}
      yAxis={{ title: 'Rain (mm)' }}
      series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan' }]}
    />
  );
}`,
      view: () => (
        <LineChart
          w={640}
          h={260}
          data={GAPS}
          category="month"
          xAxis={{ title: 'Month' }}
          yAxis={{ title: 'Rain (mm)' }}
          series={[{ key: 'North', color: 'purple' }, { key: 'South', color: 'cyan' }]}
        />
      ),
      height: 290,
    },
  ],
};
