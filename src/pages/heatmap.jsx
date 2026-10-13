// Heatmap (rui-core/charts): months of days colored by value.

import { Heatmap } from 'rui-core/charts';
/** Minutes read each day from April to September 2026: shorter on weekdays, a long read most Sundays. */
const READING = (() => {
  /** @type {Record<string, number>} */
  const out = {};
  const start = Date.UTC(2026, 3, 1);
  for (let i = 0; i < 179; i++) {
    const d = new Date(start + i * 86400000);
    const minutes = d.getUTCDay() === 0 ? 45 + ((i * 7) % 30) : ((i * 13 + (i % 4) * 9) % 50) - 8;
    if (minutes > 0) out[d.toISOString().slice(0, 10)] = minutes;
  }
  return out;
})();

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'heatmap',
  group: 'charts',
  title: 'Heatmap',
  description: 'Days in weekly columns colored by their value (rui-core/charts), in equal-width bins over `domain`: the months and weekdays named by default, a `legend` from least to most, and a `tooltip` per day (its line from `tipOf`).',
  props: [
    { name: 'data', type: "Record<'YYYY-MM-DD', number>", description: 'A value per day.' },
    { name: 'from / to', type: "'YYYY-MM-DD' | Date", default: 'the current calendar year', description: 'The days shown: 1 January to 31 December by default, the days after today drawn in the page’s track color.' },
    { name: 'weekStart / today', type: "number / 'YYYY-MM-DD'", default: 'DateSettings’ (1, Monday / the platform’s day)', description: 'The first row (0 Sunday to 6 Saturday), and the day after which the days are drawn in the track color.' },
    { name: 'outside', type: 'boolean', default: 'false', description: 'The first and last weeks’ days outside the range too.' },
    { name: 'colors', type: 'string[]', default: 'the accent’s four', description: 'The levels, least to most, each an equal share of `domain`: by default the accent at its faint, disabled and dense opacities, then solid two shades toward the strong end.' },
    { name: 'domain', type: '[number, number]', default: 'the values’ range', description: 'The values the colors span.' },
    { name: 'cell', type: "{ size, gap, radius: number | 'xs' … 'xl' }", default: "{ size: sizes.glyph.xs (12), gap: 2, radius: 'xs' }", description: 'The days’ squares: their size, the gap between them and their corners, in pixels or a radius step (the theme’s xs by default).' },
    { name: 'months', type: 'boolean | { names, height }', default: 'true', description: 'The months over the columns (a month shorter than a week unnamed), or `{ names }` (12) and `height` (a line by default); `false` hides them.' },
    { name: 'weekdays', type: 'boolean | { names, width }', default: 'true', description: 'The weekdays beside the rows, by their one-letter names (DateSettings’ `weekdaysNarrow`), every other row when the rows sit closer than a line; `{ names }` (7, Sunday first, blank to skip) names every row, `width` spacing lg by default; `false` hides them.' },
    { name: 'monthGaps', type: 'boolean', default: 'false', description: 'Each month in fresh columns, a gutter of spacing xs between months.' },
    { name: 'legend', type: 'boolean | { labels: [string, string] }', default: 'false', description: 'A line of the levels under the days, between `labels` (by default the least and the greatest value, formatted).' },
    { name: 'tooltip / tipOf', type: 'boolean / ({ date, value }) => string', default: 'false', description: 'A tooltip per day: its date over a row of its level’s tone, `label` and value; `tipOf` gives its one line instead.' },
    { name: 'label / format / unit', type: 'string / (value) => string / string', description: 'The value’s name in the tooltip, and how values read (the tooltip and the default legend).' },
  ],
  demos: [
    {
      title: 'Reading minutes per day',
      code: `
// READING: minutes read per day, { '2026-04-02': 14, '2026-04-03': 36, … }

function Demo() {
  return (
    <Heatmap
      data={READING}
      from="2026-04-01"
      to="2026-09-26"
      domain={[0, 60]}
      months
      weekdays
      legend={{ labels: ['0 min', '60+ min'] }}
      tooltip
      tipOf={({ date, value }) => \`\${date}: \${value ?? 0} minutes read\`}
    />
  );
}`,
      view: () => (
        <Heatmap
          data={READING}
          from="2026-04-01"
          to="2026-09-26"
          domain={[0, 60]}
          months
          weekdays
          legend={{ labels: ['0 min', '60+ min'] }}
          tooltip
          tipOf={(/** @type {{ date: string, value: number | null }} */ { date, value }) => `${date}: ${value ?? 0} minutes read`}
        />
      ),
      height: 160,
    },
    {
      title: 'Months apart, in larger squares, without the weekdays',
      code: `
function Demo() {
  return (
    <Heatmap
      data={READING}
      from="2026-07-01"
      to="2026-09-26"
      monthGaps
      outside
      cell={{ size: 16, gap: 3, radius: 'sm' }}
      colors={['indigo.1', 'indigo.3', 'indigo.5', 'indigo.8']}
      weekdays={false}
    />
  );
}`,
      view: () => (
        <Heatmap
          data={READING}
          from="2026-07-01"
          to="2026-09-26"
          monthGaps
          outside
          cell={{ size: 16, gap: 3, radius: 'sm' }}
          colors={['indigo.1', 'indigo.3', 'indigo.5', 'indigo.8']}
          weekdays={false}
        />
      ),
      height: 170,
    },
  ],
};
