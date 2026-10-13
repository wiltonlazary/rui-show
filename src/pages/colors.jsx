// Colors: the default palette and the color arithmetic.

import { BASE_THEME, Stack, Row, Box, Text, alpha, shade, isLight } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'colors',
  group: 'foundations',
  title: 'Colors',
  description: 'The default palette: thirteen hues in color-wheel order (red to magenta), then the neutrals gray and night, ten shades each, lightest first; white text on shade 6 passes WCAG AA for every hue. Components take a color name (its accent shade), `name.shade` or CSS hex; the helpers below mix and measure colors.',
  props: [
    { name: 'BASE_COLORS', type: 'Record<string, string[10]>', description: 'The palette, as CSS hex: red, orange, amber, yellow, lime, green, teal, cyan, blue, indigo, violet, purple, magenta, gray, night.' },
    { name: 'colorOf(theme, scheme, color)', type: 'string', description: 'A color name, `name.shade` or hex, as hex (a name at the scheme’s accent shade).' },
    { name: 'alpha(color, amount)', type: 'string', description: 'The color with an alpha, as `#rrggbbaa`.' },
    { name: 'shade(color, amount)', type: 'string', description: 'Mixed toward black (positive) or white (negative), 0 to 1.' },
    { name: 'luminance(color)', type: 'number', description: 'Its WCAG relative luminance, 0 to 1.' },
    { name: 'isLight(color, threshold?)', type: 'boolean', description: 'Whether black text reads best on it: its luminance past `threshold` (0.179, where black and white text have equal contrast).' },
  ],
  demos: [
    {
      title: 'The default palette',
      code: `
function Demo() {
  return (
    <Stack gap={4}>
      {Object.entries(BASE_THEME.colors).map(([name, shades]) => (
        <Row gap={4} wrap={false}>
          <Text w={64} size="xs" fontWeight={700}>{name}</Text>
          {shades.map(hex => <Box w={52} h={22} bg={hex} style={{ radius: 3 }} />)}
        </Row>
      ))}
    </Stack>
  );
}`,
      view: () => (
        <Stack gap={4}>
          {Object.entries(BASE_THEME.colors).map(([name, shades]) => (
            <Row gap={4} wrap={false}>
              <Text w={64} size="xs" fontWeight={700}>
                {name}
              </Text>
              {shades.map(hex => (
                <Box w={52} h={22} bg={hex} style={{ radius: 3 }} />
              ))}
            </Row>
          ))}
        </Stack>
      ),
      height: 440,
    },
    {
      title: 'Mixing colors',
      code: `
const BASE = BASE_THEME.colors.teal[6];
const MIXES = [
  ['alpha 0.25', alpha(BASE, 0.25)],
  ['base', BASE],
  ['shade 0.3', shade(BASE, 0.3)],
  ['shade -0.5', shade(BASE, -0.5)],
];

function Demo() {
  return (
    <Row gap="sm">
      {MIXES.map(([name, color]) => (
        <Box w={130} h={60} p="xs" bg={color} fg={isLight(color) ? 'black' : 'white'} style={{ radius: 6, justify: 'end' }}>
          <Text fontWeight={700} inherit>{name}</Text>
        </Box>
      ))}
    </Row>
  );
}`,
      view: () => {
        const BASE = BASE_THEME.colors.teal[6];
        const MIXES = [
          ['alpha 0.25', alpha(BASE, 0.25)],
          ['base', BASE],
          ['shade 0.3', shade(BASE, 0.3)],
          ['shade -0.5', shade(BASE, -0.5)],
        ];
        return (
          <Row gap="sm">
            {MIXES.map(([name, color]) => (
              <Box w={130} h={60} p="xs" bg={color} fg={isLight(color) ? 'black' : 'white'} style={{ radius: 6, justify: 'end' }}>
                <Text fontWeight={700} inherit>
                  {name}
                </Text>
              </Box>
            ))}
          </Row>
        );
      },
      height: 100,
    },
  ],
};
