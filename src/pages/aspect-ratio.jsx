// AspectRatio: content at a fixed width-to-height ratio.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { AspectRatio, Row, Stack, Button, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'aspect-ratio',
  group: 'structure',
  title: 'AspectRatio',
  description:
    'Content at a fixed ratio of width to height: the portable style’s `aspectRatio`, so its height follows its width on every resize, the same on every renderer.',
  props: [
    { name: 'ratio', type: 'number', default: '1', description: 'Width over height (`16 / 9`); a signal or accessor changes it in place.' },
    { name: 'children', type: 'any', description: 'The content, filling the box.' },
    { name: 'style props', type: 'w, maxWidth, m, bg, …', description: 'As Box: give it a width.' },
  ],
  demos: [
    {
      title: 'Ratios',
      code: `
const RATIOS = [['16 / 9', 16 / 9, 240, 'blue.6'], ['4 / 3', 4 / 3, 160, 'teal.6'], ['1 / 1', 1, 120, 'purple.6']];

function Demo() {
  return (
    <Row gap="md" align="start">
      {RATIOS.map(([name, ratio, width, color]) => (
        <Stack gap={4} w={width}>
          <AspectRatio ratio={ratio} bg={color} />
          <Text size="sm" fg="quiet">{\`\${name}, \${width} px wide\`}</Text>
        </Stack>
      ))}
    </Row>
  );
}`,
      view: () => {
        /** @type {[string, number, number, string][]} */
        const RATIOS = [
          ['16 / 9', 16 / 9, 240, 'blue.6'],
          ['4 / 3', 4 / 3, 160, 'teal.6'],
          ['1 / 1', 1, 120, 'purple.6'],
        ];
        return (
          <Row gap="md" align="start">
            {RATIOS.map(([name, ratio, width, color]) => (
              <Stack gap={4} w={width}>
                <AspectRatio ratio={ratio} bg={color} />
                <Text size="sm" fg="quiet">
                  {`${name}, ${width} px wide`}
                </Text>
              </Stack>
            ))}
          </Row>
        );
      },
      height: 170,
    },
    {
      title: 'A ratio that changes',
      code: `
const RATIOS = [['16 / 9', 16 / 9], ['4 / 3', 4 / 3], ['1 / 1', 1], ['21 / 9', 21 / 9]];

function Demo() {
  const ratio = $signal($active(), 16 / 9);
  const name = $signal($active(), '16 / 9');
  return (
    <Stack gap="sm">
      <Row gap="xs">
        {RATIOS.map(([n, r]) => (
          <Button size="sm" dense variant="neutral" onPress={() => ($write(ratio, r), $write(name, n))}>{n}</Button>
        ))}
        <Text size="sm" fg="quiet">{() => \`ratio \${$read(name)}\`}</Text>
      </Row>
      <AspectRatio ratio={ratio} w={200} bg="indigo.1" />
    </Stack>
  );
}`,
      view: () => {
        /** @type {[string, number][]} */
        const RATIOS = [
          ['16 / 9', 16 / 9],
          ['4 / 3', 4 / 3],
          ['1 / 1', 1],
          ['21 / 9', 21 / 9],
        ];
        const ratio = $signal($active(), 16 / 9);
        const name = $signal($active(), '16 / 9');
        return (
          <Stack gap="sm">
            <Row gap="xs">
              {RATIOS.map(([n, r]) => (
                <Button size="sm" dense variant="neutral" onPress={() => ($write(ratio, r), $write(name, n))}>
                  {n}
                </Button>
              ))}
              <Text size="sm" fg="quiet">
                {() => `ratio ${$read(name)}`}
              </Text>
            </Row>
            <AspectRatio ratio={ratio} w={200} bg="indigo.1" />
          </Stack>
        );
      },
      height: 250,
    },
  ],
};
