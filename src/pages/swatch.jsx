// Swatch: a color sample, pressable, with content over it.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $ui, Box, Button, pageColors, Row, Stack, Swatch, Text } from 'rui-core';

const HUES = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'violet', 'purple', 'magenta'];
const SHADES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'swatch',
  group: 'data',
  title: 'Swatch',
  description: 'A small square (or round) sample of a theme color or hex, with an inner edge in the page’s rule color, content centered over it and, with `onPress`, something to press: the pieces of a color picker.',
  props: [
    { name: 'color', type: 'string', description: 'A theme color name (its primary shade), `name.shade`, or hex.' },
    { name: 'size', type: 'number', default: '24', description: 'Width and height in pixels.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'sm'", description: 'Corner radius: a scale step or pixels (half the size for a circle).' },
    { name: 'shadowed', type: 'boolean', default: 'false', description: 'A small shadow under the sample.' },
    { name: 'label', type: 'string', default: 'its color', description: 'The accessible name when it is pressable.' },
    { name: 'onPress', type: '(event) => void', description: 'Makes it pressable, with a pointer cursor.' },
    { name: 'children', type: 'any', description: 'Content centered over the color, such as a check mark.' },
  ],
  demos: [
    {
      title: 'Colors, shades and hex',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Swatch color="#2f78c9" />
        <Swatch color="teal" />
        <Swatch color="violet.3" />
        <Swatch color="amber.8" />
        <Swatch color="rgb(255, 94, 80)" />
      </Row>
      <Row gap="xs" align="center">
        <Swatch color="magenta" size={16} />
        <Swatch color="magenta" />
        <Swatch color="magenta" size={36} radius="md" />
        <Swatch color="magenta" size={48} radius={24} shadowed />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="xs">
            <Swatch color="#2f78c9" />
            <Swatch color="teal" />
            <Swatch color="violet.3" />
            <Swatch color="amber.8" />
            <Swatch color="rgb(255, 94, 80)" />
          </Row>
          <Row gap="xs" align="center">
            <Swatch color="magenta" size={16} />
            <Swatch color="magenta" />
            <Swatch color="magenta" size={36} radius="md" />
            <Swatch color="magenta" size={48} radius={24} shadowed />
          </Row>
        </Stack>
      ),
      height: 110,
    },
    {
      title: 'An accent picker',
      code: `
const HUES = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'violet', 'purple', 'magenta'];
const SHADES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function Demo() {
  const ui = $ui();
  const accent = $signal($active(), 'indigo');
  // The chosen swatch wears a ring in the page's border color.
  const ring = color => () => ({
    padding: 2,
    radius: ui.theme().radius.round,
    border: 2,
    borderColor: $read(accent) === color ? pageColors(ui.theme(), ui.scheme()).border : 'transparent',
  });
  return (
    <Stack gap="sm">
      <Row gap={2}>
        {HUES.map(color => (
          <Box style={ring(color)}>
            <Swatch color={color} size={24} radius={12} label={color} onPress={() => $write(accent, color)} />
          </Box>
        ))}
      </Row>
      <Row gap={0}>
        {SHADES.map(shade => <Swatch color={() => \`\${$read(accent)}.\${shade}\`} size={32} radius={0} />)}
      </Row>
      <Row gap="sm" align="center">
        <Button size="xs" color={() => $read(accent)}>Save</Button>
        <Text size="sm" fg="quiet">{() => \`accent: \${$read(accent)}, shades 1 to 9\`}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const ui = $ui();
        const accent = $signal($active(), 'indigo');
        const ring = (/** @type {string} */ color) => () => ({
          padding: 2,
          radius: ui.theme().radius.round,
          border: 2,
          borderColor: $read(accent) === color ? pageColors(ui.theme(), ui.scheme()).border : 'transparent',
        });
        return (
          <Stack gap="sm">
            <Row gap={2}>
              {HUES.map(color => (
                <Box style={ring(color)}>
                  <Swatch color={color} size={24} radius={12} label={color} onPress={() => $write(accent, color)} />
                </Box>
              ))}
            </Row>
            <Row gap={0}>
              {SHADES.map(shade => (
                <Swatch color={() => `${$read(accent)}.${shade}`} size={32} radius={0} />
              ))}
            </Row>
            <Row gap="sm" align="center">
              <Button size="xs" color={() => $read(accent)}>
                Save
              </Button>
              <Text size="sm" fg="quiet">
                {() => `accent: ${$read(accent)}, shades 1 to 9`}
              </Text>
            </Row>
          </Stack>
        );
      },
      height: 150,
    },
  ],
};
