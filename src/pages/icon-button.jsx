// IconButton and IconButton.Group: variants, sizes, the drawn icons, states
// and a counter, attached groups.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { IconButton, CloseIcon, CheckIcon, ChevronIcon, DotsIcon, CopyIcon, ShareIcon, Row, Stack, Text } from 'rui-core';

const VARIANTS = ['solid', 'soft', 'outline', 'ghost', 'neutral', 'plain', 'inverse'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'icon-button',
  group: 'actions',
  title: 'IconButton',
  description: 'A square press target holding an icon, with Button’s variants, colors and states; IconButton.Group joins several in one frame that draws the edge, the lines between them and the corners. Icons are drawn Shapes (CloseIcon, CheckIcon, ChevronIcon, DotsIcon, CopyIcon, ShareIcon), the same on every renderer; a Shape does not inherit the text color, so an icon takes its own `color`.',
  props: [
    { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'ghost' | 'neutral' | 'plain' | 'inverse' | 'gradient'", default: "'solid'", description: 'How the color is applied: the theme’s variant colors, or a gradient.' },
    { name: 'gradient', type: '{ colors, angle }', default: "theme.gradient (teal to indigo, 120°)", description: 'The colors of the `gradient` variant.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'A theme color name, `name.shade`, or CSS hex.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The side of the square: 20, 24, 28, 36, 44 px, or pixels.' },
    { name: 'field', type: 'boolean', default: 'false', description: 'As tall as a field (and a button) of that size: 24, 30, 36, 44, 52 px.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius: a scale step or pixels (in an IconButton.Group the group’s frame draws the corners).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out; presses are ignored.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'A Loader (62% of the side, `ratios.icon`) in place of the icon; presses are ignored.' },
    { name: 'label', type: 'string', description: 'The accessible name (the icon has no text).' },
    { name: 'onPress', type: '(event) => void', description: 'Called on a press.' },
    { name: 'onKey', type: '(event) => void', description: 'Called on a key while it has focus.' },
    { name: 'children', type: 'any', description: 'The icon.' },
    { name: 'IconButton.Group orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Attached side by side, or stacked.' },
    { name: 'IconButton.Group divider', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'xs' (1 px)", description: 'The thickness of the frame’s edge and of the lines between its children: a `theme.sizes.divider` step or pixels; 0 for none.' },
    { name: 'IconButton.Group radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'The frame’s corners; the children draw no border and no radius (the frame draws them).' },
    { name: 'Icons size', type: 'number', default: '16', description: 'CloseIcon, CheckIcon, ChevronIcon, DotsIcon, CopyIcon and ShareIcon: the side in pixels.' },
    { name: 'Icons color', type: 'string', default: 'the scheme’s text color', description: "A theme color, `'name.shade'`, `'quiet'`, `'white'` or hex." },
    { name: 'Icons stroke', type: 'number', default: 'size / 8 (at least 1.5)', description: 'The line width of the stroked icons.' },
    { name: 'ChevronIcon rotate', type: 'number', default: '0', description: 'Degrees clockwise from pointing down: 90 left, -90 right, 180 up.' },
    { name: 'ChevronIcon edge', type: 'boolean', default: 'false', description: 'A bar where it points (first and last page controls).' },
  ],
  demos: [
    {
      title: 'Variants',
      code: `
const VARIANTS = ['solid', 'soft', 'outline', 'ghost', 'neutral', 'plain', 'inverse'];

function Demo() {
  return (
    <Row gap="lg">
      {VARIANTS.map(variant => (
        <Stack gap={4} align="center">
          <IconButton variant={variant} label={variant}>
            <CheckIcon size={18} color={variant === 'solid' ? 'white' : variant === 'neutral' ? undefined : 'indigo'} />
          </IconButton>
          <Text size="xs" fg="quiet">{variant}</Text>
        </Stack>
      ))}
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg">
          {VARIANTS.map(variant => (
            <Stack gap={4} align="center">
              <IconButton variant={variant} label={variant}>
                <CheckIcon size={18} color={variant === 'solid' ? 'white' : variant === 'neutral' ? undefined : 'indigo'} />
              </IconButton>
              <Text size="xs" fg="quiet">
                {variant}
              </Text>
            </Stack>
          ))}
        </Row>
      ),
      height: 90,
    },
    {
      title: 'Sizes and icons',
      code: `
const SIZES = { xs: 12, sm: 14, md: 18, lg: 22, xl: 28 };

function Demo() {
  return (
    <Stack gap="md">
      <Row gap="sm" align="center">
        {Object.entries(SIZES).map(([size, icon]) => (
          <IconButton size={size} color="teal" label={size}>
            <CheckIcon size={icon} color="white" />
          </IconButton>
        ))}
        <IconButton size="sm" field variant="neutral" label="sm, as tall as a field">
          <DotsIcon size={20} />
        </IconButton>
      </Row>
      <Row gap="sm" align="center">
        <IconButton variant="soft" label="Close"><CloseIcon size={18} color="indigo" /></IconButton>
        <IconButton variant="soft" label="Down"><ChevronIcon size={18} color="indigo" /></IconButton>
        <IconButton variant="soft" label="Left"><ChevronIcon size={18} rotate={90} color="indigo" /></IconButton>
        <IconButton variant="soft" label="Right"><ChevronIcon size={18} rotate={-90} color="indigo" /></IconButton>
        <IconButton variant="soft" label="Up"><ChevronIcon size={18} rotate={180} color="indigo" /></IconButton>
        <IconButton variant="soft" label="Last"><ChevronIcon size={18} rotate={-90} edge color="indigo" /></IconButton>
        <IconButton variant="soft" label="More"><DotsIcon size={18} color="indigo" /></IconButton>
        <IconButton variant="soft" label="Copy"><CopyIcon size={18} color="indigo" /></IconButton>
        <IconButton variant="soft" label="Share"><ShareIcon size={18} color="indigo" /></IconButton>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const SIZES = { xs: 12, sm: 14, md: 18, lg: 22, xl: 28 };
        return (
          <Stack gap="md">
            <Row gap="sm" align="center">
              {Object.entries(SIZES).map(([size, icon]) => (
                <IconButton size={size} color="teal" label={size}>
                  <CheckIcon size={icon} color="white" />
                </IconButton>
              ))}
              <IconButton size="sm" field variant="neutral" label="sm, as tall as a field">
                <DotsIcon size={20} />
              </IconButton>
            </Row>
            <Row gap="sm" align="center">
              <IconButton variant="soft" label="Close">
                <CloseIcon size={18} color="indigo" />
              </IconButton>
              <IconButton variant="soft" label="Down">
                <ChevronIcon size={18} color="indigo" />
              </IconButton>
              <IconButton variant="soft" label="Left">
                <ChevronIcon size={18} rotate={90} color="indigo" />
              </IconButton>
              <IconButton variant="soft" label="Right">
                <ChevronIcon size={18} rotate={-90} color="indigo" />
              </IconButton>
              <IconButton variant="soft" label="Up">
                <ChevronIcon size={18} rotate={180} color="indigo" />
              </IconButton>
              <IconButton variant="soft" label="Last">
                <ChevronIcon size={18} rotate={-90} edge color="indigo" />
              </IconButton>
              <IconButton variant="soft" label="More">
                <DotsIcon size={18} color="indigo" />
              </IconButton>
              <IconButton variant="soft" label="Copy">
                <CopyIcon size={18} color="indigo" />
              </IconButton>
              <IconButton variant="soft" label="Share">
                <ShareIcon size={18} color="indigo" />
              </IconButton>
            </Row>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'States and a counter',
      code: `
function Demo() {
  const count = $signal($active(), 0);
  return (
    <Stack gap="sm">
      <Row gap="sm" align="center">
        <IconButton size="lg" label="Add one" onPress={() => $write(count, $read(count) + 1)}>
          <CheckIcon size={20} color="white" />
        </IconButton>
        <IconButton size="lg" variant="soft" color="red" label="Reset" onPress={() => $write(count, 0)}>
          <CloseIcon size={20} color="red" />
        </IconButton>
        <IconButton size="lg" disabled label="Disabled">
          <CloseIcon size={20} color="quiet" />
        </IconButton>
        <IconButton size="lg" loading label="Loading">
          <CheckIcon size={20} color="white" />
        </IconButton>
      </Row>
      <Text fg="quiet">{() => 'pressed ' + $read(count) + ' times'}</Text>
    </Stack>
  );
}`,
      view: () => {
        const count = $signal($active(), 0);
        return (
          <Stack gap="sm">
            <Row gap="sm" align="center">
              <IconButton size="lg" label="Add one" onPress={() => $write(count, $read(count) + 1)}>
                <CheckIcon size={20} color="white" />
              </IconButton>
              <IconButton size="lg" variant="soft" color="red" label="Reset" onPress={() => $write(count, 0)}>
                <CloseIcon size={20} color="red" />
              </IconButton>
              <IconButton size="lg" disabled label="Disabled">
                <CloseIcon size={20} color="quiet" />
              </IconButton>
              <IconButton size="lg" loading label="Loading">
                <CheckIcon size={20} color="white" />
              </IconButton>
            </Row>
            <Text fg="quiet">{() => 'pressed ' + $read(count) + ' times'}</Text>
          </Stack>
        );
      },
      height: 90,
    },
    {
      title: 'Attached in groups',
      code: `
function Demo() {
  const page = $signal($active(), 3);
  return (
    <Row gap="xl" align="start">
      <IconButton.Group>
        <IconButton variant="neutral" size="lg" label="Previous" onPress={() => $write(page, $read(page) - 1)}>
          <ChevronIcon size={18} rotate={90} />
        </IconButton>
        <IconButton variant="neutral" size="lg" label="Next" onPress={() => $write(page, $read(page) + 1)}>
          <ChevronIcon size={18} rotate={-90} />
        </IconButton>
      </IconButton.Group>
      <IconButton.Group orientation="vertical">
        <IconButton variant="neutral" size="lg" label="Up"><ChevronIcon size={18} rotate={180} /></IconButton>
        <IconButton variant="neutral" size="lg" label="More"><DotsIcon size={18} /></IconButton>
        <IconButton variant="neutral" size="lg" label="Down"><ChevronIcon size={18} /></IconButton>
      </IconButton.Group>
      <Text>{() => 'page ' + $read(page)}</Text>
    </Row>
  );
}`,
      view: () => {
        const page = $signal($active(), 3);
        return (
          <Row gap="xl" align="start">
            <IconButton.Group>
              <IconButton variant="neutral" size="lg" label="Previous" onPress={() => $write(page, $read(page) - 1)}>
                <ChevronIcon size={18} rotate={90} />
              </IconButton>
              <IconButton variant="neutral" size="lg" label="Next" onPress={() => $write(page, $read(page) + 1)}>
                <ChevronIcon size={18} rotate={-90} />
              </IconButton>
            </IconButton.Group>
            <IconButton.Group orientation="vertical">
              <IconButton variant="neutral" size="lg" label="Up">
                <ChevronIcon size={18} rotate={180} />
              </IconButton>
              <IconButton variant="neutral" size="lg" label="More">
                <DotsIcon size={18} />
              </IconButton>
              <IconButton variant="neutral" size="lg" label="Down">
                <ChevronIcon size={18} />
              </IconButton>
            </IconButton.Group>
            <Text>{() => 'page ' + $read(page)}</Text>
          </Row>
        );
      },
      height: 130,
    },
    {
      title: 'Gradients',
      code: `
function Demo() {
  const story = $signal($active(), 1);
  const move = by => $write(story, Math.min(5, Math.max(1, $read(story) + by)));
  return (
    <Row gap="sm" align="center">
      <IconButton variant="gradient" size="lg" gradient={{ colors: ['blue', 'violet'], angle: 225 }} label="Previous story" onPress={() => move(-1)}><ChevronIcon size={18} rotate={90} /></IconButton>
      <IconButton variant="gradient" size="xl" radius="xl" gradient={{ colors: ['amber', 'magenta', 'purple'], angle: 160 }} label="Share story"><ShareIcon size={20} /></IconButton>
      <IconButton variant="gradient" size="lg" gradient={{ colors: ['blue', 'violet'], angle: 45 }} label="Next story" onPress={() => move(1)}><ChevronIcon size={18} rotate={-90} /></IconButton>
      <Text size="sm">{() => \`Story \${$read(story)} of 5\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const story = $signal($active(), 1);
        const move = (/** @type {number} */ by) => $write(story, Math.min(5, Math.max(1, $read(story) + by)));
        return (
          <Row gap="sm" align="center">
            <IconButton variant="gradient" size="lg" gradient={{ colors: ['blue', 'violet'], angle: 225 }} label="Previous story" onPress={() => move(-1)}>
              <ChevronIcon size={18} rotate={90} />
            </IconButton>
            <IconButton variant="gradient" size="xl" radius="xl" gradient={{ colors: ['amber', 'magenta', 'purple'], angle: 160 }} label="Share story">
              <ShareIcon size={20} />
            </IconButton>
            <IconButton variant="gradient" size="lg" gradient={{ colors: ['blue', 'violet'], angle: 45 }} label="Next story" onPress={() => move(1)}>
              <ChevronIcon size={18} rotate={-90} />
            </IconButton>
            <Text size="sm">{() => `Story ${$read(story)} of 5`}</Text>
          </Row>
        );
      },
      height: 80,
    },
  ],
};
