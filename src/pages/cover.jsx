// Cover: content laid over a picture that covers the box.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Cover, Badge, Button, Heading, Stack, Text } from 'rui-core';
import { landscape, sunset } from '../pictures.js';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'cover',
  group: 'data',
  title: 'Cover',
  description: 'A box whose picture covers it from edge to edge under its children, clipped to its radius. The picture is the portable Image, cropped to cover the box.',
  props: [
    { name: 'source', type: 'string', description: 'The picture under the content.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: '0', description: 'Corner radius the picture and content are clipped to.' },
    { name: 'children', type: 'any', description: 'The content over the picture.' },
    { name: 'w, h, p, m …', type: 'style props', description: 'Size, padding and margin, as on Box.' },
  ],
  demos: [
    {
      title: 'A trip header',
      code: `
// landscape: a small PNG data: URI (src/pictures.js)
function Demo() {
  return (
    <Cover source={landscape} radius="lg" h={180} p="lg">
      <Stack h="100%" gap={4} justify="end" align="start">
        <Text fg="white" size="xs" fontWeight={700}>5 DAYS · 3 STOPS</Text>
        <Heading level={3} fg="white">Along the river valley</Heading>
        <Text fg="white" size="sm">Leaves Friday, 07:40, from the north station</Text>
      </Stack>
    </Cover>
  );
}`,
      view: () => (
        <Cover source={landscape} radius="lg" h={180} p="lg">
          <Stack h="100%" gap={4} justify="end" align="start">
            <Text fg="white" size="xs" fontWeight={700}>
              5 DAYS · 3 STOPS
            </Text>
            <Heading level={3} fg="white">
              Along the river valley
            </Heading>
            <Text fg="white" size="sm">
              Leaves Friday, 07:40, from the north station
            </Text>
          </Stack>
        </Cover>
      ),
      height: 200,
    },
    {
      title: 'A hero with content',
      code: `
// sunset: a small PNG data: URI (src/pictures.js)
function Demo() {
  const going = $signal($active(), false);
  return (
    <Cover source={sunset} radius="lg" p="lg" h={200}>
      <Stack h="100%" gap="xs" justify="end" align="start">
        <Badge color="orange" variant="inverse">Sat 17 Oct · 19:00</Badge>
        <Heading level={3} fg="white">Open-air cinema on the hill</Heading>
        <Text fg="white" size="sm">Bring a blanket; the first film starts at dusk.</Text>
        <Button size="sm" color="orange" onPress={() => $write(going, true)}>
          {() => ($read(going) ? 'You are going' : 'Save a seat')}
        </Button>
      </Stack>
    </Cover>
  );
}`,
      view: () => {
        const going = $signal($active(), false);
        return (
          <Cover source={sunset} radius="lg" p="lg" h={200}>
            <Stack h="100%" gap="xs" justify="end" align="start">
              <Badge color="orange" variant="inverse">
                Sat 17 Oct · 19:00
              </Badge>
              <Heading level={3} fg="white">
                Open-air cinema on the hill
              </Heading>
              <Text fg="white" size="sm">
                Bring a blanket; the first film starts at dusk.
              </Text>
              <Button size="sm" color="orange" onPress={() => $write(going, true)}>
                {() => ($read(going) ? 'You are going' : 'Save a seat')}
              </Button>
            </Stack>
          </Cover>
        );
      },
      height: 220,
    },
  ],
};
