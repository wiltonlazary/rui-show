// The props rows the cartesian chart pages share (AreaChart, BarChart,
// LineChart, MixedChart read the same axes, grid and legend props).

/** @type {import('./site.js').PropRow[]} */
export const CARTESIAN = [
  { name: 'data', type: 'Record<string, any>[]', description: 'The rows: a category field and a value per series.' },
  { name: 'category', type: 'string', default: "'label'", description: 'The category field (the x axis).' },
  { name: 'series', type: '{ key, color, label?, stack?, axis? }[]', description: 'The series: `key` is the row field, then its color and legend label; series sharing a `stack` stack; `axis: \'end\'` puts one on the end axis.' },
  { name: 'curve', type: "'linear' | 'natural' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' | 'bump'", default: "'monotone' ('linear' for bars)", description: 'How the points are joined.' },
  { name: 'legend', type: "boolean | { at: 'top' | 'bottom' | 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end' }", default: 'false', description: 'A legend of tone dots and quiet labels (under the plot at its start, `bottom-start`, by default; it follows a changing `at`); hovering an item highlights its series.' },
  { name: 'tooltip', type: 'boolean', default: 'true', description: 'A tooltip that follows the pointer (a table of tone dots and names over values, on the sunken ground) and a cursor at the category under it.' },
  { name: 'xAxis / yAxis', type: 'boolean | { title, domain, width, tickCount, format, angle, height, interval }', default: 'true', description: 'The axes: shown or not, or their title, range, width, ticks and label turn.' },
  { name: 'endAxis', type: 'boolean | { title, width, … }', description: 'A y axis at the end for the series with `axis: \'end\'`.' },
  { name: 'grid', type: "'rows' | 'columns' | 'both' | false", default: "'rows'", description: 'The grid lines drawn.' },
  { name: 'ticks', type: "'x' | 'y' | 'both' | false", default: 'false', description: 'The tick marks drawn.' },
  { name: 'gridColor / textColor', type: 'string', default: 'the border role, muted / the quiet role', description: 'The grid’s color and the tick marks’ color.' },
  { name: 'dash', type: 'string', default: "'4 2'", description: 'The grid’s dashes.' },
  { name: 'references', type: '{ x?, y?, label?, color?, dash?, at? }[]', description: 'Lines across the plot at a value or a category (orange by default); `at` places the label: a y line at \'start\' or \'end\', an x line at \'top\' or \'bottom\'.' },
  { name: 'values', type: 'boolean | { at, color, fontSize }', description: 'Each point’s value over it.' },
  { name: 'format / unit', type: '(value) => string / string', description: 'How values read on the axis and in the tooltip.' },
  { name: 'w / h', type: 'number', default: 'the box’s width / sizes.box.chart (300)', description: 'The size; without `w` it follows its box (`onResize`).' },
];
