// $motion: frames for animated components.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $motion, Stack, Box, Text, Button, Row } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'motion',
  group: 'foundations',
  title: '$motion',
  description: 'Calls a step once per frame, in a batch, while it returns true and its owner lives: the time source of rui-core’s animated components. Frames come from the Clock context: the platform’s, or `manualClock()` in tests, so animations are deterministic.',
  props: [
    { name: 'step', type: '(now: number, elapsed: number) => boolean | void', description: 'Runs each frame; return true for another one.' },
    { name: 'returns', type: '() => void', description: 'Stops it early. It stops by itself when its owner goes.' },
    { name: 'Clock', type: 'context of { now(), frame(callback) }', default: 'platformClock', description: 'Where frames come from (requestAnimationFrame, or a 16 ms timer).' },
    { name: 'manualClock()', type: '{ now, frame, advance(ms), pending() }', description: 'A clock that moves only when told, for tests.' },
    { name: 'MOTION', type: '{ quick, base, calm, hold }', default: '{ quick: 110, base: 190, calm: 300, hold: 1500 }', description: 'The motion presets, in ms: `quick` for small panels and tips, `base` for sheets and collapsing content, `calm` for large moves and progress, and `hold`, how long a confirmation stays (a copy’s “Done”). A component’s `motion`, `duration` or `hold` takes a preset’s name or a number; the easing is ease-out unless given.' },
  ],
  demos: [
    {
      title: 'A bar that moves while it lives',
      code: `
function Demo() {
  const R = $active();
  const x = $signal(R, 0);
  const running = $signal(R, true);
  let stop = () => {};
  const start = () => {
    stop = $motion((now, elapsed) => {
      $write(x, (Math.sin(elapsed / 400) + 1) / 2);
      return true;
    });
  };
  start();
  const toggle = () => {
    if ($read(running)) stop();
    else start();
    $write(running, !$read(running));
  };
  return (
    <Stack gap="sm">
      <Row gap="sm">
        <Button size="xs" variant="soft" onPress={toggle}>{() => ($read(running) ? 'Pause' : 'Play')}</Button>
        <Text size="sm" fg="quiet">{() => \`\${Math.round($read(x) * 100)}%\`}</Text>
      </Row>
      <Box h={24} w={() => 24 + $read(x) * 560} bg="blue" style={{ radius: 12 }} />
    </Stack>
  );
}`,
      view: () => {
        const R = $active();
        const x = $signal(R, 0);
        const running = $signal(R, true);
        let stop = () => {};
        const start = () => {
          stop = $motion((now, elapsed) => {
            $write(x, (Math.sin(elapsed / 400) + 1) / 2);
            return true;
          });
        };
        start();
        const toggle = () => {
          if ($read(running)) stop();
          else start();
          $write(running, !$read(running));
        };
        return (
          <Stack gap="sm">
            <Row gap="sm">
              <Button size="xs" variant="soft" onPress={toggle}>
                {() => ($read(running) ? 'Pause' : 'Play')}
              </Button>
              <Text size="sm" fg="quiet">
                {() => `${Math.round($read(x) * 100)}%`}
              </Text>
            </Row>
            <Box h={24} w={() => 24 + $read(x) * 560} bg="blue" style={{ radius: 12 }} />
          </Stack>
        );
      },
      height: 110,
    },
  ],
};
