// Popover: a panel against its trigger, its positions and arrow, a form
// in it with the focus trapped, and one held by a signal.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Popover, Badge, Button, Row, Stack, Text, TextInput } from 'rui-core';

const POSITIONS = ['top', 'right', 'bottom-start', 'bottom-end', 'left'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'popover',
  group: 'layers',
  title: 'Popover',
  description: 'A panel placed against its trigger in the portal layer: a press, Enter, Space or ArrowDown on the trigger opens it, and Escape, a press outside or the trigger again closes it. Placement is portable: it flips to the other side where its own overflows the viewport and shifts along it to stay inside, and it follows its trigger through scrolls, moves and resizes while open.',
  props: [
    { name: 'open', type: 'boolean | () => boolean', description: 'Controlled: whether it is open (with `onOpenChange`).' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Uncontrolled: open at first.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it opens or closes, or asks to.' },
    { name: 'at', type: "'top' | 'right' | 'bottom' | 'left', each with '-start' or '-end'", default: "'bottom'", description: 'Its side of the trigger and its alignment.' },
    { name: 'offset', type: 'number', default: '6', description: 'The gap from the trigger, in pixels.' },
    { name: 'width', type: "number | 'trigger'", description: 'Its width; `trigger` makes it as wide as the trigger.' },
    { name: 'collision', type: '{ flip?: boolean, slide?: boolean }', default: '{ flip: true, slide: true }', description: 'The other side where its own overflows the viewport; a slide along it to stay inside (8 px in, never past the trigger).' },
    { name: 'persistent', type: 'boolean', default: 'false', description: 'The panel stays built while closed, hidden.' },
    { name: 'arrow', type: "boolean | { size, offset, at: 'edge' | 'center' }", default: 'false', description: 'An arrow pointing at the trigger: its size (6), its distance from the panel’s aligned edge (6), and `edge` (that distance from the aligned edge) or `center` (at the trigger’s center).' },
    { name: 'trap', type: 'boolean', default: 'false', description: 'Moves the focus in and keeps Tab inside.' },
    { name: 'dismiss', type: 'boolean | { escape?, outside? }', default: '{ escape: true, outside: true }', description: 'What closes it: Escape, a press outside (a transparent backdrop takes the press); false for neither.' },
    { name: 'refocus', type: 'boolean', default: 'true', description: 'Gives the focus back to the trigger on close.' },
    { name: 'shadow', type: "'xs' … 'xl'", default: "'md'", description: 'Its shadow.' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: 'theme.corner', description: 'Corner radius.' },
    { name: 'motion', type: "'quick' | 'base' | 'calm' | { effect, duration, exit, easing }", default: "'quick' (110), a fade from the trigger’s side", description: 'How it comes and goes: a motion preset, or options: `effect` (by default `sink` below the trigger, `rise` above, `from-start` or `from-end` beside it), `duration` and `exit` (ms or presets; the closing takes the duration by default), `easing` \'linear\' | \'ease\' | \'ease-in\' | \'ease-out\' | \'ease-in-out\' | \'settle\' or a function (ease-out by default).' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'In the portal layer; false keeps it inline, in the trigger’s box (no backdrop).' },
    { name: 'layer', type: 'number', default: 'LAYERS.float (30)', description: 'Its stacking order.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Never opens.' },
    { name: 'Popover.Trigger style', type: 'style', description: 'Added to the wrapper’s style, for a plain or a function child.' },
    { name: 'Popover.Trigger children', type: 'any | ((trigger) => any)', description: 'The trigger; a function gets `{ onPress, onKey, ref }` to spread on the trigger itself.' },
    { name: 'Popover.Panel children', type: 'any', description: 'The panel’s content, padded 8 × 12; `ref` gets its node.' },
  ],
  demos: [
    {
      title: 'A color legend',
      code: `
function Demo() {
  return (
    <Popover width={200} at="bottom-start" arrow>
      <Popover.Trigger>
        <Button variant="neutral">What the colors mean</Button>
      </Popover.Trigger>
      <Popover.Panel>
        <Stack gap={6}>
          <Badge variant="dot" color="teal">On track</Badge>
          <Badge variant="dot" color="amber">At risk</Badge>
          <Badge variant="dot" color="red">Blocked</Badge>
        </Stack>
      </Popover.Panel>
    </Popover>
  );
}`,
      view: () => (
        <Popover width={200} at="bottom-start" arrow>
          <Popover.Trigger>
            <Button variant="neutral">What the colors mean</Button>
          </Popover.Trigger>
          <Popover.Panel>
            <Stack gap={6}>
              <Badge variant="dot" color="teal">
                On track
              </Badge>
              <Badge variant="dot" color="amber">
                At risk
              </Badge>
              <Badge variant="dot" color="red">
                Blocked
              </Badge>
            </Stack>
          </Popover.Panel>
        </Popover>
      ),
      height: 150,
    },
    {
      title: 'Positions',
      code: `
const POSITIONS = ['top', 'right', 'bottom-start', 'bottom-end', 'left'];

function Demo() {
  return (
    <Row gap="md" justify="center" py={50}>
      {POSITIONS.map(position => (
        <Popover at={position} arrow={{ at: 'center' }}>
          <Popover.Trigger>
            <Button variant="neutral">{position}</Button>
          </Popover.Trigger>
          <Popover.Panel>
            <Text size="sm">{position}</Text>
          </Popover.Panel>
        </Popover>
      ))}
    </Row>
  );
}`,
      view: () => (
        <Row gap="md" justify="center" py={50}>
          {POSITIONS.map(position => (
            <Popover at={position} arrow={{ at: 'center' }}>
              <Popover.Trigger>
                <Button variant="neutral">{position}</Button>
              </Popover.Trigger>
              <Popover.Panel>
                <Text size="sm">{position}</Text>
              </Popover.Panel>
            </Popover>
          ))}
        </Row>
      ),
      height: 150,
    },
    {
      title: 'A rename form, with the focus trapped',
      code: `
function Demo() {
  const name = $signal($active(), 'field-notes.md');
  const open = $signal($active(), false);
  return (
    <Row gap="md">
      <Popover width={260} trap open={open} onOpenChange={o => $write(open, o)} at="bottom-start">
        <Popover.Trigger>
          <Button variant="soft">Rename file</Button>
        </Popover.Trigger>
        <Popover.Panel>
          <Row gap="xs" align="end">
            <TextInput label="File name" value={name} onChange={v => $write(name, v)} style={{ grow: 1 }} />
            <Button onPress={() => $write(open, false)}>Save</Button>
          </Row>
        </Popover.Panel>
      </Popover>
      <Text size="sm" fg="quiet">{() => $read(name)}</Text>
    </Row>
  );
}`,
      view: () => {
        const name = $signal($active(), 'field-notes.md');
        const open = $signal($active(), false);
        return (
          <Row gap="md">
            <Popover width={260} trap open={open} onOpenChange={(/** @type {boolean} */ o) => $write(open, o)} at="bottom-start">
              <Popover.Trigger>
                <Button variant="soft">Rename file</Button>
              </Popover.Trigger>
              <Popover.Panel>
                <Row gap="xs" align="end">
                  <TextInput label="File name" value={name} onChange={(/** @type {string} */ v) => $write(name, v)} style={{ grow: 1 }} />
                  <Button onPress={() => $write(open, false)}>Save</Button>
                </Row>
              </Popover.Panel>
            </Popover>
            <Text size="sm" fg="quiet">
              {() => $read(name)}
            </Text>
          </Row>
        );
      },
      height: 160,
    },
    {
      title: 'Held by a signal',
      code: `
function Demo() {
  const open = $signal($active(), false);
  return (
    <Row gap="md">
      <Popover open={open} onOpenChange={value => $write(open, value)} at="right">
        <Popover.Trigger>
          <Button>Toggle</Button>
        </Popover.Trigger>
        <Popover.Panel>
          <Button size="xs" variant="soft" onPress={() => $write(open, false)}>Close from inside</Button>
        </Popover.Panel>
      </Popover>
      <Text size="sm" fg="quiet">{() => ($read(open) ? 'open' : 'closed')}</Text>
    </Row>
  );
}`,
      view: () => {
        const open = $signal($active(), false);
        return (
          <Row gap="md">
            <Popover open={open} onOpenChange={(/** @type {boolean} */ value) => $write(open, value)} at="right">
              <Popover.Trigger>
                <Button>Toggle</Button>
              </Popover.Trigger>
              <Popover.Panel>
                <Button size="xs" variant="soft" onPress={() => $write(open, false)}>
                  Close from inside
                </Button>
              </Popover.Panel>
            </Popover>
            <Text size="sm" fg="quiet">
              {() => ($read(open) ? 'open' : 'closed')}
            </Text>
          </Row>
        );
      },
      height: 80,
    },
  ],
};
