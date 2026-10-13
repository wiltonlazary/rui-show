// Excerpt: content cut at a height, with a trigger to show it whole.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Excerpt, Stack, Text } from 'rui-core';

const STORY = [
  'We walked out at first light, when the valley was still gray and the river ran loud under the bridge. By the time the sun cleared the eastern ridge we had passed the last farm, and the path turned to stone.',
  'Lunch was bread and cheese on a flat rock above the falls. The afternoon was long and warm; we took the high path back, along the ridge, and came down into the village as the lamps were being lit.',
  'Nobody said much at dinner. It had been, all of us agreed later, the best day of the summer.',
];

/** The story, a paragraph a Text. */
const Story = () => (
  <Stack gap="xs">
    {STORY.map(text => (
      <Text size="sm">{text}</Text>
    ))}
  </Stack>
);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'excerpt',
  group: 'data',
  title: 'Excerpt',
  description: 'Content cut at `height`, with a trigger that shows it whole and hides it again, animating the height. The trigger appears only when the content is higher than `height`, measured once laid out and again on every resize (`onResize`).',
  props: [
    { name: 'height', type: 'number', default: '120', description: 'The height the content is cut at, in pixels.' },
    { name: 'moreLabel', type: 'string', default: "'More'", description: 'The trigger’s text while the content is cut.' },
    { name: 'lessLabel', type: 'string', default: "'Less'", description: 'The trigger’s text while the content shows whole.' },
    { name: 'open', type: 'boolean', description: 'Whether the content shows whole, controlled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the trigger is pressed.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Shows the content whole at first, uncontrolled.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'base' (190)", description: 'How long the height takes to change: ms or a motion preset.' },
    { name: 'getHandle', type: '(handle: { open, close, toggle }) => void', description: 'Receives the commands that open, close or toggle it from outside.' },
    { name: 'children', type: 'any', description: 'The content.' },
  ],
  demos: [
    {
      title: 'A story cut short',
      code: `
const STORY = ['We walked out at first light, …', 'Lunch was bread and cheese …', 'Nobody said much at dinner. …'];

const Story = () => (
  <Stack gap="xs">
    {STORY.map(text => <Text size="sm">{text}</Text>)}
  </Stack>
);

function Demo() {
  return (
    <Excerpt height={60}>
      <Story />
    </Excerpt>
  );
}`,
      view: () => (
        <Excerpt height={60}>
          <Story />
        </Excerpt>
      ),
      height: 170,
      measured: true,
      clipped: true,
    },
    {
      title: 'Held by a signal',
      code: `
const STORY = ['We walked out at first light, …', 'Lunch was bread and cheese …', 'Nobody said much at dinner. …'];

const Story = () => (
  <Stack gap="xs">
    {STORY.map(text => <Text size="sm">{text}</Text>)}
  </Stack>
);

function Demo() {
  const open = $signal($active(), false);
  return (
    <Stack gap="sm">
      <Row gap="xs" align="center">
        <Button size="xs" variant="soft" onPress={() => $write(open, !$read(open))}>Toggle from outside</Button>
        <Text size="sm" fg="quiet">{() => \`open: \${$read(open)}\`}</Text>
      </Row>
      <Excerpt
        height={40}
        moreLabel="Read the whole story"
        lessLabel="Fold it away"
        open={() => $read(open)}
        onOpenChange={v => $write(open, v)}
        duration={400}
      >
        <Story />
      </Excerpt>
    </Stack>
  );
}`,
      view: () => {
        const open = $signal($active(), false);
        return (
          <Stack gap="sm">
            <Row gap="xs" align="center">
              <Button size="xs" variant="soft" onPress={() => $write(open, !$read(open))}>
                Toggle from outside
              </Button>
              <Text size="sm" fg="quiet">
                {() => `open: ${$read(open)}`}
              </Text>
            </Row>
            <Excerpt
              height={40}
              moreLabel="Read the whole story"
              lessLabel="Fold it away"
              open={() => $read(open)}
              onOpenChange={(/** @type {boolean} */ v) => $write(open, v)}
              duration={400}
            >
              <Story />
            </Excerpt>
          </Stack>
        );
      },
      height: 205,
      measured: true,
      clipped: true,
    },
  ],
};
