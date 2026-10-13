// Transition: mounts and unmounts content with one of its effects.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Transition, EFFECTS, Button, Row, SegmentedControl, Stack, Surface, Switch, Text } from 'rui-core';

const PICKS = ['fade', 'rise', 'sink', 'from-start', 'grow', 'slide-top', 'slide-start'];
const MORE = Object.keys(EFFECTS).length - PICKS.length;

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'transition',
  group: 'behavior',
  title: 'Transition',
  description:
    'Mounts and unmounts its content (`shown`) with an `effect` on rui-core’s Clock: `EFFECTS` as opacity and the portable transforms (short moves, slides by the content’s own size and scales about an origin), painted and never reflowed, the same on every renderer.',
  props: [
    { name: 'shown', type: 'boolean | () => boolean', description: 'Whether the content is in; a change runs the effect.' },
    { name: 'effect', type: 'keyof EFFECTS | { opacity?, x?, y?, w?, h?, scale?, origin?, lag? }', default: "'fade'", description: 'An effect name, or a look while out: opacity 0, a move in pixels or a spacing step (`x`, `y`: `xs`, `-xs` the other way) or in the content’s size (`w`, `h`, fractions), and a `scale` (or `[x, y]`), about `origin` (`[x, y]` percents; the center). `lag` (0 to 1) holds the fade back for that share of the way, so the move starts unseen; the slides enter from their edge with a lag of `ratios.mark` (0.3). An unknown name falls back to `fade`.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'base' (190 ms)", description: 'The enter duration: milliseconds, or a MOTION preset (quick 110, base 190, calm 300, hold 1500).' },
    { name: 'exit', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: 'duration', description: 'The exit duration: ms or a motion preset.' },
    { name: 'easing', type: "'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'settle' | ((t) => number)", default: "'ease-out'", description: 'The easing curve.' },
    { name: 'persistent', type: 'boolean', default: 'false', description: 'Hides the content when out instead of removing it.' },
    { name: 'onEnter', type: '() => void', description: 'Called when it starts entering.' },
    { name: 'onEntered', type: '() => void', description: 'Called when it is in.' },
    { name: 'onExit', type: '() => void', description: 'Called when it starts leaving.' },
    { name: 'onExited', type: '() => void', description: 'Called when it is out.' },
    { name: 'children', type: 'any | ((style: () => object) => any)', description: 'The content, or a function given the style accessor to put on its own element.' },
    { name: 'style props', type: 'm, p, w, …', description: 'As Box, on the content’s box (not with a function child).' },
  ],
  demos: [
    {
      title: 'Pick an effect, then show and hide',
      code: `
const PICKS = ['fade', 'rise', 'sink', 'from-start', 'grow', 'slide-top', 'slide-start'];
const MORE = Object.keys(EFFECTS).length - PICKS.length;

function Demo() {
  const effect = $signal($active(), 'rise');
  const shown = $signal($active(), true);
  return (
    <Stack gap="sm">
      <SegmentedControl aria-label="Effect" size="xs" data={PICKS} value={effect} onChange={v => $write(effect, v)} />
      <Row gap="md" align="center">
        <Switch label="Shown" checked={shown} onChange={v => $write(shown, v)} />
        <Text size="sm" fg="quiet">{\`and \${MORE} more in EFFECTS\`}</Text>
      </Row>
      <Transition shown={shown} effect={effect} duration={400}>
        <Surface bordered shadow="sm" p="md" w={260}>
          <Text size="sm" fontWeight={600}>{() => \`Effect: \${$read(effect)}\`}</Text>
          <Text size="sm" fg="quiet">Painted, never reflowed</Text>
        </Surface>
      </Transition>
    </Stack>
  );
}`,
      view: () => {
        const effect = $signal($active(), 'rise');
        const shown = $signal($active(), true);
        return (
          <Stack gap="sm">
            <SegmentedControl aria-label="Effect" size="xs" data={PICKS} value={effect} onChange={(/** @type {string} */ v) => $write(effect, v)} />
            <Row gap="md" align="center">
              <Switch label="Shown" checked={shown} onChange={(/** @type {boolean} */ v) => $write(shown, v)} />
              <Text size="sm" fg="quiet">
                {`and ${MORE} more in EFFECTS`}
              </Text>
            </Row>
            <Transition shown={shown} effect={effect} duration={400}>
              <Surface bordered shadow="sm" p="md" w={260}>
                <Text size="sm" fontWeight={600}>
                  {() => `Effect: ${$read(effect)}`}
                </Text>
                <Text size="sm" fg="quiet">
                  Painted, never reflowed
                </Text>
              </Surface>
            </Transition>
          </Stack>
        );
      },
      height: 200,
    },
    {
      title: 'Persistent, a style function and the callbacks',
      code: `
function Demo() {
  const shown = $signal($active(), true);
  const last = $signal($active(), 'none yet');
  return (
    <Stack gap="sm">
      <Row gap="sm">
        <Button variant="soft" onPress={() => $write(shown, !$read(shown))}>{() => ($read(shown) ? 'Hide' : 'Show')}</Button>
        <Text size="sm" fg="quiet">{() => \`last event: \${$read(last)}\`}</Text>
      </Row>
      <Transition
        shown={shown}
        effect="slide-start"
        duration={300}
        exit={150}
        easing="ease-out"
        persistent
        onEnter={() => $write(last, 'enter')}
        onEntered={() => $write(last, 'entered')}
        onExit={() => $write(last, 'exit')}
        onExited={() => $write(last, 'exited')}
      >
        {style => <Surface bordered p="sm" w={260} style={style}><Text size="sm">Slides in from the left</Text></Surface>}
      </Transition>
    </Stack>
  );
}`,
      view: () => {
        const shown = $signal($active(), true);
        const last = $signal($active(), 'none yet');
        return (
          <Stack gap="sm">
            <Row gap="sm">
              <Button variant="soft" onPress={() => $write(shown, !$read(shown))}>
                {() => ($read(shown) ? 'Hide' : 'Show')}
              </Button>
              <Text size="sm" fg="quiet">
                {() => `last event: ${$read(last)}`}
              </Text>
            </Row>
            <Transition
              shown={shown}
              effect="slide-start"
              duration={300}
              exit={150}
              easing="ease-out"
              persistent
              onEnter={() => $write(last, 'enter')}
              onEntered={() => $write(last, 'entered')}
              onExit={() => $write(last, 'exit')}
              onExited={() => $write(last, 'exited')}
            >
              {(/** @type {() => any} */ style) => (
                <Surface bordered p="sm" w={260} style={style}>
                  <Text size="sm">Slides in from the left</Text>
                </Surface>
              )}
            </Transition>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'A look of your own: a flip in from the top edge',
      code: `
// The portable transforms are flat (no rotateX or perspective), so the
// flip about the top edge is a scale down the y axis about that edge.
const FLIP = { opacity: true, scale: [1, 0.05], origin: ['50%', '0%'] };

function Demo() {
  const shown = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Row>
        <Button size="xs" onPress={() => $write(shown, !$read(shown))}>{() => ($read(shown) ? 'Flip out' : 'Flip in')}</Button>
      </Row>
      <Transition shown={shown} effect={FLIP} duration={320} easing="ease-out">
        <Surface bordered shadow="sm" p="md" w={240}>
          <Text size="sm" fontWeight={600}>Boarding pass</Text>
          <Text size="sm" fg="quiet">Gate 14, seat 22C</Text>
        </Surface>
      </Transition>
    </Stack>
  );
}`,
      view: () => {
        const shown = $signal($active(), true);
        const flip = { opacity: true, scale: /** @type {[number, number]} */ ([1, 0.05]), origin: /** @type {const} */ (['50%', '0%']) };
        return (
          <Stack gap="sm">
            <Row>
              <Button size="xs" onPress={() => $write(shown, !$read(shown))}>
                {() => ($read(shown) ? 'Flip out' : 'Flip in')}
              </Button>
            </Row>
            <Transition shown={shown} effect={flip} duration={320} easing="ease-out">
              <Surface bordered shadow="sm" p="md" w={240}>
                <Text size="sm" fontWeight={600}>
                  Boarding pass
                </Text>
                <Text size="sm" fg="quiet">
                  Gate 14, seat 22C
                </Text>
              </Surface>
            </Transition>
          </Stack>
        );
      },
      height: 140,
    },
  ],
};
