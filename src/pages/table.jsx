// Table: from parts or from data; stripes, hover, borders, density.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Table, Switch, Stack } from 'rui-core';

/** The planets: diameter in km, known moons, a day in hours. */
const PLANETS = [
  { name: 'Mercury', diameter: 4879, moons: 0, day: 1407.6 },
  { name: 'Venus', diameter: 12104, moons: 0, day: 5832.5 },
  { name: 'Earth', diameter: 12756, moons: 1, day: 23.9 },
  { name: 'Mars', diameter: 6792, moons: 2, day: 24.6 },
  { name: 'Jupiter', diameter: 142984, moons: 95, day: 9.9 },
  { name: 'Saturn', diameter: 120536, moons: 146, day: 10.7 },
  { name: 'Uranus', diameter: 51118, moons: 28, day: 17.2 },
  { name: 'Neptune', diameter: 49528, moons: 16, day: 16.1 },
];
const INNER = PLANETS.slice(0, 4);
/** @param {typeof PLANETS[number]} p */
const cellsOf = p => [p.name, p.diameter.toLocaleString('en-US'), String(p.moons), String(p.day)];
const COLUMNS = ['Planet', 'Diameter (km)', 'Moons', 'Day (h)'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'table',
  group: 'data',
  title: 'Table',
  description: 'Rows of cells from parts (Table.Head, .Body, .Foot, .Row, .Heading, .Cell, .Caption) or from `data` (columns, rows, totals and a caption), with stripes, hover, borders and a `density`. The table is one grid of columns sized by their content; each row is a boxless `row` (`display: \'contents\'`), so its Data is a record per row keyed by the column headers.',
  props: [
    { name: 'data', type: '{ columns?: any[], rows?: any[][], totals?: any[], caption?: string }', description: 'The whole table, in place of parts: the column titles, the rows of cells, a totals row and a caption.' },
    { name: 'striped', type: 'boolean', default: 'false', description: 'Tints every second body row, from the second.' },
    { name: 'hoverable', type: 'boolean', default: 'false', description: 'Tints a body row under the pointer.' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'A border around the table.' },
    { name: 'lines', type: "'rows' | 'columns' | 'both' | false", default: "'rows'", description: 'Lines under rows, between cells, both, or none.' },
    { name: 'density', type: "'tight' | 'even' | 'airy'", default: "'even'", description: 'The cells’ padding (y × x, the theme’s `control.density`): 4 × 8, 8 × 12 or 12 × 16.' },
    { name: 'captionAt', type: "'top' | 'bottom'", default: "'bottom'", description: 'Where `data`’s caption goes (parts place Table.Caption where written).' },
    { name: 'borderColor', type: 'string', description: 'The lines’ CSS color (the page’s rule color by default).' },
    { name: 'stripeColor', type: 'string', description: 'The stripes’ CSS color (the page’s stripe by default).' },
    { name: 'hoverColor', type: 'string', description: 'The hovered row’s CSS color (the page’s hover by default).' },
    { name: 'sticky', type: 'boolean', default: 'false', description: 'In a Table.Scroll, the Head stays at its top (on the raised layer).' },
    { name: 'stickyOffset', type: 'number', default: '0', description: 'Pixels between the sticky header and the container’s top.' },
    { name: 'fixed', type: 'boolean', default: 'false', description: 'Equal columns; otherwise columns are sized by their content.' },
    { name: 'Table.Scroll', type: 'component', description: 'A Scroll around the table: `maxHeight` bounds it, `minWidth` keeps the table from narrowing.' },
    { name: 'Table.Heading / Table.Cell', type: 'component', description: 'Header and data cells: text or content; a number `w` (pixels) sizes its column (at least `w` wide, sharing any room left; the cell stretches across it), and a string `w` (\'50%\') is the cell’s own width, as any box’s; `span` spans columns (a spanning cell’s `w` is its least width).' },
  ],
  demos: [
    {
      title: 'The inner planets, from parts',
      code: `
const PLANETS = [
  { name: 'Mercury', diameter: 4879, moons: 0, day: 1407.6 },
  { name: 'Venus', diameter: 12104, moons: 0, day: 5832.5 },
  { name: 'Earth', diameter: 12756, moons: 1, day: 23.9 },
  { name: 'Mars', diameter: 6792, moons: 2, day: 24.6 },
  { name: 'Jupiter', diameter: 142984, moons: 95, day: 9.9 },
  { name: 'Saturn', diameter: 120536, moons: 146, day: 10.7 },
  { name: 'Uranus', diameter: 51118, moons: 28, day: 17.2 },
  { name: 'Neptune', diameter: 49528, moons: 16, day: 16.1 },
];
const INNER = PLANETS.slice(0, 4);
const cellsOf = p => [p.name, p.diameter.toLocaleString('en-US'), String(p.moons), String(p.day)];
const COLUMNS = ['Planet', 'Diameter (km)', 'Moons', 'Day (h)'];

function Demo() {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Heading w={120}>Planet</Table.Heading>
          <Table.Heading>Diameter (km)</Table.Heading>
          <Table.Heading w={90}>Moons</Table.Heading>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {INNER.map(p => (
          <Table.Row>
            <Table.Cell w={120}>{p.name}</Table.Cell>
            <Table.Cell>{p.diameter.toLocaleString('en-US')}</Table.Cell>
            <Table.Cell w={90}>{String(p.moons)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Caption>The inner planets</Table.Caption>
    </Table>
  );
}`,
      view: () => (
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Heading w={120}>Planet</Table.Heading>
              <Table.Heading>Diameter (km)</Table.Heading>
              <Table.Heading w={90}>Moons</Table.Heading>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {INNER.map(p => (
              <Table.Row>
                <Table.Cell w={120}>{p.name}</Table.Cell>
                <Table.Cell>{p.diameter.toLocaleString('en-US')}</Table.Cell>
                <Table.Cell w={90}>{String(p.moons)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Caption>The inner planets</Table.Caption>
        </Table>
      ),
      height: 230,
    },
    {
      title: 'Moons of the giants, from data with totals',
      code: `
function Demo() {
  return (
    <Table
      data={{
        columns: ['Planet', 'Moons'],
        rows: PLANETS.slice(4).map(p => [p.name, String(p.moons)]),
        totals: ['All four', String(PLANETS.slice(4).reduce((n, p) => n + p.moons, 0))],
        caption: 'Moons of the giant planets',
      }}
    />
  );
}`,
      view: () => (
        <Table
          data={{
            columns: ['Planet', 'Moons'],
            rows: PLANETS.slice(4).map(p => [p.name, String(p.moons)]),
            totals: ['All four', String(PLANETS.slice(4).reduce((n, p) => n + p.moons, 0))],
            caption: 'Moons of the giant planets',
          }}
        />
      ),
      height: 230,
    },
    {
      title: 'Striped rows',
      code: `
function Demo() {
  const striped = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Switch label="Striped" checked={striped} onChange={v => $write(striped, v)} />
      <Table striped={striped} data={{ columns: COLUMNS, rows: PLANETS.map(cellsOf) }} />
    </Stack>
  );
}`,
      view: () => {
        const striped = $signal($active(), true);
        return (
          <Stack gap="sm">
            <Switch label="Striped" checked={striped} onChange={(/** @type {boolean} */ v) => $write(striped, v)} />
            <Table striped={striped} data={{ columns: COLUMNS, rows: PLANETS.map(cellsOf) }} />
          </Stack>
        );
      },
      height: 330,
    },
    {
      title: 'A row lit under the pointer',
      code: `
function Demo() {
  return (
    <Table hoverable data={{ columns: COLUMNS, rows: INNER.map(cellsOf) }} />
  );
}`,
      view: () => (
        <Table hoverable data={{ columns: COLUMNS, rows: INNER.map(cellsOf) }} />
      ),
      height: 180,
    },
    {
      title: 'A border and column lines',
      code: `
function Demo() {
  const columns = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Switch label="Lines between columns" checked={columns} onChange={v => $write(columns, v)} />
      <Table bordered lines={() => ($read(columns) ? 'both' : 'rows')} data={{ columns: COLUMNS, rows: INNER.map(cellsOf) }} />
    </Stack>
  );
}`,
      view: () => {
        const columns = $signal($active(), true);
        return (
          <Stack gap="sm">
            <Switch label="Lines between columns" checked={columns} onChange={(/** @type {boolean} */ v) => $write(columns, v)} />
            <Table bordered lines={() => ($read(columns) ? 'both' : 'rows')} data={{ columns: COLUMNS, rows: INNER.map(cellsOf) }} />
          </Stack>
        );
      },
      height: 230,
    },
    {
      title: 'Density and a caption on top',
      code: `
function Demo() {
  return (
    <Table
      density="airy"
      lines={false}
      striped
      captionAt="top"
      data={{
        caption: 'Airy cells, no lines, every second row striped',
        columns: ['Planet', 'Day (h)'],
        rows: INNER.map(p => [p.name, String(p.day)]),
      }}
    />
  );
}`,
      view: () => (
        <Table
          density="airy"
          lines={false}
          striped
          captionAt="top"
          data={{
            caption: 'Airy cells, no lines, every second row striped',
            columns: ['Planet', 'Day (h)'],
            rows: INNER.map(p => [p.name, String(p.day)]),
          }}
        />
      ),
      height: 270,
    },
    {
      title: 'A sticky header in a Table.Scroll',
      code: `
function Demo() {
  return (
    <Table.Scroll minWidth={560} maxHeight={170}>
      <Table sticky striped data={{ columns: COLUMNS, rows: PLANETS.map(cellsOf) }} />
    </Table.Scroll>
  );
}`,
      view: () => (
        <Table.Scroll minWidth={560} maxHeight={170}>
          <Table sticky striped data={{ columns: COLUMNS, rows: PLANETS.map(cellsOf) }} />
        </Table.Scroll>
      ),
      height: 200,
      clipped: true,
    },
  ],
};
