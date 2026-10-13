// Breadcrumbs: the default separator, text and element separators, gaps.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Link, Breadcrumbs, ChevronIcon, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'breadcrumbs',
  group: 'wayfinding',
  title: 'Breadcrumbs',
  description: 'Items in a row with a separator between them, wrapping when the row is full; the items are usually Links and the last one plain Text.',
  props: [
    { name: 'children', type: 'any', description: 'The items; a separator goes between each two.' },
    { name: 'separator', type: 'string | any', default: "'›'", description: 'Text (drawn in the quiet color) or an element between the items.' },
    { name: 'separatorGap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: 'The space on each side of a separator.' },
  ],
  demos: [
    {
      title: 'A trail to this page',
      code: `
function Demo() {
  return (
    <Breadcrumbs>
      <Link>rui-core</Link>
      <Link>Wayfinding</Link>
      <Text>Breadcrumbs</Text>
    </Breadcrumbs>
  );
}`,
      view: () => (
        <Breadcrumbs>
          <Link>rui-core</Link>
          <Link>Wayfinding</Link>
          <Text>Breadcrumbs</Text>
        </Breadcrumbs>
      ),
      height: 50,
    },
    {
      title: 'Separators',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Breadcrumbs separator="·" separatorGap="xs">
        <Link>Library</Link>
        <Link>Poetry</Link>
        <Text>Sonnets</Text>
      </Breadcrumbs>
      <Breadcrumbs separator={<ChevronIcon size={14} rotate={-90} color="quiet" />}>
        <Link>Library</Link>
        <Link>Essays</Link>
        <Text>On walking</Text>
      </Breadcrumbs>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Breadcrumbs separator="·" separatorGap="xs">
            <Link>Library</Link>
            <Link>Poetry</Link>
            <Text>Sonnets</Text>
          </Breadcrumbs>
          <Breadcrumbs separator={<ChevronIcon size={14} rotate={-90} color="quiet" />}>
            <Link>Library</Link>
            <Link>Essays</Link>
            <Text>On walking</Text>
          </Breadcrumbs>
        </Stack>
      ),
      height: 80,
    },
    {
      title: 'Going back up',
      code: `
const PATH = ['Home', 'Projects', 'rui', 'Docs'];

function Demo() {
  const depth = $signal($active(), PATH.length);
  return (
    <Stack gap="sm">
      {() => (
        <Breadcrumbs>
          {PATH.slice(0, $read(depth)).map((name, i) =>
            i === $read(depth) - 1 ? <Text>{name}</Text> : <Link onPress={() => $write(depth, i + 1)}>{name}</Link>,
          )}
        </Breadcrumbs>
      )}
      <Text size="sm" fg="quiet">{() => $read(depth) + ' levels deep'}</Text>
    </Stack>
  );
}`,
      view: () => {
        const PATH = ['Home', 'Projects', 'rui', 'Docs'];
        const depth = $signal($active(), PATH.length);
        return (
          <Stack gap="sm">
            {() => (
              <Breadcrumbs>
                {PATH.slice(0, $read(depth)).map((name, i) =>
                  i === $read(depth) - 1 ? <Text>{name}</Text> : <Link onPress={() => $write(depth, i + 1)}>{name}</Link>,
                )}
              </Breadcrumbs>
            )}
            <Text size="sm" fg="quiet">
              {() => $read(depth) + ' levels deep'}
            </Text>
          </Stack>
        );
      },
      height: 80,
    },
  ],
};
