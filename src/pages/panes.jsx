// Panes: panes resized by dragging or stepping the handles between them,
// in percents or in pixels.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Panes, Surface, Button, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'panes',
  group: 'structure',
  title: 'Panes',
  description:
    'Panes side by side or stacked, a handle between each pair: dragged (with pointer capture) or stepped by keys, each pane within its limits. A number is pixels, a string such as \'30%\' a percent of the room the panes share; the same on every renderer.',
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Panes side by side, or stacked.' },
    { name: 'sizes / defaultSizes', type: "(number | '30%')[] | Signal", description: 'Held by you (with `onSizesChange`), or the first sizes. One unit per list: pixels for every pane but the last, which takes the rest (a missing size is `sizes.box.pane`, 200); or percents of the measured room (a number in a percent list is pixels of it; a missing pane shares what is left, at least its `min`; under 100% leaves the rest empty). Sizes outside a pane’s `min`/`max` are laid out and reported within them. With no sizes, pixels.' },
    { name: 'onSizesChange', type: '(sizes) => void', description: 'Hears the sizes as a handle moves, in the list’s unit (\'60%\' strings for percents).' },
    { name: 'onCommit', type: '(sizes) => void', description: 'Hears the sizes when a drag or a key that changed them ends.' },
    { name: 'handle', type: 'boolean', default: 'true', description: 'Draws each handle’s line (`sizes.divider.xs`, the page’s rule) and grip; false leaves an invisible handle.' },
    { name: 'handleSize', type: 'number', default: 'spacing.xs (8)', description: 'The handle’s thickness.' },
    { name: 'step', type: 'number', default: 'spacing.xs px (as a percent of the room in a percent list)', description: 'How far an arrow key moves a handle, in the list’s unit (Shift: five steps).' },
    { name: 'Handle keys', type: 'separator', description: 'Each handle is named ‘Resize pane N’: the arrows move it by `step` (Shift five steps), Home and End take the pane to its minimum and maximum.' },
    { name: 'Panes.Pane min / max', type: "number | '20%'", default: '0 / —', description: 'The pane’s bounds, in either unit (a percent of the room, or pixels, once it is measured).' },
    { name: 'style props', type: 'w, h, …', description: 'As Box, on Panes and on each Pane.' },
  ],
  demos: [
    {
      title: 'Three panes in percents, with limits',
      code: `
function Demo() {
  const sizes = $signal($active(), ['25%', '50%', '25%']);
  return (
    <Stack gap="xs">
      <Text size="sm" fg="quiet">{() => \`sizes: \${$read(sizes).join(' / ')}\`}</Text>
      <Surface bordered h={110}>
        <Panes h="100%" defaultSizes={['25%', '50%', '25%']} onSizesChange={s => $write(sizes, s)}>
          <Panes.Pane min="15%" p="sm"><Text size="sm">Files (15% or more)</Text></Panes.Pane>
          <Panes.Pane min="30%" p="sm"><Text size="sm">Editor (30% or more)</Text></Panes.Pane>
          <Panes.Pane max="40%" p="sm"><Text size="sm">Outline (40% at most)</Text></Panes.Pane>
        </Panes>
      </Surface>
    </Stack>
  );
}`,
      view: () => {
        const sizes = $signal($active(), ['25%', '50%', '25%']);
        return (
          <Stack gap="xs">
            <Text size="sm" fg="quiet">
              {() => `sizes: ${$read(sizes).join(' / ')}`}
            </Text>
            <Surface bordered h={110}>
              <Panes h="100%" defaultSizes={['25%', '50%', '25%']} onSizesChange={(/** @type {string[]} */ s) => $write(sizes, s)}>
                <Panes.Pane min="15%" p="sm">
                  <Text size="sm">Files (15% or more)</Text>
                </Panes.Pane>
                <Panes.Pane min="30%" p="sm">
                  <Text size="sm">Editor (30% or more)</Text>
                </Panes.Pane>
                <Panes.Pane max="40%" p="sm">
                  <Text size="sm">Outline (40% at most)</Text>
                </Panes.Pane>
              </Panes>
            </Surface>
          </Stack>
        );
      },
      height: 150,
    },
    {
      title: 'Stacked in pixels, held by a signal, committed at the end',
      code: `
function Demo() {
  const sizes = $signal($active(), [90]);
  const kept = $signal($active(), 'nothing committed yet');
  return (
    <Stack gap="xs">
      <Row gap="sm">
        <Button size="sm" dense variant="neutral" onPress={() => $write(sizes, [60])}>Short query</Button>
        <Button size="sm" dense variant="neutral" onPress={() => $write(sizes, [90])}>Reset</Button>
        <Text size="sm" fg="quiet">{() => \`query \${Math.round($read(sizes)[0])} px; \${$read(kept)}\`}</Text>
      </Row>
      <Surface bordered h={180}>
        <Panes orientation="vertical" h="100%" sizes={sizes} onSizesChange={s => $write(sizes, s)} onCommit={s => $write(kept, \`committed \${Math.round(s[0])} px\`)}>
          <Panes.Pane min={40} max={130} p="sm"><Text size="sm">Query</Text></Panes.Pane>
          <Panes.Pane p="sm"><Text size="sm">Results take the rest</Text></Panes.Pane>
        </Panes>
      </Surface>
    </Stack>
  );
}`,
      view: () => {
        const sizes = $signal($active(), [90]);
        const kept = $signal($active(), 'nothing committed yet');
        return (
          <Stack gap="xs">
            <Row gap="sm">
              <Button size="sm" dense variant="neutral" onPress={() => $write(sizes, [60])}>
                Short query
              </Button>
              <Button size="sm" dense variant="neutral" onPress={() => $write(sizes, [90])}>
                Reset
              </Button>
              <Text size="sm" fg="quiet">
                {() => `query ${Math.round($read(sizes)[0])} px; ${$read(kept)}`}
              </Text>
            </Row>
            <Surface bordered h={180}>
              <Panes
                orientation="vertical"
                h="100%"
                sizes={sizes}
                onSizesChange={(/** @type {number[]} */ s) => $write(sizes, s)}
                onCommit={(/** @type {number[]} */ s) => $write(kept, `committed ${Math.round(s[0])} px`)}
              >
                <Panes.Pane min={40} max={130} p="sm">
                  <Text size="sm">Query</Text>
                </Panes.Pane>
                <Panes.Pane p="sm">
                  <Text size="sm">Results take the rest</Text>
                </Panes.Pane>
              </Panes>
            </Surface>
          </Stack>
        );
      },
      height: 230,
    },
    {
      title: 'Pixels side by side, no visible handle, a wider grip area',
      code: `
function Demo() {
  return (
    <Panes h={120} w={420} defaultSizes={[140, 160]} handle={false} handleSize={12}>
      <Panes.Pane min={100}><Surface bordered h="100%" p="sm"><Text size="sm">Inbox</Text></Surface></Panes.Pane>
      <Panes.Pane min={120}><Surface bordered h="100%" p="sm"><Text size="sm">Message</Text></Surface></Panes.Pane>
      <Panes.Pane><Surface bordered h="100%" p="sm"><Text size="sm">Details</Text></Surface></Panes.Pane>
    </Panes>
  );
}`,
      view: () => (
        <Panes h={120} w={420} defaultSizes={[140, 160]} handle={false} handleSize={12}>
          <Panes.Pane min={100}>
            <Surface bordered h="100%" p="sm">
              <Text size="sm">Inbox</Text>
            </Surface>
          </Panes.Pane>
          <Panes.Pane min={120}>
            <Surface bordered h="100%" p="sm">
              <Text size="sm">Message</Text>
            </Surface>
          </Panes.Pane>
          <Panes.Pane>
            <Surface bordered h="100%" p="sm">
              <Text size="sm">Details</Text>
            </Surface>
          </Panes.Pane>
        </Panes>
      ),
      height: 150,
    },
  ],
};
