// ScrollRow: a horizontal strip with controls at its ends.

import { ScrollRow, Badge, Button, Stack, Text } from 'rui-core';

const TAGS = ['Apple', 'Banana', 'Cherry', 'Grape', 'Lemon', 'Lime', 'Mango', 'Melon', 'Orange', 'Papaya', 'Peach', 'Pear', 'Plum', 'Quince'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'scroll-row',
  group: 'structure',
  title: 'ScrollRow',
  description:
    'A horizontal strip that scrolls: chevron controls at the ends while there is more, the wheel (its vertical turn scrolls across too), and dragging. It is a Scroll along x; its controls follow the scroll position and the resizes of the strip and its content (`onResize`), the same on every renderer.',
  props: [
    { name: 'step', type: 'number', default: 'the visible width × `ratios.pad` (¾)', description: 'Pixels a control press scrolls, animated over the base motion (190 ms); by default three quarters of what shows, so a quarter stays in view as the place kept.' },
    { name: 'buttonSize', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The size of the controls: a step of the theme’s `sizes.icon`, or pixels.' },
    { name: 'draggable', type: 'boolean', default: 'false', description: 'Dragging the strip scrolls it.' },
    { name: 'previousIcon', type: 'any', description: 'Replaces the start chevron.' },
    { name: 'nextIcon', type: 'any', description: 'Replaces the end chevron.' },
    { name: 'children', type: 'any', description: 'The strip’s content, in a row.' },
    { name: 'style props', type: 'm, w, …', description: 'As Box.' },
  ],
  demos: [
    {
      title: 'Tags with controls',
      code: `
const TAGS = ['Apple', 'Banana', 'Cherry', 'Grape', 'Lemon', 'Lime', 'Mango', 'Melon', 'Orange', 'Papaya', 'Peach', 'Pear', 'Plum', 'Quince'];

function Demo() {
  return (
    <Stack gap="xs">
      <Text size="sm" fg="quiet">Press a chevron or use the wheel</Text>
      <ScrollRow w={400} step={150}>
        {TAGS.map(tag => <Badge variant="soft" mr="xs">{tag}</Badge>)}
      </ScrollRow>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          <Text size="sm" fg="quiet">
            Press a chevron or use the wheel
          </Text>
          <ScrollRow w={400} step={150}>
            {TAGS.map(tag => (
              <Badge variant="soft" mr="xs">
                {tag}
              </Badge>
            ))}
          </ScrollRow>
        </Stack>
      ),
      height: 80,
    },
    {
      title: 'Draggable, small controls',
      code: `
function Demo() {
  return (
    <Stack gap="xs">
      <Text size="sm" fg="quiet">Drag the strip</Text>
      <ScrollRow w={400} draggable buttonSize="sm">
        {TAGS.map(tag => <Button size="sm" dense variant="neutral" mr="xs">{tag}</Button>)}
      </ScrollRow>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          <Text size="sm" fg="quiet">
            Drag the strip
          </Text>
          <ScrollRow w={400} draggable buttonSize="sm">
            {TAGS.map(tag => (
              <Button size="sm" dense variant="neutral" mr="xs">
                {tag}
              </Button>
            ))}
          </ScrollRow>
        </Stack>
      ),
      height: 80,
    },
  ],
};
