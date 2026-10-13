// Center: content centered both ways.

import { Center, Box, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'center',
  group: 'structure',
  title: 'Center',
  description: 'Centers its content horizontally and vertically.',
  props: [
    { name: 'inline', type: 'boolean', default: 'false', description: 'Centers in a row rather than a column.' },
    { name: 'style props', type: 'm, p, w, h, bg, …', description: 'As Box.' },
  ],
  demos: [
    {
      title: 'Centered in a box',
      code: `
function Demo() {
  return (
    <Center h={110} bg="indigo.1">
      <Box p="sm" bg="indigo.6" fg="white" style={{ radius: 6 }}>
        <Text>All in the middle</Text>
      </Box>
    </Center>
  );
}`,
      view: () => (
        <Center h={110} bg="indigo.1">
          <Box p="sm" bg="indigo.6" fg="white" style={{ radius: 6 }}>
            <Text>All in the middle</Text>
          </Box>
        </Center>
      ),
      height: 150,
    },
  ],
};
