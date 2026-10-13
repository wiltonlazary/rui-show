// Floater: a window dragged by the pointer, by its title bar only,
// or along one axis, kept inside the demo's box; resized by its corner.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Floater, Box, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'floater',
  group: 'layers',
  title: 'Floater',
  description: 'A window dragged by the pointer, which it captures while it moves. With a Floater.Handle inside, only the handle drags it. These demos keep it in place in their box (`portal={false}`); by default it floats over the page. It stays inside the viewport (a fixed View over it: the page on the DOM, the canvas on Skia and three.js). A Floater.Grip resizes it within its `bounds`, dragged or by the arrow keys once focused.',
  props: [
    { name: 'defaultPosition', type: '{ top, left }', default: 'theme.sizes.box.at ({ top: 20, left: 20 })', description: 'Where it starts, when it holds its own place.' },
    { name: 'position', type: '{ top, left } | (() => { top, left })', description: 'Where it is, held by you (with `onPositionChange`).' },
    { name: 'onPositionChange', type: '(position: { top, left }) => void', description: 'Called as it is dragged.' },
    { name: 'onDragStart / onDragEnd', type: '() => void', description: 'Called when a drag starts and ends.' },
    { name: 'draggable', type: 'boolean', default: 'true', description: 'Whether it can be dragged.' },
    { name: 'axis', type: "'x' | 'y'", description: 'Drags along one axis only.' },
    { name: 'contained', type: 'boolean', default: 'true', description: 'Keeps it (and its size) inside the viewport; where the viewport cannot be measured (a worker) nothing is constrained.' },
    { name: 'margin', type: 'number', default: '0', description: 'Its least distance from the viewport’s edges while contained.' },
    { name: 'defaultSize', type: '{ width, height }', description: 'Its size to start with, in pixels (unset: the content’s own).' },
    { name: 'size', type: '{ width, height } | (() => { width, height })', description: 'Its size, held by you (with `onSizeChange`).' },
    { name: 'onSizeChange', type: '(size: { width, height }) => void', description: 'Called as it is resized (each arrow key too).' },
    { name: 'bounds', type: '{ min?: { width?, height? }, max?: { width?, height? } }', description: 'The range a resize keeps (any part may be left out); the viewport too while contained.' },
    { name: 'onResize', type: "(phase: 'start' | 'end') => void", description: 'Hears `start` and `end` around each resize (around each arrow key too).' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'Draws a border.' },
    { name: 'shadow', type: "'xs' … 'xl'", default: "'md'", description: 'Its shadow.' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: 'theme.corner', description: 'Corner radius.' },
    { name: 'p', type: "'xs' … 'xl' | number", default: "'md'", description: 'The inner padding.' },
    { name: 'w', type: 'number | string', description: 'Its width.' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'Over the page in the portal layer; false places it in its parent.' },
    { name: 'layer', type: 'number', default: 'LAYERS.sheet (20)', description: 'Its stacking order.' },
    { name: 'Floater.Handle', type: '{ children }', description: 'The part that drags it (a title bar).' },
    { name: 'Floater.Grip', type: '{ children, label }', description: 'Its bottom right corner, `sizes.glyph.md` (16 px; notches drawn, or its children), that resizes it: dragged, or focused and stepped by the arrow keys (`spacing.xs`, 8 px; `spacing.xl`, 32 px, with Shift). `label` names it (`Drag to resize`).' },
    { name: 'aria-label', type: 'string', description: 'The dialog’s accessible name: its title.' },
  ],
  demos: [
    {
      title: 'Dragged by its title bar',
      code: `
function Demo() {
  const at = $signal($active(), { top: 20, left: 20 });
  return (
    <Box h={200}>
      <Text size="sm" fg="quiet">{() => \`top \${Math.round($read(at).top)}, left \${Math.round($read(at).left)}\`}</Text>
      <Floater aria-label="Drag me by this bar" position={at} onPositionChange={p => $write(at, p)} portal={false} w={260} bordered p="sm">
        <Floater.Handle>
          <Text fontWeight={700} size="sm">Drag me by this bar</Text>
        </Floater.Handle>
        <Text size="sm" mt="xs">The body does not drag the window.</Text>
      </Floater>
    </Box>
  );
}`,
      view: () => {
        const at = $signal($active(), { top: 20, left: 20 });
        return (
          <Box h={200}>
            <Text size="sm" fg="quiet">
              {() => `top ${Math.round($read(at).top)}, left ${Math.round($read(at).left)}`}
            </Text>
            <Floater aria-label="Drag me by this bar" position={at} onPositionChange={(/** @type {any} */ p) => $write(at, p)} portal={false} w={260} bordered p="sm">
              <Floater.Handle>
                <Text fontWeight={700} size="sm">
                  Drag me by this bar
                </Text>
              </Floater.Handle>
              <Text size="sm" mt="xs">
                The body does not drag the window.
              </Text>
            </Floater>
          </Box>
        );
      },
      height: 232,
    },
    {
      title: 'Anywhere on it, along x only',
      code: `
function Demo() {
  return (
    <Box h={100}>
      <Floater aria-label="Drag me sideways" portal={false} axis="x" defaultPosition={{ top: 10, left: 10 }} radius="md" shadow="lg">
        <Text size="sm">Drag me sideways</Text>
      </Floater>
    </Box>
  );
}`,
      view: () => (
        <Box h={100}>
          <Floater aria-label="Drag me sideways" portal={false} axis="x" defaultPosition={{ top: 10, left: 10 }} radius="md" shadow="lg">
            <Text size="sm">Drag me sideways</Text>
          </Floater>
        </Box>
      ),
      height: 132,
    },
    {
      title: 'Resized by its corner',
      code: `
function Demo() {
  const size = $signal($active(), { width: 240, height: 110 });
  return (
    <Box h={210}>
      <Text size="sm" fg="quiet">{() => \`\${$read(size).width} x \${$read(size).height}\`}</Text>
      <Floater
        aria-label="Notes"
        portal={false}
        defaultPosition={{ top: 30, left: 10 }}
        defaultSize={{ width: 240, height: 110 }}
        bounds={{ min: { width: 180, height: 80 }, max: { width: 420, height: 170 } }}
        onSizeChange={s => $write(size, s)}
        bordered
        p="sm"
      >
        <Floater.Handle>
          <Text fontWeight={700} size="sm">Notes</Text>
        </Floater.Handle>
        <Text size="sm" mt="xs">Drag the corner, or focus it and press the arrows.</Text>
        <Floater.Grip />
      </Floater>
    </Box>
  );
}`,
      view: () => {
        const size = $signal($active(), { width: 240, height: 110 });
        return (
          <Box h={210}>
            <Text size="sm" fg="quiet">
              {() => `${$read(size).width} x ${$read(size).height}`}
            </Text>
            <Floater
              aria-label="Notes"
              portal={false}
              defaultPosition={{ top: 30, left: 10 }}
              defaultSize={{ width: 240, height: 110 }}
              bounds={{ min: { width: 180, height: 80 }, max: { width: 420, height: 170 } }}
              onSizeChange={(/** @type {{ width: number, height: number }} */ s) => $write(size, s)}
              bordered
              p="sm"
            >
              <Floater.Handle>
                <Text fontWeight={700} size="sm">
                  Notes
                </Text>
              </Floater.Handle>
              <Text size="sm" mt="xs">
                Drag the corner, or focus it and press the arrows.
              </Text>
              <Floater.Grip />
            </Floater>
          </Box>
        );
      },
      height: 242,
    },
  ],
};
