// Dialog: a small window fixed in a corner of the viewport, not modal.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Dialog, Button, Rating, Row, Stack, Text, Textarea } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'dialog',
  group: 'layers',
  title: 'Dialog',
  description: 'A small window fixed to a corner of the viewport (`position: fixed`) that does not block the page: no backdrop, no focus trap. On the DOM it sits in the browser window’s corner, on a canvas in the canvas’s.',
  props: [
    { name: 'open', type: 'boolean | () => boolean', description: 'Whether it is shown, controlled.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether it is shown at first, uncontrolled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called with false by the close button, Escape and (with `dismiss.outside`) a press outside.' },
    { name: 'dismiss', type: 'boolean | { escape?, outside? }', default: '{ escape: true, outside: false }', description: 'What closes it: Escape inside it, and a press outside (a transparent layer under it takes that press; none with `portal` false); `true` both, `false` neither. The page stays in use, so outside is off by default.' },
    { name: 'closable', type: 'boolean | { size, label } | any', default: 'false', description: 'A close button (size sm, labeled ‘Close’), its options, or your own: no corner overlay but a part of the first row, at its end level with the content’s top, `theme.control.iconGap` from it, inside the padding.' },
    { name: 'at', type: '{ top?, right?, bottom?, left? }', default: "{ bottom: 'lg', right: 'lg' } (24)", description: 'Its distances from the viewport’s edges, in px or spacing steps.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Its width: 200, 260, 320, 400 or 480 px, or pixels.' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'Draws a border.' },
    { name: 'shadow', type: "'xs' … 'xl'", default: "'lg'", description: 'Its shadow.' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: 'theme.corner', description: 'Corner radius.' },
    { name: 'p', type: "'xs' … 'xl' | number", default: "'lg'", description: 'The inner padding.' },
    { name: 'motion', type: "'quick' | 'base' | 'calm' | { effect, duration, exit, easing }", default: "'base' (190), a rise", description: 'How it comes and goes: a motion preset, or options: `effect`, `duration` and `exit` (ms or presets; the closing takes the duration by default), `easing` \'linear\' | \'ease\' | \'ease-in\' | \'ease-out\' | \'ease-in-out\' | \'settle\' or a function (ease-out by default).' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'In the portal layer (it is fixed either way).' },
    { name: 'layer', type: 'number', default: 'LAYERS.sheet (20)', description: 'Its stacking order.' },
    { name: 'children', type: 'any', description: 'Its content.' },
  ],
  demos: [
    {
      title: 'A feedback prompt in the corner',
      code: `
function Demo() {
  const open = $signal($active(), false);
  const stars = $signal($active(), 0);
  return (
    <>
      <Row gap="sm">
        <Button onPress={() => $write(open, !$read(open))}>Ask for feedback</Button>
        <Text size="sm" fg="quiet">{() => ($read(open) ? 'open at the bottom left' : 'closed')}</Text>
      </Row>
      <Dialog open={open} onOpenChange={o => $write(open, o)} at={{ bottom: 'lg', left: 'lg' }} size="md" closable bordered>
        <Stack gap="sm">
          <Text fontWeight={600}>How did the new search work for you?</Text>
          <Rating value={stars} onChange={v => $write(stars, v)} />
          <Textarea placeholder="What would you change?" rows={3} />
          <Row justify="end">
            <Button onPress={() => $write(open, false)}>Send</Button>
          </Row>
        </Stack>
      </Dialog>
    </>
  );
}`,
      view: () => {
        const open = $signal($active(), false);
        const stars = $signal($active(), 0);
        return (
          <>
            <Row gap="sm">
              <Button onPress={() => $write(open, !$read(open))}>Ask for feedback</Button>
              <Text size="sm" fg="quiet">
                {() => ($read(open) ? 'open at the bottom left' : 'closed')}
              </Text>
            </Row>
            <Dialog open={open} onOpenChange={(/** @type {boolean} */ o) => $write(open, o)} at={{ bottom: 'lg', left: 'lg' }} size="md" closable bordered>
              <Stack gap="sm">
                <Text fontWeight={600}>How did the new search work for you?</Text>
                <Rating value={stars} onChange={(/** @type {number} */ v) => $write(stars, v)} />
                <Textarea placeholder="What would you change?" rows={3} />
                <Row justify="end">
                  <Button onPress={() => $write(open, false)}>Send</Button>
                </Row>
              </Stack>
            </Dialog>
          </>
        );
      },
      height: 200,
    },
    {
      title: 'Top left, small, without a transition',
      code: `
function Demo() {
  const open = $signal($active(), false);
  return (
    <>
      <Row>
        <Button variant="soft" onPress={() => $write(open, !$read(open))}>Toggle</Button>
      </Row>
      <Dialog open={open} at={{ top: 20, left: 20 }} size="sm" shadow="xl" motion={{ duration: 0 }}>
        <Text size="sm">Saved a moment ago.</Text>
      </Dialog>
    </>
  );
}`,
      view: () => {
        const open = $signal($active(), false);
        return (
          <>
            <Row>
              <Button variant="soft" onPress={() => $write(open, !$read(open))}>
                Toggle
              </Button>
            </Row>
            <Dialog open={open} at={{ top: 20, left: 20 }} size="sm" shadow="xl" motion={{ duration: 0 }}>
              <Text size="sm">Saved a moment ago.</Text>
            </Dialog>
          </>
        );
      },
      height: 120,
    },
  ],
};
