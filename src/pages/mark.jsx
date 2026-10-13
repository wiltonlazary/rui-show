// Mark: marked text, alone or inside a paragraph.

import { Mark, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'mark',
  group: 'text',
  title: 'Mark',
  description: 'Text on a highlighter-colored background (amber by default), the scheme’s shade of any theme color. Alone it is one run whose background covers its text’s height; nested in Text it is a run of the Text’s Label, wrapping with the words around it on every renderer.',
  props: [
    { name: 'children', type: 'string | (() => string)', description: 'The marked text.' },
    { name: 'color', type: 'string', default: "'amber'", description: 'A theme color: its shade 1 on light, shade 6 at 30 % on dark.' },
  ],
  demos: [
    {
      title: 'Marks inside a paragraph',
      code: `
function Demo() {
  return (
    <Stack gap="sm" w={420}>
      <Text>
        Water the <Mark>seedlings</Mark> before noon, then tag the rows: <Mark color="cyan">cyan</Mark> for
        herbs, <Mark color="magenta">magenta</Mark> for flowers and <Mark color="lime">lime</Mark> for greens.
      </Text>
      <Row>
        <Mark color="violet">A mark on its own</Mark>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm" w={420}>
          <Text>
            Water the <Mark>seedlings</Mark> before noon, then tag the rows: <Mark color="cyan">cyan</Mark> for herbs, <Mark color="magenta">magenta</Mark> for flowers and{' '}
            <Mark color="lime">lime</Mark> for greens.
          </Text>
          <Row>
        <Mark color="violet">A mark on its own</Mark>
      </Row>
        </Stack>
      ),
      height: 110,
    },
  ],
};
