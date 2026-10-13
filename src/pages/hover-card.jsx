// HoverCard: Popover's panel opened by a resting pointer: file previews in
// a list, and a word's meaning in a sentence.

import { HoverCard, Link, Row, Stack, Text } from 'rui-core';

/** @type {{ name: string, kind: string, size: string, first: string }[]} */
const FILES = [
  { name: 'budget-2026.xlsx', kind: 'Spreadsheet', size: '84 KB', first: 'Q1 rent, payroll and the new kiln' },
  { name: 'kiln-manual.pdf', kind: 'PDF, 38 pages', size: '2.1 MB', first: 'Firing schedules for cone 6 and cone 10' },
  { name: 'open-studio.md', kind: 'Notes', size: '3 KB', first: 'Doors at ten; glaze demo at noon' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hover-card',
  group: 'layers',
  title: 'HoverCard',
  description: 'Popover’s panel, opened by a pointer at rest rather than a press. The pointer has to stay `openDelay` on the trigger first, so passing over it does nothing; leaving starts `closeDelay`, and reaching the panel within it keeps the panel up, so what is inside can be read and pressed. Placement and look are Popover’s props.',
  props: [
    { name: 'openDelay', type: 'number', default: '80', description: 'How long the pointer rests on the trigger before it opens, in milliseconds.' },
    { name: 'closeDelay', type: 'number', default: '240', description: 'How long after the pointer leaves before it closes.' },
    { name: 'at', type: "'top' | 'right' | 'bottom' | 'left', each with '-start' or '-end'", default: "'bottom'", description: 'Its side of the trigger and its alignment.' },
    { name: 'offset', type: 'number', default: '6', description: 'The gap from the trigger.' },
    { name: 'width', type: "number | 'trigger'", description: 'Its width (`trigger`: as wide as the trigger).' },
    { name: 'arrow', type: "boolean | { size, offset, at: 'edge' | 'center' }", default: 'false', description: 'Draws an arrow pointing at the trigger (`size` 6, `offset` 6 from the aligned edge, or at the trigger’s center).' },
    { name: 'shadow', type: "'xs' … 'xl'", default: "'md'", description: 'Its shadow.' },
    { name: 'open / defaultOpen', type: 'boolean | () => boolean / boolean', description: 'Whether it is open, controlled or not.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it opens and when it closes.' },
    { name: 'motion', type: "'quick' | 'base' | 'calm' | { effect, duration, exit, easing }", default: "'quick' (110 ms), a fade from the trigger’s side", description: 'A preset’s name, or the transition; `exit` is the closing’s ms (the duration by default).' },
    { name: 'dismiss', type: 'boolean | { escape? }', default: '{ escape: true }', description: 'Escape closes it (false: nothing does). No press outside closes it: it closes as the pointer leaves the trigger and the card.' },
    { name: 'refocus', type: 'boolean', default: 'true', description: 'Closing it with the focus inside the card gives the focus back to the trigger.' },
    { name: 'others', type: 'Popover props', description: '`radius`, `layer` (`LAYERS.float`, 30), `portal`, `disabled`, as Popover.' },
    { name: 'HoverCard.Trigger / HoverCard.Panel', type: 'Popover.Trigger / Popover.Panel', description: 'The trigger and the card (padded 8 × 12).' },
  ],
  demos: [
    {
      title: 'A preview of each file in a list',
      code: `
const FILES = [
  { name: 'budget-2026.xlsx', kind: 'Spreadsheet', size: '84 KB', first: 'Q1 rent, payroll and the new kiln' },
  { name: 'kiln-manual.pdf', kind: 'PDF, 38 pages', size: '2.1 MB', first: 'Firing schedules for cone 6 and cone 10' },
  { name: 'open-studio.md', kind: 'Notes', size: '3 KB', first: 'Doors at ten; glaze demo at noon' },
];

function Demo() {
  return (
    <Stack gap={6} align="start">
      {FILES.map(file => (
        <HoverCard width={260} at="right-start" openDelay={500} closeDelay={150} shadow="sm">
          <HoverCard.Trigger>
            <Link size="sm">{file.name}</Link>
          </HoverCard.Trigger>
          <HoverCard.Panel>
            <Stack gap={4}>
              <Text size="xs" fg="quiet">{\`\${file.kind} · \${file.size}\`}</Text>
              <Text size="sm">{file.first}</Text>
            </Stack>
          </HoverCard.Panel>
        </HoverCard>
      ))}
    </Stack>
  );
}`,
      view: () => (
        <Stack gap={6} align="start">
          {FILES.map(file => (
            <HoverCard width={260} at="right-start" openDelay={500} closeDelay={150} shadow="sm">
              <HoverCard.Trigger>
                <Link size="sm">{file.name}</Link>
              </HoverCard.Trigger>
              <HoverCard.Panel>
                <Stack gap={4}>
                  <Text size="xs" fg="quiet">
                    {`${file.kind} · ${file.size}`}
                  </Text>
                  <Text size="sm">{file.first}</Text>
                </Stack>
              </HoverCard.Panel>
            </HoverCard>
          ))}
        </Stack>
      ),
      height: 130,
    },
    {
      title: 'A word’s meaning, above it in a sentence',
      code: `
function Demo() {
  return (
    <Row gap={4} align="center" pt={110}>
      <Text size="sm">Keep the seedlings outdoors by day until</Text>
      <HoverCard at="top" arrow width={240}>
        <HoverCard.Trigger>
          <Link size="sm">hardening off</Link>
        </HoverCard.Trigger>
        <HoverCard.Panel>
          <Stack gap={2}>
            <Text size="sm">hardening off</Text>
            <Text size="xs" fg="quiet">A week or two of short, longer and then whole days outside, so young plants get used to sun and wind.</Text>
          </Stack>
        </HoverCard.Panel>
      </HoverCard>
      <Text size="sm">is done.</Text>
    </Row>
  );
}`,
      view: () => (
        <Row gap={4} align="center" pt={110}>
          <Text size="sm">Keep the seedlings outdoors by day until</Text>
          <HoverCard at="top" arrow width={240}>
            <HoverCard.Trigger>
              <Link size="sm">hardening off</Link>
            </HoverCard.Trigger>
            <HoverCard.Panel>
              <Stack gap={2}>
                <Text size="sm">hardening off</Text>
                <Text size="xs" fg="quiet">
                  A week or two of short, longer and then whole days outside, so young plants get used to sun and wind.
                </Text>
              </Stack>
            </HoverCard.Panel>
          </HoverCard>
          <Text size="sm">is done.</Text>
        </Row>
      ),
      height: 170,
    },
  ],
};
