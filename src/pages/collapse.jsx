// Collapse: content that opens and closes by animating its height.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Collapse, Button, Row, Surface, Stack, Text } from 'rui-core';

/** A cubic ease-out: fast at first, settling at the end. @param {number} t */

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'collapse',
  group: 'data',
  title: 'Collapse',
  description: 'Content that opens and closes by animating its height (and its opacity with `fade`) on rui-core’s Clock. Closed, the content stays built and is hidden; the motion is the same on every renderer.',
  props: [
    { name: 'open', type: 'boolean | () => boolean', default: 'false', description: 'Whether it is open; a signal or accessor animates each change.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'base' (190)", description: 'The duration of the motion: ms or a motion preset.' },
    { name: 'easing', type: "'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'settle' | ((t) => number)", default: "'ease-out'", description: 'The easing curve.' },
    { name: 'fade', type: 'boolean', default: 'false', description: 'Fades the content with its height (the height alone moves by default).' },
    { name: 'onEntered', type: '() => void', description: 'Called once it has finished opening.' },
    { name: 'onExited', type: '() => void', description: 'Called once it has finished closing.' },
    { name: 'children', type: 'any', description: 'The content.' },
    { name: 'style props', type: 'm, p, w, …', description: 'As Box, on the outer box.' },
  ],
  demos: [
    {
      title: 'Toggled by a button',
      code: `
function Demo() {
  const open = $signal($active(), false);
  return (
    <Stack gap="sm">
      <Row gap="sm">
        <Button onPress={() => $write(open, !$read(open))}>Show the recipe</Button>
        <Text size="sm" fg="quiet">{() => ($read(open) ? 'open' : 'closed')}</Text>
      </Row>
      <Collapse open={open}>
        <Surface bordered p="sm">
          <Text size="sm">Flour, water, salt and a slow night rise: the content opens to its own height and closes again.</Text>
        </Surface>
      </Collapse>
    </Stack>
  );
}`,
      view: () => {
        const open = $signal($active(), false);
        return (
          <Stack gap="sm">
            <Row gap="sm">
              <Button onPress={() => $write(open, !$read(open))}>Show the recipe</Button>
              <Text size="sm" fg="quiet">
                {() => ($read(open) ? 'open' : 'closed')}
              </Text>
            </Row>
            <Collapse open={open}>
              <Surface bordered p="sm">
                <Text size="sm">Flour, water, salt and a slow night rise: the content opens to its own height and closes again.</Text>
              </Surface>
            </Collapse>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'Open at first: a preset duration, the settle easing, a fade, onEntered and onExited',
      code: `

function Demo() {
  const open = $signal($active(), true);
  const settled = $signal($active(), 'not moved yet');
  return (
    <Surface bordered p="sm">
      <Stack gap="xs">
        <Row gap="sm" align="center">
          <Text size="sm" fontWeight={600} flex={1}>Version 0.4 notes</Text>
          <Text size="sm" fg="quiet">{() => $read(settled)}</Text>
          <Button size="xs" variant="ghost" onPress={() => $write(open, !$read(open))}>{() => ($read(open) ? 'Fold' : 'Unfold')}</Button>
        </Row>
        <Collapse open={open} duration="calm" easing="settle" fade onEntered={() => $write(settled, 'settled open')} onExited={() => $write(settled, 'settled folded')}>
          <Stack gap={4}>
            <Text size="sm">Tables keep their header while the body scrolls.</Text>
            <Text size="sm">Date fields accept a typed month name.</Text>
            <Text size="sm">Menus close when focus leaves them.</Text>
          </Stack>
        </Collapse>
      </Stack>
    </Surface>
  );
}`,
      view: () => {
        const open = $signal($active(), true);
        const settled = $signal($active(), 'not moved yet');
        return (
          <Surface bordered p="sm">
            <Stack gap="xs">
              <Row gap="sm" align="center">
                <Text size="sm" fontWeight={600} flex={1}>
                  Version 0.4 notes
                </Text>
                <Text size="sm" fg="quiet">
                  {() => $read(settled)}
                </Text>
                <Button size="xs" variant="ghost" onPress={() => $write(open, !$read(open))}>
                  {() => ($read(open) ? 'Fold' : 'Unfold')}
                </Button>
              </Row>
              <Collapse open={open} duration="calm" easing="settle" fade onEntered={() => $write(settled, 'settled open')} onExited={() => $write(settled, 'settled folded')}>
                <Stack gap={4}>
                  <Text size="sm">Tables keep their header while the body scrolls.</Text>
                  <Text size="sm">Date fields accept a typed month name.</Text>
                  <Text size="sm">Menus close when focus leaves them.</Text>
                </Stack>
              </Collapse>
            </Stack>
          </Surface>
        );
      },
      height: 150,
    },
  ],
};
