// Stepper: an order flow with Previous and Continue and a done view, stage
// presses by `reach`, vertical stages, colors, sizes and a loading stage.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Stack, Stepper, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'stepper',
  group: 'wayfinding',
  title: 'Stepper',
  description: 'Numbered chips in a row (or a column), borderless, joined by tracks that fill in the tone as the stages before them are done, with the current stage’s content below; Stepper.Done shows once every stage is done. `value` is the current index: moving on and back are the application’s buttons, and `reach` says which stages a press may move to (done stages by default).',
  props: [
    { name: 'value', type: 'number | (() => number) | Signal<number>', description: 'The current stage’s index; at or past the stage count every stage is done and Stepper.Done shows, below 0 nothing shows. A signal is written on a press.' },
    { name: 'defaultValue', type: 'number', default: '0', description: 'The first current stage, when nothing holds `value`.' },
    { name: 'onChange', type: '(index: number) => void', description: 'Called when a stage is pressed; a plain `value` without it (or a signal) does not press.' },
    { name: 'reach', type: "'back' | 'any' | 'none'", default: "'back'", description: 'Which stages a press may move to: done stages only, any other stage, or none.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Stages in a row, or in a column beside the content.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The tone: done chips solid in it, the current one a soft wash of it, and the filled tracks.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'The chips (`theme.sizes.step`: 28, 32, 36, 44, 52 px), the tracks’ thickness (`sizes.progress`) and the text.' },
    { name: 'chipSize', type: 'number', default: 'theme.sizes.step at size', description: 'The chips’ side in pixels.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'The chips’ radius (capped at a circle).' },
    { name: 'doneIcon', type: 'any', default: 'a check', description: 'What a done stage shows.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'lg'", description: 'The space between the stages and the content.' },
    { name: 'wrap', type: 'boolean', default: 'false', description: 'Horizontal stages wrap onto more rows.' },
    { name: 'children', type: 'Stepper.Stage | Stepper.Done', description: 'The stages, then what shows when all are done.' },
    { name: 'Stepper.Stage label', type: 'string | any', description: 'The stage’s title.' },
    { name: 'Stepper.Stage description', type: 'string | any', description: 'Quiet text under the title.' },
    { name: 'Stepper.Stage icon', type: 'any', default: 'its number', description: 'What the stage’s chip shows while not done.' },
    { name: 'Stepper.Stage doneIcon', type: 'any', description: 'What it shows once done.' },
    { name: 'Stepper.Stage loading', type: 'boolean', default: 'false', description: 'A Loader in its chip.' },
    { name: 'Stepper.Stage color', type: 'string', description: 'Its own tone.' },
    { name: 'Stepper.Stage disabled', type: 'boolean', default: 'false', description: 'Never pressed, and dimmed.' },
    { name: 'Stepper.Stage children', type: 'string | any', description: 'The content shown while it is current.' },
  ],
  demos: [
    {
      title: 'An order flow',
      code: `
function Demo() {
  const active = $signal($active(), 0);
  const go = to => $write(active, Math.min(3, Math.max(0, to)));
  return (
    <Stack gap="md">
      <Stepper value={active} onChange={i => go(i)} reach="any">
        <Stepper.Stage label="Cart" description="3 items">Two notebooks and a pen, € 24.</Stepper.Stage>
        <Stepper.Stage label="Address" description="Where it goes">Delivery to 12 Harbor Lane.</Stepper.Stage>
        <Stepper.Stage label="Payment" description="Card or transfer">The card ending in 4417.</Stepper.Stage>
        <Stepper.Done>Done: the order is placed.</Stepper.Done>
      </Stepper>
      <Row gap="xs" justify="center">
        <Button variant="neutral" onPress={() => go($read(active) - 1)}>Previous</Button>
        <Button onPress={() => go($read(active) + 1)}>Continue</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => 'value: ' + $read(active)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const active = $signal($active(), 0);
        const go = (/** @type {number} */ to) => $write(active, Math.min(3, Math.max(0, to)));
        return (
          <Stack gap="md">
            <Stepper value={active} onChange={(/** @type {number} */ i) => go(i)} reach="any">
              <Stepper.Stage label="Cart" description="3 items">
                Two notebooks and a pen, € 24.
              </Stepper.Stage>
              <Stepper.Stage label="Address" description="Where it goes">
                Delivery to 12 Harbor Lane.
              </Stepper.Stage>
              <Stepper.Stage label="Payment" description="Card or transfer">
                The card ending in 4417.
              </Stepper.Stage>
              <Stepper.Done>Done: the order is placed.</Stepper.Done>
            </Stepper>
            <Row gap="xs" justify="center">
              <Button variant="neutral" onPress={() => go($read(active) - 1)}>
                Previous
              </Button>
              <Button onPress={() => go($read(active) + 1)}>Continue</Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => 'value: ' + $read(active)}
            </Text>
          </Stack>
        );
      },
      height: 220,
    },
    {
      title: 'Vertical, pressing back to a done stage',
      code: `
function Demo() {
  const active = $signal($active(), 1);
  return (
    <Stepper value={active} orientation="vertical" size="sm">
      <Stepper.Stage label="Order placed" description="Monday">The order is in.</Stepper.Stage>
      <Stepper.Stage label="Shipped" description="Tuesday">On its way to you.</Stepper.Stage>
      <Stepper.Stage label="Delivered" description="Soon">At your door.</Stepper.Stage>
    </Stepper>
  );
}`,
      view: () => {
        const active = $signal($active(), 1);
        return (
          <Stepper value={active} orientation="vertical" size="sm">
            <Stepper.Stage label="Order placed" description="Monday">
              The order is in.
            </Stepper.Stage>
            <Stepper.Stage label="Shipped" description="Tuesday">
              On its way to you.
            </Stepper.Stage>
            <Stepper.Stage label="Delivered" description="Soon">
              At your door.
            </Stepper.Stage>
          </Stepper>
        );
      },
      height: 220,
    },
    {
      title: 'Colors, sizes, a loading and a disabled stage',
      code: `
function Demo() {
  return (
    <Stack gap="lg">
      <Stepper value={2} color="teal" size="xs" gap="xs">
        <Stepper.Stage label="Upload" />
        <Stepper.Stage label="Scan" color="violet" />
        <Stepper.Stage label="Convert" loading />
        <Stepper.Stage label="Share" />
      </Stepper>
      <Stepper value={1} size="lg" radius="xl">
        <Stepper.Stage label="Draft" />
        <Stepper.Stage label="Review" />
        <Stepper.Stage label="Publish" disabled />
      </Stepper>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="lg">
          <Stepper value={2} color="teal" size="xs" gap="xs">
            <Stepper.Stage label="Upload" />
            <Stepper.Stage label="Scan" color="violet" />
            <Stepper.Stage label="Convert" loading />
            <Stepper.Stage label="Share" />
          </Stepper>
          <Stepper value={1} size="lg" radius="xl">
            <Stepper.Stage label="Draft" />
            <Stepper.Stage label="Review" />
            <Stepper.Stage label="Publish" disabled />
          </Stepper>
        </Stack>
      ),
      height: 160,
    },
  ],
};
