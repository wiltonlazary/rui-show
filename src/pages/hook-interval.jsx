// $interval and $timeout: timers that end with their owner.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $interval, $timeout } from 'rui-core/hooks';
import { Button, Row, Stack, Text, Badge, Ring } from 'rui-core';

const FOCUS = 25 * 60;
/** Seconds as mm:ss. @param {number} s */
const clockText = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-interval',
  group: 'behavior',
  title: '$interval',
  description: 'Calls a function every `ms` while started; `$timeout` calls one once after a delay. Both use the platform’s timers, run their callback as one batch of the root, and are cleared when their owner ends.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'fn', type: '() => void', description: 'Called each period.' },
    { name: 'ms', type: 'number', description: 'The period, in ms.' },
    { name: 'options.auto', type: 'boolean', default: 'false', description: 'Starts at once.' },
    { name: 'returns', type: '{ value: Readable<boolean>, start(), stop(), toggle() }', description: 'Whether it runs (`value`), and its commands.' },
    { name: '$timeout(fn, delay, options?)', type: '{ value: Readable<boolean>, start(...args), stop() }', description: 'Calls `fn(...args)` once, `delay` ms after `start`; a new start replaces the pending call, `stop()` drops it; `value` (pending) is true from a start until the call or a stop; `auto` starts it at once.' },
  ],
  demos: [
    {
      title: 'A focus timer',
      code: `
const FOCUS = 25 * 60;
const clockText = s => \`\${String(Math.floor(s / 60)).padStart(2, '0')}:\${String(s % 60).padStart(2, '0')}\`;

function Demo() {
  const left = $signal($active(), FOCUS);
  const timer = $interval(() => {
    $write(left, Math.max(0, $read(left) - 1));
    if ($read(left) === 0) timer.stop();
  }, 1000);
  return (
    <Row gap="md">
      <Ring size={80} thickness={8} segments={() => [{ value: ((FOCUS - $read(left)) / FOCUS) * 100, color: 'red' }]} />
      <Stack gap="xs">
        <Text size="xl" fontWeight={700}>{() => clockText($read(left))}</Text>
        <Row gap="xs">
          <Button size="xs" onPress={timer.toggle}>{() => ($read(timer.value) ? 'Pause' : 'Start')}</Button>
          <Button size="xs" variant="neutral" onPress={() => (timer.stop(), $write(left, FOCUS))}>Reset</Button>
        </Row>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const left = $signal($active(), FOCUS);
        /** @type {{ value: any, start: () => void, stop: () => void, toggle: () => void }} */
        const timer = $interval(() => {
          $write(left, Math.max(0, $read(left) - 1));
          if ($read(left) === 0) timer.stop();
        }, 1000);
        return (
          <Row gap="md">
            <Ring size={80} thickness={8} segments={() => [{ value: ((FOCUS - $read(left)) / FOCUS) * 100, color: 'red' }]} />
            <Stack gap="xs">
              <Text size="xl" fontWeight={700}>
                {() => clockText($read(left))}
              </Text>
              <Row gap="xs">
                <Button size="xs" onPress={timer.toggle}>
                  {() => ($read(timer.value) ? 'Pause' : 'Start')}
                </Button>
                <Button size="xs" variant="neutral" onPress={() => (timer.stop(), $write(left, FOCUS))}>
                  Reset
                </Button>
              </Row>
            </Stack>
          </Row>
        );
      },
      height: 100,
    },
    {
      title: '$timeout',
      code: `
function Demo() {
  const message = $signal($active(), 'Nothing saved');
  const done = $timeout(name => $write(message, \`Saved \${name}\`), 1500);
  const save = () => {
    $write(message, 'Saving…');
    done.start('draft.txt');
  };
  return (
    <Row gap="sm">
      <Button size="xs" onPress={save}>Save</Button>
      <Button size="xs" variant="neutral" onPress={() => (done.stop(), $write(message, 'Canceled'))}>Cancel</Button>
      <Badge color={() => ($read(done.value) ? 'yellow' : 'gray')}>{() => $read(message)}</Badge>
    </Row>
  );
}`,
      view: () => {
        const message = $signal($active(), 'Nothing saved');
        const done = $timeout((/** @type {string} */ name) => $write(message, `Saved ${name}`), 1500);
        const save = () => {
          $write(message, 'Saving…');
          done.start('draft.txt');
        };
        return (
          <Row gap="sm">
            <Button size="xs" onPress={save}>
              Save
            </Button>
            <Button size="xs" variant="neutral" onPress={() => (done.stop(), $write(message, 'Canceled'))}>
              Cancel
            </Button>
            <Badge color={() => ($read(done.value) ? 'yellow' : 'gray')}>{() => $read(message)}</Badge>
          </Row>
        );
      },
      height: 60,
    },
  ],
};
