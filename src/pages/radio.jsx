// Radio: Radio.Group, sizes, colors and states.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Badge, Radio, Row, Stack, Surface, Text } from 'rui-core';

const SPEEDS = [
  { value: 'standard', label: 'Standard', description: '€3.90, in 3 to 5 days' },
  { value: 'express', label: 'Express', description: '€9.50, tomorrow before noon' },
  { value: 'pickup', label: 'Pickup', description: 'Free, at the Rua Augusta store', note: 'closed Sundays' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'radio',
  group: 'choices',
  title: 'Radio',
  description: 'A radio button, a ring with a dot drawn with portable Views, focusable and pressable on every renderer. Radio.Group keeps one value among the radios inside it.',
  props: [
    { name: 'checked', type: 'boolean | (() => boolean)', description: 'The state, controlled (outside a group).' },
    { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'The first state when uncontrolled. A press only checks: a lone radio never unchecks itself.' },
    { name: 'onChange', type: '(checked: boolean) => void', description: 'Called with `true` when a press checks it.' },
    { name: 'value', type: 'string', description: 'Its value inside a Radio.Group.' },
    { name: 'aria-label', type: 'string', description: 'An accessible name when there is no visible label.' },
    { name: 'label', type: 'string', description: 'The text beside the ring.' },
    { name: 'description', type: 'string', description: 'Quiet text under the label.' },
    { name: 'error', type: 'string', description: 'A message under the label; it makes the ring red.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'The red ring without a message.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The ring: 14 to 30 pixels (`theme.sizes.check`), and its dot `ratios.mark` (.3) of it. Inside a group, the group’s size unless its own is set.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The checked ring’s color.' },
    { name: 'dotColor', type: 'string', default: 'black or white by contrast', description: 'The dot’s color; by default black or white by the theme’s contrast rule on the fill.' },
    { name: 'variant', type: "'solid' | 'outline'", default: "'solid'", description: '`solid` fills a checked ring with `color`; `outline` keeps the field’s ground and draws the border and dot in `color`.' },
    { name: 'labelAt', type: "'end' | 'start'", default: "'end'", description: 'Which side of the ring the label is on.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out; presses are ignored.' },
    { name: 'Radio.Group value', type: 'string | null', description: 'The checked value, controlled (`onChange` gets the new one); `defaultValue` when uncontrolled.' },
    { name: 'Radio.Group label, description, error', type: 'string', description: 'The group’s field texts; `size` sizes every radio without its own, and `disabled` locks every radio inside.' },
    { name: 'Radio.Group required / asterisk', type: 'boolean / boolean | string | node', description: 'A choice is needed (`aria-required` only); the mark after the label (none by default).' },
  ],
  demos: [
    {
      title: 'Radio.Group: delivery cards',
      code: `
const SPEEDS = [
  { value: 'standard', label: 'Standard', description: '€3.90, in 3 to 5 days' },
  { value: 'express', label: 'Express', description: '€9.50, tomorrow before noon' },
  { value: 'pickup', label: 'Pickup', description: 'Free, at the Rua Augusta store', note: 'closed Sundays' },
];

function Demo() {
  const speed = $signal($active(), 'standard');
  return (
    <Stack gap="sm" w={360}>
      <Radio.Group label="Delivery" value={() => $read(speed)} onChange={v => $write(speed, v)}>
        <Stack gap="xs" mt="xs">
          {SPEEDS.map(s => (
            <Surface bordered radius="md" p="sm">
              <Row gap="sm" justify="between" align="start">
                <Radio value={s.value} label={s.label} description={s.description} />
                {s.note ? <Badge size="xs" variant="soft" color="orange">{s.note}</Badge> : null}
              </Row>
            </Surface>
          ))}
        </Stack>
      </Radio.Group>
      <Text size="sm" fg="quiet">{() => \`value: \${$read(speed)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const speed = $signal($active(), 'standard');
        return (
          <Stack gap="sm" w={360}>
            <Radio.Group label="Delivery" value={() => $read(speed)} onChange={(/** @type {string} */ v) => $write(speed, v)}>
              <Stack gap="xs" mt="xs">
                {SPEEDS.map(s => (
                  <Surface bordered radius="md" p="sm">
                    <Row gap="sm" justify="between" align="start">
                      <Radio value={s.value} label={s.label} description={s.description} />
                      {s.note ? (
                        <Badge size="xs" variant="soft" color="orange">
                          {s.note}
                        </Badge>
                      ) : null}
                    </Row>
                  </Surface>
                ))}
              </Stack>
            </Radio.Group>
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(speed)}`}
            </Text>
          </Stack>
        );
      },
      height: 330,
    },
    {
      title: 'Sizes, colors and states',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="lg" align="center">
        {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <Radio size={size} label={size} defaultChecked />)}
      </Row>
      <Row gap="lg">
        <Radio color="teal" label="Teal" defaultChecked />
        <Radio variant="outline" label="Outline" defaultChecked />
        <Radio label="Disabled" disabled defaultChecked />
        <Radio label="Error" error="Choose a size" />
        <Radio label="Label at start" labelAt="start" />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="lg" align="center">
            {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
              <Radio size={size} label={size} defaultChecked />
            ))}
          </Row>
          <Row gap="lg">
            <Radio color="teal" label="Teal" defaultChecked />
            <Radio variant="outline" label="Outline" defaultChecked />
            <Radio label="Disabled" disabled defaultChecked />
            <Radio label="Error" error="Choose a size" />
            <Radio label="Label at start" labelAt="start" />
          </Row>
        </Stack>
      ),
      height: 130,
    },
  ],
};

