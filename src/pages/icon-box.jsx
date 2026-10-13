// IconBox: an icon on a colored square.

import { CheckIcon, CloseIcon, Row, Stack, Text, IconBox } from 'rui-core';

const VARIANTS = ['solid', 'soft', 'outline', 'neutral', 'ghost', 'plain', 'inverse'];
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'icon-box',
  group: 'data',
  title: 'IconBox',
  description: 'An icon, or a letter, centered on a square in a theme color and the button variants, in five sizes or any pixel size.',
  props: [
    { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'neutral' | 'ghost' | 'plain' | 'inverse' | 'gradient'", default: "'solid'", description: 'How the color is applied, or a gradient.' },
    { name: 'gradient', type: '{ colors, angle }', default: "theme.gradient (teal to indigo, 120°)", description: 'The colors of the `gradient` variant.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'A theme color name, `name.shade`, or hex.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Width and height: 20, 24, 32, 40 or 48 pixels, or a number.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius.' },
    { name: 'children', type: 'any', description: 'The icon (an icon component, a Shape) or a short text.' },
  ],
  demos: [
    {
      title: 'Variants',
      code: `
const VARIANTS = ['solid', 'soft', 'outline', 'neutral', 'ghost', 'plain', 'inverse'];

function Demo() {
  return (
    <Row>
      {VARIANTS.map(variant => (
        <IconBox variant={variant} size="lg">
          <CheckIcon size={18} color={variant === 'solid' ? 'white' : undefined} />
        </IconBox>
      ))}
    </Row>
  );
}`,
      view: () => (
        <Row>
          {VARIANTS.map(variant => (
            <IconBox variant={variant} size="lg">
              <CheckIcon size={18} color={variant === 'solid' ? 'white' : undefined} />
            </IconBox>
          ))}
        </Row>
      ),
      height: 60,
    },
    {
      title: 'Colors, sizes and radius',
      code: `
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

function Demo() {
  return (
    <Stack gap="md">
      <Row align="center">
        {SIZES.map(size => <IconBox size={size} color="teal">{size}</IconBox>)}
        <IconBox size={56} radius="xl" color="purple" variant="soft">56</IconBox>
      </Row>
      <Row>
        <IconBox color="red" radius="xl"><CloseIcon size={14} color="white" /></IconBox>
        <IconBox color="orange.4" radius={0}>A</IconBox>
        <IconBox color="#2f78c9" variant="outline">B</IconBox>
        <IconBox color="indigo" variant="soft" radius="md">C</IconBox>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <Row align="center">
            {SIZES.map(size => (
              <IconBox size={size} color="teal">
                {size}
              </IconBox>
            ))}
            <IconBox size={56} radius="xl" color="purple" variant="soft">
              56
            </IconBox>
          </Row>
          <Row>
            <IconBox color="red" radius="xl">
              <CloseIcon size={14} color="white" />
            </IconBox>
            <IconBox color="orange.4" radius={0}>
              A
            </IconBox>
            <IconBox color="#2f78c9" variant="outline">
              B
            </IconBox>
            <IconBox color="indigo" variant="soft" radius="md">
              C
            </IconBox>
          </Row>
        </Stack>
      ),
      height: 120,
    },
    {
      title: 'Gradient',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="sm" align="center">
        <IconBox variant="gradient" size="lg"><CheckIcon size={18} /></IconBox>
        <Text size="sm">Backups run nightly (the theme’s gradient)</Text>
      </Row>
      <Row gap="sm" align="center">
        <IconBox variant="gradient" size="lg" radius="xl" gradient={{ colors: ['lime', 'green'], angle: 200 }}><CheckIcon size={18} /></IconBox>
        <Text size="sm">Two-step sign-in is on</Text>
      </Row>
      <Row gap="sm" align="center">
        <IconBox variant="gradient" size="lg" gradient={{ colors: ['amber', 'red', 'magenta'], angle: 315 }}><CloseIcon size={18} /></IconBox>
        <Text size="sm">Two old sessions were signed out</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="sm" align="center">
            <IconBox variant="gradient" size="lg">
              <CheckIcon size={18} />
            </IconBox>
            <Text size="sm">Backups run nightly (the theme’s gradient)</Text>
          </Row>
          <Row gap="sm" align="center">
            <IconBox variant="gradient" size="lg" radius="xl" gradient={{ colors: ['lime', 'green'], angle: 200 }}>
              <CheckIcon size={18} />
            </IconBox>
            <Text size="sm">Two-step sign-in is on</Text>
          </Row>
          <Row gap="sm" align="center">
            <IconBox variant="gradient" size="lg" gradient={{ colors: ['amber', 'red', 'magenta'], angle: 315 }}>
              <CloseIcon size={18} />
            </IconBox>
            <Text size="sm">Two old sessions were signed out</Text>
          </Row>
        </Stack>
      ),
      height: 160,
    },
  ],
};
