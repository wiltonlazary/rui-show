// Spinner (rui-core/more): spokes or dots going round.

import { Row } from 'rui-core';
import { Spinner } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'spinner',
  group: 'status',
  title: 'Spinner',
  description: 'A spinner of spokes or dots (rui-core/more) drawn with Shape: the lead segment opaque and those behind it fading, going round on the Clock.',
  props: [
    { name: 'size', type: "'xs' … 'xl' | number", default: "'md' (32)", description: 'Its diameter.' },
    { name: 'segments', type: 'number', default: '12', description: 'How many spokes or dots.' },
    { name: 'thickness', type: 'number', default: 'size ÷ segments, at least 1.5', description: 'A spoke’s width.' },
    { name: 'inner', type: 'number', default: "'ratios.glyph' (0.42)", description: 'The spokes’ inner radius, a share of the radius.' },
    { name: 'kind', type: "'lines' | 'dots'", default: "'lines'", description: 'Spokes or dots.' },
    { name: 'speed', type: 'number', default: '1000', description: 'Milliseconds a turn.' },
    { name: 'direction', type: "'clockwise' | 'counterclockwise'", default: "'clockwise'", description: 'Which way it goes.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'Its color.' },
  ],
  demos: [
    {
      title: 'Kinds, sizes and speeds',
      code: `
function Demo() {
  return (
    <Row gap="xl" align="center">
      <Spinner size="xs" />
      <Spinner />
      <Spinner size="xl" color="blue" segments={8} thickness={5} />
      <Spinner size="lg" kind="dots" color="purple" />
      <Spinner size={60} kind="dots" segments={16} speed={2000} direction="counterclockwise" color="teal" />
      <Spinner size="lg" inner={0.2} color="orange" />
    </Row>
  );
}`,
      view: () => (
        <Row gap="xl" align="center">
          <Spinner size="xs" />
          <Spinner />
          <Spinner size="xl" color="blue" segments={8} thickness={5} />
          <Spinner size="lg" kind="dots" color="purple" />
          <Spinner size={60} kind="dots" segments={16} speed={2000} direction="counterclockwise" color="teal" />
          <Spinner size="lg" inner={0.2} color="orange" />
        </Row>
      ),
      height: 100,
    },
  ],
};
