// Checkbox: states, sizes and colors, Checkbox.Group, an indeterminate parent.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Checkbox, Row, Stack, Text, Tiles, Box } from 'rui-core';

const PHOTOS = ['Harbor', 'Dunes', 'Market', 'Bridge', 'Orchard', 'Lighthouse', 'Glacier', 'Vineyard', 'Old town', 'Canyon', 'Lagoon', 'Summit'];
const SHADES = ['blue.3', 'yellow.3', 'orange.3', 'gray.4', 'lime.3', 'red.3', 'cyan.2', 'violet.3', 'orange.2', 'red.4', 'teal.3', 'indigo.2'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'checkbox',
  group: 'choices',
  title: 'Checkbox',
  description: 'A checkbox with its label, description and error, drawn with portable Views and Shapes: a focusable press target that toggles on a press or the keyboard on every renderer. Checkbox.Group shares one list of values.',
  props: [
    { name: 'checked', type: 'boolean | (() => boolean)', description: 'The state, controlled: shown as given, a press only calls `onChange`.' },
    { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'The first state when uncontrolled.' },
    { name: 'onChange', type: '(checked: boolean) => void', description: 'Called with the new state on a press.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Draws a dash in a filled box, whatever the state.' },
    { name: 'label', type: 'string', description: 'The text beside the box; also the press target’s accessible name.' },
    { name: 'description', type: 'string', description: 'Quiet text under the label.' },
    { name: 'error', type: 'string', description: 'A message under the label; it makes the border red.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'The red border without a message.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The box: 14 to 30 pixels (`theme.sizes.check`), its mark `ratios.icon` (.62) of it, and the label’s font size. Inside a group, the group’s size unless its own is set.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'The box’s corner radius.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The checked box’s color: a theme color, `name.shade` or hex.' },
    { name: 'checkColor', type: 'string', default: 'black or white by contrast', description: 'The check mark’s color; by default black or white by the theme’s contrast rule on the fill.' },
    { name: 'variant', type: "'solid' | 'outline'", default: "'solid'", description: '`solid` fills a checked box with `color`; `outline` keeps the field’s ground and draws the border and mark in `color`.' },
    { name: 'labelAt', type: "'end' | 'start'", default: "'end'", description: 'Which side of the box the label is on.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out; presses are ignored.' },
    { name: 'value', type: 'string', description: 'Its value inside a Checkbox.Group.' },
    { name: 'aria-label', type: 'string', description: 'An accessible name when there is no visible label.' },
    { name: 'Checkbox.Group value', type: 'string[]', description: 'The checked values, controlled (`onChange` gets the new list); `defaultValue` when uncontrolled.' },
    { name: 'Checkbox.Group max', type: 'number', description: 'No more than this many can be checked.' },
    { name: 'Checkbox.Group label, description, error', type: 'string', description: 'The group’s field texts; `size` sizes every checkbox without its own, and `disabled` locks every checkbox inside.' },
    { name: 'Checkbox.Group required / asterisk', type: 'boolean / boolean | string | node', description: 'A choice is needed (`aria-required` only); the mark after the label (none by default).' },
  ],
  demos: [
    {
      title: 'States',
      code: `
function Demo() {
  const on = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Checkbox label="Email me the nightly build report" description="Held by a signal" checked={() => $read(on)} onChange={v => $write(on, v)} />
      <Text size="sm" fg="quiet">{() => \`checked: \${$read(on)}\`}</Text>
      <Row gap="lg">
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Outline" variant="outline" defaultChecked />
        <Checkbox label="Error" error="Required" />
        <Checkbox label="Label at start" labelAt="start" />
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const on = $signal($active(), true);
        return (
          <Stack gap="sm">
            <Checkbox label="Email me the nightly build report" description="Held by a signal" checked={() => $read(on)} onChange={(/** @type {boolean} */ v) => $write(on, v)} />
            <Text size="sm" fg="quiet">
              {() => `checked: ${$read(on)}`}
            </Text>
            <Row gap="lg">
              <Checkbox label="Indeterminate" indeterminate />
              <Checkbox label="Disabled" disabled />
              <Checkbox label="Outline" variant="outline" defaultChecked />
              <Checkbox label="Error" error="Required" />
              <Checkbox label="Label at start" labelAt="start" />
            </Row>
          </Stack>
        );
      },
      height: 170,
    },
    {
      title: 'Sizes and colors',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="lg" align="center">
        {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <Checkbox size={size} label={size} defaultChecked />)}
      </Row>
      <Row gap="lg">
        <Checkbox color="teal" label="Teal" defaultChecked />
        <Checkbox color="purple" radius="xl" label="Round" defaultChecked />
        <Checkbox color="yellow.3" label="Light fill, dark mark" defaultChecked />
        <Checkbox color="indigo" checkColor="yellow.3" label="Own mark color" defaultChecked />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="lg" align="center">
            {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
              <Checkbox size={size} label={size} defaultChecked />
            ))}
          </Row>
          <Row gap="lg">
            <Checkbox color="teal" label="Teal" defaultChecked />
            <Checkbox color="purple" radius="xl" label="Round" defaultChecked />
            <Checkbox color="yellow.3" label="Light fill, dark mark" defaultChecked />
            <Checkbox color="indigo" checkColor="yellow.3" label="Own mark color" defaultChecked />
          </Row>
        </Stack>
      ),
      height: 110,
    },
    {
      title: 'Checkbox.Group',
      code: `
function Demo() {
  const value = $signal($active(), ['basil']);
  return (
    <Stack gap="sm">
      <Checkbox.Group label="Pizza toppings" description="Two at most" max={2}
        value={() => $read(value)} onChange={v => $write(value, v)}>
        <Row gap="lg" mt="xs">
          <Checkbox value="basil" label="Basil" />
          <Checkbox value="olive" label="Olive" />
          <Checkbox value="mushroom" label="Mushroom" />
          <Checkbox value="anchovy" label="Anchovy" disabled />
        </Row>
      </Checkbox.Group>
      <Text size="sm" fg="quiet">{() => \`value: [\${$read(value).join(', ')}]\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), /** @type {string[]} */ (['basil']));
        return (
          <Stack gap="sm">
            <Checkbox.Group label="Pizza toppings" description="Two at most" max={2} value={() => $read(value)} onChange={(/** @type {string[]} */ v) => $write(value, v)}>
              <Row gap="lg" mt="xs">
                <Checkbox value="basil" label="Basil" />
                <Checkbox value="olive" label="Olive" />
                <Checkbox value="mushroom" label="Mushroom" />
                <Checkbox value="anchovy" label="Anchovy" disabled />
              </Row>
            </Checkbox.Group>
            <Text size="sm" fg="quiet">
              {() => `value: [${$read(value).join(', ')}]`}
            </Text>
          </Stack>
        );
      },
      height: 150,
    },
    {
      title: 'Select all, indeterminate',
      code: `
const PHOTOS = ['Harbor', 'Dunes', 'Market', 'Bridge', 'Orchard', 'Lighthouse', 'Glacier', 'Vineyard', 'Old town', 'Canyon', 'Lagoon', 'Summit'];
const SHADES = ['blue.3', 'yellow.3', 'orange.3', 'gray.4', 'lime.3', 'red.3', 'cyan.2', 'violet.3', 'orange.2', 'red.4', 'teal.3', 'indigo.2'];

function Demo() {
  const picked = $signal($active(), ['Dunes', 'Glacier', 'Lagoon']);
  const all = () => $read(picked).length === PHOTOS.length;
  const some = () => $read(picked).length > 0 && !all();
  return (
    <Stack gap="sm">
      <Checkbox label="Select all 12 photos" checked={all} indeterminate={some}
        onChange={() => $write(picked, all() ? [] : [...PHOTOS])} />
      <Checkbox.Group value={() => $read(picked)} onChange={v => $write(picked, v)}>
        <Tiles columns={6} gap="xs">
          {PHOTOS.map((photo, i) => (
            <Box h={56} p={6} bg={SHADES[i]} style={{ radius: 4 }}>
              <Checkbox value={photo} aria-label={photo} size="xs" />
            </Box>
          ))}
        </Tiles>
      </Checkbox.Group>
      <Text size="sm" fg="quiet">{() => \`\${$read(picked).length} of \${PHOTOS.length} selected\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const picked = $signal($active(), /** @type {string[]} */ (['Dunes', 'Glacier', 'Lagoon']));
        const all = () => $read(picked).length === PHOTOS.length;
        const some = () => $read(picked).length > 0 && !all();
        return (
          <Stack gap="sm">
            <Checkbox label="Select all 12 photos" checked={all} indeterminate={some} onChange={() => $write(picked, all() ? [] : [...PHOTOS])} />
            <Checkbox.Group value={() => $read(picked)} onChange={(/** @type {string[]} */ v) => $write(picked, v)}>
              <Tiles columns={6} gap="xs">
                {PHOTOS.map((photo, i) => (
                  <Box h={56} p={6} bg={SHADES[i]} style={{ radius: 4 }}>
                    <Checkbox value={photo} aria-label={photo} size="xs" />
                  </Box>
                ))}
              </Tiles>
            </Checkbox.Group>
            <Text size="sm" fg="quiet">
              {() => `${$read(picked).length} of ${PHOTOS.length} selected`}
            </Text>
          </Stack>
        );
      },
      height: 230,
    },
  ],
};
