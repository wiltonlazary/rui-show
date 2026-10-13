// LoadBar (rui-core/load-bar): the bar at the top, driven by
// its store.

import { Button, Row, Slider, Surface, Stack, Text } from 'rui-core';
import { LoadBar, $loadBar } from 'rui-core/load-bar';

/** A simulated page load: run, hold and finish it, or set it with the slider. */
function Controls() {
  const bar = $loadBar();
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button size="xs" onPress={() => bar.run()}>Run</Button>
        <Button size="xs" variant="soft" onPress={() => bar.hold()}>Hold</Button>
        <Button size="xs" variant="soft" color="teal" onPress={() => bar.finish()}>Finish</Button>
      </Row>
      <Slider w={280} thumbLabel="Loaded" value={() => Math.round(bar.value())} onChange={(/** @type {number} */ v) => bar.to(v)} />
      <Text size="sm" fg="quiet">{() => `${Math.round(bar.value())}%, ${bar.phase()}`}</Text>
    </Stack>
  );
}

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'load-bar',
  group: 'status',
  title: 'LoadBar',
  description: 'The load bar (rui-core/load-bar), fixed at the top of the viewport (the canvas on Skia and three.js), driven by a store per root: `$loadBar()` runs it (creeping on toward 98 on the Clock), holds it, sets it `to` a value, moves it (`add`), finishes it (full, then fading out) and clears it.',
  props: [
    { name: 'defaultValue', type: 'number', default: '0', description: 'Where it starts, 0 to 100.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The bar’s color.' },
    { name: 'size', type: 'number', default: '2', description: 'Its height in pixels.' },
    { name: 'interval', type: 'number', default: '400', description: 'Milliseconds between creep steps (each 9 % of what is left to 98, at least 0.4).' },
    { name: 'duration', type: "'quick' | 'base' | 'calm' | 'hold' | number", default: "'base' (190)", description: 'Its width’s motion and its fade: a motion preset’s name or ms.' },
    { name: 'layer', type: 'number', default: 'LAYERS.top (50)', description: 'Its stacking order.' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'Fixed at the viewport’s top; false: at the top of its parent.' },
    { name: 'store / children', type: 'LoadBarStore / any', description: 'The store (`$loadBar()` by default, or one made with `loadBarStore(root?)`); inside, `$loadBar()` finds it.' },
    { name: 'store methods', type: "run, hold, to(value), add(step?), finish, clear; value(), shown(), phase(): 'idle' | 'running' | 'held' | 'finishing'", description: 'Drive it and read it; `add` with a negative step moves it back.' },
  ],
  demos: [
    {
      title: 'At the top of the viewport',
      code: `
// A simulated page load: run, hold and finish it, or set it with the slider.
function Controls() {
  const bar = $loadBar();
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button size="xs" onPress={() => bar.run()}>Run</Button>
        <Button size="xs" variant="soft" onPress={() => bar.hold()}>Hold</Button>
        <Button size="xs" variant="soft" color="teal" onPress={() => bar.finish()}>Finish</Button>
      </Row>
      <Slider w={280} thumbLabel="Loaded" value={() => Math.round(bar.value())} onChange={v => bar.to(v)} />
      <Text size="sm" fg="quiet">{() => \`\${Math.round(bar.value())}%, \${bar.phase()}\`}</Text>
    </Stack>
  );
}

function Demo() {
  return (
    <LoadBar>
      <Controls />
    </LoadBar>
  );
}`,
      view: () => (
        <LoadBar>
          <Controls />
        </LoadBar>
      ),
      height: 150,
    },
    {
      title: 'At the top of a card, thicker and red',
      code: `
function Demo() {
  return (
    <Surface bordered p="md" pt="lg">
      <LoadBar portal={false} color="red" size={5} defaultValue={30}>
        <Controls />
      </LoadBar>
    </Surface>
  );
}`,
      view: () => (
        <Surface bordered p="md" pt="lg">
          <LoadBar portal={false} color="red" size={5} defaultValue={30}>
            <Controls />
          </LoadBar>
        </Surface>
      ),
      height: 190,
    },
  ],
};
