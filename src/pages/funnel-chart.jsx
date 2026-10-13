// FunnelChart (rui-core/charts): rows narrowing to the last.

import { Row } from 'rui-core';
import { FunnelChart } from 'rui-core/charts';

const STAGES = [
  { label: 'Visited', value: 1200, color: 'indigo.6' },
  { label: 'Signed up', value: 780, color: 'cyan.6' },
  { label: 'Trial', value: 420, color: 'teal.6' },
  { label: 'Paid', value: 150, color: 'lime.6' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'funnel-chart',
  group: 'charts',
  title: 'FunnelChart',
  description: 'A funnel (rui-core/charts): a trapezoid per row, as wide as its share of the largest value, narrowing to the next row, the last a rectangle.',
  props: [
    { name: 'data', type: '{ label, value, color }[]', description: 'The rows, top to bottom.' },
    { name: 'size', type: 'number', default: 'sizes.box.funnel (260)', description: 'Its height and greatest width.' },
    { name: 'labels', type: 'boolean', default: 'false', description: 'Each row’s value.' },
    { name: 'labelsAt', type: "'inside' | 'end' | 'start'", default: "'inside'", description: 'Where the labels go.' },
    { name: 'gap', type: 'number', default: '2', description: 'Pixels between the rows.' },
    { name: 'tooltip', type: 'boolean', default: 'true', description: 'A tooltip on hover.' },
    { name: 'format / unit', type: '(value) => string / string', description: 'How values read, with `unit` after each (the labels and the tooltip).' },
    { name: 'w / h', type: 'number', default: 'size (260)', description: 'The box’s width and height, the chart centered in it.' },
  ],
  demos: [
    {
      title: 'Labels inside and at the end',
      code: `
const STAGES = [
  { label: 'Visited', value: 1200, color: 'indigo.6' },
  { label: 'Signed up', value: 780, color: 'cyan.6' },
  { label: 'Trial', value: 420, color: 'teal.6' },
  { label: 'Paid', value: 150, color: 'lime.6' },
];

function Demo() {
  return (
    <Row gap={60} justify="center">
      <FunnelChart data={STAGES} size={200} labels />
      <FunnelChart data={STAGES} size={200} labels labelsAt="end" />
    </Row>
  );
}`,
      view: () => (
        <Row gap={60} justify="center">
          <FunnelChart data={STAGES} size={200} labels />
          <FunnelChart data={STAGES} size={200} labels labelsAt="end" />
        </Row>
      ),
      height: 230,
    },
  ],
};
