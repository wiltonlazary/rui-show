// Tiles: equal columns.

import { Surface, Text, Tiles } from 'rui-core';

/** @param {{ children?: any }} props */
const Item = props => (
  <Surface bordered p="xs">
    <Text size="sm">{props.children}</Text>
  </Surface>
);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'tiles',
  group: 'structure',
  title: 'Tiles',
  description: 'Equal columns on the portable CSS grid: `columns` of them, `gap` between columns and `rowGap` between rows.',
  props: [
    { name: 'columns', type: 'number | { base, sm, … }', default: '1', description: 'The number of columns; responsive from a breakpoint up.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | { base, … }", default: "'md'", description: 'Space between columns (and rows, unless `rowGap`).' },
    { name: 'rowGap', type: "'xs' | … | number | { base, … }", description: 'Space between rows.' },
  ],
  demos: [
    {
      title: 'Three columns',
      code: `
const Item = props => <Surface bordered p="xs"><Text size="sm">{props.children}</Text></Surface>;

function Demo() {
  return (
    <Tiles columns={3} gap="sm" rowGap="xs">
      {[1, 2, 3, 4, 5, 6].map(n => <Item>{\`Cell \${n}\`}</Item>)}
    </Tiles>
  );
}`,
      view: () => (
        <Tiles columns={3} gap="sm" rowGap="xs">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <Item>{`Cell ${n}`}</Item>
          ))}
        </Tiles>
      ),
      height: 130,
    },
  ],
};
