// Surface: a surface.

import { Surface, Row, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'surface',
  group: 'structure',
  title: 'Surface',
  description: 'A surface in the page’s colors, with a radius, an optional border and a theme shadow; it follows the color scheme.',
  props: [
    { name: 'shadow', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", description: 'A theme shadow.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius.' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'A border in the scheme’s border color.' },
    { name: 'style props', type: 'm, p, w, h, bg, fg, …', description: 'As Box.' },
  ],
  demos: [
    {
      title: 'Shadows, radius and border',
      code: `
function Demo() {
  return (
    <Row gap="lg" p="xs">
      <Surface shadow="xs" p="md"><Text>shadow xs</Text></Surface>
      <Surface shadow="md" radius="md" p="md"><Text>shadow md</Text></Surface>
      <Surface shadow="xl" radius="lg" p="md"><Text>shadow xl</Text></Surface>
      <Surface bordered radius="md" p="md"><Text>bordered</Text></Surface>
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg" p="xs">
          <Surface shadow="xs" p="md">
            <Text>shadow xs</Text>
          </Surface>
          <Surface shadow="md" radius="md" p="md">
            <Text>shadow md</Text>
          </Surface>
          <Surface shadow="xl" radius="lg" p="md">
            <Text>shadow xl</Text>
          </Surface>
          <Surface bordered radius="md" p="md">
            <Text>bordered</Text>
          </Surface>
        </Row>
      ),
      height: 130,
    },
  ],
};
