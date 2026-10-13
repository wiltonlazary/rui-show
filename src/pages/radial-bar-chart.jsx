// RadialBarChart (rui-core/charts): a ring per row.

import { RadialBarChart } from 'rui-core/charts';

const TEAMS = [
  { label: 'Design', value: 72, color: 'purple.6' },
  { label: 'Build', value: 58, color: 'cyan.6' },
  { label: 'Test', value: 44, color: 'orange.6' },
  { label: 'Docs', value: 27, color: 'teal.6' },
  { label: 'Ops', value: 15, color: 'magenta.6' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'radial-bar-chart',
  group: 'charts',
  title: 'RadialBarChart',
  description: 'A ring per row (rui-core/charts), the first innermost, each swept by its share of the largest value; a track behind each, labels and a legend.',
  props: [
    { name: 'data', type: '{ label, value, color }[]', description: 'The rows.' },
    { name: 'valueKey', type: 'string', default: "'value'", description: 'The field holding each bar’s value.' },
    { name: 'thickness', type: 'number', default: 'sizes.progress.xl (14)', description: 'Each ring’s width, at most `theme.chart.band` (0.72) of its ring’s band.' },
    { name: 'track', type: 'boolean', default: 'true', description: 'A track behind each ring.' },
    { name: 'startAngle / endAngle', type: 'number', default: '225 / -45', description: 'Where the rings start and where a full one ends: a 270° gauge by default.' },
    { name: 'labels', type: 'boolean', default: 'true', description: 'Each value at its bar’s end.' },
    { name: 'legend', type: "boolean | { at: 'top' | 'bottom' (-start, -center, -end) }", default: 'false', description: 'A legend of the rows, under the chart at its start (`bottom-start`) unless `at` says otherwise.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'A tooltip that follows the pointer: the ring’s tone dot and name over its value.' },
    { name: 'format / unit', type: '(value) => string / string', description: 'How values read, with `unit` after each (the labels and the tooltip).' },
    { name: 'w / h', type: 'number', default: 'the box’s width / 300', description: 'The size.' },
  ],
  demos: [
    {
      title: 'Progress by team, with a legend',
      code: `
const TEAMS = [
  { label: 'Design', value: 72, color: 'purple.6' },
  { label: 'Build', value: 58, color: 'cyan.6' },
  { label: 'Test', value: 44, color: 'orange.6' },
  { label: 'Docs', value: 27, color: 'teal.6' },
  { label: 'Ops', value: 15, color: 'magenta.6' },
];

function Demo() {
  return <RadialBarChart w={640} h={280} data={TEAMS} valueKey="value" legend />;
}`,
      view: () => <RadialBarChart w={640} h={280} data={TEAMS} valueKey="value" legend />,
      height: 320,
    },
    {
      title: 'Three quarters from the top, no track',
      code: `
function Demo() {
  return <RadialBarChart w={640} h={220} data={TEAMS} valueKey="value" startAngle={90} endAngle={-180} track={false} thickness={10} />;
}`,
      view: () => <RadialBarChart w={640} h={220} data={TEAMS} valueKey="value" startAngle={90} endAngle={-180} track={false} thickness={10} />,
      height: 240,
    },
  ],
};
