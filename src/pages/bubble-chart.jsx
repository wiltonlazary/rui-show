// BubbleChart (rui-core/charts): bubbles at their values, sized by a value.

import { BubbleChart } from 'rui-core/charts';

/** Eight cities, oldest first (a rough founding year), and their people in millions (the city proper, rounded). */
const CITIES = [
  { city: 'Lisbon', founded: -1200, people: 0.55 },
  { city: 'Rome', founded: -753, people: 2.8 },
  { city: 'Paris', founded: -250, people: 2.1 },
  { city: 'Vienna', founded: -15, people: 2.0 },
  { city: 'London', founded: 47, people: 8.9 },
  { city: 'Madrid', founded: 865, people: 3.3 },
  { city: 'Berlin', founded: 1237, people: 3.7 },
  { city: 'Amsterdam', founded: 1275, people: 0.93 },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'bubble-chart',
  group: 'charts',
  title: 'BubbleChart',
  description: 'Bubbles on a value axis (rui-core/charts), a band per category: each bubble stands at its value’s height, its area mapped from its size onto `range`.',
  props: [
    { name: 'data', type: 'Record<string, any>[]', description: 'The bubbles.' },
    { name: 'category', type: 'string', default: "'label'", description: 'The field naming each bubble’s band.' },
    { name: 'valueKey', type: 'string', default: "'value'", description: 'The field that sets each bubble’s height on the value axis.' },
    { name: 'sizeKey', type: 'string', default: 'valueKey', description: 'The field that sets each bubble’s area.' },
    { name: 'range', type: '[number, number]', default: '[24, 400]', description: 'The bubbles’ least and greatest areas (px²).' },
    { name: 'label', type: 'string', description: 'The value’s name, over the value axis and in the tooltip.' },
    { name: 'yAxis', type: 'boolean | { width, domain }', default: 'true', description: 'The value axis’s ticks and label; `false` hides them. Its width: as wide as its tick labels, `chart.axisWidth` at least and `chart.axisShare` of the chart at most (a longer label cut with …), a given `width` as given.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The bubbles’ color.' },
    { name: 'unit', type: 'string', description: 'Put after each value on the axis and in the tooltip.' },
    { name: 'format', type: '(value) => string', description: 'How the values read on the axis and in the tooltip.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'A tooltip on hover.' },
    { name: 'grid', type: "'rows' | false", default: "'rows'", description: 'A line across the plot at each tick.' },
    { name: 'xAxis', type: 'boolean', default: 'true', description: 'The categories under their bands; `false` hides them.' },
    { name: 'w / h', type: 'number', default: 'the box’s width / 300', description: 'The size.' },
  ],
  demos: [
    {
      title: 'Eight cities by population, oldest first',
      code: `
const CITIES = [
  { city: 'Lisbon', founded: -1200, people: 0.55 },
  { city: 'Rome', founded: -753, people: 2.8 },
  { city: 'Paris', founded: -250, people: 2.1 },
  { city: 'Vienna', founded: -15, people: 2.0 },
  { city: 'London', founded: 47, people: 8.9 },
  { city: 'Madrid', founded: 865, people: 3.3 },
  { city: 'Berlin', founded: 1237, people: 3.7 },
  { city: 'Amsterdam', founded: 1275, people: 0.93 },
];

function Demo() {
  return (
    <BubbleChart
      w={640}
      data={CITIES}
      category="city" valueKey="people"
      range={[40, 1600]}
      h={280}
      yAxis={{ width: 80 }}
      color="indigo"
      grid="rows"
      unit=" million"
      label="People"
    />
  );
}`,
      view: () => <BubbleChart w={640} data={CITIES} category="city" valueKey="people" range={[40, 1600]} h={280} yAxis={{ width: 80 }} color="indigo" grid="rows" unit=" million" label="People" />,
      height: 300,
    },
  ],
};
