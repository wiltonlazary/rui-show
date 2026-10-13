// Rings (rui-core/more): concentric progress rings.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Row, Slider, Stack, Text } from 'rui-core';
import { Rings } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'rings',
  group: 'status',
  title: 'Rings',
  description: 'Concentric progress rings (rui-core/more), as activity rings: each ring’s arc from the top, clockwise, over a translucent track of its color, with a label in the middle.',
  props: [
    { name: 'rings', type: '{ value, color }[]', description: 'The rings, outermost first; `value` in percent.' },
    { name: 'size', type: 'number', default: '112', description: 'Its diameter.' },
    { name: 'thickness / gap', type: 'number', default: '10 / 4', description: 'Each ring’s width and the space between.' },
    { name: 'round', type: 'boolean', default: 'true', description: 'Round ends.' },
    { name: 'trackOpacity', type: 'number', default: "'opacity.faint' (0.16)", description: 'The tracks’ opacity.' },
    { name: 'label', type: 'any', description: 'In the middle.' },
  ],
  demos: [
    {
      title: 'Three activity goals',
      code: `
function Demo() {
  const move = $signal($active(), 72);
  return (
    <Row gap="xl" align="center">
      <Rings
        size={140}
        label={<Text size="sm" fontWeight={700}>{() => \`\${$read(move)}%\`}</Text>}
        rings={() => [{ value: $read(move), color: 'red' }, { value: 48, color: 'lime' }, { value: 90, color: 'cyan' }]}
      />
      <Rings size={100} thickness={8} gap={2} round={false} rings={[{ value: 30, color: 'purple' }, { value: 60, color: 'orange' }]} />
      <Stack gap="xs" w={220}>
        <Text size="sm">Move</Text>
        <Slider thumbLabel="Move" value={move} onChange={v => $write(move, v)} color="red" />
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const move = $signal($active(), 72);
        return (
          <Row gap="xl" align="center">
            <Rings
              size={140}
              label={
                <Text size="sm" fontWeight={700}>
                  {() => `${$read(move)}%`}
                </Text>
              }
              rings={() => [
                { value: $read(move), color: 'red' },
                { value: 48, color: 'lime' },
                { value: 90, color: 'cyan' },
              ]}
            />
            <Rings
              size={100}
              thickness={8}
              gap={2}
              round={false}
              rings={[
                { value: 30, color: 'purple' },
                { value: 60, color: 'orange' },
              ]}
            />
            <Stack gap="xs" w={220}>
              <Text size="sm">Move</Text>
              <Slider thumbLabel="Move" value={move} onChange={(/** @type {number} */ v) => $write(move, v)} color="red" />
            </Stack>
          </Row>
        );
      },
      height: 172,
    },
  ],
};
