// Bars (rui-core/charts): named bars by their share of the largest.

import { Bars } from 'rui-core/charts';

const PAGES = [
  { label: '/trips', value: 832 },
  { label: '/trips/lisbon', value: 512 },
  { label: '/bookings', value: 344 },
  { label: '/guides/packing', value: 198 },
  { label: '/account/receipts', value: 76 },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'bars',
  group: 'charts',
  title: 'Bars',
  description: 'A list of named amounts (rui-core/charts): each a line of text, its name at the start and its value at the end, over a thin track filled by its share of the largest value.',
  props: [
    { name: 'data', type: '{ label, value, color? }[]', description: 'The items: each label at its line’s start, its value at the end, its share of the largest in the track under them.' },
    { name: 'head', type: '{ label, value }', description: 'The columns’ headings, over the labels and the values.' },
    { name: 'barSize / rowGap', type: 'number', default: 'sizes.progress.md (6) / spacing.sm (12)', description: 'The track’s thickness and the space between items.' },
    { name: 'minLength', type: 'number', default: 'sizes.progress.sm (4)', description: 'The least fill of a positive value, so the smallest still shows.' },
    { name: 'track', type: 'boolean', default: 'true', description: 'The unfilled part of each track, in the page’s track role.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The fills’ color (an item’s own `color` wins); no text sits on a fill, so any color reads.' },
    { name: 'format / unit', type: '(value) => string / string', description: 'How values read.' },
    { name: 'w', type: 'number', default: 'the box’s width', description: 'The width.' },
  ],
  demos: [
    {
      title: 'Pages by views',
      code: `
const PAGES = [
  { label: '/trips', value: 832 },
  { label: '/trips/lisbon', value: 512 },
  { label: '/bookings', value: 344 },
  { label: '/guides/packing', value: 198 },
  { label: '/account/receipts', value: 76 },
];

function Demo() {
  return <Bars w={560} data={PAGES} head={{ label: 'Page', value: 'Views' }} format={v => v.toLocaleString('en-US')} />;
}`,
      view: () => <Bars w={560} data={PAGES} head={{ label: 'Page', value: 'Views' }} format={(/** @type {number} */ v) => v.toLocaleString('en-US')} />,
      height: 280,
    },
    {
      title: 'Colors of their own, thicker and without a track',
      code: `
function Demo() {
  return (
    <Bars
      w={560}
      barSize={10}
      track={false}
      data={[
        { label: 'Search', value: 64, color: 'blue.6' },
        { label: 'Newsletter', value: 19, color: 'cyan.3' },
        { label: 'Referral', value: 4, color: 'orange.6' },
      ]}
      format={v => \`\${v}%\`}
    />
  );
}`,
      view: () => (
        <Bars
          w={560}
          barSize={10}
          track={false}
          data={[
            { label: 'Search', value: 64, color: 'blue.6' },
            { label: 'Newsletter', value: 19, color: 'cyan.3' },
            { label: 'Referral', value: 4, color: 'orange.6' },
          ]}
          format={(/** @type {number} */ v) => `${v}%`}
        />
      ),
      height: 150,
    },
  ],
};
