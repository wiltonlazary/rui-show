// Accordion: items that open and close, one at a time or several.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Accordion, Button, Row, Stack, Text, IconBox } from 'rui-core';

const VARIANTS = ['plain', 'boxed', 'soft', 'split'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'accordion',
  group: 'data',
  title: 'Accordion',
  description: 'Items whose panels open and close with a chevron that turns a quarter as it opens and a collapsing panel, one at a time or `multiple`, in four variants, the same on every renderer.',
  props: [
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Several items may be open at once; the value is then an array.' },
    { name: 'value', type: 'string | null | string[]', description: 'The open item (or items with `multiple`), controlled.' },
    { name: 'defaultValue', type: 'string | null | string[]', default: 'null (or [])', description: 'The item open at first, uncontrolled.' },
    { name: 'onChange', type: '(value: string | null | string[]) => void', description: 'Called with the new value when an item opens or closes.' },
    { name: 'variant', type: "'plain' | 'boxed' | 'soft' | 'split'", default: "'plain'", description: 'Lines between items, one bordered box, each item on the sunken ground, or separate boxes.' },
    { name: 'chevronAt', type: "'end' | 'start'", default: "'end'", description: 'Which side of the trigger the chevron sits on.' },
    { name: 'chevron', type: 'boolean | any | { size?, turn? }', default: 'true', description: 'The built-in chevron (`true`), none (`false`), content of your own, or the built-in one’s options: `size` in pixels (`sizes.glyph.md`, 16) and `turn`: it points to the end (the start with `chevronAt` start) at rest and turns 90° down as its item opens (true; `false` keeps it at rest).' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'base' (190)", description: 'How long a panel takes to open or close, and the chevron to turn: ms or a motion preset.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius of the boxed, soft and split variants.' },
    { name: 'Accordion.Item value', type: 'string', description: 'The item’s key, the one `value` names.' },
    { name: 'Accordion.Trigger icon', type: 'any', description: 'Content before the trigger’s label. The trigger is padded by `control.optionPad`, its parts `control.iconGap` (8) apart.' },
    { name: 'Accordion.Trigger chevron', type: 'any | null', description: 'This trigger’s own chevron; `null` hides it.' },
    { name: 'Accordion.Trigger disabled', type: 'boolean', default: 'false', description: 'Dimmed; presses do not open the item.' },
    { name: 'Accordion.Panel children', type: 'any', description: 'The content the item opens: text wraps. Padded 12 at its sides and 6 below (`control.optionPad`, `control.panelPad`), indented under the label when the chevron is at the start.' },
  ],
  demos: [
    {
      title: 'Three seasons',
      code: `
function Demo() {
  return (
    <Accordion defaultValue="spring">
      <Accordion.Item value="spring">
        <Accordion.Trigger>Spring</Accordion.Trigger>
        <Accordion.Panel>Long rains and the first green on the hills.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="summer">
        <Accordion.Trigger>Summer</Accordion.Trigger>
        <Accordion.Panel>Warm nights and slow evenings.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="autumn">
        <Accordion.Trigger>Autumn</Accordion.Trigger>
        <Accordion.Panel>Short days and a sharp wind.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}`,
      view: () => (
        <Accordion defaultValue="spring">
          <Accordion.Item value="spring">
            <Accordion.Trigger>Spring</Accordion.Trigger>
            <Accordion.Panel>Long rains and the first green on the hills.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="summer">
            <Accordion.Trigger>Summer</Accordion.Trigger>
            <Accordion.Panel>Warm nights and slow evenings.</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="autumn">
            <Accordion.Trigger>Autumn</Accordion.Trigger>
            <Accordion.Panel>Short days and a sharp wind.</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ),
      height: 230,
    },
    {
      title: 'Variants',
      code: `
const VARIANTS = ['plain', 'boxed', 'soft', 'split'];

function Demo() {
  const variant = $signal($active(), 'boxed');
  return (
    <Stack gap="sm">
      <Row gap="xs">
        {VARIANTS.map(v => (
          <Button size="xs" variant={() => ($read(variant) === v ? 'solid' : 'neutral')} onPress={() => $write(variant, v)}>{v}</Button>
        ))}
      </Row>
      <Accordion variant={() => $read(variant)} defaultValue="first" radius="md">
        <Accordion.Item value="first">
          <Accordion.Trigger>Opening hours</Accordion.Trigger>
          <Accordion.Panel>Nine to six, closed on Sundays.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="second">
          <Accordion.Trigger>Getting here</Accordion.Trigger>
          <Accordion.Panel>Two stops past the river, then left.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}`,
      view: () => {
        const variant = $signal($active(), 'boxed');
        return (
          <Stack gap="sm">
            <Row gap="xs">
              {VARIANTS.map(v => (
                <Button size="xs" variant={() => ($read(variant) === v ? 'solid' : 'neutral')} onPress={() => $write(variant, v)}>
                  {v}
                </Button>
              ))}
            </Row>
            <Accordion variant={() => $read(variant)} defaultValue="first" radius="md">
              <Accordion.Item value="first">
                <Accordion.Trigger>Opening hours</Accordion.Trigger>
                <Accordion.Panel>Nine to six, closed on Sundays.</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="second">
                <Accordion.Trigger>Getting here</Accordion.Trigger>
                <Accordion.Panel>Two stops past the river, then left.</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        );
      },
      height: 230,
    },
    {
      title: 'Multiple, held by a signal, chevron at the start',
      code: `
function Demo() {
  const open = $signal($active(), ['a']);
  return (
    <Stack gap="sm">
      <Text size="sm" fg="quiet">{() => \`open: \${$read(open).join(', ') || 'none'}\`}</Text>
      <Accordion multiple chevronAt="start" variant="split" value={() => $read(open)} onChange={v => $write(open, v)}>
        <Accordion.Item value="a">
          <Accordion.Trigger icon={<IconBox size="sm" variant="soft">A</IconBox>}>Account</Accordion.Trigger>
          <Accordion.Panel>Name, email and password.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="b">
          <Accordion.Trigger icon={<IconBox size="sm" variant="soft" color="teal">B</IconBox>}>Billing</Accordion.Trigger>
          <Accordion.Panel>Cards and invoices.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="c">
          <Accordion.Trigger disabled>Closed for now</Accordion.Trigger>
          <Accordion.Panel>Never shown.</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}`,
      view: () => {
        const open = $signal($active(), /** @type {string[]} */ (['a']));
        return (
          <Stack gap="sm">
            <Text size="sm" fg="quiet">
              {() => `open: ${$read(open).join(', ') || 'none'}`}
            </Text>
            <Accordion multiple chevronAt="start" variant="split" value={() => $read(open)} onChange={(/** @type {string[]} */ v) => $write(open, v)}>
              <Accordion.Item value="a">
                <Accordion.Trigger
                  icon={
                    <IconBox size="sm" variant="soft">
                      A
                    </IconBox>
                  }
                >
                  Account
                </Accordion.Trigger>
                <Accordion.Panel>Name, email and password.</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="b">
                <Accordion.Trigger
                  icon={
                    <IconBox size="sm" variant="soft" color="teal">
                      B
                    </IconBox>
                  }
                >
                  Billing
                </Accordion.Trigger>
                <Accordion.Panel>Cards and invoices.</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="c">
                <Accordion.Trigger disabled>Closed for now</Accordion.Trigger>
                <Accordion.Panel>Never shown.</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        );
      },
      height: 340,
    },
  ],
};
