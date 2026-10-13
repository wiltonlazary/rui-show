// DataTable (rui-core/more): nested fields, sorting, pages, picking and a
// row press, over a seed library's shelf.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Badge, Stack, Text } from 'rui-core';
import { DataTable } from 'rui-core/more';

/** A seed library's shelf: heirloom varieties, where each was saved, and the packets left. */
const SEEDS = [
  { id: 'T-12', variety: 'Cherokee Purple', crop: 'Tomato', saved: { state: 'TN', year: 2024 }, packets: 42 },
  { id: 'B-03', variety: 'Dragon Tongue', crop: 'Bean', saved: { state: 'OR', year: 2025 }, packets: 7 },
  { id: 'C-08', variety: 'Glass Gem', crop: 'Corn', saved: { state: 'OK', year: 2023 }, packets: 15 },
  { id: 'P-21', variety: 'Lemon Drop', crop: 'Pepper', saved: { state: 'NM', year: 2025 }, packets: 3 },
  { id: 'M-05', variety: 'Moon and Stars', crop: 'Melon', saved: { state: 'MO', year: 2024 }, packets: 26 },
  { id: 'B-17', variety: 'Scarlet Runner', crop: 'Bean', saved: { state: 'VT', year: 2022 }, packets: 0 },
  { id: 'C-02', variety: 'Hopi Blue', crop: 'Corn', saved: { state: 'AZ', year: 2025 }, packets: 19 },
];

/** A shelf label for a packet count. @param {number} n */
const stockOf = n => (n === 0 ? ['gone', 'gray'] : n < 10 ? ['low', 'amber'] : ['on the shelf', 'indigo']);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'data-table',
  group: 'data',
  title: 'DataTable',
  description: 'A data table (rui-core/more): fields keyed by a row path (nested with `a.b`), sorting by a header press, pages, picking rows with checkboxes, row presses, a loading cover, and virtual rows under a sticky header in a body that scrolls.',
  props: [
    { name: 'fields', type: "{ [path]: { title, cell(row, index), sort: true | (row) => any, width, align: 'start' | 'center' | 'end' } | true }", description: 'The columns, one per key in key order; a path left out is not shown.' },
    { name: 'rows', type: 'any[]', description: 'The rows (only the page’s with `pages.total`).' },
    { name: 'idOf', type: '(row, index) => any', default: 'row.id, else the index', description: 'A row’s key.' },
    { name: 'order / onOrderChange / defaultOrder', type: '{ by: string, desc?: boolean }', description: 'Held by the caller (who sorts) or the table’s own (it sorts); a sortable header is a `columnheader` with `aria-sort`, holding a button named by the column’s title, and shows its direction with a `sizes.glyph.sm` (14 px) arrow.' },
    { name: 'pages', type: 'false | { size, page, defaultPage, onChange, total, text(from, to, total), look: { size } }', default: 'false', description: 'Pages of `size` rows (10): the table slices unless `total` says the rows are a page; `text` is the “1–2 of 5” line (one row: “5 of 5”), `look.size` the pager’s (sm).' },
    { name: 'picking', type: 'false | { value, defaultValue, onChange, allow(row) }', default: 'false', description: 'Picked rows, with a checkbox column; `allow` says which rows can be picked.' },
    { name: 'onRowPress', type: '(row, index, event) => void', description: 'A row pressed.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'A Busy cover over the rows.' },
    { name: 'loader', type: 'object', description: 'The cover’s loader options.' },
    { name: 'empty', type: 'string', default: "'Nothing here yet'", description: 'Shown when there are none, in a box twice a medium control tall (72 px).' },
    { name: 'height / virtual / rowHeight / overscan', type: 'number / boolean / number / number', default: '— / false / 36 / 4', description: 'A body that scrolls under a sticky header (`sizes.box.table`, 300, while it measures); virtual builds only the rows in view.' },
    { name: 'striped / hoverable / bordered', type: 'boolean', default: 'false', description: 'The look: every other row on the page’s stripe, a row on hover under the pointer, a frame.' },
    { name: 'selectionColor', type: 'string', default: 'theme.accent', description: 'Picked rows wear its tint.' },
    { name: 'lines', type: "'rows' | 'columns' | 'both' | false", default: "'rows'", description: 'The borders between cells.' },
    { name: 'density', type: "'tight' | 'even' | 'airy'", default: "'even'", description: 'The cell padding (the theme’s `control.density`): 4 × 8, 8 × 12 or 12 × 16 pixels.' },
    { name: 'radius / fontSize', type: "… / 'xs' … 'xl'", default: "'sm' / 'md'", description: 'The frame’s corners (with `bordered`) and the cells’ text.' },
  ],
  demos: [
    {
      title: 'Nested paths, sorting by count, and a drawn cell',
      code: `
// SEEDS: a seed library's shelf, [{ id: 'T-12', variety: 'Cherokee Purple', crop: 'Tomato', saved: { state: 'TN', year: 2024 }, packets: 42 }, …]
const stockOf = n => (n === 0 ? ['gone', 'gray'] : n < 10 ? ['low', 'amber'] : ['on the shelf', 'indigo']);

function Demo() {
  return (
    <DataTable
      bordered
      radius="sm"
      striped
      hoverable
      rows={SEEDS.slice(0, 5)}
      defaultOrder={{ by: 'packets', desc: true }}
      fields={{
        variety: { sort: true },
        crop: { sort: true },
        'saved.state': { title: 'Saved in', sort: true, width: 90 },
        packets: { sort: true, align: 'end', width: 90 },
        stock: { title: 'Shelf', cell: s => <Badge color={stockOf(s.packets)[1]} variant="soft">{stockOf(s.packets)[0]}</Badge> },
      }}
    />
  );
}`,
      view: () => (
        <DataTable
          bordered
          radius="sm"
          striped
          hoverable
          rows={SEEDS.slice(0, 5)}
          defaultOrder={{ by: 'packets', desc: true }}
          fields={{
            variety: { sort: true },
            crop: { sort: true },
            'saved.state': { title: 'Saved in', sort: true, width: 90 },
            packets: { sort: true, align: 'end', width: 90 },
            stock: {
              title: 'Shelf',
              cell: (/** @type {any} */ s) => (
                <Badge color={stockOf(s.packets)[1]} variant="soft">
                  {stockOf(s.packets)[0]}
                </Badge>
              ),
            },
          }}
        />
      ),
      height: 280,
    },
    {
      title: 'Pages, picking what is in stock, and a row press',
      code: `
function Demo() {
  const order = $signal($active(), []);
  const looked = $signal($active(), 'nothing yet');
  return (
    <Stack gap="xs">
      <DataTable
        bordered
        density="tight"
        rows={SEEDS}
        pages={{ size: 3 }}
        picking={{ value: order, onChange: r => $write(order, r), allow: s => s.packets > 0 }}
        onRowPress={row => $write(looked, \`\${row.variety} (\${row.id}), \${row.packets} left\`)}
        fields={{ id: { title: 'Shelf', width: 70 }, variety: true, 'saved.year': { title: 'Saved', align: 'end', width: 70 } }}
      />
      <Text size="sm" fg="quiet">{() => \`\${$read(order).length} in the request; looked at: \${$read(looked)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const order = $signal($active(), /** @type {any[]} */ ([]));
        const looked = $signal($active(), 'nothing yet');
        return (
          <Stack gap="xs">
            <DataTable
              bordered
              density="tight"
              rows={SEEDS}
              pages={{ size: 3 }}
              picking={{ value: order, onChange: (/** @type {any[]} */ r) => $write(order, r), allow: (/** @type {any} */ s) => s.packets > 0 }}
              onRowPress={(/** @type {any} */ row) => $write(looked, `${row.variety} (${row.id}), ${row.packets} left`)}
              fields={{ id: { title: 'Shelf', width: 70 }, variety: true, 'saved.year': { title: 'Saved', align: 'end', width: 70 } }}
            />
            <Text size="sm" fg="quiet">
              {() => `${$read(order).length} in the request; looked at: ${$read(looked)}`}
            </Text>
          </Stack>
        );
      },
      height: 260,
    },
  ],
};
