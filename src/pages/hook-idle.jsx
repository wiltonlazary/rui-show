// $idle: whether no activity happened for a while.

import { $read } from 'rrx-core';
import { $idle } from 'rui-core/hooks';
import { Avatar, Badge, Button, Row, Stack, Surface, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-idle',
  group: 'behavior',
  title: '$idle',
  description: 'Whether no activity happened for `timeout` ms. Portable: activity is what reaches `props` (pointer moves and presses, keys, the wheel) on the component they are spread on, often the application’s outer view, not document listeners; `reset()` counts as activity too.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'timeout', type: 'number', description: 'How long without activity makes it idle, in ms.' },
    { name: 'options.initial', type: 'boolean', default: 'false', description: 'Starts active, idle after `timeout`; true starts idle.' },
    { name: 'returns', type: '{ value: Readable<boolean>, reset: () => void, props: { onPointerMove, onPointerDown, onKey, onWheel } }', description: 'Whether it is idle, a way to mark activity, and the props for the region whose activity counts.' },
  ],
  demos: [
    {
      title: 'Away after five seconds',
      code: `
function Demo() {
  const idle = $idle(5000);
  return (
    <Surface {...idle.props} p="md">
      <Stack gap="sm" align="start">
        <Surface bordered radius="xl" p={6} pr="md">
          <Row gap="sm" align="center">
            <Avatar name="Mira Okafor" size="sm" color="teal" />
            <Text size="sm" fontWeight={600}>Mira Okafor</Text>
            {() => ($read(idle.value) ? <Badge variant="soft" color="amber">Away</Badge> : null)}
          </Row>
        </Surface>
        <Text size="sm" fg="quiet">Keep the pointer still over this area for 5 s; any move, press or key brings Mira back.</Text>
        <Button size="xs" variant="soft" onPress={idle.reset}>I'm here</Button>
      </Stack>
    </Surface>
  );
}`,
      view: () => {
        const idle = $idle(5000);
        return (
          <Surface {...idle.props} p="md">
            <Stack gap="sm" align="start">
              <Surface bordered radius="xl" p={6} pr="md">
                <Row gap="sm" align="center">
                  <Avatar name="Mira Okafor" size="sm" color="teal" />
                  <Text size="sm" fontWeight={600}>
                    Mira Okafor
                  </Text>
                  {() =>
                    $read(idle.value) ? (
                      <Badge variant="soft" color="amber">
                        Away
                      </Badge>
                    ) : null
                  }
                </Row>
              </Surface>
              <Text size="sm" fg="quiet">
                Keep the pointer still over this area for 5 s; any move, press or key brings Mira back.
              </Text>
              <Button size="xs" variant="soft" onPress={idle.reset}>
                I'm here
              </Button>
            </Stack>
          </Surface>
        );
      },
      height: 150,
    },
  ],
};
