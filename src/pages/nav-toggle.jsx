// NavToggle: a toggle with its state, and one that opens a nav panel.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Collapse, NavItem, NavToggle, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'nav-toggle',
  group: 'actions',
  title: 'NavToggle',
  description: 'The menu button: three drawn lines that turn into a cross while `open`, animated on the Clock, the same on every renderer. It keeps no state of its own: `open` and `onPress` belong to the application.',
  props: [
    { name: 'open', type: 'boolean | (() => boolean) | Signal<boolean>', default: 'false', description: 'Whether it shows the cross; also its `aria-expanded`.' },
    { name: 'onPress', type: '(event) => void', description: 'Called on a press: where `open` changes.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The lines’ length (`theme.sizes.toggle`: 14, 18, 22, 30, 38 px, or pixels), in a square as tall as a control of the same step (`sizes.control`; a pixel size takes the square an icon of that size fills at `theme.ratios.icon`).' },
    { name: 'thickness', type: 'number', default: 'theme.sizes.divider at the step (1 / 1 / 2 / 3 / 4)', description: 'The lines’ width: as thick as a Divider of that step (a pixel size takes the step whose toggle it reaches).' },
    { name: 'color', type: 'string', default: 'the scheme’s text color', description: 'The lines’ color: a theme color, `name.shade` or hex.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'base' (190 ms)", description: 'The turn into a cross: ms, or a MOTION preset’s name.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius of the press area.' },
    { name: 'label', type: 'string', default: "'Menu'", description: 'The accessible name.' },
  ],
  demos: [
    {
      title: 'Showing and hiding a menu',
      code: `
function Demo() {
  const isOpen = $signal($active(), false);
  return (
    <Row gap="md" align="center">
      <NavToggle open={isOpen} onPress={() => $write(isOpen, !$read(isOpen))} />
      <Text fg="quiet">{() => ($read(isOpen) ? 'menu open' : 'menu closed')}</Text>
    </Row>
  );
}`,
      view: () => {
        const isOpen = $signal($active(), false);
        return (
          <Row gap="md" align="center">
            <NavToggle open={isOpen} onPress={() => $write(isOpen, !$read(isOpen))} />
            <Text fg="quiet">{() => ($read(isOpen) ? 'menu open' : 'menu closed')}</Text>
          </Row>
        );
      },
      height: 60,
    },
    {
      title: 'Opening a nav panel',
      code: `
function Demo() {
  const isOpen = $signal($active(), false);
  const page = $signal($active(), 'Overview');
  return (
    <Stack gap="xs" w={240}>
      <Row gap="sm" align="center">
        <NavToggle label="Sections" duration="calm" open={isOpen} onPress={() => $write(isOpen, !$read(isOpen))} />
        <Text fontWeight={600}>{() => $read(page)}</Text>
      </Row>
      <Collapse open={isOpen}>
        <Stack gap={2}>
          {['Overview', 'Invoices', 'Payouts', 'Settings'].map(name => (
            <NavItem label={name} active={() => $read(page) === name} onPress={() => ($write(page, name), $write(isOpen, false))} />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}`,
      view: () => {
        const isOpen = $signal($active(), false);
        const page = $signal($active(), 'Overview');
        return (
          <Stack gap="xs" w={240}>
            <Row gap="sm" align="center">
              <NavToggle label="Sections" duration="calm" open={isOpen} onPress={() => $write(isOpen, !$read(isOpen))} />
              <Text fontWeight={600}>{() => $read(page)}</Text>
            </Row>
            <Collapse open={isOpen}>
              <Stack gap={2}>
                {['Overview', 'Invoices', 'Payouts', 'Settings'].map(name => (
                  <NavItem label={name} active={() => $read(page) === name} onPress={() => ($write(page, name), $write(isOpen, false))} />
                ))}
              </Stack>
            </Collapse>
          </Stack>
        );
      },
      height: 220,
    },
  ],
};
