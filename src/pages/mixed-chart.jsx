// MixedChart (rui-core/charts): bars, areas and lines on one plot.

import { MixedChart } from 'rui-core/charts';
import { ORDERS } from '../chart-data.js';
import { CARTESIAN } from '../chart-props.js';

/** Monthly revenue (in thousands) against its target. */
const REVENUE = [
  { month: 'Jan', revenue: 42, target: 45 },
  { month: 'Feb', revenue: 47, target: 46 },
  { month: 'Mar', revenue: 51, target: 48 },
  { month: 'Apr', revenue: 44, target: 50 },
  { month: 'May', revenue: 58, target: 52 },
  { month: 'Jun', revenue: 63, target: 55 },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'mixed-chart',
  group: 'charts',
  title: 'MixedChart',
  description: 'Bars, areas and lines on one plot (rui-core/charts): each series says its `kind`.',
  props: [{ name: 'series[].kind', type: "'bar' | 'area' | 'line'", default: "'line'", description: 'How each series is drawn.' }, { name: 'barWidth', type: 'number', description: 'The most a bar is wide.' }, { name: 'across', type: 'boolean', default: 'false', description: 'Bars run across, the categories down (as BarChart’s).' }, ...CARTESIAN],
  demos: [
    {
      title: 'Revenue against a target',
      code: `
const REVENUE = [
  { month: 'Jan', revenue: 42, target: 45 },
  { month: 'Feb', revenue: 47, target: 46 },
  { month: 'Mar', revenue: 51, target: 48 },
  { month: 'Apr', revenue: 44, target: 50 },
  { month: 'May', revenue: 58, target: 52 },
  { month: 'Jun', revenue: 63, target: 55 },
];

function Demo() {
  return (
    <MixedChart
      w={640}
      h={280}
      data={REVENUE}
      category="month"
      barWidth={24}
      unit="k"
      legend
      series={[
        { key: 'target', label: 'Target', color: 'orange.6', kind: 'line' },
        { key: 'revenue', label: 'Revenue', color: 'indigo.5', kind: 'bar' },
      ]}
    />
  );
}`,
      view: () => (
        <MixedChart
          w={640}
          h={280}
          data={REVENUE}
          category="month"
          barWidth={24}
          unit="k"
          legend
          series={[
            { key: 'target', label: 'Target', color: 'orange.6', kind: 'line' },
            { key: 'revenue', label: 'Revenue', color: 'indigo.5', kind: 'bar' },
          ]}
        />
      ),
      height: 320,
    },
    {
      title: 'Axis titles and a budget line',
      code: `
// ORDERS: [{ week: 'W1', North: 1480, East: 920, West: 1310 }, …]
function Demo() {
  return (
    <MixedChart
      w={640}
      h={260}
      data={ORDERS}
      category="week"
      series={[{ key: 'North', color: 'cyan.6', kind: 'bar' }, { key: 'East', color: 'orange.6', kind: 'area' }]}
      xAxis={{ title: 'Week' }}
      yAxis={{ title: 'Orders' }}
      references={[{ y: 1200, label: 'Budget', color: 'gray.7' }]}
    />
  );
}`,
      view: () => (
        <MixedChart
          w={640}
          h={260}
          data={ORDERS}
          category="week"
          series={[
            { key: 'North', color: 'cyan.6', kind: 'bar' },
            { key: 'East', color: 'orange.6', kind: 'area' },
          ]}
          xAxis={{ title: 'Week' }}
          yAxis={{ title: 'Orders' }}
          references={[{ y: 1200, label: 'Budget', color: 'gray.7' }]}
        />
      ),
      height: 290,
    },
  ],
};
