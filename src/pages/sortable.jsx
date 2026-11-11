// Sortable (rui-core/more): a list sorted by dragging an item's handle, or by the keys on it.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Badge, Card, Row, Stack, Text } from 'rui-core';
import { Sortable } from 'rui-core/more';

/** The demos' rows: a ledger's name and its currency. */
const LEDGERS = [
  { id: 'home', name: 'Home', currency: 'BRL' },
  { id: 'trip', name: 'Trip to Lisbon', currency: 'EUR' },
  { id: 'band', name: 'Band', currency: 'BRL' },
  { id: 'office', name: 'Office lunch', currency: 'USD' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'sortable',
  group: 'data',
  title: 'Sortable',
  description:
    'A list sorted by hand (rui-core/more): an item taken by its handle follows the pointer while the others make room, and drops at its place; on a focused handle Space or Enter lifts it, the arrows move it, Space or Enter drops it and Escape gives up. One change is told, at the drop.',
  props: [
    { name: 'value / defaultValue / onChange', type: 'T[]', description: 'The items, in order. `onChange(items)` hears the list in its new order, at a drop that moved an item.' },
    { name: 'onCommit', type: '(items: T[], from: number, to: number) => void', description: 'The same drop: the list in its new order, and the item’s place before and after. Nothing is told while an item is held, by a drop on its own place, or by a move given up.' },
    { name: 'by', type: '(item: T) => unknown', description: 'What tells an item from the others (the item itself by default).' },
    { name: 'children', type: '(item: () => T, index: () => number) => node', description: 'Draws each item: a `Sortable.Item` holding a `Sortable.Handle`.' },
    { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Down a column or along a row (the arrows follow it).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'No item is taken. On a `Sortable.Item`: that item is not taken, and the others still pass it.' },
    { name: 'gap', type: 'Spacing', default: "'xs'", description: 'The room between the items; the layout props too.' },
    { name: 'Sortable.Handle', type: 'label / size / children', default: "'Reorder' / 'md' / a grip", description: 'What takes its item: only a handle starts a move, so a touch elsewhere on the list still pans the page.' },
  ],
  demos: [
    {
      title: 'Dragged, or moved by the keys',
      code: `
// LEDGERS: the ledgers to sort, { id, name, currency }[]
function Demo() {
  const ledgers = $signal($active(), LEDGERS);
  const told = $signal($active(), 'Nothing moved yet');
  return (
    <Stack gap="sm" w={360}>
      <Sortable
        value={ledgers}
        by={l => l.id}
        onChange={next => $write(ledgers, next)}
        onCommit={(next, from, to) => $write(told, \`\${next[to].name}: from place \${from + 1} to \${to + 1}\`)}
      >
        {ledger => (
          <Sortable.Item>
            <Card padding="xs">
              <Row gap="sm" align="center">
                <Sortable.Handle label={() => \`Reorder \${ledger().name}\`} />
                <Text flex={1}>{() => ledger().name}</Text>
                <Badge variant="soft">{() => ledger().currency}</Badge>
              </Row>
            </Card>
          </Sortable.Item>
        )}
      </Sortable>
      <Text size="sm" fg="quiet">{told}</Text>
    </Stack>
  );
}`,
      view: () => {
        const ledgers = $signal($active(), LEDGERS);
        const told = $signal($active(), 'Nothing moved yet');
        return (
          <Stack gap="sm" w={360}>
            <Sortable
              value={ledgers}
              by={(/** @type {typeof LEDGERS[number]} */ l) => l.id}
              onChange={(/** @type {typeof LEDGERS} */ next) => $write(ledgers, next)}
              onCommit={(/** @type {typeof LEDGERS} */ next, /** @type {number} */ from, /** @type {number} */ to) => $write(told, `${next[to].name}: from place ${from + 1} to ${to + 1}`)}
            >
              {(/** @type {() => typeof LEDGERS[number]} */ ledger) => (
                <Sortable.Item>
                  <Card padding="xs">
                    <Row gap="sm" align="center">
                      <Sortable.Handle label={() => `Reorder ${ledger().name}`} />
                      <Text flex={1}>{() => ledger().name}</Text>
                      <Badge variant="soft">{() => ledger().currency}</Badge>
                    </Row>
                  </Card>
                </Sortable.Item>
              )}
            </Sortable>
            <Text size="sm" fg="quiet">
              {told}
            </Text>
          </Stack>
        );
      },
      height: 260,
      clipped: true,
    },
    {
      title: 'Items of different heights, one that stays',
      code: `
function Demo() {
  const notes = $signal($active(), ['Rent', 'Groceries and the market on Saturday, with what the neighbors asked for', 'Power', 'Pinned']);
  return (
    <Sortable w={320} value={notes} onChange={next => $write(notes, next)}>
      {note => (
        <Sortable.Item disabled={() => note() === 'Pinned'}>
          <Card padding="xs">
            <Row gap="sm" align="start" wrap={false}>
              <Sortable.Handle label={() => \`Reorder \${note()}\`} size="lg" />
              <Text flex={1}>{note}</Text>
            </Row>
          </Card>
        </Sortable.Item>
      )}
    </Sortable>
  );
}`,
      view: () => {
        const notes = $signal($active(), ['Rent', 'Groceries and the market on Saturday, with what the neighbors asked for', 'Power', 'Pinned']);
        return (
          <Sortable w={320} value={notes} onChange={(/** @type {string[]} */ next) => $write(notes, next)}>
            {(/** @type {() => string} */ note) => (
              <Sortable.Item disabled={() => note() === 'Pinned'}>
                <Card padding="xs">
                  <Row gap="sm" align="start" wrap={false}>
                    <Sortable.Handle label={() => `Reorder ${note()}`} size="lg" />
                    <Text flex={1}>{note}</Text>
                  </Row>
                </Card>
              </Sortable.Item>
            )}
          </Sortable>
        );
      },
      height: 280,
      clipped: true,
    },
    {
      title: 'Along a row',
      code: `
function Demo() {
  return (
    <Sortable orientation="horizontal" defaultValue={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}>
      {day => (
        <Sortable.Item>
          <Card padding="xs">
            <Row gap="xs" align="center">
              <Sortable.Handle label={() => \`Reorder \${day()}\`} size="sm" />
              <Text>{day}</Text>
            </Row>
          </Card>
        </Sortable.Item>
      )}
    </Sortable>
  );
}`,
      view: () => (
        <Sortable orientation="horizontal" defaultValue={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}>
          {(/** @type {() => string} */ day) => (
            <Sortable.Item>
              <Card padding="xs">
                <Row gap="xs" align="center">
                  <Sortable.Handle label={() => `Reorder ${day()}`} size="sm" />
                  <Text>{day}</Text>
                </Row>
              </Card>
            </Sortable.Item>
          )}
        </Sortable>
      ),
      height: 90,
      clipped: true,
    },
  ],
};
