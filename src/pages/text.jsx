// Text: text in the theme's sizes.

import { $signal, $read, $write } from 'rrx-core';
import { $active, $resizes } from 'ren-core';
import { Text, Stack } from 'rui-core';

/** Right-to-left text: a sentence in Arabic, its letters joined on every renderer. */
export const ARABIC = 'نص من اليمين إلى اليسار، حروفه متصلة';

/** The Arabic line and its width as laid out, which agrees on every renderer. */
function RightToLeft() {
  const R = $active();
  const line = $signal(R, /** @type {any} */ (null));
  const width = $signal(R, 0);
  $resizes(() => $read(line), e => $write(width, e.width));
  return (
    <Stack gap={4} align="start">
      <Text ref={(/** @type {any} */ el) => $write(line, el)}>{ARABIC}</Text>
      <Text size="sm" fg="quiet">
        {() => ($read(width) > 0 ? `${$read(width).toFixed(1)} px wide` : '')}
      </Text>
    </Stack>
  );
}

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'text',
  group: 'text',
  title: 'Text',
  description: 'Text in the theme’s font sizes and line heights, colored by theme colors or `quiet`, with weight, alignment, italic, underline and strike. Right-to-left text runs from the right, Arabic with its letters joined, on every renderer.',
  props: [
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Font size and line height from the theme.' },
    { name: 'fg', type: "string | 'quiet'", description: 'Color: a theme color, `name.shade`, hex, or the scheme’s quiet color.' },
    { name: 'fontWeight', type: "'normal' | 'bold' | number", description: 'Font weight: 100 to 900 in hundreds (`normal` 400, `bold` 700); each renderer draws the nearest face it has.' },
    { name: 'textAlign', type: "'start' | 'center' | 'end'", description: 'Text alignment.' },
    { name: 'italic', type: 'boolean', default: 'false', description: 'Slanted (a block Text or a run).' },
    { name: 'underline / strike', type: 'boolean', default: 'false', description: 'Underlined, or struck through (a block Text or a run).' },
    { name: 'inherit', type: 'boolean', default: 'false', description: 'Takes the parent’s size and color; its own `italic`, `underline` and `strike` still apply.' },
    { name: 'inline', type: 'boolean', default: 'false', description: 'Text within text, not a paragraph.' },
    { name: 'lines', type: 'number', description: 'At most that many lines, the last ending with …' },
    { name: 'truncate', type: "boolean | 'end'", default: 'false', description: 'One line ending with …' },
    { name: 'children', type: 'string | number | (() => string)', description: 'The text; an accessor updates it in place (`text` too).' },
  ],
  demos: [
    {
      title: 'Five sizes',
      code: `
function Demo() {
  return (
    <Stack gap={4}>
      {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <Text size={size}>{\`Size \${size}: a short line of text\`}</Text>)}
    </Stack>
  );
}`,
      view: () => (
        <Stack gap={4}>
          {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
            <Text size={size}>{`Size ${size}: a short line of text`}</Text>
          ))}
        </Stack>
      ),
      height: 190,
    },
    {
      title: 'Quiet, bold indigo, struck and italic',
      code: `
function Demo() {
  return (
    <Stack gap={4}>
      <Text fg="quiet">Updated two minutes ago</Text>
      <Text fg="indigo" fontWeight={700}>Due on Friday</Text>
      <Text strike>Buy stamps</Text>
      <Text italic textAlign="end">— signed, the front desk</Text>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap={4}>
          <Text fg="quiet">Updated two minutes ago</Text>
          <Text fg="indigo" fontWeight={700}>
            Due on Friday
          </Text>
          <Text strike>Buy stamps</Text>
          <Text italic textAlign="end">
            — signed, the front desk
          </Text>
        </Stack>
      ),
      height: 150,
    },
    {
      title: 'Right to left, its letters joined',
      code: `
function Demo() {
  const line = $signal($active(), null);
  const width = $signal($active(), 0);
  // The line's width as its renderer lays it out: the canvases shape it as the browser does.
  $resizes(() => $read(line), e => $write(width, e.width));
  return (
    <Stack gap={4} align="start">
      <Text ref={el => $write(line, el)}>نص من اليمين إلى اليسار، حروفه متصلة</Text>
      <Text size="sm" fg="quiet">{() => ($read(width) > 0 ? \`\${$read(width).toFixed(1)} px wide\` : '')}</Text>
    </Stack>
  );
}`,
      view: () => <RightToLeft />,
      height: 80,
      measured: true,
    },
  ],
};
