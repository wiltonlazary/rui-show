// OverflowList: as many items as fit in a row, the rest in one item.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Avatar, Badge, Button, Link, Row, OverflowList, Stack, Text } from 'rui-core';

const PEOPLE = ['Mira Okafor', 'Tomas Lind', 'Priya Nair', 'Jonah Reyes', 'Elena Varga', 'Kenji Mori', 'Ruben Sol', 'Ines Duarte'];
const PATH = ['Home', 'Projects', 'Garden', 'Beds', 'North', 'Tomatoes', 'Notes'];
const TAGS = ['apple', 'banana', 'cherry', 'purple', 'lemon', 'lime', 'mango', 'melon', 'orange', 'papaya', 'peach', 'pear', 'plum', 'quince', 'kiwi'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'overflow-list',
  group: 'data',
  title: 'OverflowList',
  description: 'Items in a row, as many as fit (on `lines` lines, and at most `limit`), the rest gathered into one overflow item. It measures its items once laid out, again when its data changes and when it is resized.',
  props: [
    { name: 'data', type: 'any[]', description: 'The items.' },
    { name: 'renderItem', type: '(item, index: number) => any', description: 'Renders one item.' },
    { name: 'renderMore', type: '(hidden: any[]) => any', default: 'a quiet +N', description: 'Renders the item that stands for the folded ones, given them in data order; by default a quiet `+N` named `N more`.' },
    { name: 'lines', type: 'number', default: '1', description: 'Lines the items may take; more than one wraps the row.' },
    { name: 'limit', type: 'number', description: 'Items shown at most, even when more fit.' },
    { name: 'fold', type: "'end' | 'start' | 'middle'", default: "'end'", description: 'Which items fold: the last, the first, or those in the middle (the first and last stay). The overflow item sits where they were.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: 'Space between items.' },
    { name: 'w, maxWidth …', type: 'style props', description: 'The width the items must fit in, as on Box.' },
  ],
  demos: [
    {
      title: 'Recipients, at most three',
      code: `
const PEOPLE = ['Mira Okafor', 'Tomas Lind', 'Priya Nair', 'Jonah Reyes', 'Elena Varga', 'Kenji Mori', 'Ruben Sol', 'Ines Duarte'];

function Demo() {
  const others = $signal($active(), '');
  const person = name => (
    <Row gap={4} align="center">
      <Avatar name={name} color="auto" size="xs" />
      <Text size="sm">{name}</Text>
    </Row>
  );
  return (
    <Stack gap="md">
      <Row gap="xs" align="center">
        <Text size="sm" fg="quiet">To</Text>
        <OverflowList
          data={PEOPLE}
          limit={3}
          gap="sm"
          renderItem={person}
          renderMore={hidden => <Link size="sm" onPress={() => $write(others, hidden.join(', '))}>{\`and \${hidden.length} others\`}</Link>}
        />
      </Row>
      <Text size="sm" fg="quiet">{() => ($read(others) ? \`Also: \${$read(others)}\` : 'Press the link for the others')}</Text>
      <Row gap="xs" align="center">
        <Text size="sm" fg="quiet">Last replies</Text>
        <OverflowList
          data={PEOPLE}
          limit={2}
          fold="start"
          gap="sm"
          renderItem={person}
          renderMore={hidden => <Badge variant="soft" color="gray">{\`\${hidden.length} earlier\`}</Badge>}
        />
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const others = $signal($active(), '');
        const person = (/** @type {string} */ name) => (
          <Row gap={4} align="center">
            <Avatar name={name} color="auto" size="xs" />
            <Text size="sm">{name}</Text>
          </Row>
        );
        return (
          <Stack gap="md">
            <Row gap="xs" align="center">
              <Text size="sm" fg="quiet">
                To
              </Text>
              <OverflowList
                data={PEOPLE}
                limit={3}
                gap="sm"
                renderItem={person}
                renderMore={(/** @type {string[]} */ hidden) => (
                  <Link size="sm" onPress={() => $write(others, hidden.join(', '))}>
                    {`and ${hidden.length} others`}
                  </Link>
                )}
              />
            </Row>
            <Text size="sm" fg="quiet">
              {() => ($read(others) ? `Also: ${$read(others)}` : 'Press the link for the others')}
            </Text>
            <Row gap="xs" align="center">
              <Text size="sm" fg="quiet">
                Last replies
              </Text>
              <OverflowList
                data={PEOPLE}
                limit={2}
                fold="start"
                gap="sm"
                renderItem={person}
                renderMore={(/** @type {string[]} */ hidden) => (
                  <Badge variant="soft" color="gray">
                    {`${hidden.length} earlier`}
                  </Badge>
                )}
              />
            </Row>
          </Stack>
        );
      },
      height: 120,
    },
    {
      title: 'As many as fit',
      code: `
const TAGS = ['apple', 'banana', 'cherry', 'purple', 'lemon', 'lime', 'mango', 'melon', 'orange', 'papaya', 'peach', 'pear', 'plum', 'quince', 'kiwi'];

function Demo() {
  const count = $signal($active(), 4);
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button size="xs" onPress={() => $write(count, Math.min(TAGS.length, $read(count) + 3))}>Add tags</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(count, Math.max(1, $read(count) - 3))}>Remove tags</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => \`\${$read(count)} tags in 360 pixels\`}</Text>
      <OverflowList
        w={360}
        data={() => TAGS.slice(0, $read(count))}
        renderItem={tag => <Badge variant="soft" color="purple">{tag}</Badge>}
        renderMore={hidden => <Badge variant="solid" color="purple">{\`+\${hidden.length}\`}</Badge>}
      />
    </Stack>
  );
}`,
      view: () => {
        const count = $signal($active(), 4);
        return (
          <Stack gap="sm">
            <Row gap="xs">
              <Button size="xs" onPress={() => $write(count, Math.min(TAGS.length, $read(count) + 3))}>
                Add tags
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(count, Math.max(1, $read(count) - 3))}>
                Remove tags
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `${$read(count)} tags in 360 pixels`}
            </Text>
            <OverflowList
              w={360}
              data={() => TAGS.slice(0, $read(count))}
              renderItem={(/** @type {string} */ tag) => (
                <Badge variant="soft" color="purple">
                  {tag}
                </Badge>
              )}
              renderMore={(/** @type {string[]} */ hidden) => (
                <Badge variant="solid" color="purple">
                  {`+${hidden.length}`}
                </Badge>
              )}
            />
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'Two lines',
      code: `
function Demo() {
  return (
    <OverflowList
      w={420}
      lines={2}
      data={TAGS.slice(0, 12)}
      renderItem={tag => <Badge size="lg" variant="neutral">{tag}</Badge>}
      renderMore={hidden => <Badge size="lg">{\`+\${hidden.length}\`}</Badge>}
    />
  );
}`,
      view: () => (
        <OverflowList
          w={420}
          lines={2}
          data={TAGS.slice(0, 12)}
          renderItem={(/** @type {string} */ tag) => (
            <Badge size="lg" variant="neutral">
              {tag}
            </Badge>
          )}
          renderMore={(/** @type {string[]} */ hidden) => <Badge size="lg">{`+${hidden.length}`}</Badge>}
        />
      ),
      height: 115,
    },
    {
      title: 'Fold the middle, the default overflow item',
      code: `
const PATH = ['Home', 'Projects', 'Garden', 'Beds', 'North', 'Tomatoes', 'Notes'];

function Demo() {
  return (
    <OverflowList
      w={300}
      fold="middle"
      data={PATH}
      renderItem={part => <Text size="sm">{part}</Text>}
    />
  );
}`,
      view: () => (
        <OverflowList
          w={300}
          fold="middle"
          data={PATH}
          renderItem={(/** @type {string} */ part) => <Text size="sm">{part}</Text>}
        />
      ),
      height: 60,
    },
  ],
};
