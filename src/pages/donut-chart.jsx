// DonutChart (rui-core/charts): shares as a ring, labeled, a 270° gauge.

import { Row } from 'rui-core';
import { DonutChart } from 'rui-core/charts';
import { DISK } from '../chart-data.js';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'donut-chart',
  group: 'charts',
  title: 'DonutChart',
  description: 'Shares of a whole as a ring (rui-core/charts), drawn with the portable Shape: labels outside, a label in the middle, a gap between the slices, a part of the circle only.',
  props: [
    { name: 'data', type: '{ label, value, color }[]', description: 'The slices: a color name resolves at the accent shade.' },
    { name: 'size', type: 'number', default: 'sizes.box.pie (180)', description: 'The ring’s diameter.' },
    { name: 'thickness', type: 'number', default: 'sizes.box.donut (24)', description: 'The ring’s width.' },
    { name: 'gap', type: 'number', default: '2', description: 'Degrees between the slices.' },
    { name: 'startAngle / endAngle', type: 'number', default: '0 / -360', description: 'The part of the circle drawn, in degrees counterclockwise from three o’clock: one turn clockwise from three o’clock by default.' },
    { name: 'labels', type: 'boolean', default: 'false', description: 'Labels outside the ring.' },
    { name: 'leaders', type: 'boolean', default: 'false', description: 'A line from each label to its slice.' },
    { name: 'labelsAs', type: "'percent' | 'value'", default: "'percent'", description: 'What the labels show.' },
    { name: 'caption', type: 'string | number | node', description: 'Text in the middle (md, strong), or a node as given.' },
    { name: 'locale', type: 'string', default: "'en-US'", description: 'How percents read: whole, one decimal under 10 %.' },
    { name: 'tooltip', type: "boolean | { scope: 'slice' | 'chart' }", default: 'true', description: 'A tooltip on hover: the slice under the pointer, or every slice (`scope`).' },
    { name: 'format / unit', type: '(value) => string / string', description: 'How values read, with `unit` after each (the labels and the tooltip).' },
    { name: 'w / h', type: 'number', default: 'size (180), grown for the labels', description: 'The box’s width and height, the chart centered in it.' },
  ],
  demos: [
    {
      title: 'A ring, and a label in the middle',
      code: `
// DISK: [{ label: 'Photos', value: 340, color: 'purple.6' }, { label: 'Video', value: 260, color: 'cyan.6' }, …]

function Demo() {
  return (
    <Row gap={60} justify="center">
      <DonutChart data={DISK} />
      <DonutChart data={DISK} caption="Disk use" thickness={30} gap={4} />
    </Row>
  );
}`,
      view: () => (
        <Row gap={60} justify="center">
          <DonutChart data={DISK} />
          <DonutChart data={DISK} caption="Disk use" thickness={30} gap={4} />
        </Row>
      ),
      height: 200,
    },
    {
      title: 'Labels in values, and a 270° gauge',
      code: `
function Demo() {
  return (
    <Row gap={60} justify="center">
      <DonutChart data={DISK} labels labelsAs="value" leaders size={150} format={v => \`\${v} GB\`} />
      <DonutChart data={DISK} startAngle={225} endAngle={-45} thickness={16} caption="1 TB" />
    </Row>
  );
}`,
      view: () => (
        <Row gap={60} justify="center">
          <DonutChart data={DISK} labels labelsAs="value" leaders size={150} format={(/** @type {number} */ v) => `${v} GB`} />
          <DonutChart data={DISK} startAngle={225} endAngle={-45} thickness={16} caption="1 TB" />
        </Row>
      ),
      height: 260,
    },
  ],
};
