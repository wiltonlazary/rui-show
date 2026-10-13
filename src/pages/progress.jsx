// Progress: a bar, segments with text, stripes, a sheen and a tween.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Progress, Button, Row, Stack, Text } from 'rui-core';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'progress',
  group: 'status',
  title: 'Progress',
  description: 'A bar filled to a percent, or a track of colored segments with text (Progress.Track, .Segment, .Text). Stripes and the moving sheen are drawn with Shape and run on rui-core’s Clock; a new value can follow over `duration`, the same on every renderer.',
  props: [
    { name: 'value', type: 'number | (() => number)', default: '0', description: 'The filled percent, 0 to 100.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The fill: a theme color name, `name.shade`, or CSS hex.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The track’s height (`theme.sizes.progress`): 3, 4, 6, 10 or 14 px, or pixels.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius of the track (and of a single fill).' },
    { name: 'striped', type: 'boolean', default: 'false', description: 'Diagonal stripes over the fill: white at `opacity.faint` (.16), leaning back at -45°, 12 px apart.' },
    { name: 'moving', type: 'boolean', default: 'false', description: 'Motion along the fill: with `striped` the stripes run; without, a sheen (30% of the fill wide, white at `opacity.faint`) sweeps across every four calm motions (1.2 s).' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'calm' (300)", description: 'How long a new value takes to be reached: ms or a motion preset; 0 changes it at once.' },
    { name: 'Progress.Track', type: 'component', description: 'The track for segments: `size`, `radius`, style props.' },
    { name: 'Progress.Segment', type: 'component', description: 'One segment: `value`, `color`, `striped`, `moving`, `duration`; its children (a Progress.Text) are centered. It means a progressbar with its value. Outside a Track it takes an md bar (6 px).' },
    { name: 'Progress.Text', type: 'component', description: 'A segment’s text: the largest type step that fits the bar with 1 px clear (xs at least), weight 600, black or white by the contrast rule on the segment’s color.' },
  ],
  demos: [
    {
      title: 'Sizes and colors',
      code: `
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

function Demo() {
  return (
    <Stack gap="sm">
      {SIZES.map((size, i) => <Progress size={size} value={24 + i * 17} />)}
      <Progress color="cyan" value={88} radius="xl" size={8} />
      <Progress color="orange.5" value={36} radius={0} />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          {SIZES.map((size, i) => (
            <Progress size={size} value={24 + i * 17} />
          ))}
          <Progress color="cyan" value={88} radius="xl" size={8} />
          <Progress color="orange.5" value={36} radius={0} />
        </Stack>
      ),
      height: 150,
    },
    {
      title: 'Sync with two segments',
      code: `
function Demo() {
  return (
    <Stack gap="xs">
      <Text size="sm" fontWeight={600}>Sync</Text>
      <Progress.Track size="lg">
        <Progress.Segment value={54} color="indigo"><Progress.Text>Uploaded</Progress.Text></Progress.Segment>
        <Progress.Segment value={21} color="amber"><Progress.Text>Queued</Progress.Text></Progress.Segment>
      </Progress.Track>
      <Text size="sm" fg="quiet">54 of 100 files uploaded, 21 queued</Text>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs">
          <Text size="sm" fontWeight={600}>
            Sync
          </Text>
          <Progress.Track size="lg">
            <Progress.Segment value={54} color="indigo">
              <Progress.Text>Uploaded</Progress.Text>
            </Progress.Segment>
            <Progress.Segment value={21} color="amber">
              <Progress.Text>Queued</Progress.Text>
            </Progress.Segment>
          </Progress.Track>
          <Text size="sm" fg="quiet">
            54 of 100 files uploaded, 21 queued
          </Text>
        </Stack>
      ),
      height: 90,
    },
    {
      title: 'Striped and moving',
      code: `
function Demo() {
  return (
    <Stack gap="md">
      <Progress size="lg" value={58} striped />
      <Progress size="lg" value={66} color="teal" striped moving />
      <Progress size="lg" value={74} color="blue" moving />
      <Progress.Track size={18}>
        <Progress.Segment value={45} color="violet" striped><Progress.Text>Striped</Progress.Text></Progress.Segment>
        <Progress.Segment value={35} color="magenta" moving><Progress.Text>Moving</Progress.Text></Progress.Segment>
      </Progress.Track>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <Progress size="lg" value={58} striped />
          <Progress size="lg" value={66} color="teal" striped moving />
          <Progress size="lg" value={74} color="blue" moving />
          <Progress.Track size={18}>
            <Progress.Segment value={45} color="violet" striped>
              <Progress.Text>Striped</Progress.Text>
            </Progress.Segment>
            <Progress.Segment value={35} color="magenta" moving>
              <Progress.Text>Moving</Progress.Text>
            </Progress.Segment>
          </Progress.Track>
        </Stack>
      ),
      height: 140,
    },
    {
      title: 'A value that moves',
      code: `
function Demo() {
  const value = $signal($active(), 20);
  const step = by => $write(value, Math.max(0, Math.min(100, $read(value) + by)));
  return (
    <Stack gap="sm">
      <Progress value={value} duration={300} size="lg" />
      <Row gap="xs">
        <Button size="xs" variant="neutral" onPress={() => step(-20)}>Less</Button>
        <Button size="xs" onPress={() => step(20)}>More</Button>
        <Text size="sm" fg="quiet">{() => \`value \${$read(value)}%\`}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), 20);
        const step = (/** @type {number} */ by) => $write(value, Math.max(0, Math.min(100, $read(value) + by)));
        return (
          <Stack gap="sm">
            <Progress value={value} duration={300} size="lg" />
            <Row gap="xs">
              <Button size="xs" variant="neutral" onPress={() => step(-20)}>
                Less
              </Button>
              <Button size="xs" onPress={() => step(20)}>
                More
              </Button>
              <Text size="sm" fg="quiet">
                {() => `value ${$read(value)}%`}
              </Text>
            </Row>
          </Stack>
        );
      },
      height: 80,
    },
  ],
};
