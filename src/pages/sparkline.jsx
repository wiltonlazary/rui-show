// Sparkline (rui-core/charts): a small line with its area, and trend colors.

import { Row, Stack, Text } from 'rui-core';
import { Sparkline } from 'rui-core/charts';

// Closing prices over ten sessions: one rising, one falling, one that ends where it began.
const RISING = [41.2, 40.6, 42.9, 42.1, 44.8, 44.3, 46.7, 45.9, 48.4, 49.6];
const FALLING = [73.5, 74.1, 71.8, 72.4, 69.9, 70.6, 67.2, 66.5, 67.1, 64.3];
const EVEN = [18.4, 19.2, 18.1, 17.6, 18.9, 19.5, 18.2, 17.9, 18.8, 18.4];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'sparkline',
  group: 'charts',
  title: 'Sparkline',
  description: 'A small line of numbers with the area under it (rui-core/charts), no axes: a trend at a glance; `trend` colors it by its last value against its first.',
  props: [
    { name: 'data', type: '(number | null)[]', description: 'The values.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The line and fill.' },
    { name: 'trend', type: '{ up, down, flat }', description: 'The color of each trend (the last value against the first), over `color`.' },
    { name: 'curve', type: "'linear' | 'natural' | 'monotone' | 'step' | …", default: "'monotone'", description: 'How the points are joined.' },
    { name: 'lineWidth', type: 'number', default: '1.5', description: 'The line’s width.' },
    { name: 'fillOpacity', type: 'number', default: "'opacity.soft' (0.3)", description: 'The fill’s opacity (at its top when it fades).' },
    { name: 'fade', type: 'boolean', default: 'false', description: 'The fill fades downwards; solid by default.' },
    { name: 'bridge', type: 'boolean', default: 'false', description: 'The line goes over missing values; by default a gap breaks it.' },
    { name: 'w / h', type: 'number', default: 'the box’s width / 60', description: 'The size.' },
  ],
  demos: [
    {
      title: 'One price, three curves',
      code: `
// Closing prices over ten sessions.
const RISING = [41.2, 40.6, 42.9, 42.1, 44.8, 44.3, 46.7, 45.9, 48.4, 49.6];

function Demo() {
  return (
    <Row gap="xl">
      <Sparkline w={160} h={48} data={RISING} />
      <Sparkline w={160} h={48} data={RISING} curve="linear" color="violet" fade fillOpacity={0.45} />
      <Sparkline w={160} h={48} data={RISING} curve="step" color="cyan" fillOpacity={0} lineWidth={2} />
    </Row>
  );
}`,
      view: () => (
        <Row gap="xl">
          <Sparkline w={160} h={48} data={RISING} />
          <Sparkline w={160} h={48} data={RISING} curve="linear" color="violet" fade fillOpacity={0.45} />
          <Sparkline w={160} h={48} data={RISING} curve="step" color="cyan" fillOpacity={0} lineWidth={2} />
        </Row>
      ),
      height: 90,
    },
    {
      title: 'Tickers colored by trend',
      code: `
const RISING = [41.2, 40.6, 42.9, 42.1, 44.8, 44.3, 46.7, 45.9, 48.4, 49.6];
const FALLING = [73.5, 74.1, 71.8, 72.4, 69.9, 70.6, 67.2, 66.5, 67.1, 64.3];
const EVEN = [18.4, 19.2, 18.1, 17.6, 18.9, 19.5, 18.2, 17.9, 18.8, 18.4];

function Demo() {
  const trend = { up: 'teal', down: 'orange', flat: 'gray.6' };
  return (
    <Row gap="xl">
      <Stack gap={4}><Text size="sm">NRTH 49.60 +20 %</Text><Sparkline w={170} h={40} data={RISING} trend={trend} /></Stack>
      <Stack gap={4}><Text size="sm">KELP 64.30 −13 %</Text><Sparkline w={170} h={40} data={FALLING} trend={trend} /></Stack>
      <Stack gap={4}><Text size="sm">MOSS 18.40 0 %</Text><Sparkline w={170} h={40} data={EVEN} trend={trend} /></Stack>
    </Row>
  );
}`,
      view: () => {
        const trend = { up: 'teal', down: 'orange', flat: 'gray.6' };
        return (
          <Row gap="xl">
            <Stack gap={4}>
              <Text size="sm">NRTH 49.60 +20 %</Text>
              <Sparkline w={170} h={40} data={RISING} trend={trend} />
            </Stack>
            <Stack gap={4}>
              <Text size="sm">KELP 64.30 −13 %</Text>
              <Sparkline w={170} h={40} data={FALLING} trend={trend} />
            </Stack>
            <Stack gap={4}>
              <Text size="sm">MOSS 18.40 0 %</Text>
              <Sparkline w={170} h={40} data={EVEN} trend={trend} />
            </Stack>
          </Row>
        );
      },
      height: 100,
    },
  ],
};
