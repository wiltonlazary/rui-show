// Tooltip: a label on hover, its positions, colors and arrow, a wrapped
// one, one held by a signal, and Tooltip.Follow following the pointer.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Tooltip, Button, Surface, Row, Stack, Switch, Text } from 'rui-core';

const SIDES = ['top', 'right', 'bottom', 'left'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'tooltip',
  group: 'layers',
  title: 'Tooltip',
  description: 'A short label shown after a deliberate hover on its trigger (and at once when keyboard focus enters it), placed against it in the portal layer. Tooltip.Follow follows the pointer over its trigger instead.',
  props: [
    { name: 'label', type: 'string | (() => string) | any', description: 'What it shows; while it shows, it describes the Button, Pressable or IconButton it wraps (`aria-describedby`).' },
    { name: 'at', type: "'top' | 'right' | 'bottom' | 'left', each with '-start' or '-end'", default: "'top'", description: 'Its side of the trigger.' },
    { name: 'offset', type: 'number', default: '6', description: 'The gap from the trigger (half of spacing sm, as every panel).' },
    { name: 'arrow', type: 'boolean | { size }', default: 'false', description: 'Draws an arrow pointing at the trigger (`size` 5).' },
    { name: 'color', type: 'string', description: 'A theme color to fill it with (night.8 with gray.1 text by default; gray.0 with night.9 text in the dark scheme).' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: "'sm'", description: 'Corner radius. The label sits 3 × 9 px inside, in the xs font size.' },
    { name: 'wrap', type: 'boolean', default: 'false', description: 'Wraps the label at `w`.' },
    { name: 'w', type: 'number', default: '250', description: 'The width a wrapped label wraps at.' },
    { name: 'openDelay', type: 'number', default: '500', description: 'The hover time before it opens, in milliseconds; keyboard focus shows it at once.' },
    { name: 'closeDelay', type: 'number', default: '100', description: 'The time before it closes after the pointer leaves: grace to cross a gap.' },
    { name: 'open', type: 'boolean | () => boolean', description: 'Controlled: shown whatever the pointer does.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Never shows.' },
    { name: 'motion', type: "'quick' | 'base' | 'calm' | { effect, duration, exit, easing }", default: "'quick' (110 ms), a fade", description: 'How it comes and goes: a MOTION preset’s name, or an EFFECTS preset, the opening’s ms, the closing’s ms (`exit`, the duration by default) and the easing (`\'linear\'`, `\'ease\'`, `\'ease-in\'`, `\'ease-out\'` (default), `\'ease-in-out\'`, `\'settle\'` or a function).' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'In the portal layer, or inline.' },
    { name: 'layer', type: 'number', default: 'LAYERS.tip (35)', description: 'Its stacking order: above any panel it explains.' },
    { name: 'children', type: 'any | ((props: { onPress, onKey, ref }) => any)', description: 'The trigger: plain children work, focus bubbling to their wrapper; a function child gets the trigger props to spread on its element.' },
    { name: 'Tooltip.Follow', type: '{ label, at, offset, color, radius, disabled, layer }', description: 'Follows the pointer over its trigger: `at` (`bottom-end`: below the pointer, reaching toward the end; or `top`, `left`, `right`, each with -start and -end) and `offset` (`sizes.box.follow`, 12) from it.' },
  ],
  demos: [
    {
      title: 'Positions and the arrow',
      code: `
const SIDES = ['top', 'right', 'bottom', 'left'];

function Demo() {
  return (
    <Row justify="center" gap="xl" py={40}>
      {SIDES.map(side => (
        <Tooltip label={\`Tooltip on the \${side}\`} at={side} arrow>
          <Button variant="neutral">{side}</Button>
        </Tooltip>
      ))}
    </Row>
  );
}`,
      view: () => (
        <Row justify="center" gap="xl" py={40}>
          {SIDES.map(side => (
            <Tooltip label={`Tooltip on the ${side}`} at={side} arrow>
              <Button variant="neutral">{side}</Button>
            </Tooltip>
          ))}
        </Row>
      ),
      height: 120,
    },
    {
      title: 'Colors, radius and a wrapped definition',
      code: `
function Demo() {
  return (
    <Row justify="center" gap="md" pt={50} pb={90}>
      <Tooltip label="Teal tooltip" color="teal" radius="xl">
        <Button color="teal" variant="soft">Teal</Button>
      </Tooltip>
      <Tooltip label="Purple tooltip" color="purple" arrow>
        <Button color="purple" variant="soft">Purple</Button>
      </Tooltip>
      <Tooltip wrap w={280} at="bottom" label="The Web Content Accessibility Guidelines: the shared standard for accessible web content. Level AA asks, among much else, for a text contrast of 4.5 to 1.">
        <Text underline>WCAG</Text>
      </Tooltip>
    </Row>
  );
}`,
      view: () => (
        <Row justify="center" gap="md" pt={50} pb={90}>
          <Tooltip label="Teal tooltip" color="teal" radius="xl">
            <Button color="teal" variant="soft">
              Teal
            </Button>
          </Tooltip>
          <Tooltip label="Purple tooltip" color="purple" arrow>
            <Button color="purple" variant="soft">
              Purple
            </Button>
          </Tooltip>
          <Tooltip wrap w={280} at="bottom" label="The Web Content Accessibility Guidelines: the shared standard for accessible web content. Level AA asks, among much else, for a text contrast of 4.5 to 1.">
            <Text underline>WCAG</Text>
          </Tooltip>
        </Row>
      ),
      height: 190,
    },
    {
      title: 'Held by a signal, and following the pointer',
      code: `
function Demo() {
  const shown = $signal($active(), false);
  return (
    <Stack gap="md" pt={30}>
      <Row gap="xl">
        <Tooltip label="Shown by the switch" open={shown} at="right" arrow>
          <Button variant="soft">Trigger</Button>
        </Tooltip>
      </Row>
      <Switch label="Show the tooltip" checked={shown} onChange={value => $write(shown, value)} />
      <Tooltip.Follow label="Tracking your pointer">
        <Surface bordered p="md" w={300}>
          <Text size="sm">Trace a path across this card</Text>
        </Surface>
      </Tooltip.Follow>
    </Stack>
  );
}`,
      view: () => {
        const shown = $signal($active(), false);
        return (
          <Stack gap="md" pt={30}>
            <Row gap="xl">
              <Tooltip label="Shown by the switch" open={shown} at="right" arrow>
                <Button variant="soft">Trigger</Button>
              </Tooltip>
            </Row>
            <Switch label="Show the tooltip" checked={shown} onChange={(/** @type {boolean} */ value) => $write(shown, value)} />
            <Tooltip.Follow label="Tracking your pointer">
              <Surface bordered p="md" w={300}>
                <Text size="sm">Trace a path across this card</Text>
              </Surface>
            </Tooltip.Follow>
          </Stack>
        );
      },
      height: 200,
    },
  ],
};
