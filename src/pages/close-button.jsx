// CloseButton: sizes, variants and colors, states, content after the X.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, CloseButton, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'close-button',
  group: 'actions',
  title: 'CloseButton',
  description: 'A button with a drawn X, for closing Alerts, Notifications, Modals and the like; the X is a Shape, the same on every renderer, and its accessible name is “Close” unless `label` says otherwise.',
  props: [
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The side of the square: 20, 24, 28, 36, 44 px, or pixels.' },
    { name: 'field', type: 'boolean', default: 'false', description: 'As tall as a field of that size (24, 30, 36, 44, 52 px), to sit inside or beside one.' },
    { name: 'iconSize', type: 'number', default: 'by size (12, 14, 18, 22, 28 px; 62% (`ratios.icon`) of a pixel or `field` size)', description: 'The side of the X.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius of the hover background.' },
    { name: 'variant', type: "'ghost' | 'plain'", default: "'ghost'", description: '`ghost` shows a background on hover; `plain` never does.' },
    { name: 'color', type: 'string', default: 'the page’s quiet text', description: 'The X’s color: a theme color, `name.shade` or hex.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Half transparent; presses are ignored.' },
    { name: 'label', type: 'string', default: "'Close'", description: 'The accessible name.' },
    { name: 'onPress', type: '(event) => void', description: 'Called on a press.' },
    { name: 'children', type: 'any', description: 'Content after the X, inside the same square (which keeps its size).' },
  ],
  demos: [
    {
      title: 'Sizes, and a field’s height',
      code: `
function Demo() {
  return (
    <Row gap="md" align="center">
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <CloseButton size={size} label={'Close ' + size} />)}
      <CloseButton size={56} iconSize={24} label="Close 56 px" />
      <CloseButton size="md" field label="Close, as tall as a field" />
    </Row>
  );
}`,
      view: () => (
        <Row gap="md" align="center">
          {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
            <CloseButton size={size} label={'Close ' + size} />
          ))}
          <CloseButton size={56} iconSize={24} label="Close 56 px" />
          <CloseButton size="md" field label="Close, as tall as a field" />
        </Row>
      ),
      height: 80,
    },
    {
      title: 'Variants, colors and states',
      code: `
function Demo() {
  return (
    <Row gap="md" align="center">
      <CloseButton />
      <CloseButton variant="plain" />
      <CloseButton color="red" />
      <CloseButton color="blue.6" radius="xl" />
      <CloseButton disabled />
    </Row>
  );
}`,
      view: () => (
        <Row gap="md" align="center">
          <CloseButton />
          <CloseButton variant="plain" />
          <CloseButton color="red" />
          <CloseButton color="blue.6" radius="xl" />
          <CloseButton disabled />
        </Row>
      ),
      height: 70,
    },
    {
      title: 'Closing something',
      code: `
function Demo() {
  const closed = $signal($active(), 0);
  return (
    <Stack gap="sm" align="start">
      <Row gap="xs" align="center">
        <Text>A dismissible note</Text>
        <CloseButton size="sm" label="Dismiss the note" onPress={() => $write(closed, $read(closed) + 1)} />
      </Row>
      <Button size="sm" dense variant="neutral" onPress={() => $write(closed, 0)}>Reset</Button>
      <Text fg="quiet">{() => 'closed ' + $read(closed) + ' times'}</Text>
    </Stack>
  );
}`,
      view: () => {
        const closed = $signal($active(), 0);
        return (
          <Stack gap="sm" align="start">
            <Row gap="xs" align="center">
              <Text>A dismissible note</Text>
              <CloseButton size="sm" label="Dismiss the note" onPress={() => $write(closed, $read(closed) + 1)} />
            </Row>
            <Button size="sm" dense variant="neutral" onPress={() => $write(closed, 0)}>
              Reset
            </Button>
            <Text fg="quiet">{() => 'closed ' + $read(closed) + ' times'}</Text>
          </Stack>
        );
      },
      height: 120,
    },
  ],
};
