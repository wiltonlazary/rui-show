// Image: a picture filling its box, rounded, with a fallback.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Image, Stack, Text } from 'rui-core';
import { landscape, sunset, portraits } from '../pictures.js';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'image',
  group: 'data',
  title: 'Image',
  description: 'A picture that fills its box, clipped to its radius, with a fallback when the source is empty. It is ren-core’s portable Image: an `<img>` on the DOM, decoded and drawn by CanvasKit on Skia. `fit` places it in its box as CSS object-fit does, and a source that fails to load gives way to `fallback`.',
  props: [
    { name: 'source', type: 'string', description: 'The picture’s source (a URL; a data: URI works everywhere).' },
    { name: 'fallback', type: 'string', description: 'Shown when `source` is empty or fails to load.' },
    { name: 'fit', type: "'cover' | 'contain' | 'fill' | 'none'", default: "'cover'", description: 'How the picture fills its box (CSS object-fit).' },
    { name: 'onError', type: '(event) => void', description: 'Hears a source that failed to load.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: '0', description: 'Corner radius the picture is clipped to.' },
    { name: 'w', type: 'number | string', description: 'Width; the parent’s by default.' },
    { name: 'h', type: 'number | string', description: 'Height.' },
    { name: 'label', type: 'string', description: 'The picture’s accessible label.' },
  ],
  demos: [
    {
      title: 'A rounded and a square picture',
      code: `
// landscape, sunset: small PNG data: URIs (src/pictures.js)
function Demo() {
  return (
    <Row>
      <Image source={landscape} w={240} h={150} radius="md" label="A green valley" />
      <Image source={sunset} w={240} h={150} label="Hills at dusk" />
    </Row>
  );
}`,
      view: () => (
        <Row>
          <Image source={landscape} w={240} h={150} radius="md" label="A green valley" />
          <Image source={sunset} w={240} h={150} label="Hills at dusk" />
        </Row>
      ),
      height: 170,
    },
    {
      title: 'Radius',
      code: `
// portraits: small PNG data: URIs (src/pictures.js)
function Demo() {
  return (
    <Row align="end">
      {['xs', 'sm', 'md', 'lg', 'xl'].map(radius => (
        <Stack gap={4} align="center">
          <Image source={portraits[1]} w={80} h={80} radius={radius} />
          <Text size="xs" fg="quiet">{radius}</Text>
        </Stack>
      ))}
      <Stack gap={4} align="center">
        <Image source={portraits[2]} w={80} h={80} radius={40} />
        <Text size="xs" fg="quiet">40</Text>
      </Stack>
    </Row>
  );
}`,
      view: () => (
        <Row align="end">
          {['xs', 'sm', 'md', 'lg', 'xl'].map(radius => (
            <Stack gap={4} align="center">
              <Image source={portraits[1]} w={80} h={80} radius={radius} />
              <Text size="xs" fg="quiet">
                {radius}
              </Text>
            </Stack>
          ))}
          <Stack gap={4} align="center">
            <Image source={portraits[2]} w={80} h={80} radius={40} />
            <Text size="xs" fg="quiet">
              40
            </Text>
          </Stack>
        </Row>
      ),
      height: 120,
    },
    {
      title: 'Fallback',
      code: `
function Demo() {
  const src = $signal($active(), '');
  return (
    <Stack gap="sm" align="start">
      <Image source={() => $read(src)} fallback={sunset} w={200} h={120} radius="sm" />
      <Row gap="xs">
        <Button size="xs" variant="soft" onPress={() => $write(src, landscape)}>Load the picture</Button>
        <Button size="xs" variant="neutral" onPress={() => $write(src, '')}>Empty source</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => ($read(src) === '' ? 'source is empty: the fallback shows' : 'source is set')}</Text>
    </Stack>
  );
}`,
      view: () => {
        const src = $signal($active(), '');
        return (
          <Stack gap="sm" align="start">
            <Image source={() => $read(src)} fallback={sunset} w={200} h={120} radius="sm" />
            <Row gap="xs">
              <Button size="xs" variant="soft" onPress={() => $write(src, landscape)}>
                Load the picture
              </Button>
              <Button size="xs" variant="neutral" onPress={() => $write(src, '')}>
                Empty source
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {() => ($read(src) === '' ? 'source is empty: the fallback shows' : 'source is set')}
            </Text>
          </Stack>
        );
      },
      height: 215,
    },
    {
      title: 'Fit',
      code: `
function Demo() {
  return (
    <Row gap="md">
      {['cover', 'contain', 'fill', 'none'].map(fit => (
        <Stack gap={4} align="center">
          <Image source={landscape} fit={fit} w={130} h={130} radius="sm" bg="gray.2" />
          <Text size="xs" fg="quiet">{fit}</Text>
        </Stack>
      ))}
    </Row>
  );
}`,
      view: () => (
        <Row gap="md">
          {['cover', 'contain', 'fill', 'none'].map(fit => (
            <Stack gap={4} align="center">
              <Image source={landscape} fit={fit} w={130} h={130} radius="sm" bg="gray.2" />
              <Text size="xs" fg="quiet">
                {fit}
              </Text>
            </Stack>
          ))}
        </Row>
      ),
      height: 180,
    },
  ],
};
