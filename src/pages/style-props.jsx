// Style props: shorthand props on every component.

import { Box, Row, Text, Surface } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'style-props',
  group: 'foundations',
  title: 'Style props',
  description: 'Every component takes the style props, resolved on the theme into the portable style: spacing steps or pixels, theme colors, sizes. The `style` prop (an object or an accessor) goes over them.',
  props: [
    { name: 'm, mx, my, mt, mr, mb, ml', type: "'xs' … 'xl' | number", description: 'Margins.' },
    { name: 'p, px, py, pt, pr, pb, pl', type: "'xs' … 'xl' | number", description: 'Paddings.' },
    { name: 'w, h, minWidth, maxWidth, minHeight, maxHeight', type: "number | '50%'", description: 'Width, height and their bounds.' },
    { name: 'bg', type: 'string', description: 'Background: a theme color, `name.shade` or hex.' },
    { name: 'fg', type: "string | 'quiet'", description: 'Text color: a theme color, or `quiet` for the page’s muted text.' },
    { name: 'fontSize, fontWeight, textAlign, textTransform, lineHeight', type: "'xs' … 'xl' | number, weight, alignment, case, line height", description: 'Text.' },
    { name: 'opacity, flex', type: 'number', description: 'Opacity, and the share of free space (`grow`).' },
    { name: 'style', type: 'object | (() => object)', description: 'The portable style, last.' },
  ],
  demos: [
    {
      title: 'Spacing, sizes and colors',
      code: `
function Demo() {
  return (
    <Row gap={0} align="start">
      <Box m="md" p="xl" bg="orange.1" fg="orange.9"><Text inherit>m md, p xl</Text></Box>
      <Box mt="xl" px="lg" py="xs" w={180} bg="lime.2"><Text>mt xl, w 180</Text></Box>
      <Surface ml="sm" p="sm" opacity={0.6} bordered><Text fontWeight={700} fontSize="lg">opacity 0.6</Text></Surface>
    </Row>
  );
}`,
      view: () => (
        <Row gap={0} align="start">
          <Box m="md" p="xl" bg="orange.1" fg="orange.9">
            <Text inherit>m md, p xl</Text>
          </Box>
          <Box mt="xl" px="lg" py="xs" w={180} bg="lime.2">
            <Text>mt xl, w 180</Text>
          </Box>
          <Surface ml="sm" p="sm" opacity={0.6} bordered>
            <Text fontWeight={700} fontSize="lg">
              opacity 0.6
            </Text>
          </Surface>
        </Row>
      ),
      height: 150,
    },
  ],
};
