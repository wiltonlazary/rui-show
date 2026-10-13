// EmptyState: a placeholder with a mark, a heading, a note and buttons.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { EmptyState, Button, Row, Text, CheckIcon, CloseIcon, DotsIcon } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'empty-state',
  group: 'status',
  title: 'EmptyState',
  description: 'A placeholder for no data or a first run: a mark, a heading, a note and buttons, from props or from the parts EmptyState.Mark, .Heading, .Note and .Buttons. It lines up on the start side unless told otherwise. A drawn mark (a Shape) does not take the plate’s color: pass it its own `color`.',
  props: [
    { name: 'mark', type: 'any', description: 'The icon or illustration (an EmptyState.Mark made for you).' },
    { name: 'heading', type: 'string | (() => string) | any', description: 'The heading (an EmptyState.Heading), at a heading level’s size by size: the sixth’s for xs up to the second’s for xl (text, not a heading).' },
    { name: 'note', type: 'string | (() => string) | any', description: 'The quiet note, at most 420 px wide (an EmptyState.Note).' },
    { name: 'children', type: 'any', description: 'After the rest: the buttons, or the parts in your own order.' },
    { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'The side the parts and their text line up on.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'The mark’s side (28 to 68 px), the heading’s size, the note’s font size and the gap (half that spacing step).' },
    { name: 'variant', type: "'solid' | 'soft'", description: 'A colored, round mark plate; none by default.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The plate’s color with a variant.' },
    { name: 'tinted', type: 'boolean', default: 'false', description: 'A plate in the page’s sunken color behind the mark when no variant is set.' },
    { name: 'EmptyState.Mark', type: 'component', description: 'The icon or illustration, in a circle sized by the EmptyState; decoration.' },
    { name: 'EmptyState.Heading / .Note', type: 'component', description: 'Text parts sized and aligned by the EmptyState; they take style props.' },
    { name: 'EmptyState.Buttons', type: 'component', description: 'A wrapping row of buttons on the EmptyState’s side, a spacing xs further down.' },
  ],
  demos: [
    {
      title: 'A search with no matches',
      code: `
function Demo() {
  const resets = $signal($active(), 0);
  return (
    <EmptyState
      align="center"
      mark={<DotsIcon size={24} color="quiet" />}
      tinted
      heading="No matches"
      note={() => \`No matches for your search (reset \${$read(resets)} times).\`}
    >
      <EmptyState.Buttons>
        <Button variant="neutral" onPress={() => $write(resets, $read(resets) + 1)}>Clear filters</Button>
        <Button>New item</Button>
      </EmptyState.Buttons>
    </EmptyState>
  );
}`,
      view: () => {
        const resets = $signal($active(), 0);
        return (
          <EmptyState
            align="center"
            mark={<DotsIcon size={24} color="quiet" />}
            tinted
            heading="No matches"
            note={() => `No matches for your search (reset ${$read(resets)} times).`}
          >
            <EmptyState.Buttons>
              <Button variant="neutral" onPress={() => $write(resets, $read(resets) + 1)}>
                Clear filters
              </Button>
              <Button>New item</Button>
            </EmptyState.Buttons>
          </EmptyState>
        );
      },
      height: 200,
    },
    {
      title: 'Variants and sizes, centered',
      code: `
function Demo() {
  return (
    <Row justify="around" align="start">
      <EmptyState align="center" size="xs" variant="soft" mark={<CheckIcon size={16} color="indigo" />} heading="All done" note="Size xs, soft" />
      <EmptyState align="center" size="md" variant="solid" color="teal" mark={<CheckIcon size={24} color="white" />} heading="Synced" note="Size md, solid" />
      <EmptyState align="center" size="xl" variant="soft" color="red" mark={<CloseIcon size={32} color="red" />} heading="Offline" note="Size xl, soft red" />
    </Row>
  );
}`,
      view: () => (
        <Row justify="around" align="start">
          <EmptyState align="center" size="xs" variant="soft" mark={<CheckIcon size={16} color="indigo" />} heading="All done" note="Size xs, soft" />
          <EmptyState align="center" size="md" variant="solid" color="teal" mark={<CheckIcon size={24} color="white" />} heading="Synced" note="Size md, solid" />
          <EmptyState align="center" size="xl" variant="soft" color="red" mark={<CloseIcon size={32} color="red" />} heading="Offline" note="Size xl, soft red" />
        </Row>
      ),
      height: 190,
    },
    {
      title: 'Parts in your own order, on the start side',
      code: `
function Demo() {
  return (
    <EmptyState size="sm">
      <EmptyState.Heading>Your inbox is empty</EmptyState.Heading>
      <EmptyState.Note>New messages show here. The parts come in the order you write them.</EmptyState.Note>
      <Text size="xs" fg="quiet">Last checked a minute ago</Text>
    </EmptyState>
  );
}`,
      view: () => (
        <EmptyState size="sm">
          <EmptyState.Heading>Your inbox is empty</EmptyState.Heading>
          <EmptyState.Note>New messages show here. The parts come in the order you write them.</EmptyState.Note>
          <Text size="xs" fg="quiet">
            Last checked a minute ago
          </Text>
        </EmptyState>
      ),
      height: 120,
    },
  ],
};
