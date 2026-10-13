// Box: the base component.

import { Box, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'box',
  group: 'structure',
  title: 'Box',
  description: 'The base of every layout component: a portable View that takes the style props and the portable style.',
  props: [
    { name: 'style props', type: 'm, p, w, h, minWidth, maxWidth, minHeight, maxHeight, bg, fg, fontSize, fontWeight, textAlign, textTransform, lineHeight, opacity, flex', description: 'Resolved on the theme: spacing steps or pixels, theme colors.' },
    { name: 'style', type: 'object | (() => object)', description: 'The portable style, over the style props.' },
    { name: 'onPress', type: '(event) => void', description: 'Pointer and key events pass to the View (`onPointerDown`, `onKey`, …).' },
    { name: 'label', type: 'string', description: 'The accessible name.' },
    { name: 'children', type: 'any', description: 'The content.' },
  ],
  demos: [
    {
      title: 'Style props',
      code: `
function Demo() {
  return (
    <Box p="md" bg="blue.1" fg="blue.9" style={{ radius: 8 }}>
      <Text>Box with padding, background and color from the theme</Text>
    </Box>
  );
}`,
      view: () => (
        <Box p="md" bg="blue.1" fg="blue.9" style={{ radius: 8 }}>
          <Text>Box with padding, background and color from the theme</Text>
        </Box>
      ),
      height: 100,
    },
    {
      title: 'Sizes and nesting',
      code: `
function Demo() {
  return (
    <Box w={320} p="sm" bg="purple.1" style={{ radius: 8, gap: 8 }}>
      <Box h={24} w="60%" bg="purple.4" style={{ radius: 4 }} />
      <Box h={24} w="85%" bg="purple.6" style={{ radius: 4 }} />
      <Box h={24} bg="purple.8" style={{ radius: 4 }} />
    </Box>
  );
}`,
      view: () => (
        <Box w={320} p="sm" bg="purple.1" style={{ radius: 8, gap: 8 }}>
          <Box h={24} w="60%" bg="purple.4" style={{ radius: 4 }} />
          <Box h={24} w="85%" bg="purple.6" style={{ radius: 4 }} />
          <Box h={24} bg="purple.8" style={{ radius: 4 }} />
        </Box>
      ),
      height: 150,
    },
  ],
};
