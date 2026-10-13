// Container: content at a readable width.

import { Container, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'container',
  group: 'structure',
  title: 'Container',
  description: 'Centers content at a readable width: the theme’s container sizes, a number of pixels, or the full width with `fluid`.',
  props: [
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The maximum width: 576, 736, 944, 1152 or 1344 pixels, or a number.' },
    { name: 'fluid', type: 'boolean', default: 'false', description: 'Takes the full width.' },
    { name: 'style props', type: 'm, p, w, h, bg, …', description: 'As Box.' },
  ],
  demos: [
    {
      title: 'Sizes',
      code: `
function Demo() {
  return (
    <Stack gap="xs">
      <Container size={260} bg="blue.1" py="xs"><Text>size 260</Text></Container>
      <Container size={420} bg="blue.2" py="xs"><Text>size 420</Text></Container>
      <Container fluid bg="blue.3" py="xs"><Text>fluid</Text></Container>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          <Container size={260} bg="blue.1" py="xs">
            <Text>size 260</Text>
          </Container>
          <Container size={420} bg="blue.2" py="xs">
            <Text>size 420</Text>
          </Container>
          <Container fluid bg="blue.3" py="xs">
            <Text>fluid</Text>
          </Container>
        </Stack>
      ),
      height: 170,
    },
  ],
};
