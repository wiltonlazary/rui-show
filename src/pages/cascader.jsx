// Cascader: a path through a tree, chosen column by column; parents
// chosen too, and a path held by a signal.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Cascader, Stack, Text } from 'rui-core';

const PLACES = [
  {
    value: 'europe',
    label: 'Europe',
    children: [
      { value: 'pt', label: 'Portugal', children: [{ value: 'lisbon', label: 'Lisbon' }, { value: 'porto', label: 'Porto' }] },
      { value: 'fr', label: 'France', children: [{ value: 'paris', label: 'Paris' }, { value: 'lyon', label: 'Lyon' }] },
    ],
  },
  {
    value: 'americas',
    label: 'Americas',
    children: [
      { value: 'br', label: 'Brazil', children: [{ value: 'recife', label: 'Recife' }, { value: 'sao-paulo', label: 'São Paulo' }] },
      { value: 'ca', label: 'Canada', disabled: true },
    ],
  },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'cascader',
  group: 'choices',
  title: 'Cascader',
  description: 'A path through a tree of options, chosen column by column: a press on an option opens its children in the next column, a leaf is the value (the path of values from the root), and the panel closes on a choice unless `stay`. The keys walk it: ArrowUp and ArrowDown in a column, ArrowRight into the next, ArrowLeft back, Enter chooses. `searchable` lists the paths holding every typed word in their labels as one flat list; `openOn="hover"` opens a column on hover; past `levels` columns the earlier levels fold into a trail of crumbs. The field names the active option through `aria-activedescendant`.',
  props: [
    { name: 'data', type: '{ value, label, children?, disabled? }[]', description: 'The tree.' },
    { name: 'value', type: 'string[] | null | (() => string[] | null)', description: 'Controlled: the path of values (with `onChange`).' },
    { name: 'defaultValue', type: 'string[] | null', default: 'null', description: 'Uncontrolled: the path at first.' },
    { name: 'onChange', type: '(path: string[] | null) => void', description: 'Called with the new path.' },
    { name: 'pick', type: "'leaf' | 'any'", default: "'leaf'", description: "What may be chosen: only a node without children, or (`'any'`) a parent too, by Enter or a second press once it is open." },
    { name: 'toggle', type: 'boolean', default: 'true', description: 'Choosing the chosen path again clears it.' },
    { name: 'stay', type: 'boolean', default: 'false', description: 'The panel stays open on a choice (it closes otherwise).' },
    { name: 'separator', type: 'string', default: "' › '", description: 'Between the labels where a path is written as text.' },
    { name: 'format', type: '(labels: string[]) => string', description: 'The field’s text for a path (the labels joined by `separator` by default).' },
    { name: 'column', type: '{ width? }', default: '{ width: sizes.box.menu (160) }', description: 'Each column’s options.' },
    { name: 'panelHeight', type: 'number', default: 'sizes.box.panel (280)', description: 'Each column (and the flat list) scrolls past this height.' },
    { name: 'levels', type: 'number', default: '4', description: 'Columns shown side by side; the earlier open levels fold into a trail of crumbs above them, each pressable to bring its level back.' },
    { name: 'trailLabel', type: 'string', default: "'Levels above'", description: 'The trail’s accessible name.' },
    { name: 'check', type: "boolean | { at?: 'start' | 'end' }", default: 'true (at the end)', description: 'A check on the chosen option, and where it sits.' },
    { name: 'layout', type: "'columns' | 'list'", default: "'columns'", description: "`'list'` lists every choosable path flat, as a search does." },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'The field filters the paths: a path is found when every word typed is in one of its labels, in any order; listed flat and walked by the arrows.' },
    { name: 'match', type: '(nodes, search: string) => boolean', description: 'Whether a path (its nodes from the root) is found by the search, in place of the built-in rule.' },
    { name: 'limit', type: 'number', description: 'The most paths a search shows.' },
    { name: 'search / defaultSearch / onSearchChange', type: 'string / string / (value: string) => void', description: 'The search, controlled or not.' },
    { name: 'openOn', type: "'press' | 'hover'", default: "'press'", description: 'What opens a parent’s column; a leaf is still chosen by a press.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button while a path is chosen.' },
    { name: 'placeholder', type: 'string', description: 'Shown while nothing is chosen.' },
    { name: 'empty', type: 'string', default: "'No match'", description: 'Shown when nothing is listed.' },
    { name: 'label / description / error / invalid / size / radius / variant', type: 'as Select', description: 'The field’s label, texts, state and look.' },
    { name: 'disabled / readOnly', type: 'boolean', default: 'false', description: 'No panel.' },
  ],
  demos: [
    {
      title: 'Choosing a city',
      code: `
const PLACES = [
  { value: 'europe', label: 'Europe', children: [
    { value: 'pt', label: 'Portugal', children: [{ value: 'lisbon', label: 'Lisbon' }, { value: 'porto', label: 'Porto' }] },
    { value: 'fr', label: 'France', children: [{ value: 'paris', label: 'Paris' }, { value: 'lyon', label: 'Lyon' }] },
  ] },
  { value: 'americas', label: 'Americas', children: [
    { value: 'br', label: 'Brazil', children: [{ value: 'recife', label: 'Recife' }, { value: 'sao-paulo', label: 'São Paulo' }] },
    { value: 'ca', label: 'Canada', disabled: true },
  ] },
];

function Demo() {
  return <Cascader w={300} label="City" placeholder="Pick a city" data={PLACES} clearable />;
}`,
      view: () => <Cascader w={300} label="City" placeholder="Pick a city" data={PLACES} clearable />,
      height: 220,
    },
    {
      title: 'Parents chosen too, a formatted value, held by a signal',
      code: `
function Demo() {
  const path = $signal($active(), ['europe', 'pt']);
  return (
    <Stack gap="xs">
      <Cascader
        w={300}
        label="Region"
        data={PLACES}
        pick="any"
        format={labels => labels.join(' · ')}
        value={path}
        onChange={p => $write(path, p)}
      />
      <Text size="sm" fg="quiet">{() => \`path: \${($read(path) ?? []).join('/') || 'none'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const path = $signal($active(), /** @type {string[] | null} */ (['europe', 'pt']));
        return (
          <Stack gap="xs">
            <Cascader w={300} label="Region" data={PLACES} pick="any" format={(/** @type {string[]} */ labels) => labels.join(' · ')} value={path} onChange={(/** @type {string[] | null} */ p) => $write(path, p)} />
            <Text size="sm" fg="quiet">
              {() => `path: ${($read(path) ?? []).join('/') || 'none'}`}
            </Text>
          </Stack>
        );
      },
      height: 250,
    },
  ],
};
