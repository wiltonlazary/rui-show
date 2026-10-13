// Switch: states, track labels, sizes, Switch.Group.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Switch, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'switch',
  group: 'choices',
  title: 'Switch',
  description: 'An on/off switch whose thumb slides on the Clock over `duration` (quick, 110 ms), drawn with portable Views on every renderer, with optional labels inside the track. Switch.Group shares one list of values.',
  props: [
    { name: 'checked', type: 'boolean | (() => boolean)', description: 'The state, controlled: a press only calls `onChange`.' },
    { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'The first state when uncontrolled.' },
    { name: 'onChange', type: '(checked: boolean) => void', description: 'Called with the new state on a press.' },
    { name: 'label', type: 'string', description: 'The text beside the track.' },
    { name: 'description', type: 'string', description: 'Quiet text under the label.' },
    { name: 'error', type: 'string', description: 'A message under the label; it makes the track’s border red.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'The red border without a message.' },
    { name: 'labels', type: '{ on?: string, off?: string }', description: 'Text in the track when on and when off.' },
    { name: 'thumb', type: 'any', description: 'Content inside the thumb.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The track: 14 to 30 px high (xs–xl), twice its height less 4 wide (32 × 18 at sm), the thumb 2 px inside. Inside a group, the group’s size unless its own is set.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'round', description: 'The track’s corner radius (the thumb follows).' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The track’s color when on.' },
    { name: 'labelAt', type: "'end' | 'start'", default: "'end'", description: 'Which side of the track the label is on.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'quick' (110)", description: 'How long the thumb takes to slide: ms or a motion preset.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out; presses are ignored.' },
    { name: 'value', type: 'string', description: 'Its value inside a Switch.Group.' },
    { name: 'aria-label', type: 'string', description: 'An accessible name when there is no visible label.' },
    { name: 'Switch.Group value', type: 'string[]', description: 'The values switched on, controlled (`onChange` gets the new list); `defaultValue` when uncontrolled.' },
    { name: 'Switch.Group label, description, error', type: 'string', description: 'The group’s field texts; `size` sizes every switch without its own, and `disabled` locks every switch inside.' },
    { name: 'Switch.Group required / asterisk', type: 'boolean / boolean | string | node', description: 'A choice is needed (`aria-required` only); the mark after the label (none by default).' },
  ],
  demos: [
    {
      title: 'States and track labels',
      code: `
function Demo() {
  const on = $signal($active(), false);
  return (
    <Stack gap="sm">
      <Row gap="lg">
        <Switch label="Airplane mode" checked={() => $read(on)} onChange={v => $write(on, v)} />
        <Text size="sm" fg="quiet">{() => ($read(on) ? 'on' : 'off')}</Text>
      </Row>
      <Row gap="lg">
        <Switch size="xl" labels={{ on: 'yes', off: 'no' }} label="Words in the track" defaultChecked />
        <Switch label="Disabled" disabled />
        <Switch label="Checked, disabled" disabled defaultChecked />
        <Switch label="Error" error="Required" />
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const on = $signal($active(), false);
        return (
          <Stack gap="sm">
            <Row gap="lg">
              <Switch label="Airplane mode" checked={() => $read(on)} onChange={(/** @type {boolean} */ v) => $write(on, v)} />
              <Text size="sm" fg="quiet">
                {() => ($read(on) ? 'on' : 'off')}
              </Text>
            </Row>
            <Row gap="lg">
              <Switch size="xl" labels={{ on: 'yes', off: 'no' }} label="Words in the track" defaultChecked />
              <Switch label="Disabled" disabled />
              <Switch label="Checked, disabled" disabled defaultChecked />
              <Switch label="Error" error="Required" />
            </Row>
          </Stack>
        );
      },
      height: 120,
    },
    {
      title: 'Sizes, colors, radius and duration',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="lg" align="center">
        {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <Switch size={size} label={size} defaultChecked />)}
      </Row>
      <Row gap="lg">
        <Switch color="teal" label="Teal" defaultChecked />
        <Switch color="red" radius="xs" label="Square" defaultChecked />
        <Switch labelAt="start" label="Label at the start" />
        <Switch duration="calm" label="A calm slide" />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="lg" align="center">
            {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
              <Switch size={size} label={size} defaultChecked />
            ))}
          </Row>
          <Row gap="lg">
            <Switch color="teal" label="Teal" defaultChecked />
            <Switch color="red" radius="xs" label="Square" defaultChecked />
            <Switch labelAt="start" label="Label at the start" />
            <Switch duration="calm" label="A calm slide" />
          </Row>
        </Stack>
      ),
      height: 110,
    },
    {
      title: 'Switch.Group',
      code: `
function Demo() {
  const value = $signal($active(), ['email']);
  return (
    <Stack gap="sm">
      <Switch.Group label="Notifications" description="Where we reach you"
        value={() => $read(value)} onChange={v => $write(value, v)}>
        <Row gap="lg" mt="xs">
          <Switch value="email" label="Email" />
          <Switch value="sms" label="SMS" />
          <Switch value="push" label="Push" />
        </Row>
      </Switch.Group>
      <Text size="sm" fg="quiet">{() => \`value: [\${$read(value).join(', ')}]\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), /** @type {string[]} */ (['email']));
        return (
          <Stack gap="sm">
            <Switch.Group label="Notifications" description="Where we reach you" value={() => $read(value)} onChange={(/** @type {string[]} */ v) => $write(value, v)}>
              <Row gap="lg" mt="xs">
                <Switch value="email" label="Email" />
                <Switch value="sms" label="SMS" />
                <Switch value="push" label="Push" />
              </Row>
            </Switch.Group>
            <Text size="sm" fg="quiet">
              {() => `value: [${$read(value).join(', ')}]`}
            </Text>
          </Stack>
        );
      },
      height: 150,
    },
  ],
};
