// Outline: variants, indents, an active heading the
// application owns.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Outline, Row, Stack, Text } from 'rui-core';

const HEADINGS = [
  { label: 'Getting there', level: 1 },
  { label: 'By train', level: 2 },
  { label: 'By ferry', level: 2 },
  { label: 'Where to stay', level: 1 },
  { label: 'Hillside huts', level: 3 },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'outline',
  group: 'wayfinding',
  title: 'Outline',
  description: 'Links to a page’s headings, indented by level, with the active one marked. The application sets `value`, or passes `spy` (rui-core/hooks’ `$spy`) to follow a Scroll’s headings.',
  props: [
    { name: 'data', type: '{ label: string, level?: number, id?: string }[]', description: 'The headings: their text, their level (1 the top) and, where given, the heading’s id (a `#id` link).' },
    { name: 'value', type: 'number | (() => number) | Signal<number>', description: 'The index shown active (a signal is written on press).' },
    { name: 'defaultValue', type: 'number', default: '0', description: 'The active index when not controlled.' },
    { name: 'onChange', type: '(index: number) => void', description: 'Called with the pressed heading’s index.' },
    { name: 'variant', type: "'solid' | 'soft' | 'plain'", default: "'solid'", description: 'How the active heading is colored (`plain` colors only its text).' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The active colors.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: 'Font size.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'The headings’ corner radius.' },
    { name: 'indent', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The indent a level: a spacing step or pixels.' },
    { name: 'indentFrom', type: 'number', default: '2', description: 'The first level indented.' },
    { name: 'spy', type: 'ReturnType<typeof $spy>', description: 'A scroll spy: its headings are the data (without `data`), the active one follows the Scroll (without `value`), and a press scrolls to its heading.' },
  ],
  demos: [
    {
      title: 'The active heading',
      code: `
const HEADINGS = [
  { label: 'Getting there', level: 1 },
  { label: 'By train', level: 2 },
  { label: 'By ferry', level: 2 },
  { label: 'Where to stay', level: 1 },
  { label: 'Hillside huts', level: 3 },
];

function Demo() {
  const active = $signal($active(), 0);
  return (
    <Stack gap="xs" w={260}>
      <Outline data={HEADINGS} value={active} />
      <Text size="sm" fg="quiet">{() => 'reading: ' + HEADINGS[$read(active)].label}</Text>
    </Stack>
  );
}`,
      view: () => {
        const active = $signal($active(), 0);
        return (
          <Stack gap="xs" w={260}>
            <Outline data={HEADINGS} value={active} />
            <Text size="sm" fg="quiet">
              {() => 'reading: ' + HEADINGS[$read(active)].label}
            </Text>
          </Stack>
        );
      },
      height: 240,
    },
    {
      title: 'Variants and indents',
      code: `
// HEADINGS as in the first demo

function Demo() {
  return (
    <Row gap="lg" align="start" fill>
      <Outline data={HEADINGS} defaultValue={1} variant="soft" color="teal" />
      <Outline data={HEADINGS} defaultValue={2} variant="plain" color="purple" size="xs" />
      <Outline data={HEADINGS} defaultValue={4} indent="xs" radius="xl" />
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg" align="start" fill>
          <Outline data={HEADINGS} defaultValue={1} variant="soft" color="teal" />
          <Outline data={HEADINGS} defaultValue={2} variant="plain" color="purple" size="xs" />
          <Outline data={HEADINGS} defaultValue={4} indent="xs" radius="xl" />
        </Row>
      ),
      height: 170,
    },
    {
      title: 'Hearing a press',
      code: `
// HEADINGS as in the first demo

function Demo() {
  const heard = $signal($active(), 'press a heading');
  return (
    <Stack gap="xs" w={260}>
      <Outline data={HEADINGS.slice(0, 3)} onChange={i => $write(heard, 'onChange(' + i + ')')} />
      <Text size="sm" fg="quiet">{() => $read(heard)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const heard = $signal($active(), 'press a heading');
        return (
          <Stack gap="xs" w={260}>
            <Outline data={HEADINGS.slice(0, 3)} onChange={(/** @type {number} */ i) => $write(heard, 'onChange(' + i + ')')} />
            <Text size="sm" fg="quiet">
              {() => $read(heard)}
            </Text>
          </Stack>
        );
      },
      height: 130,
    },
  ],
};
