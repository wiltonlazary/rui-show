// Tree: a recipe book with selection, a $treeState handle driven from
// buttons, custom rows.

import { $treeState, Badge, Button, Row, Stack, Text, Tree } from 'rui-core';

const RECIPES = [
  {
    value: 'breads',
    label: 'Breads',
    children: [
      { value: 'sourdough-loaf', label: 'Sourdough loaf' },
      { value: 'rye-crackers', label: 'Rye crackers' },
    ],
  },
  {
    value: 'soups',
    label: 'Soups',
    children: [
      { value: 'tomato-soup', label: 'Tomato soup' },
      { value: 'cold-soups', label: 'Cold soups', children: [{ value: 'gazpacho', label: 'Gazpacho' }, { value: 'cucumber-soup', label: 'Cucumber soup' }] },
    ],
  },
  { value: 'desserts', label: 'Desserts', children: [{ value: 'lemon-tart', label: 'Lemon tart' }] },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'tree',
  group: 'wayfinding',
  title: 'Tree',
  description: 'Nested items that expand and collapse, with selection, on a `$treeState()` handle (an rrx-core operation). While an item has focus, the up and down keys move between the visible items, right expands (or goes to the first child), left collapses (or goes to the parent), Home and End go to the ends.',
  props: [
    { name: 'data', type: '{ value: string, label: any, children?: TreeItem[] }[]', description: 'The items (a value, an accessor or a signal); `value` is unique in the tree.' },
    { name: 'store', type: 'TreeStateHandle', default: 'its own $treeState()', description: 'The handle holding which items are expanded and selected.' },
    { name: 'indent', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The indent a level.' },
    { name: 'press', type: "'expand' | 'select' | 'both'", default: "'expand'", description: 'What a press on an item does: opens or closes it (an item with children), selects it, or both.' },
    { name: 'chevrons', type: 'boolean', default: 'true', description: 'A turning chevron before items with children.' },
    { name: 'renderItem', type: '({ item, depth, open, chosen, branch, handle }) => any', description: 'The row’s content (`open` and `chosen` are accessors; `branch` is true for an item with children).' },
    { name: 'onExpandedChange', type: '(value: string, expanded: boolean) => void', description: 'Hears each item expand or collapse (with the Tree’s own handle).' },
    { name: '$treeState multiple', type: 'boolean', default: 'false', description: 'Several items stay selected.' },
    { name: '$treeState defaultExpanded', type: 'string[]', default: '[]', description: 'The values of the items expanded at first.' },
    { name: '$treeState defaultSelected', type: 'string[]', default: '[]', description: 'The items selected at first.' },
    { name: '$treeState onExpandedChange', type: '(value: string, expanded: boolean) => void', description: 'Called when an item opens or closes.' },
    { name: 'TreeStateHandle', type: '{ expand, collapse, toggle, select, deselect, toggleSelect, deselectAll, expandAll, collapseAll, isExpanded, isSelected, expanded, selected }', description: 'What the handle does; `expanded()` and `selected()` are the values of the open and selected items, read reactively.' },
    { name: 'aria-label', type: 'string', description: 'The tree’s accessible name: what it holds.' },
  ],
  demos: [
    {
      title: 'A recipe book with selection',
      code: `
const RECIPES = [
  {
    value: 'breads',
    label: 'Breads',
    children: [
      { value: 'sourdough-loaf', label: 'Sourdough loaf' },
      { value: 'rye-crackers', label: 'Rye crackers' },
    ],
  },
  {
    value: 'soups',
    label: 'Soups',
    children: [
      { value: 'tomato-soup', label: 'Tomato soup' },
      { value: 'cold-soups', label: 'Cold soups', children: [{ value: 'gazpacho', label: 'Gazpacho' }, { value: 'cucumber-soup', label: 'Cucumber soup' }] },
    ],
  },
  { value: 'desserts', label: 'Desserts', children: [{ value: 'lemon-tart', label: 'Lemon tart' }] },
];

function Demo() {
  const tree = $treeState({ defaultExpanded: ['soups'] });
  return (
    <Row gap="xl" align="start">
      <Tree aria-label="Recipes" data={RECIPES} store={tree} press="both" w={240} />
      <Text size="sm" fg="quiet">{() => 'selected: ' + (tree.selected().join(', ') || 'none')}</Text>
    </Row>
  );
}`,
      view: () => {
        const tree = $treeState({ defaultExpanded: ['soups'] });
        return (
          <Row gap="xl" align="start">
            <Tree aria-label="Recipes" data={RECIPES} store={tree} press="both" w={240} />
            <Text size="sm" fg="quiet">
              {() => 'selected: ' + (tree.selected().join(', ') || 'none')}
            </Text>
          </Row>
        );
      },
      height: 260,
    },
    {
      title: 'Driving the handle',
      code: `
// RECIPES as in the first demo

function Demo() {
  const tree = $treeState({ multiple: true });
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button size="sm" dense variant="neutral" onPress={() => tree.expandAll()}>Open all</Button>
        <Button size="sm" dense variant="neutral" onPress={() => tree.collapseAll()}>Close all</Button>
        <Button size="sm" dense variant="soft" onPress={() => tree.toggleSelect('gazpacho')}>Toggle Gazpacho</Button>
        <Button size="sm" dense variant="soft" color="red" onPress={() => tree.deselectAll()}>Clear</Button>
      </Row>
      <Tree aria-label="Recipes" data={RECIPES} store={tree} w={260} />
      <Text size="sm" fg="quiet">{() => tree.expanded().length + ' open, ' + tree.selected().length + ' selected'}</Text>
    </Stack>
  );
}`,
      view: () => {
        const tree = $treeState({ multiple: true });
        return (
          <Stack gap="sm">
            <Row gap="xs">
              <Button size="sm" dense variant="neutral" onPress={() => tree.expandAll()}>
                Open all
              </Button>
              <Button size="sm" dense variant="neutral" onPress={() => tree.collapseAll()}>
                Close all
              </Button>
              <Button size="sm" dense variant="soft" onPress={() => tree.toggleSelect('gazpacho')}>
                Toggle Gazpacho
              </Button>
              <Button size="sm" dense variant="soft" color="red" onPress={() => tree.deselectAll()}>
                Clear
              </Button>
            </Row>
            <Tree aria-label="Recipes" data={RECIPES} store={tree} w={260} />
            <Text size="sm" fg="quiet">
              {() => tree.expanded().length + ' open, ' + tree.selected().length + ' selected'}
            </Text>
          </Stack>
        );
      },
      height: 360,
    },
    {
      title: 'Custom rows',
      code: `
// RECIPES as in the first demo

function Demo() {
  return (
    <Tree
      aria-label="Recipes"
      data={RECIPES}
      w={300}
      chevrons={false}
      indent="lg"
      renderItem={({ item, open, branch }) => (
        <Row gap="xs" align="center">
          <Text size="sm">{() => (branch ? (open() ? '[-] ' : '[+] ') : '') + item.label}</Text>
          {branch ? <Badge size="xs" variant="soft">{String(item.children.length)}</Badge> : null}
        </Row>
      )}
    />
  );
}`,
      view: () => (
        <Tree
          aria-label="Recipes"
          data={RECIPES}
          w={300}
          chevrons={false}
          indent="lg"
          renderItem={(/** @type {any} */ { item, open, branch }) => (
            <Row gap="xs" align="center">
              <Text size="sm">{() => (branch ? (open() ? '[-] ' : '[+] ') : '') + item.label}</Text>
              {branch ? (
                <Badge size="xs" variant="soft">
                  {String(item.children.length)}
                </Badge>
              ) : null}
            </Row>
          )}
        />
      ),
      height: 290,
    },
  ],
};
