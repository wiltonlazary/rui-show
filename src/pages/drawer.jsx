// Drawer: a reader's contents from the start and a bottom sheet with a
// handle, and a recipe filter floating off the end.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Drawer, Box, Button, Center, Checkbox, NavItem, Row, SegmentedControl, Stack, Text } from 'rui-core';

const CHAPTERS = ['The harbor', 'Low tide', 'The lighthouse keeper', 'Fog'];
const TYPE = ['Small', 'Medium', 'Large'];
const TAGS = ['Vegetarian', 'Under 30 minutes', 'One pot'];
const RECIPES = [
  { name: 'Lentil soup', tags: ['Vegetarian', 'One pot'] },
  { name: 'Lemon pasta', tags: ['Vegetarian', 'Under 30 minutes'] },
  { name: 'Bean chili', tags: ['One pot'] },
  { name: 'Fried rice', tags: ['Under 30 minutes', 'One pot'] },
  { name: 'Garden salad', tags: ['Vegetarian', 'Under 30 minutes'] },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'drawer',
  group: 'layers',
  title: 'Drawer',
  description: 'A panel that slides in from an edge of the portal layer over a backdrop, closed as a Modal is (the backdrop, Escape, its close button), keeping the focus inside while open.',
  props: [
    { name: 'open / defaultOpen', type: 'boolean | () => boolean / boolean', description: 'Whether it is open, controlled or not.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called with false by the backdrop, Escape and the close button.' },
    { name: 'at', type: "'start' | 'end' | 'top' | 'bottom'", default: "'end'", description: 'The edge it slides from: `end` is the inline end (the right in left-to-right text), `start` the other side.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string", default: '360', description: 'Its width (or height from top and bottom): a step (320, 400, 560, 640, 800), pixels or a percent.' },
    { name: 'offset', type: 'number', default: '0', description: 'A gap from the edges; with one, the panel takes `radius`.' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: 'theme.corner', description: 'Corner radius, when offset.' },
    { name: 'title', type: 'string | any', description: 'The header’s title.' },
    { name: 'closable', type: 'boolean | { size, label } | any', default: 'true', description: 'The close button, its options, or a node of your own.' },
    { name: 'backdrop', type: 'boolean | { color, opacity }', default: 'true', description: 'Dims the page behind it (night.9 at the theme’s opacity.disabled, .45; opacity.muted, .7, in the dark scheme).' },
    { name: 'dismiss', type: 'false | { escape, outside }', default: '{ escape: true, outside: true }', description: 'Whether Escape and a press on the backdrop close it.' },
    { name: 'trap', type: 'boolean', default: 'true', description: 'Moves the focus in and keeps Tab inside.' },
    { name: 'refocus', type: 'boolean', default: 'true', description: 'Gives the focus back on close.' },
    { name: 'padding', type: "'xs' … 'xl' | number", default: "'lg'", description: 'The inner padding.' },
    { name: 'shadow', type: "'xs' … 'xl'", default: "'xl'", description: 'Its shadow.' },
    { name: 'motion', type: "'quick' | 'base' | 'calm' | { effect, duration, exit, easing }", default: "'calm' (300 ms), a slide from its edge", description: 'A preset’s name, or the motion; `exit` is the closing’s ms (the duration by default).' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'In the portal layer; false covers its parent.' },
    { name: 'layer', type: 'number', default: 'LAYERS.sheet (20)', description: 'Its stacking order.' },
    { name: 'stack', type: 'string', description: 'Its id in a `Drawer.Stack`.' },
    { name: 'children', type: 'any', description: 'The body.' },
  ],
  demos: [
    {
      title: 'Contents from the start, a sheet from the bottom',
      code: `
const CHAPTERS = ['The harbor', 'Low tide', 'The lighthouse keeper', 'Fog'];
const TYPE = ['Small', 'Medium', 'Large'];

function Demo() {
  const contents = $signal($active(), false);
  const sheet = $signal($active(), false);
  const chapter = $signal($active(), 0);
  const type = $signal($active(), 'Medium');
  const go = i => ($write(chapter, i), $write(contents, false));
  return (
    <Stack gap="sm" align="start">
      <Row gap="xs">
        <Button variant="neutral" onPress={() => $write(contents, true)}>Contents</Button>
        <Button variant="neutral" onPress={() => $write(sheet, true)}>Text size</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => \`Chapter \${$read(chapter) + 1}, \${CHAPTERS[$read(chapter)]}, in \${$read(type).toLowerCase()} text\`}</Text>
      <Drawer open={contents} onOpenChange={v => $write(contents, v)} at="start" size={250} title="Contents">
        {CHAPTERS.map((name, i) => <NavItem label={name} description={\`Chapter \${i + 1}\`} active={() => $read(chapter) === i} onPress={() => go(i)} />)}
      </Drawer>
      <Drawer open={sheet} onOpenChange={v => $write(sheet, v)} at="bottom" size={130} closable={false} padding="md">
        <Stack gap="md">
          <Center><Box w={40} h={4} bg="gray.4" style={{ radius: 2 }} /></Center>
          <SegmentedControl aria-label="Type" stretch data={TYPE} value={type} onChange={v => ($write(type, v), $write(sheet, false))} />
        </Stack>
      </Drawer>
    </Stack>
  );
}`,
      view: () => {
        const contents = $signal($active(), false);
        const sheet = $signal($active(), false);
        const chapter = $signal($active(), 0);
        const type = $signal($active(), 'Medium');
        const go = (/** @type {number} */ i) => ($write(chapter, i), $write(contents, false));
        return (
          <Stack gap="sm" align="start">
            <Row gap="xs">
              <Button variant="neutral" onPress={() => $write(contents, true)}>
                Contents
              </Button>
              <Button variant="neutral" onPress={() => $write(sheet, true)}>
                Text size
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `Chapter ${$read(chapter) + 1}, ${CHAPTERS[$read(chapter)]}, in ${$read(type).toLowerCase()} text`}
            </Text>
            <Drawer open={contents} onOpenChange={(/** @type {boolean} */ v) => $write(contents, v)} at="start" size={250} title="Contents">
              {CHAPTERS.map((name, i) => (
                <NavItem label={name} description={`Chapter ${i + 1}`} active={() => $read(chapter) === i} onPress={() => go(i)} />
              ))}
            </Drawer>
            <Drawer open={sheet} onOpenChange={(/** @type {boolean} */ v) => $write(sheet, v)} at="bottom" size={130} closable={false} padding="md">
              <Stack gap="md">
                <Center>
                  <Box w={40} h={4} bg="gray.4" style={{ radius: 2 }} />
                </Center>
                <SegmentedControl aria-label="Type" stretch data={TYPE} value={type} onChange={(/** @type {string} */ v) => ($write(type, v), $write(sheet, false))} />
              </Stack>
            </Drawer>
          </Stack>
        );
      },
      height: 360,
    },
    {
      title: 'A recipe filter floating off the end',
      code: `
const TAGS = ['Vegetarian', 'Under 30 minutes', 'One pot'];
const RECIPES = [
  { name: 'Lentil soup', tags: ['Vegetarian', 'One pot'] },
  { name: 'Lemon pasta', tags: ['Vegetarian', 'Under 30 minutes'] },
  { name: 'Bean chili', tags: ['One pot'] },
  { name: 'Fried rice', tags: ['Under 30 minutes', 'One pot'] },
  { name: 'Garden salad', tags: ['Vegetarian', 'Under 30 minutes'] },
];

function Demo() {
  const open = $signal($active(), false);
  const chosen = $signal($active(), []);
  const flip = tag => $write(chosen, $read(chosen).includes(tag) ? $read(chosen).filter(t => t !== tag) : [...$read(chosen), tag]);
  const matches = () => RECIPES.filter(r => $read(chosen).every(t => r.tags.includes(t)));
  return (
    <Stack gap="sm" align="start">
      <Button variant="soft" onPress={() => $write(open, true)}>{() => \`Filters (\${$read(chosen).length})\`}</Button>
      <Text size="sm">{() => matches().map(r => r.name).join(' · ') || 'No recipe fits every filter'}</Text>
      <Drawer open={open} onOpenChange={v => $write(open, v)} size={280} offset={12} radius="lg" title="Filter recipes">
        <Stack gap="sm">
          {TAGS.map(tag => <Checkbox label={tag} checked={() => $read(chosen).includes(tag)} onChange={() => flip(tag)} />)}
          <Row gap="xs">
            <Button onPress={() => $write(open, false)}>{() => \`Show \${matches().length}\`}</Button>
            <Button variant="neutral" onPress={() => $write(chosen, [])}>Clear</Button>
          </Row>
        </Stack>
      </Drawer>
    </Stack>
  );
}`,
      view: () => {
        const open = $signal($active(), false);
        const chosen = $signal($active(), /** @type {string[]} */ ([]));
        const flip = (/** @type {string} */ tag) => $write(chosen, $read(chosen).includes(tag) ? $read(chosen).filter(t => t !== tag) : [...$read(chosen), tag]);
        const matches = () => RECIPES.filter(r => $read(chosen).every(t => r.tags.includes(t)));
        return (
          <Stack gap="sm" align="start">
            <Button variant="soft" onPress={() => $write(open, true)}>
              {() => `Filters (${$read(chosen).length})`}
            </Button>
            <Text size="sm">
              {() =>
                matches()
                  .map(r => r.name)
                  .join(' · ') || 'No recipe fits every filter'
              }
            </Text>
            <Drawer open={open} onOpenChange={(/** @type {boolean} */ v) => $write(open, v)} size={280} offset={12} radius="lg" title="Filter recipes">
              <Stack gap="sm">
                {TAGS.map(tag => (
                  <Checkbox label={tag} checked={() => $read(chosen).includes(tag)} onChange={() => flip(tag)} />
                ))}
                <Row gap="xs">
                  <Button onPress={() => $write(open, false)}>{() => `Show ${matches().length}`}</Button>
                  <Button variant="neutral" onPress={() => $write(chosen, [])}>
                    Clear
                  </Button>
                </Row>
              </Stack>
            </Drawer>
          </Stack>
        );
      },
      height: 300,
    },
  ],
};
