// TreeSelect: one value from a tree, many values, and checkboxes where a
// parent checks its leaves.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { TreeSelect, Stack, Text } from 'rui-core';

const RECIPES = [
  {
    value: 'breakfast',
    label: 'Breakfast',
    children: [
      { value: 'oat-porridge', label: 'Oat porridge' },
      { value: 'shakshuka', label: 'Shakshuka' },
    ],
  },
  {
    value: 'baking',
    label: 'Baking',
    children: [
      { value: 'breads', label: 'Breads', children: [{ value: 'rye-loaf', label: 'Rye loaf' }, { value: 'focaccia', label: 'Focaccia' }] },
      { value: 'lemon-tart', label: 'Lemon tart' },
    ],
  },
  { value: 'soups', label: 'Soups', children: [{ value: 'pea-and-mint', label: 'Pea and mint' }] },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'tree-select',
  group: 'choices',
  title: 'TreeSelect',
  description: 'Values from a tree of options shown as an indented list whose parents open and close. `pick` takes one value or many; `checks` puts a checkbox on each row, where a parent checks every leaf under it. A parent’s chevron points to the end and turns +90° as it opens; it is drawn decoration that takes no focus, so a press leaves the focus on the field, and the arrow keys open and close rows. ArrowUp and ArrowDown move, ArrowRight opens (or goes to the first child), ArrowLeft closes (or goes to the parent), Enter chooses. `searchable` finds nodes by their labels (or `match`), keeping the ancestors of a match open. The list is a `tree` of `treeitem`s, the parents saying `aria-expanded`, and the field names the active row through `aria-activedescendant`.',
  props: [
    { name: 'data', type: '{ value, label, children?, disabled? }[]', description: 'The tree.' },
    { name: 'pick', type: "'one' | 'many'", default: "'one'", description: 'One value, or many (an array).' },
    { name: 'checks', type: 'boolean', default: 'false', description: 'A checkbox on each row, and many values: a parent checks every leaf under it, and the value is the leaves checked.' },
    { name: 'strict', type: 'boolean', default: 'false', description: 'With `checks`, no cascade: each node is checked alone, independent of its parent and children.' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'The field is an Edit: typing shows the nodes whose labels contain the text, their ancestors kept and opened.' },
    { name: 'match', type: '(node, search: string) => boolean', description: 'Which nodes a search finds, in place of the label test.' },
    { name: 'empty', type: 'any', description: 'Shown when a search finds nothing.' },
    { name: 'search / defaultSearch / onSearchChange', type: 'string / string / (value: string) => void', description: 'The search, controlled or not.' },
    { name: 'guides', type: 'boolean', default: 'false', description: 'Hairlines join each node to its parent.' },
    { name: 'value', type: 'string | string[] | null', description: 'Controlled: a value, or an array with many (with `onChange`).' },
    { name: 'defaultValue', type: 'string | string[] | null', description: 'Uncontrolled: the value at first.' },
    { name: 'onChange', type: '(value) => void', description: 'Called with the new value.' },
    { name: 'expanded', type: 'string[]', description: 'Controlled: the open parents (with `onExpandedChange`).' },
    { name: 'defaultExpanded', type: 'string[] | true', default: '[]', description: 'Uncontrolled: the parents open at first; `true` for all.' },
    { name: 'press', type: "'select' | 'expand'", default: "'select'", description: 'What a press on a parent does: choose it, or open and close it (as Tree’s `press`).' },
    { name: 'max', type: 'number', description: 'At most this many values (with many).' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button while something is chosen.' },
    { name: 'panelHeight', type: 'number', default: 'sizes.box.panel (280)', description: 'The list scrolls past this height.' },
    { name: 'placeholder', type: 'string', description: 'Shown while nothing is chosen; also the trigger’s accessible name, `Options` without one. The trigger is at least as wide as the control is high.' },
    { name: 'label / description / error / invalid / asterisk / size / radius / variant', type: 'as Select', description: 'The field, its texts and state.' },
    { name: 'disabled / readOnly', type: 'boolean', default: 'false', description: 'No panel.' },
  ],
  demos: [
    {
      title: 'One recipe from a recipe book',
      code: `
const RECIPES = [
  { value: 'breakfast', label: 'Breakfast', children: [
    { value: 'oat-porridge', label: 'Oat porridge' },
    { value: 'shakshuka', label: 'Shakshuka' },
  ] },
  { value: 'baking', label: 'Baking', children: [
    { value: 'breads', label: 'Breads', children: [
      { value: 'rye-loaf', label: 'Rye loaf' },
      { value: 'focaccia', label: 'Focaccia' },
    ] },
    { value: 'lemon-tart', label: 'Lemon tart' },
  ] },
  { value: 'soups', label: 'Soups', children: [{ value: 'pea-and-mint', label: 'Pea and mint' }] },
];

function Demo() {
  return <TreeSelect w={300} label="Recipe" placeholder="Choose a recipe" data={RECIPES} defaultExpanded={['baking']} press="expand" clearable />;
}`,
      view: () => <TreeSelect w={300} label="Recipe" placeholder="Choose a recipe" data={RECIPES} defaultExpanded={['baking']} press="expand" clearable />,
      height: 280,
    },
    {
      title: 'Checkboxes: a chapter checks its recipes, with guides',
      code: `
function Demo() {
  const planned = $signal($active(), ['shakshuka']);
  return (
    <Stack gap="xs">
      <TreeSelect w={340} checks guides defaultExpanded label="This week’s cooking" placeholder="Pick recipes" data={RECIPES} value={planned} onChange={v => $write(planned, v)} />
      <Text size="sm" fg="quiet">{() => \`\${$read(planned).length} recipes planned\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const planned = $signal($active(), /** @type {string[]} */ (['shakshuka']));
        return (
          <Stack gap="xs">
            <TreeSelect w={340} checks guides defaultExpanded label="This week’s cooking" placeholder="Pick recipes" data={RECIPES} value={planned} onChange={(/** @type {string[]} */ v) => $write(planned, v)} />
            <Text size="sm" fg="quiet">
              {() => `${$read(planned).length} recipes planned`}
            </Text>
          </Stack>
        );
      },
      height: 360,
    },
    {
      title: 'Many values',
      code: `
function Demo() {
  return <TreeSelect w={340} pick="many" max={3} label="Up to three" placeholder="Recipes to try" data={RECIPES} defaultExpanded defaultValue={['focaccia']} />;
}`,
      view: () => <TreeSelect w={340} pick="many" max={3} label="Up to three" placeholder="Recipes to try" data={RECIPES} defaultExpanded defaultValue={['focaccia']} />,
      height: 340,
    },
  ],
};
