// RadarChart (rui-core/charts): series over axes around a center.

import { RadarChart } from 'rui-core/charts';

/** Skills by role, 0 to 100, one row per axis. */
const ROLES = [
  { skill: 'Research', designer: 78, engineer: 52, analyst: 86 },
  { skill: 'Visuals', designer: 92, engineer: 38, analyst: 57 },
  { skill: 'Code', designer: 41, engineer: 94, analyst: 63 },
  { skill: 'Data', designer: 35, engineer: 71, analyst: 90 },
  { skill: 'Writing', designer: 66, engineer: 49, analyst: 74 },
  { skill: 'Planning', designer: 59, engineer: 68, analyst: 61 },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'radar-chart',
  group: 'charts',
  title: 'RadarChart',
  description: 'Series as polygons over axes around a center (rui-core/charts), clockwise from the top, over a polygon grid at the value ticks.',
  props: [
    { name: 'data', type: 'Record<string, any>[]', description: 'A row per axis.' },
    { name: 'category', type: 'string', default: "'label'", description: 'The axis name field.' },
    { name: 'series', type: '{ key, color, opacity?, lineColor?, label? }[]', description: 'The polygons: `key` is the row field; `opacity` the fill’s (the chart’s `fillOpacity` by default).' },
    { name: 'fillOpacity', type: 'number', default: 'opacity.faint (0.16)', description: 'The fills’ opacity for every series without its own.' },
    { name: 'grid', type: 'boolean', default: 'true', description: 'The grid.' },
    { name: 'angleAxis', type: 'boolean', default: 'true', description: 'The axes’ names.' },
    { name: 'radiusAxis', type: 'boolean | { domain }', default: 'true', description: 'The values along the first axis; `domain`, the value range.' },
    { name: 'gridColor', type: 'string', default: 'the page’s border, muted', description: 'The grid’s color.' },
    { name: 'points', type: 'boolean', default: 'true', description: 'A dot at each value, of `chart.pointArea` px² (r ≈ 3.9); strokes from `sizes.divider`.' },
    { name: 'legend', type: 'boolean | { at }', default: 'on with two series or more', description: 'A legend of the series (a tone dot and a quiet label per series), under the chart at its start (`bottom-start`) unless `at`, as AreaChart’s, says otherwise.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'A tooltip that follows the pointer: a table of the series, a tone dot and its name over its value, on the sunken ground.' },
    { name: 'format / unit', type: '(value) => string / string', description: 'How values read, with `unit` after each (the labels and the tooltip).' },
    { name: 'w / h', type: 'number', default: 'the box’s width / sizes.box.chart (300)', description: 'The size.' },
  ],
  demos: [
    {
      title: 'One skills profile',
      code: `
const ROLES = [
  { skill: 'Research', designer: 78, engineer: 52, analyst: 86 },
  { skill: 'Visuals', designer: 92, engineer: 38, analyst: 57 },
  { skill: 'Code', designer: 41, engineer: 94, analyst: 63 },
  { skill: 'Data', designer: 35, engineer: 71, analyst: 90 },
  { skill: 'Writing', designer: 66, engineer: 49, analyst: 74 },
  { skill: 'Planning', designer: 59, engineer: 68, analyst: 61 },
];

function Demo() {
  return <RadarChart w={640} h={280} data={ROLES} category="skill" series={[{ key: 'designer', label: 'Designer', color: 'violet' }]} />;
}`,
      view: () => <RadarChart w={640} h={280} data={ROLES} category="skill" series={[{ key: 'designer', label: 'Designer', color: 'violet' }]} />,
      height: 300,
    },
    {
      title: 'Three roles compared: points, a legend and a tooltip by default',
      code: `
function Demo() {
  return (
    <RadarChart
      w={640}
      h={300}
      data={ROLES}
      category="skill"
      fillOpacity={0.12}
      series={[
        { key: 'designer', label: 'Designer', color: 'violet' },
        { key: 'engineer', label: 'Engineer', color: 'teal' },
        { key: 'analyst', label: 'Analyst', color: 'amber' },
      ]}
    />
  );
}`,
      view: () => (
        <RadarChart
          w={640}
          h={300}
          data={ROLES}
          category="skill"
          fillOpacity={0.12}
          series={[
            { key: 'designer', label: 'Designer', color: 'violet' },
            { key: 'engineer', label: 'Engineer', color: 'teal' },
            { key: 'analyst', label: 'Analyst', color: 'amber' },
          ]}
        />
      ),
      height: 330,
    },
  ],
};
