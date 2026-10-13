// Loader: ring, bars and dots; sizes and colors.

import { Loader, Row, Stack, Text } from 'rui-core';

const KINDS = ['ring', 'bars', 'dots'];
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'loader',
  group: 'status',
  title: 'Loader',
  description: 'Three loaders (`kind`: ring, bars, dots), drawn with Shape and animated on rui-core’s Clock, so every renderer paints the same frame at the same time; a test clock holds them still.',
  props: [
    { name: 'kind', type: "'ring' | 'bars' | 'dots'", default: "'ring'", description: 'Which loader: an arc turning and growing from a quarter to three quarters of the ring on a faint track (`opacity.faint`, .16), four bars rising in turn as a level meter, or three dots lifting in a wave (`opacity.soft`, .3, at rest). Each cycle is a multiple of the MOTION presets.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Its side (`theme.sizes.loader`): 16, 24, 32, 40 or 56 px, or pixels (the dots row is 3/8 of it high).' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'A theme color name, `name.shade`, or CSS hex.' },
  ],
  demos: [
    {
      title: 'Kinds',
      code: `
const KINDS = ['ring', 'bars', 'dots'];

function Demo() {
  return (
    <Row gap="xl" justify="center">
      {KINDS.map(kind => (
        <Stack align="center" gap="xs">
          <Loader kind={kind} />
          <Text size="sm" fg="quiet">{kind}</Text>
        </Stack>
      ))}
    </Row>
  );
}`,
      view: () => (
        <Row gap="xl" justify="center">
          {KINDS.map(kind => (
            <Stack align="center" gap="xs">
              <Loader kind={kind} />
              <Text size="sm" fg="quiet">
                {kind}
              </Text>
            </Stack>
          ))}
        </Row>
      ),
      height: 90,
    },
    {
      title: 'Sizes',
      code: `
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

function Demo() {
  return (
    <Stack gap="md">
      <Row gap="lg" align="center">{SIZES.map(size => <Loader size={size} />)}</Row>
      <Row gap="lg" align="center">{SIZES.map(size => <Loader kind="bars" size={size} />)}</Row>
      <Row gap="lg" align="center">
        {SIZES.map(size => <Loader kind="dots" size={size} />)}
        <Loader kind="dots" size={80} />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <Row gap="lg" align="center">
            {SIZES.map(size => (
              <Loader size={size} />
            ))}
          </Row>
          <Row gap="lg" align="center">
            {SIZES.map(size => (
              <Loader kind="bars" size={size} />
            ))}
          </Row>
          <Row gap="lg" align="center">
            {SIZES.map(size => (
              <Loader kind="dots" size={size} />
            ))}
            <Loader kind="dots" size={80} />
          </Row>
        </Stack>
      ),
      height: 190,
    },
    {
      title: 'Colors',
      code: `
function Demo() {
  return (
    <Row gap="lg" align="center">
      <Loader color="red" />
      <Loader kind="bars" color="teal" />
      <Loader kind="dots" color="purple.4" />
      <Loader color="#f67502" size="lg" />
      <Loader kind="bars" color="gray" size="sm" />
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg" align="center">
          <Loader color="red" />
          <Loader kind="bars" color="teal" />
          <Loader kind="dots" color="purple.4" />
          <Loader color="#f67502" size="lg" />
          <Loader kind="bars" color="gray" size="sm" />
        </Row>
      ),
      height: 80,
    },
  ],
};
