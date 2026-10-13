// Marquee: content scrolling past in a loop.

import { Marquee, Badge, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'marquee',
  group: 'behavior',
  title: 'Marquee',
  description:
    'Content scrolling past in a loop, on rui-core’s Clock: horizontal or vertical, either way, held under the pointer (`holdOnHover`), its ends fading (`fade`); it holds still while the user asks for reduced motion. The same on every renderer. Its repeated copies are inert decoration: a control in the content is reached by Tab and read once, in the first copy.',
  props: [
    { name: 'duration', type: 'number', default: '20000', description: 'Milliseconds for one copy of the content to go by.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Which way it moves.' },
    { name: 'reverse', type: 'boolean', default: 'false', description: 'Moves right (or down) instead.' },
    { name: 'holdOnHover', type: 'boolean', default: 'false', description: 'Stops while the pointer is over it.' },
    { name: 'fade / fadeColor / fadeSize', type: 'boolean / string / number | string', default: "false / the page’s body color / 'xl'", description: 'At both ends the color eases out over `fadeSize` (a spacing step or pixels): solid at the edge, at `opacity.soft` half way, clear at the inner end.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'lg'", description: 'Space between the copies.' },
    { name: 'repeat', type: 'number', default: '2', description: 'How many copies of the content make the loop.' },
    { name: 'children', type: 'any', description: 'The content of one copy, in a row.' },
    { name: 'style props', type: 'w, h, …', description: 'As Box: bound it with `w` or `h`.' },
  ],
  demos: [
    {
      title: 'Horizontal, held on hover, with faded ends',
      code: `
function Demo() {
  return (
    <Stack gap="xs">
      <Marquee w={600} duration={8000} holdOnHover fade>
        <Badge>Platform 4</Badge>
        <Text size="sm" ml="xs">The 18:05 to the coast leaves on time</Text>
      </Marquee>
      <Marquee w={600} duration={8000} reverse gap="xl">
        <Badge color="teal">Platform 7</Badge>
        <Text size="sm" ml="xs">The night train is boarding now</Text>
      </Marquee>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          <Marquee w={600} duration={8000} holdOnHover fade>
            <Badge>Platform 4</Badge>
            <Text size="sm" ml="xs">
              The 18:05 to the coast leaves on time
            </Text>
          </Marquee>
          <Marquee w={600} duration={8000} reverse gap="xl">
            <Badge color="teal">Platform 7</Badge>
            <Text size="sm" ml="xs">
              The night train is boarding now
            </Text>
          </Marquee>
        </Stack>
      ),
      height: 80,
    },
    {
      title: 'Vertical',
      code: `
function Demo() {
  return (
    <Marquee orientation="vertical" h={100} w={300} duration={5000} gap="xs">
      <Stack gap="xs">
        <Text size="sm">Low tide at 06:12</Text>
        <Text size="sm">High tide at 12:30</Text>
      </Stack>
    </Marquee>
  );
}`,
      view: () => (
        <Marquee orientation="vertical" h={100} w={300} duration={5000} gap="xs">
          <Stack gap="xs">
            <Text size="sm">Low tide at 06:12</Text>
            <Text size="sm">High tide at 12:30</Text>
          </Stack>
        </Marquee>
      ),
      height: 120,
    },
  ],
};
