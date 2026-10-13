// Flip (rui-core/more): a card that turns between two faces.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Surface, Stack, Text } from 'rui-core';
import { Flip } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'flip',
  group: 'data',
  title: 'Flip',
  description: 'A card that turns between two faces (rui-core/more): Flip.Trigger inside toggles it, pressed by pointer or keyboard; it is a button, so its content holds no controls (a control of your own turns the Flip through `flipped` and `onFlippedChange`). The portable transforms are flat (no rotateY or perspective), so the turn is a scale across through 0: the face narrows about its center, painted so and never reflowed, and the other widens back.',
  props: [
    { name: 'flipped / defaultFlipped / onFlippedChange', type: 'boolean', default: 'false', description: 'Which face shows: held by you with `flipped` and `onFlippedChange(flipped)`, or its own from `defaultFlipped`.' },
    { name: 'duration', type: "'quick' | 'base' | 'calm' | 'hold' | number", default: "'calm' (300 ms)", description: 'A turn’s time: a MOTION preset or ms.' },
    { name: 'onFlipEnd', type: '(flipped: boolean) => void', description: 'Called when a turn finishes.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'A turn across or up.' },
    { name: 'w / h', type: 'number', default: '— / 200', description: 'Its size.' },
    { name: 'Flip.Front / Flip.Back', type: '{ children }', description: 'The two faces.' },
    { name: 'Flip.Trigger', type: '{ children, aria-label }', description: 'Toggles the Flip around it when pressed, by pointer or keyboard: a button, named by its content or `aria-label`, that wraps its children with no look of its own. Its content holds no controls (buttons, links, fields), only text, images and the like; a control of your own turns the Flip through `flipped` and `onFlippedChange`.' },
  ],
  demos: [
    {
      title: 'Turned by a press on it',
      code: `
function Demo() {
  return (
    <Flip w={260} h={140}>
      <Flip.Front>
        <Flip.Trigger>
          <Surface bordered radius="md" h={140} p="md" bg="blue.1"><Text fontWeight={700}>Front: press to turn</Text></Surface>
        </Flip.Trigger>
      </Flip.Front>
      <Flip.Back>
        <Flip.Trigger>
          <Surface bordered radius="md" h={140} p="md" bg="purple.1"><Text fontWeight={700}>Back: press to turn back</Text></Surface>
        </Flip.Trigger>
      </Flip.Back>
    </Flip>
  );
}`,
      view: () => (
        <Flip w={260} h={140}>
          <Flip.Front>
            <Flip.Trigger>
              <Surface bordered radius="md" h={140} p="md" bg="blue.1">
                <Text fontWeight={700}>Front: press to turn</Text>
              </Surface>
            </Flip.Trigger>
          </Flip.Front>
          <Flip.Back>
            <Flip.Trigger>
              <Surface bordered radius="md" h={140} p="md" bg="purple.1">
                <Text fontWeight={700}>Back: press to turn back</Text>
              </Surface>
            </Flip.Trigger>
          </Flip.Back>
        </Flip>
      ),
      height: 172,
    },
    {
      title: 'Held by a signal, up and down, slower',
      code: `
function Demo() {
  const flipped = $signal($active(), false);
  return (
    <Row gap="lg" align="center">
      <Flip w={200} h={100} orientation="vertical" duration={900} flipped={flipped} onFlippedChange={v => $write(flipped, v)}>
        <Flip.Front><Surface bordered h={100} p="md"><Text>Question</Text></Surface></Flip.Front>
        <Flip.Back><Surface bordered h={100} p="md" bg="teal.1"><Text>Answer</Text></Surface></Flip.Back>
      </Flip>
      <Stack gap="xs">
        <Button onPress={() => $write(flipped, !$read(flipped))}>Turn</Button>
        <Text size="sm" fg="quiet">{() => ($read(flipped) ? 'back' : 'front')}</Text>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const flipped = $signal($active(), false);
        return (
          <Row gap="lg" align="center">
            <Flip w={200} h={100} orientation="vertical" duration={900} flipped={flipped} onFlippedChange={(/** @type {boolean} */ v) => $write(flipped, v)}>
              <Flip.Front>
                <Surface bordered h={100} p="md">
                  <Text>Question</Text>
                </Surface>
              </Flip.Front>
              <Flip.Back>
                <Surface bordered h={100} p="md" bg="teal.1">
                  <Text>Answer</Text>
                </Surface>
              </Flip.Back>
            </Flip>
            <Stack gap="xs">
              <Button onPress={() => $write(flipped, !$read(flipped))}>Turn</Button>
              <Text size="sm" fg="quiet">
                {() => ($read(flipped) ? 'back' : 'front')}
              </Text>
            </Stack>
          </Row>
        );
      },
      height: 132,
    },
  ],
};
