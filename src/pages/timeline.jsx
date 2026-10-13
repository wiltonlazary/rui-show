// Timeline: events on a line, highlighted up to the reached one.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Tiles, Stack, Text, Timeline } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'timeline',
  group: 'data',
  title: 'Timeline',
  description: 'Events on a vertical line: markers and the line between them colored up to the `value` item (from the last item with `from="end"`), content after the line or, aligned to the end, before it.',
  props: [
    { name: 'value / defaultValue', type: 'number / number', default: 'none', description: 'The index of the item reached last, in the children’s order: items from `from` up to it (and the lines between them) are highlighted.' },
    { name: 'from', type: "'start' | 'end'", default: "'start'", description: 'Where progress starts: the first item, or the last.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The highlight color: a theme color name, `name.shade`, or hex.' },
    { name: 'marker', type: 'any', description: 'Content in every item’s marker (an item’s own `marker` goes over it).' },
    { name: 'markerSize', type: 'number', default: '16', description: 'The markers’ size in pixels.' },
    { name: 'lineWidth', type: 'number', default: '2', description: 'The line’s (and the markers’ border’s) width in pixels.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'round', description: 'The markers’ corner radius.' },
    { name: 'align', type: "'start' | 'end'", default: "'start'", description: 'Which side the line is on.' },
    { name: 'Timeline.Item title', type: 'any', description: 'The item’s title, above its content.' },
    { name: 'Timeline.Item marker', type: 'any', description: 'Content in the item’s marker (a letter, an icon).' },
    { name: 'Timeline.Item color', type: 'string', description: 'This item’s own highlight color.' },
    { name: 'Timeline.Item line', type: "'solid' | 'dashed' | 'dotted'", default: "'solid'", description: 'The line below its marker.' },
    { name: 'Timeline.Item children', type: 'any', description: 'The item’s content; text wraps.' },
  ],
  demos: [
    {
      title: 'Tracking an order',
      code: `
function Demo() {
  return (
    <Timeline value={1} color="teal">
      <Timeline.Item title="Placed">
        <Text size="sm" fg="quiet">Mon 18:12 · order #4103, paid by card</Text>
      </Timeline.Item>
      <Timeline.Item title="Packed" line="dotted">
        <Text size="sm" fg="quiet">Tue 09:30 · one box, 2.1 kg</Text>
      </Timeline.Item>
      <Timeline.Item title="On the way" line="dotted">
        <Text size="sm" fg="quiet">Leaves the warehouse today</Text>
      </Timeline.Item>
      <Timeline.Item title="Delivered">
        <Text size="sm" fg="quiet">Expected Thursday</Text>
      </Timeline.Item>
    </Timeline>
  );
}`,
      view: () => (
        <Timeline value={1} color="teal">
          <Timeline.Item title="Placed">
            <Text size="sm" fg="quiet">
              Mon 18:12 · order #4103, paid by card
            </Text>
          </Timeline.Item>
          <Timeline.Item title="Packed" line="dotted">
            <Text size="sm" fg="quiet">
              Tue 09:30 · one box, 2.1 kg
            </Text>
          </Timeline.Item>
          <Timeline.Item title="On the way" line="dotted">
            <Text size="sm" fg="quiet">
              Leaves the warehouse today
            </Text>
          </Timeline.Item>
          <Timeline.Item title="Delivered">
            <Text size="sm" fg="quiet">
              Expected Thursday
            </Text>
          </Timeline.Item>
        </Timeline>
      ),
      height: 300,
    },
    {
      title: 'Stepping through a recipe',
      code: `
const STEPS = ['Prep', 'Simmer', 'Rest', 'Serve'];

function Demo() {
  const step = $signal($active(), 0);
  return (
    <Stack gap="md">
      <Row gap="xs" align="center">
        <Button size="xs" variant="neutral" onPress={() => $write(step, Math.max(-1, $read(step) - 1))}>Back</Button>
        <Button size="xs" onPress={() => $write(step, Math.min(STEPS.length - 1, $read(step) + 1))}>Next</Button>
        <Text size="sm" fg="quiet">{() => \`value \${$read(step)}\`}</Text>
      </Row>
      <Timeline value={() => $read(step)} color="teal" markerSize={20} marker="•">
        {STEPS.map(title => <Timeline.Item title={title}>{\`Soup, step: \${title.toLowerCase()}.\`}</Timeline.Item>)}
      </Timeline>
    </Stack>
  );
}`,
      view: () => {
        const STEPS = ['Prep', 'Simmer', 'Rest', 'Serve'];
        const step = $signal($active(), 0);
        return (
          <Stack gap="md">
            <Row gap="xs" align="center">
              <Button size="xs" variant="neutral" onPress={() => $write(step, Math.max(-1, $read(step) - 1))}>
                Back
              </Button>
              <Button size="xs" onPress={() => $write(step, Math.min(STEPS.length - 1, $read(step) + 1))}>
                Next
              </Button>
              <Text size="sm" fg="quiet">
                {() => `value ${$read(step)}`}
              </Text>
            </Row>
            <Timeline value={() => $read(step)} color="teal" markerSize={20} marker="•">
              {STEPS.map(title => (
                <Timeline.Item title={title}>{`Soup, step: ${title.toLowerCase()}.`}</Timeline.Item>
              ))}
            </Timeline>
          </Stack>
        );
      },
      height: 360,
    },
    {
      title: 'Aligned to the end, reached from the end, square markers',
      code: `
function Demo() {
  return (
    <Tiles columns={2}>
      <Timeline align="end" value={1} color="purple">
        <Timeline.Item title="Draft">Written</Timeline.Item>
        <Timeline.Item title="Review">Read by two</Timeline.Item>
        <Timeline.Item title="Published">Out</Timeline.Item>
      </Timeline>
      <Timeline from="end" value={1} radius="sm" markerSize={18} lineWidth={3}>
        <Timeline.Item title="Oldest">First event</Timeline.Item>
        <Timeline.Item title="Middle" color="orange">Its own color</Timeline.Item>
        <Timeline.Item title="Newest">Highlighted from the end</Timeline.Item>
      </Timeline>
    </Tiles>
  );
}`,
      view: () => (
        <Tiles columns={2}>
          <Timeline align="end" value={1} color="purple">
            <Timeline.Item title="Draft">Written</Timeline.Item>
            <Timeline.Item title="Review">Read by two</Timeline.Item>
            <Timeline.Item title="Published">Out</Timeline.Item>
          </Timeline>
          <Timeline from="end" value={1} radius="sm" markerSize={18} lineWidth={3}>
            <Timeline.Item title="Oldest">First event</Timeline.Item>
            <Timeline.Item title="Middle" color="orange">
              Its own color
            </Timeline.Item>
            <Timeline.Item title="Newest">Highlighted from the end</Timeline.Item>
          </Timeline>
        </Tiles>
      ),
      height: 235,
    },
  ],
};
