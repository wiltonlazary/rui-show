// Modal: a dialog over a backdrop, in four sections: open and close, sizes
// and placement, scroll and full, a stack of two.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Modal, $modalStack, Button, ColorPicker, Row, ScrollBox, SegmentedControl, Stack, Swatch, Text, TextInput } from 'rui-core';

const SIZES = ['xs', 'sm', 'md', 'lg'];

/** The terms a long modal body scrolls through. */
const TERMS = Array.from({ length: 12 }, (_, i) => `${i + 1}. Each clause of the service terms sits in its own paragraph, so the body grows past the modal’s height and scrolls inside it.`);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'modal',
  group: 'layers',
  title: 'Modal',
  description: 'A dialog in the portal layer over a backdrop, closed by the backdrop, Escape or its close button. Focus moves into it, Tab stays inside, and on close the focus goes back where it was; it grows in on the Clock. On the DOM it covers the page, on a canvas the canvas.',
  props: [
    { name: 'open', type: 'boolean | () => boolean', description: 'Whether it is open (`defaultOpen` when uncontrolled).' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called with false by the backdrop, Escape and the close button.' },
    { name: 'title', type: 'string | any', description: 'The header’s title (text or content).' },
    { name: 'closable', type: 'boolean | { size, label } | any', default: 'true', description: 'The close button in the header: off, its size and accessible label, or a node of your own.' },
    { name: 'at', type: "'top' | 'center'", default: "'top'", description: 'Where it sits: `offset` from the top, or in the middle of the layer.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | string", default: "'md'", description: 'Its width: a step (320 to 800 px, 560 at md), pixels or a percent.' },
    { name: 'full', type: 'boolean', default: 'false', description: 'Covers the whole layer, without a radius.' },
    { name: 'padding', type: "'xs' … 'xl' | number", default: "'lg'", description: 'The inner padding.' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: 'theme.corner', description: 'Corner radius.' },
    { name: 'shadow', type: "'xs' … 'xl'", default: "'lg'", description: 'Its shadow.' },
    { name: 'backdrop', type: 'boolean | { color, opacity }', default: 'night.9 at 0.45 (0.7 dark)', description: 'Dims the page behind it: off, or its color and opacity.' },
    { name: 'dismiss', type: 'boolean | { escape, outside }', default: 'true', description: 'What closes it: Escape, a press on the backdrop (both by default), or neither (false).' },
    { name: 'trap', type: 'boolean', default: 'true', description: 'Moves the focus in and keeps Tab inside.' },
    { name: 'refocus', type: 'boolean', default: 'true', description: 'On close, gives the focus back to the element that had it.' },
    { name: 'motion', type: "'quick' | 'base' | 'calm' | { effect, duration, exit, easing }", default: "'base' (190 ms), a grow", description: 'How it comes and goes: a MOTION preset’s name, or an EFFECTS preset, the opening’s ms, the closing’s ms (`exit`, the duration by default) and the easing (`\'linear\'`, `\'ease\'`, `\'ease-in\'`, `\'ease-out\'` (default), `\'ease-in-out\'`, `\'settle\'` or a function).' },
    { name: 'offset', type: 'number | string | { x, y }', default: "64 / 'md'", description: 'Its distance from the top at `top`, and its least distance from the sides (md, 16 px); one value sets both, `{ x, y }` sets them apart.' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'In the portal layer; false covers its parent instead.' },
    { name: 'layer', type: 'number', default: 'LAYERS.sheet (20)', description: 'Its stacking order.' },
    { name: 'stack', type: 'string', description: 'Its id in a `Modal.Stack`.' },
    { name: '$modalStack(ids?)', type: '{ value, isOpen, top, open, close, toggle, clear, bind }', description: 'The open state of a stack’s members: `value` the open ids bottom to top, `top()` the topmost, `open(id)` puts one on top (raising it when it is already open), `bind(id)` the props that make a Modal its member; `ids`, when given, names the set (another id throws).' },
    { name: 'onEntered', type: '() => void', description: 'Called once it has finished opening.' },
    { name: 'onExited', type: '() => void', description: 'Called once it has closed.' },
    { name: 'children', type: 'any', description: 'The body.' },
    { name: 'Modal.Frame / Backdrop / Content / Header / Title / Close / Body', type: 'parts', description: 'The parts, for composing one: Modal.Frame takes Modal’s props (its state, closing, focus and look) and holds the rest; the Header is at least 56 high, and the Body under a Header keeps a top padding of spacing xs.' },
  ],
  demos: [
    {
      title: 'Open and close',
      code: `
function Demo() {
  const isOpen = $signal($active(), false);
  const close = () => $write(isOpen, false);
  return (
    <>
      <Row>
        <Button onPress={() => $write(isOpen, true)}>Open modal</Button>
      </Row>
      <Modal open={isOpen} onOpenChange={o => $write(isOpen, o)} title="Invite a teammate">
        <Stack gap="sm">
          <TextInput label="Teammate’s email" placeholder="sam@studio.example" />
          <TextInput label="Role" placeholder="Editor" />
          <Button stretch onPress={close}>Send invite</Button>
        </Stack>
      </Modal>
    </>
  );
}`,
      view: () => {
        const isOpen = $signal($active(), false);
        const close = () => $write(isOpen, false);
        return (
          <>
            <Row>
              <Button onPress={() => $write(isOpen, true)}>Open modal</Button>
            </Row>
            <Modal open={isOpen} onOpenChange={(/** @type {boolean} */ o) => $write(isOpen, o)} title="Invite a teammate">
              <Stack gap="sm">
                <TextInput label="Teammate’s email" placeholder="sam@studio.example" />
                <TextInput label="Role" placeholder="Editor" />
                <Button stretch onPress={close}>
                  Send invite
                </Button>
              </Stack>
            </Modal>
          </>
        );
      },
      height: 340,
    },
    {
      title: 'Sizes and placement',
      code: `
const SIZES = ['xs', 'sm', 'md', 'lg'];

function Demo() {
  const isOpen = $signal($active(), false);
  const size = $signal($active(), 'md');
  const at = $signal($active(), 'center');
  const open = s => ($write(size, s), $write(isOpen, true));
  return (
    <Stack gap="sm" align="start">
      <SegmentedControl aria-label="Placement" size="xs" data={['top', 'center']} value={at} onChange={v => $write(at, v)} />
      <Row gap="xs">
        {SIZES.map(s => <Button variant="neutral" onPress={() => open(s)}>{s}</Button>)}
      </Row>
      <Modal open={isOpen} onOpenChange={o => $write(isOpen, o)} size={size} at={at} title={() => \`Size \${$read(size)}, at \${$read(at)}\`}>
        <Text size="sm">Its width is the size’s step; \`at\` puts it near the top or in the middle of the layer.</Text>
      </Modal>
    </Stack>
  );
}`,
      view: () => {
        const isOpen = $signal($active(), false);
        const size = $signal($active(), 'md');
        const at = $signal($active(), 'center');
        const open = (/** @type {string} */ s) => ($write(size, s), $write(isOpen, true));
        return (
          <Stack gap="sm" align="start">
            <SegmentedControl aria-label="Placement" size="xs" data={['top', 'center']} value={at} onChange={(/** @type {string} */ v) => $write(at, v)} />
            <Row gap="xs">
              {SIZES.map(s => (
                <Button variant="neutral" onPress={() => open(s)}>
                  {s}
                </Button>
              ))}
            </Row>
            <Modal open={isOpen} onOpenChange={(/** @type {boolean} */ o) => $write(isOpen, o)} size={size} at={at} title={() => `Size ${$read(size)}, at ${$read(at)}`}>
              <Text size="sm">Its width is the size’s step; `at` puts it near the top or in the middle of the layer.</Text>
            </Modal>
          </Stack>
        );
      },
      height: 300,
    },
    {
      title: 'Scroll and full',
      code: `
const TERMS = Array.from({ length: 12 }, (_, i) => \`\${i + 1}. Each clause of the service terms sits in its own paragraph, so the body grows past the modal’s height and scrolls inside it.\`);

function Demo() {
  const long = $signal($active(), false);
  const full = $signal($active(), false);
  return (
    <>
      <Row gap="sm">
        <Button onPress={() => $write(long, true)}>Read the terms</Button>
        <Button variant="soft" onPress={() => $write(full, true)}>Full screen</Button>
      </Row>
      <Modal open={long} onOpenChange={o => $write(long, o)} title="Service terms" dismiss={{ outside: false }}>
        <Stack gap="sm">
          <ScrollBox h={220}>
            <Stack gap="xs">{TERMS.map(t => <Text size="sm">{t}</Text>)}</Stack>
          </ScrollBox>
          <Button onPress={() => $write(long, false)}>I agree</Button>
        </Stack>
      </Modal>
      <Modal open={full} onOpenChange={o => $write(full, o)} full title="Full screen" motion="calm">
        <Text>It covers the whole layer, growing in at the calm pace. Press Escape or the close button.</Text>
      </Modal>
    </>
  );
}`,
      view: () => {
        const long = $signal($active(), false);
        const full = $signal($active(), false);
        return (
          <>
            <Row gap="sm">
              <Button onPress={() => $write(long, true)}>Read the terms</Button>
              <Button variant="soft" onPress={() => $write(full, true)}>
                Full screen
              </Button>
            </Row>
            <Modal open={long} onOpenChange={(/** @type {boolean} */ o) => $write(long, o)} title="Service terms" dismiss={{ outside: false }}>
              <Stack gap="sm">
                <ScrollBox h={220}>
                  <Stack gap="xs">
                    {TERMS.map(t => (
                      <Text size="sm">{t}</Text>
                    ))}
                  </Stack>
                </ScrollBox>
                <Button onPress={() => $write(long, false)}>I agree</Button>
              </Stack>
            </Modal>
            <Modal open={full} onOpenChange={(/** @type {boolean} */ o) => $write(full, o)} full title="Full screen" motion="calm">
              <Text>It covers the whole layer, growing in at the calm pace. Press Escape or the close button.</Text>
            </Modal>
          </>
        );
      },
      height: 400,
    },
    {
      title: 'A label editor over its color picker',
      code: `
function Demo() {
  const stack = $modalStack(['label', 'color']);
  const name = $signal($active(), 'Needs review');
  const color = $signal($active(), '#a94a00');
  const draft = $signal($active(), '#a94a00');
  const pick = () => ($write(draft, $read(color)), stack.open('color'));
  return (
    <Modal.Stack>
      <Row gap="sm" align="center">
        <Swatch color={() => $read(color)} size={20} />
        <Text size="sm">{() => $read(name)}</Text>
        <Button variant="neutral" onPress={() => stack.open('label')}>Edit label</Button>
        <Text size="sm" fg="quiet">{() => 'on top: ' + (stack.top() ?? 'none')}</Text>
      </Row>
      <Modal {...stack.bind('label')} title="Edit label">
        <Stack gap="sm">
          <TextInput label="Name" value={name} onChange={v => $write(name, v)} />
          <Row gap="sm" align="center">
            <Swatch color={() => $read(color)} />
            <Button variant="soft" onPress={pick}>Pick a color</Button>
          </Row>
          <Button onPress={() => stack.close('label')}>Done</Button>
        </Stack>
      </Modal>
      <Modal {...stack.bind('color')} title="Label color" size="xs" at="center">
        <Stack gap="sm">
          <ColorPicker size="sm" value={() => $read(draft)} onChange={v => $write(draft, v)} />
          <Row gap="xs">
            <Button onPress={() => ($write(color, $read(draft)), stack.close('color'))}>Use it</Button>
            <Button variant="neutral" onPress={() => stack.close('color')}>Back</Button>
          </Row>
        </Stack>
      </Modal>
    </Modal.Stack>
  );
}`,
      view: () => {
        const stack = $modalStack(['label', 'color']);
        const name = $signal($active(), 'Needs review');
        const color = $signal($active(), '#a94a00');
        const draft = $signal($active(), '#a94a00');
        const pick = () => ($write(draft, $read(color)), stack.open('color'));
        return (
          <Modal.Stack>
            <Row gap="sm" align="center">
              <Swatch color={() => $read(color)} size={20} />
              <Text size="sm">{() => $read(name)}</Text>
              <Button variant="neutral" onPress={() => stack.open('label')}>
                Edit label
              </Button>
              <Text size="sm" fg="quiet">
                {() => 'on top: ' + (stack.top() ?? 'none')}
              </Text>
            </Row>
            <Modal {...stack.bind('label')} title="Edit label">
              <Stack gap="sm">
                <TextInput label="Name" value={name} onChange={(/** @type {string} */ v) => $write(name, v)} />
                <Row gap="sm" align="center">
                  <Swatch color={() => $read(color)} />
                  <Button variant="soft" onPress={pick}>
                    Pick a color
                  </Button>
                </Row>
                <Button onPress={() => stack.close('label')}>Done</Button>
              </Stack>
            </Modal>
            <Modal {...stack.bind('color')} title="Label color" size="xs" at="center">
              <Stack gap="sm">
                <ColorPicker size="sm" value={() => $read(draft)} onChange={(/** @type {string} */ v) => $write(draft, v)} />
                <Row gap="xs">
                  <Button onPress={() => ($write(color, $read(draft)), stack.close('color'))}>Use it</Button>
                  <Button variant="neutral" onPress={() => stack.close('color')}>
                    Back
                  </Button>
                </Row>
              </Stack>
            </Modal>
          </Modal.Stack>
        );
      },
      height: 440,
    },
  ],
};
