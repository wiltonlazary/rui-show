// Spacer: empty space.

import { Spacer, Row, Stack, Box, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'spacer',
  group: 'structure',
  title: 'Spacer',
  description: 'Empty space between items: `w` wide in a row, `h` high in a column, in theme spacing steps or pixels.',
  props: [
    { name: 'w', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", description: 'Width.' },
    { name: 'h', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", description: 'Height.' },
  ],
  demos: [
    {
      title: 'Horizontal and vertical',
      code: `
function Demo() {
  return (
    <Stack gap={0}>
      <Row gap={0}>
        <Box p="xs" bg="cyan.2"><Text>Start</Text></Box>
        <Spacer w="xl" />
        <Box p="xs" bg="cyan.2"><Text>End, xl away</Text></Box>
      </Row>
      <Spacer h="lg" />
      <Box p="xs" bg="cyan.4"><Text>Below, lg down</Text></Box>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap={0}>
          <Row gap={0}>
            <Box p="xs" bg="cyan.2">
              <Text>Start</Text>
            </Box>
            <Spacer w="xl" />
            <Box p="xs" bg="cyan.2">
              <Text>End, xl away</Text>
            </Box>
          </Row>
          <Spacer h="lg" />
          <Box p="xs" bg="cyan.4">
            <Text>Below, lg down</Text>
          </Box>
        </Stack>
      ),
      height: 150,
    },
  ],
};
