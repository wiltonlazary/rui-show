// Card: a frame; Card.Media spans its top, the body is padded below and Card.Rule draws a line across.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Badge, Button, Card, Row, Image, Stack, Tiles, Text } from 'rui-core';
import { landscape, sunset } from '../pictures.js';

const USAGE = [
  ['Photos', '12.4 GB'],
  ['Mail', '3.1 GB'],
  ['Backups', '41.0 GB'],
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'card',
  group: 'data',
  title: 'Card',
  description: 'A frame with radius, shadow and an optional border (`bordered`): every `Card.Media` part spans the card’s top, in the order written (one written at the foot moves up there too), and the rest sits in a padded body below, where a `Card.Rule` draws a line across the whole card between its content.',
  props: [
    { name: 'padding', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The body’s padding, below the media; `Card.Rule` takes it back at the sides to reach the edges.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "theme.corner ('md', 10 px)", description: 'Corner radius.' },
    { name: 'shadow', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: 'A theme shadow.' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'A 1 px edge in the page’s rule color (dividers and card edges).' },
    { name: 'Card.Media', type: 'part', description: 'A full-width band for a picture or a color across the card’s top, wherever it is written; several stack in order and the first takes the card’s top corners. No padding of its own.' },
    { name: 'Card.Rule color', type: 'color', default: 'the page’s rule color', description: 'A hairline across the card from edge to edge, set apart from the content above and below by the card’s padding.' },
    { name: 'w, h, p, m …', type: 'style props', description: 'Size and spacing, as on Box.' },
  ],
  demos: [
    {
      title: 'An event ticket',
      code: `
// sunset: a small PNG data: URI (src/pictures.js)
function Demo() {
  const saved = $signal($active(), false);
  return (
    <Card bordered shadow="sm" w={300}>
      <Card.Media>
        <Image source={sunset} h={96} label="Evening light over the harbor" />
      </Card.Media>
      <Text size="xs" fg="indigo" fontWeight={600}>Fri 14 Nov, 20:30</Text>
      <Text size="lg" fontWeight="bold">Harbor Lights Quartet</Text>
      <Row gap="xs" mt="xs">
        <Badge variant="soft" color="indigo">Row F</Badge>
        <Badge variant="soft" color="amber">Seat 12</Badge>
      </Row>
      <Card.Rule />
      <Row justify="between" align="center">
        <Text size="sm" fg="quiet">Admits one</Text>
        <Button variant="soft" size="xs" onPress={() => $write(saved, !$read(saved))}>
          {() => ($read(saved) ? 'In your wallet' : 'Add to wallet')}
        </Button>
      </Row>
    </Card>
  );
}`,
      view: () => {
        const saved = $signal($active(), false);
        return (
          <Card bordered shadow="sm" w={300}>
            <Card.Media>
              <Image source={sunset} h={96} label="Evening light over the harbor" />
            </Card.Media>
            <Text size="xs" fg="indigo" fontWeight={600}>
              Fri 14 Nov, 20:30
            </Text>
            <Text size="lg" fontWeight="bold">
              Harbor Lights Quartet
            </Text>
            <Row gap="xs" mt="xs">
              <Badge variant="soft" color="indigo">
                Row F
              </Badge>
              <Badge variant="soft" color="amber">
                Seat 12
              </Badge>
            </Row>
            <Card.Rule />
            <Row justify="between" align="center">
              <Text size="sm" fg="quiet">
                Admits one
              </Text>
              <Button variant="soft" size="xs" onPress={() => $write(saved, !$read(saved))}>
                {() => ($read(saved) ? 'In your wallet' : 'Add to wallet')}
              </Button>
            </Row>
          </Card>
        );
      },
      height: 290,
    },
    {
      title: 'Ruled rows and a picture on top',
      code: `
// landscape: a small PNG data: URI (src/pictures.js)
const USAGE = [['Photos', '12.4 GB'], ['Mail', '3.1 GB'], ['Backups', '41.0 GB']];

function Demo() {
  return (
    <Tiles columns={2}>
      <Card bordered padding="sm">
        <Text size="sm" fontWeight="bold">Storage</Text>
        {USAGE.map(([name, used]) => [
          <Card.Rule />,
          <Row justify="between">
            <Text size="sm">{name}</Text>
            <Text size="sm" fg="quiet">{used}</Text>
          </Row>,
        ])}
      </Card>
      <Card padding="xl" shadow="lg">
        <Card.Media>
          <Image source={landscape} h={64} />
        </Card.Media>
        <Stack gap={4}>
          <Text fontWeight="bold">padding xl, shadow lg</Text>
          <Text size="sm" fg="quiet">The media spans the top; the body is padded below.</Text>
        </Stack>
      </Card>
    </Tiles>
  );
}`,
      view: () => (
        <Tiles columns={2}>
          <Card bordered padding="sm">
            <Text size="sm" fontWeight="bold">
              Storage
            </Text>
            {USAGE.map(([name, used]) => [
              <Card.Rule />,
              <Row justify="between">
                <Text size="sm">{name}</Text>
                <Text size="sm" fg="quiet">
                  {used}
                </Text>
              </Row>,
            ])}
          </Card>
          <Card padding="xl" shadow="lg">
            <Card.Media>
              <Image source={landscape} h={64} />
            </Card.Media>
            <Stack gap={4}>
              <Text fontWeight="bold">padding xl, shadow lg</Text>
              <Text size="sm" fg="quiet">
                The media spans the top; the body is padded below.
              </Text>
            </Stack>
          </Card>
        </Tiles>
      ),
      height: 220,
    },
  ],
};
