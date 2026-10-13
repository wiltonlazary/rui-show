// Backdrop: a color or a gradient over its parent, toggled, gradients, and
// centered content that is pressable.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Backdrop, Box, Button, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'backdrop',
  group: 'layers',
  title: 'Backdrop',
  description: 'A color or a gradient laid over its parent (absolute, inset 0), or over the whole viewport with `fixed`.',
  props: [
    { name: 'color', type: 'string', default: 'the dark page’s sunken ground', description: 'The backdrop’s color: a theme color name, `name.shade` or hex.' },
    { name: 'opacity', type: 'number', default: 'theme.opacity.disabled (0.45); opacity.muted (0.7) in the dark scheme', description: 'The color’s opacity, 0 to 1: it fades only the color or a gradient’s stops, not the content.' },
    { name: 'gradient', type: '{ colors, angle } | { linear, stops } | { radial, stops }', description: 'A gradient in place of the color: `{ colors, angle }` or a portable gradient.' },
    { name: 'center', type: 'boolean', default: 'false', description: 'Centers its children over the parent.' },
    { name: 'fixed', type: 'boolean', default: 'false', description: 'Covers the viewport (`position: fixed`) instead of the parent.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", description: 'Corner radius, to match a rounded parent.' },
    { name: 'layer', type: 'number', default: 'LAYERS.sheet (20)', description: 'Its stacking order: under the sheet it shades.' },
    { name: 'onPress', type: '(event) => void', description: 'Called when the backdrop is pressed.' },
    { name: 'children', type: 'any', description: 'Content over the color (with `center`, in the middle).' },
    { name: 'style props', type: 'm, p, w, …', description: 'As Box.' },
  ],
  demos: [
    {
      title: 'Over its parent',
      code: `
function Demo() {
  const shown = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Button w={160} onPress={() => $write(shown, !$read(shown))}>Dim the card</Button>
      <Box h={90} p="md" bg="blue.1" style={{ radius: 8 }}>
        <Text fontWeight={700}>Content under the backdrop</Text>
        <Text size="sm">It is still here, dimmed.</Text>
        {() => ($read(shown) ? <Backdrop color="night.9" opacity={0.5} radius="md" /> : null)}
      </Box>
    </Stack>
  );
}`,
      view: () => {
        const shown = $signal($active(), true);
        return (
          <Stack gap="sm">
            <Button w={160} onPress={() => $write(shown, !$read(shown))}>
              Dim the card
            </Button>
            <Box h={90} p="md" bg="blue.1" style={{ radius: 8 }}>
              <Text fontWeight={700}>Content under the backdrop</Text>
              <Text size="sm">It is still here, dimmed.</Text>
              {() => ($read(shown) ? <Backdrop color="night.9" opacity={0.5} radius="md" /> : null)}
            </Box>
          </Stack>
        );
      },
      height: 160,
    },
    {
      title: 'Gradients',
      code: `
function Demo() {
  return (
    <Row fill gap="md">
      <Box h={100} p="sm">
        <Text>Purple to cyan</Text>
        <Backdrop gradient={{ colors: ['purple', 'cyan'], angle: 45 }} opacity={0.85} radius="md" />
      </Box>
      <Box h={100} p="sm">
        <Text>Clear to black</Text>
        <Backdrop gradient={{ linear: 180, stops: [[0, '#00000000'], [1, '#000000e6']] }} radius="md" />
      </Box>
    </Row>
  );
}`,
      view: () => (
        <Row fill gap="md">
          <Box h={100} p="sm">
            <Text>Purple to cyan</Text>
            <Backdrop gradient={{ colors: ['purple', 'cyan'], angle: 45 }} opacity={0.85} radius="md" />
          </Box>
          <Box h={100} p="sm">
            <Text>Clear to black</Text>
            <Backdrop
              gradient={{
                linear: 180,
                stops: [
                  [0, '#00000000'],
                  [1, '#000000e6'],
                ],
              }}
              radius="md"
            />
          </Box>
        </Row>
      ),
      height: 140,
    },
    {
      title: 'Content in the middle; a press on it reaches the backdrop',
      code: `
function Demo() {
  const hits = $signal($active(), 0);
  return (
    <Stack gap="sm">
      <Text size="sm" fg="quiet">{() => \`pressed \${$read(hits)} times\`}</Text>
      <Box h={80}>
        <Backdrop color="teal" opacity={0.3} radius="sm" center onPress={() => $write(hits, $read(hits) + 1)}>
          <Button variant="inverse">Press the backdrop</Button>
        </Backdrop>
      </Box>
    </Stack>
  );
}`,
      view: () => {
        const hits = $signal($active(), 0);
        return (
          <Stack gap="sm">
            <Text size="sm" fg="quiet">
              {() => `pressed ${$read(hits)} times`}
            </Text>
            <Box h={80}>
              <Backdrop color="teal" opacity={0.3} radius="sm" center onPress={() => $write(hits, $read(hits) + 1)}>
                <Button variant="inverse">Press the backdrop</Button>
              </Backdrop>
            </Box>
          </Stack>
        );
      },
      height: 140,
    },
  ],
};
