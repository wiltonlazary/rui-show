// PieChart (rui-core/charts): shares as a pie, labels inside and outside.

import { Row } from 'rui-core';
import { PieChart } from 'rui-core/charts';
import { DISK } from '../chart-data.js';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'pie-chart',
  group: 'charts',
  title: 'PieChart',
  description: 'Shares of a whole as a pie (rui-core/charts): DonutChart without a hole, its labels inside the slices or outside them.',
  props: [
    { name: 'data', type: '{ label, value, color }[]', description: 'The slices: a color name resolves at the accent shade.' },
    { name: 'size', type: 'number', default: 'sizes.box.pie (180)', description: 'The diameter.' },
    { name: 'labels', type: 'boolean', default: 'false', description: 'A label per slice.' },
    { name: 'labelsAt', type: "'outside' | 'inside'", default: "'inside'", description: 'Where the labels go.' },
    { name: 'labelsAs', type: "'percent' | 'value'", default: "'percent'", description: 'What the labels show.' },
    { name: 'leaders', type: 'boolean', default: 'false', description: 'Lines to outside labels.' },
    { name: 'gap / startAngle / endAngle', type: 'number', default: '1 / 0 / -360', description: 'Degrees between slices, and where the slices start and end: counterclockwise from three o’clock, so one turn clockwise from three o’clock by default.' },
    { name: 'locale', type: 'string', default: "'en-US'", description: 'How percents read: whole, one decimal under 10 %.' },
    { name: 'tooltip', type: "boolean | { scope: 'slice' | 'chart' }", default: "{ scope: 'slice' }", description: 'A tooltip on hover: the slice under the pointer, or every slice; `false` for none.' },
    { name: 'format / unit', type: '(value) => string / string', description: 'How values read, with `unit` after each (the labels and the tooltip).' },
    { name: 'w / h', type: 'number', default: 'size (180), grown for outside labels', description: 'The box’s width and height, the chart centered in it.' },
  ],
  demos: [
    {
      title: 'Labels inside and outside',
      code: `
// DISK: [{ label: 'Photos', value: 340, color: 'purple.6' }, { label: 'Video', value: 260, color: 'cyan.6' }, …]

function Demo() {
  return (
    <Row gap={48} justify="center">
      <PieChart data={DISK} labels />
      <PieChart data={DISK} labels labelsAt="outside" labelsAs="value" leaders size={150} tooltip={{ scope: 'chart' }} />
    </Row>
  );
}`,
      view: () => (
        <Row gap={48} justify="center">
          <PieChart data={DISK} labels />
          <PieChart data={DISK} labels labelsAt="outside" labelsAs="value" leaders size={150} tooltip={{ scope: 'chart' }} />
        </Row>
      ),
      height: 240,
    },
    {
      title: 'A gap between slices',
      code: `
function Demo() {
  return <PieChart data={DISK} gap={4} />;
}`,
      view: () => <PieChart data={DISK} gap={4} />,
      height: 210,
    },
  ],
};
