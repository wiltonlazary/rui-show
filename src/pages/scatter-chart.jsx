// ScatterChart (rui-core/charts): points of two groups, units and a
// reference line.

import { ScatterChart } from 'rui-core/charts';
import { STUDY } from '../chart-data.js';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'scatter-chart',
  group: 'charts',
  title: 'ScatterChart',
  description: 'Points by two values (rui-core/charts), a color per group; the tooltip shows the point nearest the pointer.',
  props: [
    { name: 'data', type: '{ label, color, points: Record<string, number>[] }[]', description: 'The groups and their points.' },
    { name: 'category', type: '{ x: string, y: string }', description: 'The fields each point is placed by.' },
    { name: 'xAxis / yAxis', type: 'boolean | { title, unit, format, domain, width }', default: 'true', description: 'The axes, or an axis’s options: its `title` (drawn along the axis, and the values’ name in the tooltip; the field otherwise), its own `unit` and `format`, its range, and the y axis’s width: as wide as its tick labels, theme.chart.axisWidth at least and theme.chart.axisShare of the chart at most (a longer label cut with …), a given `width` as given.' },
    { name: 'unit / format', type: 'string / (value) => string', description: 'How the values read on both axes, where an axis has none of its own.' },
    { name: 'grid / ticks / dash', type: "'rows' | 'columns' | 'both' | false / 'x' | 'y' | 'both' | false / string", default: "'rows' / false / '4 2'", description: 'The grid lines, the axes’ tick marks, and the grid’s dash.' },
    { name: 'gridColor', type: 'string', default: 'the page’s border, muted', description: 'The grid’s color.' },
    { name: 'references', type: '{ x?, y?, label?, color?, dash?, at? }[]', description: 'Lines across the plot at a value (orange by default); `at` places the label: a y line at \'start\' or \'end\' (the default), an x line at \'top\' (the default) or \'bottom\'.' },
    { name: 'legend', type: 'boolean | { at }', default: 'false', description: 'A legend of the groups (a tone dot and a quiet label each), `at` as AreaChart’s: under the plot at its start (`bottom-start`) by default.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'The nearest point within 24 px.' },
    { name: 'w / h', type: 'number', default: 'the box’s width / sizes.box.chart (300)', description: 'The size.' },
  ],
  demos: [
    {
      title: 'Two groups',
      code: `
// STUDY: [{ color: 'teal.5', label: 'Morning class', points: [{ hours: 2, score: 54 }, …] }, { color: 'orange.5', label: 'Evening class', points: […] }]

function Demo() {
  return <ScatterChart w={640} h={280} data={STUDY} category={{ x: 'hours', y: 'score' }} xAxis={{ title: 'Hours' }} yAxis={{ title: 'Score' }} legend />;
}`,
      view: () => <ScatterChart w={640} h={280} data={STUDY} category={{ x: 'hours', y: 'score' }} xAxis={{ title: 'Hours' }} yAxis={{ title: 'Score' }} legend />,
      height: 320,
    },
    {
      title: 'Units, domains and a reference line',
      code: `
function Demo() {
  return (
    <ScatterChart
      w={640}
      h={260}
      data={STUDY}
      category={{ x: 'hours', y: 'score' }}
      xAxis={{ unit: ' h', domain: [0, 14] }}
      yAxis={{ unit: '%', domain: [40, 90] }}
      references={[{ y: 60, label: 'Pass', color: 'red.7', at: 'start' }]}
      grid="both"
    />
  );
}`,
      view: () => (
        <ScatterChart
          w={640}
          h={260}
          data={STUDY}
          category={{ x: 'hours', y: 'score' }}
          xAxis={{ unit: ' h', domain: [0, 14] }}
          yAxis={{ unit: '%', domain: [40, 90] }}
          references={[{ y: 60, label: 'Pass', color: 'red.7', at: 'start' }]}
          grid="both"
        />
      ),
      height: 280,
    },
  ],
};
