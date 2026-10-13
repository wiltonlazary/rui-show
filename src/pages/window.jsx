// Window (rui-core/more): windows dragged by their title bars, resized from
// their edges, collapsed, closed, the pressed one on top.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Box, Button, Row, Text } from 'rui-core';
import { Window } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'window',
  group: 'layers',
  title: 'Window',
  description: 'A desktop-style window (rui-core/more) over its parent: dragged by its title bar, resized from its right and bottom edges and its corner, collapsed to the title bar, closed; a pressed window comes above the others of its root. Escape in it closes it.',
  props: [
    { name: 'title', type: 'string | any', description: 'The title bar’s text.' },
    { name: 'aria-label', type: 'string', description: 'The dialog’s name, in place of its title.' },
    { name: 'open / defaultOpen / onOpenChange', type: 'boolean / (open) => void', default: 'true', description: 'Whether it shows; the close button and Escape call `onOpenChange(false)`.' },
    { name: 'position / defaultPosition / onPositionChange', type: '{ x, y }', default: 'theme.sizes.box.at ({ x: 20, y: 20 })', description: 'Where it is.' },
    { name: 'size / defaultSize / onSizeChange', type: '{ width, height }', default: 'theme.sizes.box.window ({ width: 320, height: 240 })', description: 'Its size.' },
    { name: 'bounds', type: '{ min?: { width?, height? }, max?: { width?, height? } }', default: 'min theme.sizes.box.windowMin (160 × 80), max unbounded', description: 'The range a resize keeps; any part may be left out.' },
    { name: 'draggable / resizable', type: 'boolean', default: 'true', description: 'Dragged by the title bar; resized from the right and bottom edges and the corner.' },
    { name: 'onMove / onResize', type: "(phase: 'start' | 'end') => void", description: 'Hear `start` at a drag’s first move (a resize’s start) and `end` as it lets go.' },
    { name: 'closable / collapsible', type: 'boolean | { label } / boolean', default: 'true', description: 'The title bar’s buttons (the close button’s label is `Close window`).' },
    { name: 'collapsed / defaultCollapsed / onCollapsedChange', type: 'boolean', default: 'false', description: 'Collapsed to its title bar.' },
    { name: 'dismiss', type: 'boolean | { escape }', default: '{ escape: true }', description: 'Escape closes it; `false` for never.' },
    { name: 'layer', type: 'number', default: 'LAYERS.sheet (20)', description: 'The base stacking order; a root’s windows take as many steps above it as there are windows, and a pressed window comes to the front of them.' },
    { name: 'radius / shadow', type: "'xs' … 'xl' | number / 'xs' … 'xl'", default: "'md' / 'md'", description: 'The look.' },
    { name: 'portal', type: 'boolean', default: 'false', description: 'Over the page’s layer instead of its parent.' },
  ],
  demos: [
    {
      title: 'Two windows',
      code: `
function Demo() {
  const notes = $signal($active(), true);
  const moves = $signal($active(), 0);
  return (
    <Box h={300}>
      <Row gap="sm" align="center">
        <Button size="xs" variant="neutral" onPress={() => $write(notes, true)}>Open the notes</Button>
        <Text size="sm" fg="quiet">{() => \`notes moved \${$read(moves)} times\`}</Text>
      </Row>
      <Window
        title="Notes"
        open={notes}
        onOpenChange={v => $write(notes, v)}
        defaultPosition={{ x: 10, y: 40 }}
        defaultSize={{ width: 260, height: 160 }}
        bounds={{ min: { width: 200, height: 100 }, max: { width: 420, height: 240 } }}
        onMove={phase => phase === 'end' && $write(moves, $read(moves) + 1)}
      >
        <Text size="sm" p="sm">Drag me by my title bar, resize me from my edges.</Text>
      </Window>
      <Window title="Palette" defaultPosition={{ x: 300, y: 80 }} defaultSize={{ width: 240, height: 180 }} closable={false}>
        <Text size="sm" p="sm">Press a window to bring it forward.</Text>
      </Window>
    </Box>
  );
}`,
      view: () => {
        const notes = $signal($active(), true);
        const moves = $signal($active(), 0);
        return (
          <Box h={300}>
            <Row gap="sm" align="center">
              <Button size="xs" variant="neutral" onPress={() => $write(notes, true)}>
                Open the notes
              </Button>
              <Text size="sm" fg="quiet">
                {() => `notes moved ${$read(moves)} times`}
              </Text>
            </Row>
            <Window
              title="Notes"
              open={notes}
              onOpenChange={(/** @type {boolean} */ v) => $write(notes, v)}
              defaultPosition={{ x: 10, y: 40 }}
              defaultSize={{ width: 260, height: 160 }}
              bounds={{ min: { width: 200, height: 100 }, max: { width: 420, height: 240 } }}
              onMove={(/** @type {'start' | 'end'} */ phase) => phase === 'end' && $write(moves, $read(moves) + 1)}
            >
              <Text size="sm" p="sm">
                Drag me by my title bar, resize me from my edges.
              </Text>
            </Window>
            <Window title="Palette" defaultPosition={{ x: 300, y: 80 }} defaultSize={{ width: 240, height: 180 }} closable={false}>
              <Text size="sm" p="sm">
                Press a window to bring it forward.
              </Text>
            </Window>
          </Box>
        );
      },
      height: 332,
    },
  ],
};
