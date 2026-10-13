// Skeleton: a product tile loading, and the real tile it stands for.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $timeout } from 'rui-core/hooks';
import { AspectRatio, Badge, Button, Image, Row, Skeleton, Stack, Surface, Text } from 'rui-core';
import { landscape } from '../pictures.js';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'skeleton',
  group: 'status',
  title: 'Skeleton',
  description: 'A placeholder in the page’s track color that pulses while content loads (on rui-core’s Clock, the same frames on every renderer). Over children it keeps their room and hides them; `loading={false}` shows them.',
  props: [
    { name: 'height', type: 'number | string', description: 'Its height, in pixels or a percent; without it, its children’s.' },
    { name: 'width', type: 'number | string', default: "'100%'", description: 'Its width, in pixels or a percent.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius: a scale step or pixels.' },
    { name: 'round', type: 'boolean', default: 'false', description: 'As wide as high, and round.' },
    { name: 'pulse', type: 'boolean', default: 'true', description: 'The pulse: its opacity breathes from `opacity.disabled` (.45) to `opacity.dense` (.88) and back over four calm motions (1.2 s).' },
    { name: 'loading', type: 'boolean | (() => boolean)', default: 'true', description: 'While true it covers (and is `aria-hidden`); false shows the children and stops the pulse.' },
    { name: 'children', type: 'any', description: 'The content it stands for: laid out, painted transparent while it shows.' },
  ],
  demos: [
    {
      title: 'A product tile loading',
      code: `
function Demo() {
  return (
    <Surface bordered p="sm" w={220}>
      <Stack gap="sm">
        <AspectRatio ratio={4 / 3}>
          <Skeleton height="100%" />
        </AspectRatio>
        <Skeleton height={14} width="70%" radius="sm" />
        <Skeleton height={22} width={64} radius="xl" />
      </Stack>
    </Surface>
  );
}`,
      view: () => (
        <Surface bordered p="sm" w={220}>
          <Stack gap="sm">
            <AspectRatio ratio={4 / 3}>
              <Skeleton height="100%" />
            </AspectRatio>
            <Skeleton height={14} width="70%" radius="sm" />
            <Skeleton height={22} width={64} radius="xl" />
          </Stack>
        </Surface>
      ),
      height: 250,
    },
    {
      title: 'Load: the real tile after a fetch',
      code: `
// landscape: a small PNG data: URI (src/pictures.js)
function Demo() {
  const loaded = $signal($active(), false);
  // A fetch that takes 1.2 s, simulated.
  const request = $timeout(() => $write(loaded, true), 1200);
  const load = () => ($write(loaded, false), request.start());
  const waiting = () => !$read(loaded);
  return (
    <Stack gap="sm">
      <Row gap="sm" align="center">
        <Button size="xs" onPress={load}>Load</Button>
        <Text size="sm" fg="quiet">{() => ($read(request.value) ? 'fetching…' : $read(loaded) ? 'loaded' : 'not loaded yet')}</Text>
      </Row>
      <Surface bordered p="sm" w={220}>
        <Stack gap="sm">
          <Skeleton loading={waiting}>
            <AspectRatio ratio={4 / 3}>
              <Image source={landscape} h="100%" label="A ridge tent pitched by a lake" />
            </AspectRatio>
          </Skeleton>
          <Skeleton loading={waiting} width="70%" radius="sm">
            <Text size="sm" fontWeight={600}>Two-person ridge tent</Text>
          </Skeleton>
          <Skeleton loading={waiting} width={64} radius="xl">
            <Badge variant="soft" color="teal">€ 189</Badge>
          </Skeleton>
        </Stack>
      </Surface>
    </Stack>
  );
}`,
      view: () => {
        const loaded = $signal($active(), false);
        const request = $timeout(() => $write(loaded, true), 1200);
        const load = () => ($write(loaded, false), request.start());
        const waiting = () => !$read(loaded);
        return (
          <Stack gap="sm">
            <Row gap="sm" align="center">
              <Button size="xs" onPress={load}>
                Load
              </Button>
              <Text size="sm" fg="quiet">
                {() => ($read(request.value) ? 'fetching…' : $read(loaded) ? 'loaded' : 'not loaded yet')}
              </Text>
            </Row>
            <Surface bordered p="sm" w={220}>
              <Stack gap="sm">
                <Skeleton loading={waiting}>
                  <AspectRatio ratio={4 / 3}>
                    <Image source={landscape} h="100%" label="A ridge tent pitched by a lake" />
                  </AspectRatio>
                </Skeleton>
                <Skeleton loading={waiting} width="70%" radius="sm">
                  <Text size="sm" fontWeight={600}>
                    Two-person ridge tent
                  </Text>
                </Skeleton>
                <Skeleton loading={waiting} width={64} radius="xl">
                  <Badge variant="soft" color="teal">
                    € 189
                  </Badge>
                </Skeleton>
              </Stack>
            </Surface>
          </Stack>
        );
      },
      height: 300,
    },
  ],
};
