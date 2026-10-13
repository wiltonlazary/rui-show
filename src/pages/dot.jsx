// Dot: a dot or a small label on a point of its child, by fractions of its box.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Box, Button, Dot, DotsIcon, IconButton, Row, SegmentedControl, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'dot',
  group: 'data',
  title: 'Dot',
  description: 'A dot, or a small label, placed on any point of its child’s box by fractions (`anchor`) and drawn over it (an absolute item with a `layer`, so the canvases paint it after the content around it).',
  props: [
    { name: 'anchor', type: '{ x?: number, y?: number }', default: '{ x: 1, y: 0 }', description: 'The point the mark’s center sits on, as fractions of the child’s box from 0 to 1: x from the start edge, y from the top (the top end corner by default); a missing key takes the default’s value, and each is clamped to 0..1.' },
    { name: 'offset', type: 'number', default: '0', description: 'Moves the mark’s center toward the box’s middle, in pixels: by `offset × (1 − 2x)` and `offset × (1 − 2y)`, so a corner mark moves in on both axes and an edge’s midpoint only across it; negative moves it out.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'xs' (8)", description: 'The mark’s side: a `theme.sizes.indicator` step (8, 12, 16, 24, 32 px) or pixels.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'A theme color name, `name.shade`, or hex.' },
    { name: 'label', type: 'string | number', description: 'Text in the mark, which becomes a pill as tall as the larger of `size` and a line of xs text, its text strong in the contrast ink on the fill; a single figure sits in a circle.' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'A hairline ring (`theme.sizes.divider.xs`, 1 px) in the page’s `raised` color, inside the mark’s side, setting it off its child.' },
    { name: 'shown', type: 'boolean | (() => boolean)', default: 'true', description: 'Whether the mark shows; false hides it and keeps the child.' },
    { name: 'inline', type: 'boolean', default: 'false', description: 'As wide as its child, rather than its parent’s full width in a column.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'round', description: 'The mark’s corner radius.' },
    { name: 'layer', type: 'number', default: 'LAYERS.raised (10)', description: 'The mark’s stacking order.' },
    { name: 'children', type: 'any', description: 'The content the mark is placed on.' },
  ],
  demos: [
    {
      title: 'Placing the mark',
      code: `
function Demo() {
  const x = $signal($active(), '1');
  const y = $signal($active(), '0');
  return (
    <Stack gap="sm" align="start">
      <Row gap="sm" align="center">
        <Text size="sm" fg="quiet">x</Text>
        <SegmentedControl aria-label="x" size="xs" data={['0', '0.5', '1']} value={x} onChange={v => $write(x, v)} />
        <Text size="sm" fg="quiet">y</Text>
        <SegmentedControl aria-label="y" size="xs" data={['0', '0.5', '1']} value={y} onChange={v => $write(y, v)} />
      </Row>
      <Dot inline anchor={() => ({ x: Number($read(x)), y: Number($read(y)) })} color="magenta" size="sm">
        <Box w={180} h={64} p="sm" bg="gray.1" style={{ radius: 10 }}>
          <Text size="sm">Inbox</Text>
        </Box>
      </Dot>
      <Text size="sm" fg="quiet">{() => \`anchor={{ x: \${$read(x)}, y: \${$read(y)} }}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const x = $signal($active(), '1');
        const y = $signal($active(), '0');
        return (
          <Stack gap="sm" align="start">
            <Row gap="sm" align="center">
              <Text size="sm" fg="quiet">
                x
              </Text>
              <SegmentedControl aria-label="x" size="xs" data={['0', '0.5', '1']} value={x} onChange={(/** @type {string} */ v) => $write(x, v)} />
              <Text size="sm" fg="quiet">
                y
              </Text>
              <SegmentedControl aria-label="y" size="xs" data={['0', '0.5', '1']} value={y} onChange={(/** @type {string} */ v) => $write(y, v)} />
            </Row>
            <Dot inline anchor={() => ({ x: Number($read(x)), y: Number($read(y)) })} color="magenta" size="sm">
              <Box w={180} h={64} p="sm" bg="gray.1" style={{ radius: 10 }}>
                <Text size="sm">Inbox</Text>
              </Box>
            </Dot>
            <Text size="sm" fg="quiet">
              {() => `anchor={{ x: ${$read(x)}, y: ${$read(y)} }}`}
            </Text>
          </Stack>
        );
      },
      height: 170,
    },
    {
      title: 'An unread count on the inbox, a ringed dot on a menu',
      code: `
function Demo() {
  const unread = $signal($active(), 3);
  const fresh = $signal($active(), true);
  return (
    <Stack gap="md" align="start">
      <Row gap="lg" p="xs" align="center">
        <Dot inline label={() => $read(unread)} offset={2} color="red" shown={() => $read(unread) > 0}>
          <Button size="sm" variant="neutral" onPress={() => $write(unread, Math.max(0, $read(unread) - 1))}>Inbox</Button>
        </Dot>
        <Dot inline size="sm" offset={4} bordered color="orange" shown={() => $read(fresh)}>
          <IconButton variant="neutral" label="More actions" onPress={() => $write(fresh, false)}>
            <DotsIcon size={16} />
          </IconButton>
        </Dot>
        <Button size="xs" variant="soft" onPress={() => ($write(unread, $read(unread) + 1), $write(fresh, true))}>Mail arrives</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => \`\${$read(unread)} unread; \${$read(fresh) ? 'something new in the menu' : 'menu seen'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const unread = $signal($active(), 3);
        const fresh = $signal($active(), true);
        return (
          <Stack gap="md" align="start">
            <Row gap="lg" p="xs" align="center">
              <Dot inline label={() => $read(unread)} offset={2} color="red" shown={() => $read(unread) > 0}>
                <Button size="sm" variant="neutral" onPress={() => $write(unread, Math.max(0, $read(unread) - 1))}>
                  Inbox
                </Button>
              </Dot>
              <Dot inline size="sm" offset={4} bordered color="orange" shown={() => $read(fresh)}>
                <IconButton variant="neutral" label="More actions" onPress={() => $write(fresh, false)}>
                  <DotsIcon size={16} />
                </IconButton>
              </Dot>
              <Button size="xs" variant="soft" onPress={() => ($write(unread, $read(unread) + 1), $write(fresh, true))}>
                Mail arrives
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `${$read(unread)} unread; ${$read(fresh) ? 'something new in the menu' : 'menu seen'}`}
            </Text>
          </Stack>
        );
      },
      height: 130,
      unordered: true,
    },
  ],
};
