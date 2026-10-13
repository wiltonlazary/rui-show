// $outside: a press outside an element.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $outside, $open } from 'rui-core/hooks';
import { Badge, Button, Row, Stack, Surface, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-outside',
  group: 'behavior',
  title: '$outside',
  description: 'Calls a handler for a press outside an element, to close what a press elsewhere dismisses. Portable, with no document listeners: spread `inside` on the element and `outside` on an ancestor covering what counts as outside (the application’s outer view, an overlay); presses beyond that ancestor are not seen.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument; no root is needed.' },
    { name: 'handler', type: '(event) => void', description: 'Called with the press event of each press outside.' },
    { name: 'returns', type: '{ inside: { onPointerDown }, outside: { onPointerDown } }', description: 'The props for the element (or elements) that count as inside, and for the ancestor that sees the rest.' },
  ],
  demos: [
    {
      title: 'A panel a press elsewhere closes',
      code: `
function Demo() {
  const outsidePresses = $signal($active(), 0);
  const panel = $open(true);
  const { inside, outside } = $outside(() => {
    $write(outsidePresses, $read(outsidePresses) + 1);
    panel.close();
  });
  return (
    <Surface {...outside} bordered p="md" bg="gray.0">
      <Stack gap="sm">
        <Row gap="sm">
          <Text size="sm">Press anywhere in this gray area to close the panel.</Text>
          <Badge variant="soft">{() => \`\${$read(outsidePresses)} outside\`}</Badge>
        </Row>
        <Surface {...inside} bordered shadow="sm" p="sm" w={320}>
          <Row gap="sm">
            <Text size="sm">{() => ($read(panel.value) ? 'Panel open: press me freely' : 'Panel closed')}</Text>
            <Button size="xs" variant="soft" onPress={panel.open}>Open</Button>
          </Row>
        </Surface>
      </Stack>
    </Surface>
  );
}`,
      view: () => {
        const outsidePresses = $signal($active(), 0);
        const panel = $open(true);
        const { inside, outside } = $outside(() => {
          $write(outsidePresses, $read(outsidePresses) + 1);
          panel.close();
        });
        return (
          <Surface {...outside} bordered p="md" bg="gray.0">
            <Stack gap="sm">
              <Row gap="sm">
                <Text size="sm">Press anywhere in this gray area to close the panel.</Text>
                <Badge variant="soft">{() => `${$read(outsidePresses)} outside`}</Badge>
              </Row>
              <Surface {...inside} bordered shadow="sm" p="sm" w={320}>
                <Row gap="sm">
                  <Text size="sm">{() => ($read(panel.value) ? 'Panel open: press me freely' : 'Panel closed')}</Text>
                  <Button size="xs" variant="soft" onPress={panel.open}>
                    Open
                  </Button>
                </Row>
              </Surface>
            </Stack>
          </Surface>
        );
      },
      height: 140,
    },
  ],
};
