// Badge: a small mark shown in upper case, in variants, theme colors and sizes.

import { Badge, Row, Stack, Swatch, Text } from 'rui-core';

const VARIANTS = ['solid', 'soft', 'outline', 'dot', 'neutral', 'ghost', 'plain', 'inverse'];
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const COLORS = ['indigo', 'teal', 'amber', 'magenta', 'red', 'gray'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'badge',
  group: 'data',
  title: 'Badge',
  description: 'A small mark whose text shows in upper case (the portable `textTransform`: its data, the Data switch, keeps the text as written), in its variants (a `dot` variant too), theme colors and sizes, with `start` and `end` content.',
  props: [
    { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'dot' | 'neutral' | 'ghost' | 'plain' | 'inverse' | 'gradient'", default: "'solid'", description: 'How the color is applied; `dot` puts a colored dot before the text on the page color; `gradient` fills it with `gradient`.' },
    { name: 'gradient', type: '{ colors, angle }', default: "theme.gradient (teal to indigo, 120°)", description: 'The colors of the `gradient` variant.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'A theme color name, `name.shade`, or hex.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Height (18, 20, 22, 26 or 30 px), font size and side padding.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: 'Corner radius: a scale step or pixels (a tag by default, not a pill).' },
    { name: 'round', type: 'boolean', default: 'false', description: 'As wide as high, for a number or a letter.' },
    { name: 'stretch', type: 'boolean', default: 'false', description: 'Takes the full width of its parent.' },
    { name: 'start', type: 'any', description: 'Content before the text.' },
    { name: 'end', type: 'any', description: 'Content after the text.' },
    { name: 'children', type: 'string | number | (() => string)', description: 'The text, shown upper case and kept as written; other content passes as it is (in upper case too).' },
  ],
  demos: [
    {
      title: 'Variants',
      code: `
const VARIANTS = ['solid', 'soft', 'outline', 'dot', 'neutral', 'ghost', 'plain', 'inverse'];

function Demo() {
  return (
    <Row gap="xs">
      {VARIANTS.map(variant => <Badge variant={variant}>{variant}</Badge>)}
    </Row>
  );
}`,
      view: () => (
        <Row gap="xs">
          {VARIANTS.map(variant => (
            <Badge variant={variant}>{variant}</Badge>
          ))}
        </Row>
      ),
      height: 50,
    },
    {
      title: 'Colors and sizes',
      code: `
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const COLORS = ['indigo', 'teal', 'amber', 'magenta', 'red', 'gray'];

function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="xs">{COLORS.map(color => <Badge color={color} variant="soft">{color}</Badge>)}</Row>
      <Row gap="xs">{COLORS.map(color => <Badge color={color} variant="dot">{color}</Badge>)}</Row>
      <Row gap="xs" align="center">{SIZES.map(size => <Badge size={size}>{\`size \${size}\`}</Badge>)}</Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="xs">
            {COLORS.map(color => (
              <Badge color={color} variant="soft">
                {color}
              </Badge>
            ))}
          </Row>
          <Row gap="xs">
            {COLORS.map(color => (
              <Badge color={color} variant="dot">
                {color}
              </Badge>
            ))}
          </Row>
          <Row gap="xs" align="center">
            {SIZES.map(size => (
              <Badge size={size}>{`size ${size}`}</Badge>
            ))}
          </Row>
        </Stack>
      ),
      height: 120,
    },
    {
      title: 'Round, radius, start and end, stretch: labels on an issue',
      code: `
function Demo() {
  return (
    <Stack gap="sm" w={420}>
      <Row gap="xs" align="center">
        <Badge round size="lg" variant="outline" color="red">3</Badge>
        <Text size="sm">Checkout fails on the second retry</Text>
      </Row>
      <Row gap="xs" align="center">
        <Badge radius="xs" variant="outline" color="gray">v2.4</Badge>
        <Badge radius="xl" variant="soft" color="orange">needs triage</Badge>
        <Badge variant="neutral" start={<Swatch color="#b5523b" size={10} radius="xs" />}>area: payments</Badge>
        <Badge variant="soft" color="indigo" end={<Badge size="xs" round variant="solid" color="indigo">12</Badge>}>replies</Badge>
        <Badge round size="sm" color="green">B</Badge>
      </Row>
      <Badge stretch variant="soft" color="amber">Frozen until 2.4 ships</Badge>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm" w={420}>
          <Row gap="xs" align="center">
            <Badge round size="lg" variant="outline" color="red">
              3
            </Badge>
            <Text size="sm">Checkout fails on the second retry</Text>
          </Row>
          <Row gap="xs" align="center">
            <Badge radius="xs" variant="outline" color="gray">
              v2.4
            </Badge>
            <Badge radius="xl" variant="soft" color="orange">
              needs triage
            </Badge>
            <Badge variant="neutral" start={<Swatch color="#b5523b" size={10} radius="xs" />}>
              area: payments
            </Badge>
            <Badge
              variant="soft"
              color="indigo"
              end={
                <Badge size="xs" round variant="solid" color="indigo">
                  12
                </Badge>
              }
            >
              replies
            </Badge>
            <Badge round size="sm" color="green">
              B
            </Badge>
          </Row>
          <Badge stretch variant="soft" color="amber">
            Frozen until 2.4 ships
          </Badge>
        </Stack>
      ),
      height: 130,
    },
    {
      title: 'Gradient',
      code: `
function Demo() {
  return (
    <Row gap="sm">
      <Badge variant="gradient">Theme gradient</Badge>
      <Badge variant="gradient" gradient={{ colors: ['amber', 'magenta'], angle: 60 }} size="lg">Amber to magenta</Badge>
      <Badge variant="gradient" gradient={{ colors: ['cyan', 'violet'], angle: 0 }} size="xl">Cyan to violet</Badge>
    </Row>
  );
}`,
      view: () => (
        <Row gap="sm">
          <Badge variant="gradient">Theme gradient</Badge>
          <Badge variant="gradient" gradient={{ colors: ['amber', 'magenta'], angle: 60 }} size="lg">
            Amber to magenta
          </Badge>
          <Badge variant="gradient" gradient={{ colors: ['cyan', 'violet'], angle: 0 }} size="xl">
            Cyan to violet
          </Badge>
        </Row>
      ),
      height: 80,
    },
  ],
};
