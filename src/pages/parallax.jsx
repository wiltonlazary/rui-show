// Parallax (rui-core/more): layers moving against the pointer, or by their
// depth as the region scrolls.

import { Surface, Text } from 'rui-core';
import { Parallax } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'parallax',
  group: 'data',
  title: 'Parallax',
  description: 'Layers at depths (rui-core/more) that move against the pointer, and tilt, or move by their depth as the region scrolls; by transforms, painted and never reflowed.',
  props: [
    { name: 'source', type: "'pointer' | 'scroll'", default: "'pointer'", description: 'What moves the layers.' },
    { name: 'strength', type: 'number', default: "spacing 'lg' (24)", description: 'Pixels a layer of depth 1 moves at the edges (pointer).' },
    { name: 'tilt', type: 'number', default: '0', description: 'Degrees a layer of depth 1 turns at the left and right edges (pointer).' },
    { name: 'h / contentHeight', type: 'number', default: 'sizes.box.parallax (300) with scroll, else none / 2 × h', description: 'The region’s height; the scrolled height (scroll).' },
    { name: 'resetOnLeave', type: 'boolean', default: 'true', description: 'The layers go back when the pointer leaves.' },
    { name: 'onOffsetChange', type: '(offset) => void', description: 'Hears the region’s offset.' },
    { name: 'Parallax.Layer', type: '{ depth, style, children }', default: 'depth 0.5', description: 'A layer placed by its style’s numeric `top` and `left` in px (0 by default; `right`, `bottom` and percentages are not read), the region’s size by default.' },
  ],
  demos: [
    {
      title: 'Against the pointer, tilting',
      code: `
function Demo() {
  return (
    <Parallax w={560} h={220} strength={24} tilt={4} bg="gray.1" style={{ radius: 8 }}>
      <Parallax.Layer depth={0.2} style={{ top: 30, left: 40, width: 180, height: 90 }}>
        <Surface bg="blue.2" h="100%" radius="md" p="sm"><Text size="sm">far (0.2)</Text></Surface>
      </Parallax.Layer>
      <Parallax.Layer depth={0.6} style={{ top: 70, left: 200, width: 180, height: 90 }}>
        <Surface bg="purple.3" h="100%" radius="md" p="sm"><Text size="sm">middle (0.6)</Text></Surface>
      </Parallax.Layer>
      <Parallax.Layer depth={1} style={{ top: 110, left: 350, width: 170, height: 90 }}>
        <Surface bg="orange.4" h="100%" radius="md" p="sm"><Text size="sm">near (1)</Text></Surface>
      </Parallax.Layer>
    </Parallax>
  );
}`,
      view: () => (
        <Parallax w={560} h={220} strength={24} tilt={4} bg="gray.1" style={{ radius: 8 }}>
          <Parallax.Layer depth={0.2} style={{ top: 30, left: 40, width: 180, height: 90 }}>
            <Surface bg="blue.2" h="100%" radius="md" p="sm">
              <Text size="sm">far (0.2)</Text>
            </Surface>
          </Parallax.Layer>
          <Parallax.Layer depth={0.6} style={{ top: 70, left: 200, width: 180, height: 90 }}>
            <Surface bg="purple.3" h="100%" radius="md" p="sm">
              <Text size="sm">middle (0.6)</Text>
            </Surface>
          </Parallax.Layer>
          <Parallax.Layer depth={1} style={{ top: 110, left: 350, width: 170, height: 90 }}>
            <Surface bg="orange.4" h="100%" radius="md" p="sm">
              <Text size="sm">near (1)</Text>
            </Surface>
          </Parallax.Layer>
        </Parallax>
      ),
      height: 252,
    },
  ],
};
