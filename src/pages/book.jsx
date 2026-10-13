// Book (rui-core/more): pages that turn on a press, or from buttons.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Heading, Row, Stack, Text } from 'rui-core';
import { Book } from 'rui-core/more';

/** The pages' titles. */
const CHAPTERS = ['Cover', 'Signals', 'Memos', 'Effects', 'Roots', 'The end'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'book',
  group: 'data',
  title: 'Book',
  description: 'Pages that turn (rui-core/more), on the Clock: a press on the right page turns forward, on the left page back. The pages turn by pointer only: they are no buttons and hear no keys, so a book read from the keyboard turns through `value` and `onChange` (for example, Buttons beside it that set the page). The portable transforms are flat (no rotateY or perspective), so a turn is approximated: the leaf narrows about the spine to nothing at the half turn, then widens on the other side with its back, shaded toward the middle of the turn; no curl, no corner dragged.',
  props: [
    { name: 'value / defaultValue / onChange', type: 'number', default: '0', description: 'The first page shown (a spread’s left page, even): controlled, or uncontrolled. A page set from outside turns to it.' },
    { name: 'w / h', type: 'number', default: '240 / 320', description: 'One page’s size.' },
    { name: 'single', type: 'boolean', default: 'false', description: 'One page at a time, not spreads (its right half turns forward, its left half back).' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: '600 (two calm moves)', description: 'A turn’s time: ms or a motion preset.' },
    { name: 'onFlip', type: '(page: number) => void', description: 'Called once a turn ends.' },
    { name: 'shadow / radius', type: "'xs' … 'xl'", default: "'md' / theme.corner", description: 'Its shadow and corners.' },
    { name: 'Book.Page', type: '{ children }', description: 'A page.' },
  ],
  demos: [
    {
      title: 'Spreads, turned by a press or the buttons',
      code: `
const CHAPTERS = ['Cover', 'Signals', 'Memos', 'Effects', 'Roots', 'The end'];

function Demo() {
  const page = $signal($active(), 0);
  return (
    <Stack gap="sm" align="start">
      <Book w={150} h={190} value={() => $read(page)} onChange={p => $write(page, p)}>
        {CHAPTERS.map((title, i) => (
          <Book.Page>
            <Stack gap={4} p="md">
              <Heading level={4}>{title}</Heading>
              <Text size="xs" fg="quiet">{\`page \${i + 1}\`}</Text>
            </Stack>
          </Book.Page>
        ))}
      </Book>
      <Row gap="xs">
        <Button size="xs" variant="neutral" onPress={() => $write(page, Math.max(0, $read(page) - 2))}>Back</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(page, Math.min(4, $read(page) + 2))}>Forward</Button>
        <Text size="sm" fg="quiet">{() => \`pages \${$read(page) + 1} and \${$read(page) + 2}\`}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const page = $signal($active(), 0);
        return (
          <Stack gap="sm" align="start">
            <Book w={150} h={190} value={() => $read(page)} onChange={(/** @type {number} */ p) => $write(page, p)}>
              {CHAPTERS.map((title, i) => (
                <Book.Page>
                  <Stack gap={4} p="md">
                    <Heading level={4}>{title}</Heading>
                    <Text size="xs" fg="quiet">{`page ${i + 1}`}</Text>
                  </Stack>
                </Book.Page>
              ))}
            </Book>
            <Row gap="xs">
              <Button size="xs" variant="neutral" onPress={() => $write(page, Math.max(0, $read(page) - 2))}>
                Back
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(page, Math.min(4, $read(page) + 2))}>
                Forward
              </Button>
              <Text size="sm" fg="quiet">
                {() => `pages ${$read(page) + 1} and ${$read(page) + 2}`}
              </Text>
            </Row>
          </Stack>
        );
      },
      height: 290,
    },
    {
      title: 'One page at a time',
      code: `
const CHAPTERS = ['Cover', 'Signals', 'Memos', 'Effects', 'Roots', 'The end'];

function Demo() {
  return (
    <Book single w={200} h={130} duration={500}>
      {CHAPTERS.map(title => (
        <Book.Page>
          <Stack gap={4} p="md">
            <Heading level={4}>{title}</Heading>
            <Text size="xs" fg="quiet">Press the right half to turn forward, the left half back.</Text>
          </Stack>
        </Book.Page>
      ))}
    </Book>
  );
}`,
      view: () => (
        <Book single w={200} h={130} duration={500}>
          {CHAPTERS.map(title => (
            <Book.Page>
              <Stack gap={4} p="md">
                <Heading level={4}>{title}</Heading>
                <Text size="xs" fg="quiet">
                  Press the right half to turn forward, the left half back.
                </Text>
              </Stack>
            </Book.Page>
          ))}
        </Book>
      ),
      height: 170,
    },
  ],
};
