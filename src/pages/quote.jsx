// Quote: a quotation on a wash of its color, its source, and content of its own.

import { Quote, Stack, Text, Link } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'quote',
  group: 'text',
  title: 'Quote',
  description: 'A quotation (role `blockquote`) on a faint wash of its color, set off by an opening quotation mark at its start, with an optional source under it, the same on every renderer. A drawn icon (a Shape) takes its own `color`.',
  props: [
    { name: 'children', type: 'string | (() => string) | any', description: 'The quotation: text becomes a wrapping Label at the md size, weight 400; other content shows as it is.' },
    { name: 'source', type: 'string | (() => string) | any', description: 'Who or where it is from, under the quotation: text in the quiet color at the sm size, or content of yours.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The wash and the mark’s color: a theme color name, `name.shade`, or hex.' },
    { name: 'icon', type: 'boolean | any | { size }', default: 'true', description: 'The mark at its start: `true`, the quotation mark; `false`, none; a node of your own; or `{ size }`, the mark’s size in pixels (the first heading’s, 36, by default).' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius: a scale step or pixels.' },
  ],
  demos: [
    {
      title: 'A pull quote that links to its source',
      code: `
function Demo() {
  return (
    <Quote color="indigo">
      <Stack gap="md">
        <Text size="lg" fontWeight={500}>Good tools disappear: you notice the work, not the tool.</Text>
        <Link size="sm">From “Quiet interfaces”, the full article</Link>
      </Stack>
    </Quote>
  );
}`,
      view: () => (
        <Quote color="indigo">
          <Stack gap="md">
            <Text size="lg" fontWeight={500}>
              Good tools disappear: you notice the work, not the tool.
            </Text>
            <Link size="sm">From “Quiet interfaces”, the full article</Link>
          </Stack>
        </Quote>
      ),
      height: 140,
    },
    {
      title: 'Colors and radius',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Quote color="teal" radius="lg">Water early, before the soil warms.</Quote>
      <Quote color="purple" radius={0} source="The orchard log">Prune after flowering, never before.</Quote>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Quote color="teal" radius="lg">
            Water early, before the soil warms.
          </Quote>
          <Quote color="purple" radius={0} source="The orchard log">
            Prune after flowering, never before.
          </Quote>
        </Stack>
      ),
      height: 250,
    },
  ],
};
