// Highlight: text with marked substrings.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Highlight, Button, Row, Stack, Text } from 'rui-core';

const TERMS = ['dough', 'rest', 'loaf'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'highlight',
  group: 'text',
  title: 'Highlight',
  description: 'Text with every `match` of the given substrings marked, in any case, longest first: one Label of runs that wraps across them, so a word may span a mark.',
  props: [
    { name: 'children', type: 'string | (() => string)', description: 'The text.' },
    { name: 'match', type: 'string | string[] | (() => string | string[])', default: '[]', description: 'The substrings to mark, matched in any case.' },
    { name: 'color', type: 'string', default: "'amber'", description: 'The mark’s color (Mark’s shade for the scheme).' },
    { name: 'markStyle', type: 'Record<string, any>', description: 'Portable style added to each marked run.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Font size and line height from the theme, as Text’s.' },
  ],
  demos: [
    {
      title: 'Several terms marked at once',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Highlight match={['flour', 'butter', 'salt']} color="amber">Rub the butter into the flour, add a pinch of salt, then more flour</Highlight>
      <Highlight match={['Ferry', 'pier']} color="teal" size="lg">The ferry leaves pier 3; the last FERRY back is at nine</Highlight>
      <Highlight match="rui" color="indigo" markStyle={{ fontWeight: 'bold' }} size="sm">rui draws rui-core on every renderer</Highlight>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Highlight match={['flour', 'butter', 'salt']} color="amber">
            Rub the butter into the flour, add a pinch of salt, then more flour
          </Highlight>
          <Highlight match={['Ferry', 'pier']} color="teal" size="lg">
            The ferry leaves pier 3; the last FERRY back is at nine
          </Highlight>
          <Highlight match="rui" color="indigo" markStyle={{ fontWeight: 'bold' }} size="sm">
            rui draws rui-core on every renderer
          </Highlight>
        </Stack>
      ),
      height: 110,
    },
    {
      title: 'A term that changes',
      code: `
const TERMS = ['dough', 'rest', 'loaf'];

function Demo() {
  const term = $signal($active(), 'dough');
  return (
    <Stack gap="sm">
      <Row gap="xs">
        {TERMS.map(t => <Button size="xs" variant="neutral" onPress={() => $write(term, t)}>{t}</Button>)}
        <Text size="sm" fg="quiet">{() => \`marking “\${$read(term)}”\`}</Text>
      </Row>
      <Highlight match={() => $read(term)}>Knead the dough, let the dough rest, then shape the loaf and rest it again</Highlight>
    </Stack>
  );
}`,
      view: () => {
        const term = $signal($active(), 'dough');
        return (
          <Stack gap="sm">
            <Row gap="xs">
              {TERMS.map(t => (
                <Button size="xs" variant="neutral" onPress={() => $write(term, t)}>
                  {t}
                </Button>
              ))}
              <Text size="sm" fg="quiet">
                {() => `marking “${$read(term)}”`}
              </Text>
            </Row>
            <Highlight match={() => $read(term)}>Knead the dough, let the dough rest, then shape the loaf and rest it again</Highlight>
          </Stack>
        );
      },
      height: 80,
    },
  ],
};
