// Chip: variants, sizes, Chip.Group single and multiple.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Chip, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'chip',
  group: 'choices',
  title: 'Chip',
  description: 'A pill that toggles, with a check mark when checked, drawn the same on every renderer. Chip.Group makes chips pick one value, or a list with `multiple`.',
  props: [
    { name: 'checked', type: 'boolean | (() => boolean)', description: 'The state, controlled: a press only calls `onChange`.' },
    { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'The first state when uncontrolled.' },
    { name: 'onChange', type: '(checked: boolean) => void', description: 'Called with the new state on a press.' },
    { name: 'children', type: 'string | (() => string)', description: 'The chip’s text.' },
    { name: 'variant', type: "'solid' | 'outline' | 'soft'", default: "'solid'", description: 'How the color is applied when checked.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'Height (22 to 40, `theme.sizes.chip`), font size and side padding: a button’s, `control.pad` (10 to 24), and `control.densePad` (5 to 12) while checked, as the check takes the room. Inside a group, the group’s size unless its own is set.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius; the theme’s `corner` (md), where Tag and Badge default to `sm`.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The checked chip’s color.' },
    { name: 'icon', type: 'any', default: 'a check mark', description: 'What shows before the text when checked; the check is `ratios.glyph` (.42) of the chip’s height.' },
    { name: 'label', type: 'string', description: 'The press area’s accessible name.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out; presses are ignored.' },
    { name: 'value', type: 'string', description: 'Its value inside a Chip.Group.' },
    { name: 'Chip.Group size / disabled', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' / boolean", description: '`size` sizes every chip without its own; `disabled` locks every chip inside.' },
    { name: 'Chip.Group multiple', type: 'boolean', default: 'false', description: 'The value is a list of the checked chips’ values in press order; else one value or null.' },
    { name: 'Chip.Group toggle', type: 'boolean', default: 'true', description: 'Single: a press on the chosen chip clears the value to null; `false` keeps it, so the group always holds a choice once made.' },
    { name: 'Chip.Group max', type: 'number', description: 'With `multiple`, the most chips chosen at once: a press past it does nothing.' },
    { name: 'Chip.Group value', type: 'string | null | string[]', description: 'The value (null, or `[]` with `multiple`, by default), controlled (`onChange` gets the new one, only on a change); `defaultValue` when uncontrolled. The group adds no box of its own.' },
  ],
  demos: [
    {
      title: 'Variants',
      code: `
function Demo() {
  const on = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Row gap="sm">
        <Chip defaultChecked>Solid</Chip>
        <Chip variant="soft" defaultChecked>Soft</Chip>
        <Chip variant="outline" defaultChecked>Outline</Chip>
        <Chip color="teal" defaultChecked>Teal</Chip>
        <Chip disabled>Disabled</Chip>
      </Row>
      <Row gap="sm">
        <Chip checked={() => $read(on)} onChange={v => $write(on, v)}>Held by a signal</Chip>
        <Text size="sm" fg="quiet">{() => \`checked: \${$read(on)}\`}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const on = $signal($active(), true);
        return (
          <Stack gap="sm">
            <Row gap="sm">
              <Chip defaultChecked>Solid</Chip>
              <Chip variant="soft" defaultChecked>
                Soft
              </Chip>
              <Chip variant="outline" defaultChecked>
                Outline
              </Chip>
              <Chip color="teal" defaultChecked>
                Teal
              </Chip>
              <Chip disabled>Disabled</Chip>
            </Row>
            <Row gap="sm">
              <Chip checked={() => $read(on)} onChange={(/** @type {boolean} */ v) => $write(on, v)}>
                Held by a signal
              </Chip>
              <Text size="sm" fg="quiet">
                {() => `checked: ${$read(on)}`}
              </Text>
            </Row>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'Sizes',
      code: `
function Demo() {
  return (
    <Row gap="sm" align="center">
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <Chip size={size} defaultChecked>{size}</Chip>)}
    </Row>
  );
}`,
      view: () => (
        <Row gap="sm" align="center">
          {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
            <Chip size={size} defaultChecked>
              {size}
            </Chip>
          ))}
        </Row>
      ),
      height: 80,
    },
    {
      title: 'Chip.Group',
      code: `
function Demo() {
  const one = $signal($active(), 'apple');
  const many = $signal($active(), ['ts']);
  return (
    <Stack gap="sm">
      <Chip.Group value={() => $read(one)} onChange={v => $write(one, v)}>
        <Row gap="sm">
          <Chip value="apple">Apple</Chip>
          <Chip value="banana">Banana</Chip>
          <Chip value="cherry">Cherry</Chip>
        </Row>
      </Chip.Group>
      <Text size="sm" fg="quiet">{() => \`one: \${$read(one) ?? 'none'}\`}</Text>
      <Chip.Group multiple value={() => $read(many)} onChange={v => $write(many, v)}>
        <Row gap="sm">
          <Chip value="ts" variant="outline">TypeScript</Chip>
          <Chip value="js" variant="outline">JavaScript</Chip>
          <Chip value="css" variant="outline">CSS</Chip>
        </Row>
      </Chip.Group>
      <Text size="sm" fg="quiet">{() => \`many: [\${$read(many).join(', ')}]\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const one = $signal($active(), /** @type {string | null} */ ('apple'));
        const many = $signal($active(), /** @type {string[]} */ (['ts']));
        return (
          <Stack gap="sm">
            <Chip.Group value={() => $read(one)} onChange={(/** @type {string} */ v) => $write(one, v)}>
              <Row gap="sm">
                <Chip value="apple">Apple</Chip>
                <Chip value="banana">Banana</Chip>
                <Chip value="cherry">Cherry</Chip>
              </Row>
            </Chip.Group>
            <Text size="sm" fg="quiet">
              {() => `one: ${$read(one) ?? 'none'}`}
            </Text>
            <Chip.Group multiple value={() => $read(many)} onChange={(/** @type {string[]} */ v) => $write(many, v)}>
              <Row gap="sm">
                <Chip value="ts" variant="outline">
                  TypeScript
                </Chip>
                <Chip value="js" variant="outline">
                  JavaScript
                </Chip>
                <Chip value="css" variant="outline">
                  CSS
                </Chip>
              </Row>
            </Chip.Group>
            <Text size="sm" fg="quiet">
              {() => `many: [${$read(many).join(', ')}]`}
            </Text>
          </Stack>
        );
      },
      height: 180,
    },
  ],
};
