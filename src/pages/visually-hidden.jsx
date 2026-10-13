// VisuallyHidden: content out of sight, still in the view.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { VisuallyHidden, Rating, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'visually-hidden',
  group: 'behavior',
  title: 'VisuallyHidden',
  description: 'Content kept in the view and in the accessibility mirror but drawn nowhere: a one-pixel clipped box, taken out of the flow. The same on every renderer.',
  props: [
    { name: 'children', type: 'any', description: 'The content screen readers hear.' },
    { name: 'label', type: 'string', description: 'An accessible name on the box itself.' },
  ],
  demos: [
    {
      title: 'A star rating with its words hidden',
      code: `
function Demo() {
  const stars = $signal($active(), 4);
  return (
    <Stack gap="xs">
      <Row gap="sm">
        <Text size="sm">Lentil soup</Text>
        <Rating value={stars} onChange={v => $write(stars, v)} size="sm" />
        <VisuallyHidden>
          <Text>{() => \`Rated \${$read(stars)} of 5\`}</Text>
        </VisuallyHidden>
      </Row>
      <Text size="sm" fg="quiet">Only the stars show; a screen reader also hears “Rated 4 of 5”.</Text>
    </Stack>
  );
}`,
      view: () => {
        const stars = $signal($active(), 4);
        return (
          <Stack gap="xs">
            <Row gap="sm">
              <Text size="sm">Lentil soup</Text>
              <Rating value={stars} onChange={(/** @type {number} */ v) => $write(stars, v)} size="sm" />
              <VisuallyHidden>
                <Text>{() => `Rated ${$read(stars)} of 5`}</Text>
              </VisuallyHidden>
            </Row>
            <Text size="sm" fg="quiet">
              Only the stars show; a screen reader also hears “Rated 4 of 5”.
            </Text>
          </Stack>
        );
      },
      height: 90,
      clipped: true,
    },
  ],
};
