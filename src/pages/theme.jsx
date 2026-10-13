// Theming: the theme object, themeOf and Rui.

import { Rui, themeOf, Surface, Row, Stack, Button, TextInput, Text, Box, BASE_THEME } from 'rui-core';

const purple = themeOf({ accent: 'purple', corner: 'xl' });
const roomy = themeOf({ sizes: { control: { sm: 36, md: 44 } } });
const SIZES = /** @type {const} */ (['xs', 'sm', 'md', 'lg', 'xl']);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'theme',
  group: 'foundations',
  title: 'Theme',
  description: 'BASE_THEME is the default theme: palette, accent color and shade, spacing, radius and corner, font sizes, line heights, breakpoints, shadows, headings, the style tokens every component’s numbers read (opacity, weights, ratios, control, chart), and every component size by step (sizes). themeOf merges overrides over it; Rui provides a theme and a color scheme, each a value or a signal, and every component inside restyles in place when they change.',
  props: [
    { name: 'theme', type: 'RuiThemeValue | Signal | (() => RuiThemeValue)', default: 'BASE_THEME', description: 'The theme for everything inside.' },
    { name: 'scheme', type: "'light' | 'dark' | Signal | (() => 'light' | 'dark')", default: "'light'", description: 'The color scheme for everything inside.' },
    { name: 'children', type: 'any', description: 'What the theme applies to.' },
    { name: 'themeOf(overrides, base?)', type: 'RuiThemeValue', default: 'base: BASE_THEME', description: 'A theme from overrides over a base: objects merge deeply; arrays (a color’s shades, the heading levels) replace. The overrides are typed as a deep partial, so any part at any depth may be given alone. The theme’s tables have no prototype (read them with `Object.hasOwn` or `in`); `extra` keeps its own.' },
    { name: 'BASE_THEME.accent', type: 'string', default: "'indigo'", description: 'The color components take by default: a key of `colors`.' },
    { name: 'BASE_THEME.accentShade', type: '{ light: number, dark: number }', default: '{ light: 6, dark: 6 }', description: 'The shade solid variants use; shade 6 takes white text at WCAG AA in both schemes.' },
    { name: 'BASE_THEME.corner', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md' (10 px)", description: 'The radius components take by default.' },
    { name: 'BASE_THEME.contrast', type: 'boolean', default: 'false', description: 'Solid fills past contrastThreshold take black text; off, solid text is white (checks and dots always follow the threshold).' },
    { name: 'BASE_THEME.contrastThreshold', type: 'number', default: '0.179', description: 'The luminance past which a solid background takes black text (with `contrast`): where black and white text have equal contrast.' },
    { name: 'BASE_THEME.gradient', type: '{ colors, angle }', default: "{ colors: ['teal', 'indigo'], angle: 120 }", description: 'The gradient variant’s default.' },
    { name: 'BASE_THEME.spacing', type: 'Record<Size, number>', default: '8 / 12 / 16 / 24 / 32', description: 'The spacing steps xs to xl, in pixels.' },
    { name: 'BASE_THEME.radius', type: "Record<Size | 'round', number>", default: '3 / 6 / 10 / 14 / 24; round 9999', description: 'The radius steps xs to xl, in pixels, and `round` for a pill or a circle.' },
    { name: 'BASE_THEME.lineHeights', type: "Record<Size | 'code', number>", default: '1.3 / 1.4 / 1.5 / 1.55 / 1.6; code 1.65', description: 'The leading of each font size step, as a multiple of the size, and `code`, the leading of code blocks.' },
    { name: 'BASE_THEME.headings', type: '{ weight, levels: { size, leading }[] }', default: '700; 36 / 29 / 23 / 19 / 17 / 15 px', description: 'The headings’ weight, and each level’s size and leading (1.15 at level 1 to 1.4 at level 6), level 1 first.' },
    { name: 'BASE_THEME.opacity', type: '{ faint, soft, disabled, muted, dense }', default: '.16 / .3 / .45 / .7 / .88', description: 'A faint tint or dimmed series; a soft wash (a highlight, a quiet fill); a disabled control; a muted (resting, secondary) part; a dense fill that still lets the grid through.' },
    { name: 'BASE_THEME.weights', type: '{ regular, strong, bold }', default: '400 / 600 / 700', description: 'Body text; labels and emphasis (field and menu labels, tab and step titles); headings and marks.' },
    { name: 'BASE_THEME.ratios', type: '{ glyph, mark, inset, icon, pad }', default: '.42 / .3 / .3 / .62 / .75', description: 'Parts sized by their box, as shares of its height: a letter in its box, a dot on a badge or field, a field’s text inset from its start, an icon in a square control; and `pad`, a compact part’s side padding as a share of its font size.' },
    { name: 'BASE_THEME.control', type: '{ labelGap, panelPad, optionPad, iconGap, textStep, pad, densePad, density }', default: '6 / 6 / [6, 12] / 8 / 1; pad 10 / 12 / 16 / 20 / 24; densePad 5 / 6 / 8 / 10 / 12; density tight [4, 8], even [8, 12], airy [12, 16]', description: 'A field’s gap to its label and notes, a panel’s inner padding, an option’s padding (y, x), the gap between an icon and its text, how many type steps a control’s notes sit below its text, a button’s side padding by size (`pad`) and a compact one’s (`densePad`), and a table cell’s padding (y, x) by density.' },
    { name: 'BASE_THEME.chart', type: '{ pointArea, axisWidth, band, bandGap, labelOffset, outer, inner, dim, pointLabel, reference, frame, tick, charWidth, near, line, legend }', default: "48 / 56 / .72 / 6 / 6 / .84 / .16 / .16 / 'xs' / 'orange' / { top 10, right 20 } / 6 / 7 / 24 / 16 / 32", description: 'A point’s area (px²), a value axis’s width, a bar’s share of its band and the least gap between bars, a label’s offset from its mark, a radial chart’s outer and inner radius, the opacity of the series not highlighted, the point labels’ size and the reference lines’ color.' },
    { name: 'BASE_THEME.sizes', type: 'RuiSizes', default: 'control 24 / 30 / 36 / 44 / 52, …', description: 'Every component size by step: `control`, `dense`, `day`, `time`, `icon`, `closeIcon`, `iconBox`, `avatar`, `badge`, `tag`, `chip`, `check`, `swatch`, `colorThumb`, `picker`, `track`, `thumb`, `rating`, `progress`, `loader`, `empty`, `step`, `pagination`, `toggle`, `divider`, `indicator`, `modal`, `dialog`, `drawer` (360), `container`, `glyph` and `box`. A theme that overrides one changes the components that read it.' },
    { name: 'BASE_THEME.sizes.glyph', type: 'Record<Size, number>', default: '12 / 14 / 16 / 20 / 24', description: 'An inline icon’s side: a chevron, check or mark in a row or control.' },
    { name: 'BASE_THEME.sizes.box', type: 'RuiBoxes', default: 'ring 112, arc 180, pie 180, donut 24, funnel 260, chart 300, spark 60, clock 200, qr 160, knob 64, swatch 24, panel 280, menu 160, tip 250, follow 12, empty 420, reveal 120, table 300, snippet 240, toast 360, window [320, 240], windowMin [160, 80], launcher { offset 96, list 360 }, launcherWidth 640, modalTop 64, select 200, at [20, 20], arrow { size 6, offset 6 }, stripe 12, stage 200, parallax 300, pane 200, book [240, 320], tableCheck 44, tableRow 36, windowTitle 36, carouselButton 32, gantt { day 32, row 36, label 160, header 40 }, onboarding { card 280, room 180, center 60 }, bubble { label 24 }', description: 'Components’ default boxes, in pixels, where a component’s own `size`, `height` or `width` is not set: Ring’s side, Arc’s width, Pie’s side and Donut’s ring thickness, Funnel’s width, a chart’s and a Sparkline’s height, AnalogClock’s, QrCode’s, AngleSlider’s and Swatch’s sides, a combobox panel’s height, a Menu’s least width, a wrapping Tooltip’s width and Tooltip.Follow’s offset, an Empty state’s text width, Excerpt’s folded height, DataTable’s measuring height, a folded Snippet’s height, a notification’s width, a Window’s size and least size, and the Launcher’s offset and list height.' },
    { name: 'fontBelow(theme, size, steps?)', type: 'number', default: 'steps: control.textStep (1)', description: 'The font size that many steps below `size` (a step name or pixels) on the type scale, the smallest at the bottom.' },
    { name: 'LAYERS', type: 'Record<string, number>', default: 'raised 10, sheet 20, float 30, tip 35, toast 40, top 50', description: 'The stacking layers a `layer` prop takes: a sheet (Modal) under the panels it opens, a tooltip above any panel, toasts and the load bar above all.' },
    { name: 'TINTS', type: '{ light, dark }', default: 'rest .14 / .22, hover .22 / .30, wash .08 / .12', description: 'The alphas the soft, ghost and outline variants share (light / dark).' },
  ],
  demos: [
    {
      title: 'A nested theme',
      code: `
const purple = themeOf({ accent: 'purple', corner: 'xl' });

function Demo() {
  return (
    <Row gap="md">
      <Button>The page's accent color</Button>
      <Rui theme={purple}>
        <Button>Purple, round</Button>
        <Button variant="soft">Soft purple</Button>
      </Rui>
    </Row>
  );
}`,
      view: () => (
        <Row gap="md">
          <Button>The page's accent color</Button>
          <Rui theme={purple}>
            <Button>Purple, round</Button>
            <Button variant="soft">Soft purple</Button>
          </Rui>
        </Row>
      ),
      height: 100,
    },
    {
      title: 'A dark subtree',
      code: `
function Demo() {
  return (
    <Rui theme={BASE_THEME} scheme="dark">
      <Surface p="md" radius="md" bordered>
        <Stack gap="xs">
          <Text>Always dark, whatever the page's scheme</Text>
          <Text fg="quiet" size="sm">Quiet text and borders follow the scheme</Text>
          <Row gap="xs"><Button>Solid</Button><Button variant="neutral">Neutral</Button></Row>
        </Stack>
      </Surface>
    </Rui>
  );
}`,
      view: () => (
        <Rui theme={BASE_THEME} scheme="dark">
          <Surface p="md" radius="md" bordered>
            <Stack gap="xs">
              <Text>Always dark, whatever the page's scheme</Text>
              <Text fg="quiet" size="sm">
                Quiet text and borders follow the scheme
              </Text>
              <Row gap="xs">
                <Button>Solid</Button>
                <Button variant="neutral">Neutral</Button>
              </Row>
            </Stack>
          </Surface>
        </Rui>
      ),
      height: 170,
    },
    {
      title: 'Sizes in the theme',
      code: `
const roomy = themeOf({ sizes: { control: { sm: 36, md: 44 } } });

function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="sm">
        <Button size="sm">Small, 30 px</Button>
        <Button>Medium, 36 px</Button>
      </Row>
      <Rui theme={roomy}>
        <Row gap="sm">
          <Button size="sm">Small, 36 px</Button>
          <Button>Medium, 44 px</Button>
          <TextInput placeholder="A field as tall" w={200} />
        </Row>
      </Rui>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="sm">
            <Button size="sm">Small, 30 px</Button>
            <Button>Medium, 36 px</Button>
          </Row>
          <Rui theme={roomy}>
            <Row gap="sm">
              <Button size="sm">Small, 36 px</Button>
              <Button>Medium, 44 px</Button>
              <TextInput placeholder="A field as tall" w={200} />
            </Row>
          </Rui>
        </Stack>
      ),
      height: 120,
    },
    {
      title: 'The spacing scale',
      code: `
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

function Demo() {
  return (
    <Stack gap={6}>
      {SIZES.map(size => (
        <Row gap="sm" wrap={false}>
          <Text w={120} size="sm">{\`\${size}: \${BASE_THEME.spacing[size]}px\`}</Text>
          <Box w={BASE_THEME.spacing[size] * 8} h={14} bg="blue" style={{ radius: 3 }} />
        </Row>
      ))}
    </Stack>
  );
}`,
      view: () => (
        <Stack gap={6}>
          {SIZES.map(size => (
            <Row gap="sm" wrap={false}>
              <Text w={120} size="sm">{`${size}: ${BASE_THEME.spacing[size]}px`}</Text>
              <Box w={BASE_THEME.spacing[size] * 8} h={14} bg="blue" style={{ radius: 3 }} />
            </Row>
          ))}
        </Stack>
      ),
      height: 170,
    },
  ],
};
