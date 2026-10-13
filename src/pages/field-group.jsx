// FieldGroup: a bordered group of fields with a legend.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { FieldGroup, TextInput, Switch, Stack, Row, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'field-group',
  group: 'entry',
  title: 'FieldGroup',
  description: 'A bordered group of fields with a legend set on its top border. The legend is placed with the portable absolute positioning and painted over the border with the group’s background, the same on every renderer. `disabled` only dims the group: the fields inside take their own `disabled`.',
  props: [
    { name: 'legend', type: 'string', description: 'The title on the top border (none when absent).' },
    { name: 'variant', type: "'outline' | 'soft' | 'bare'", default: "'outline'", description: 'A `rule` border on the `field` ground, a `rule` border on the `sunken` ground, or no frame and no padding.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the group (the theme’s opacity.disabled, .45).' },
    { name: 'children', type: 'any', description: 'The fields, in a column.' },
    { name: 'style props, style, ref', type: 'as Box', description: 'On the group’s frame.' },
  ],
  demos: [
    {
      title: 'A room request in two groups, held by signals',
      code: `
function Demo() {
  const host = $signal($active(), '');
  const from = $signal($active(), '');
  const to = $signal($active(), '');
  return (
    <Stack gap="sm">
      <Row fill align="start">
        <FieldGroup legend="Who books">
          <TextInput label="Host" placeholder="Who holds the key" value={host} onChange={v => $write(host, v)} />
        </FieldGroup>
        <FieldGroup legend="When">
          <Row gap="sm">
            <TextInput label="From" placeholder="14:00" w={90} value={from} onChange={v => $write(from, v)} />
            <TextInput label="To" placeholder="15:30" w={90} value={to} onChange={v => $write(to, v)} />
          </Row>
        </FieldGroup>
      </Row>
      <Text size="sm" fg="quiet">{() => \`Quiet room for \${$read(host) || '…'}, \${$read(from) || '?'} to \${$read(to) || '?'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const host = $signal($active(), '');
        const from = $signal($active(), '');
        const to = $signal($active(), '');
        return (
          <Stack gap="sm">
            <Row fill align="start">
              <FieldGroup legend="Who books">
                <TextInput label="Host" placeholder="Who holds the key" value={host} onChange={(/** @type {string} */ v) => $write(host, v)} />
              </FieldGroup>
              <FieldGroup legend="When">
                <Row gap="sm">
                  <TextInput label="From" placeholder="14:00" w={90} value={from} onChange={(/** @type {string} */ v) => $write(from, v)} />
                  <TextInput label="To" placeholder="15:30" w={90} value={to} onChange={(/** @type {string} */ v) => $write(to, v)} />
                </Row>
              </FieldGroup>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `Quiet room for ${$read(host) || '…'}, ${$read(from) || '?'} to ${$read(to) || '?'}`}
            </Text>
          </Stack>
        );
      },
      height: 170,
    },
    {
      title: 'Variants, one inside another',
      code: `
function Demo() {
  return (
    <FieldGroup legend="Print settings" variant="soft" radius="lg">
      <Row fill align="start">
        <FieldGroup legend="Paper">
          <TextInput aria-label="Paper" placeholder="Letter, portrait" />
        </FieldGroup>
        <FieldGroup legend="Copies" variant="bare">
          <TextInput aria-label="Copies" placeholder="1" w={80} />
        </FieldGroup>
      </Row>
    </FieldGroup>
  );
}`,
      view: () => (
        <FieldGroup legend="Print settings" variant="soft" radius="lg">
          <Row fill align="start">
            <FieldGroup legend="Paper">
              <TextInput aria-label="Paper" placeholder="Letter, portrait" />
            </FieldGroup>
            <FieldGroup legend="Copies" variant="bare">
              <TextInput aria-label="Copies" placeholder="1" w={80} />
            </FieldGroup>
          </Row>
        </FieldGroup>
      ),
      height: 150,
    },
    {
      title: 'Disabled by a switch, the fields with it',
      code: `
function Demo() {
  const locker = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Switch label="Leave it at the pickup locker" checked={locker} onChange={v => $write(locker, v)} />
      <FieldGroup legend="Street address" disabled={() => $read(locker)}>
        <Row fill>
          <TextInput label="Street" placeholder="12 Orchard Lane" disabled={() => $read(locker)} />
          <TextInput label="Unit" placeholder="3B" disabled={() => $read(locker)} />
        </Row>
      </FieldGroup>
    </Stack>
  );
}`,
      view: () => {
        const locker = $signal($active(), true);
        return (
          <Stack gap="sm">
            <Switch label="Leave it at the pickup locker" checked={locker} onChange={(/** @type {boolean} */ v) => $write(locker, v)} />
            <FieldGroup legend="Street address" disabled={() => $read(locker)}>
              <Row fill>
                <TextInput label="Street" placeholder="12 Orchard Lane" disabled={() => $read(locker)} />
                <TextInput label="Unit" placeholder="3B" disabled={() => $read(locker)} />
              </Row>
            </FieldGroup>
          </Stack>
        );
      },
      height: 160,
    },
  ],
};
