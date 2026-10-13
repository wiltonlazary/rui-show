// Alert: variants, colors, the tone mark or an icon, and a close part.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Alert, CheckIcon, Stack, Text, Tiles } from 'rui-core';

const VARIANTS = ['soft', 'solid', 'outline', 'neutral', 'plain', 'inverse'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'alert',
  group: 'status',
  title: 'Alert',
  description: 'A message set in the page, in the same language as Notification: a tone mark beside the first line (a round dot in the variant’s ink, or your icon), a strong title, a quiet message a font step below it, and a close part at the end, in six variants and the theme colors, drawn the same on every renderer. The icon is the caller’s: a drawn icon (a Shape) takes its own `color`.',
  props: [
    { name: 'title', type: 'string | (() => string) | any', description: 'The first line: a strong line in the variant’s ink.' },
    { name: 'children', type: 'string | number | (() => string) | any', description: 'The message, a font step below the title: text becomes a Label (on the quiet role under a title, else in the text color; the ink on solid and inverse), other children show as they are.' },
    { name: 'variant', type: "'soft' | 'solid' | 'outline' | 'neutral' | 'plain' | 'inverse'", default: "'soft'", description: 'The surface and edge: soft (a tinted ground with a 1 px edge of the ink at `theme.opacity.soft`), solid (the tone’s fill), outline (a 1 px edge of the ink), neutral (the page’s neutral ground and border), plain (neither) or inverse (a white ground in the tone’s ink).' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'Its tone: a theme color name, `name.shade`, or CSS hex.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius: a scale step or pixels.' },
    { name: 'icon', type: 'any', description: 'In place of the tone dot, beside the first line at `theme.ratios.icon` of its height.' },
    { name: 'closable', type: 'boolean | object | any', default: 'false', description: 'The close part at the end: true (a plain CloseButton at size xs in the ink, labeled ‘Close’), its options (`{ label }` and CloseButton props) or a node of your own.' },
    { name: 'onClose', type: '(event) => void', description: 'Called when the close button is pressed.' },
  ],
  demos: [
    {
      title: 'Variants',
      code: `
const VARIANTS = ['soft', 'solid', 'outline', 'neutral', 'plain', 'inverse'];

function Demo() {
  return (
    <Tiles columns={3} gap="sm">
      {VARIANTS.map(variant => <Alert variant={variant} title={variant}>A message</Alert>)}
    </Tiles>
  );
}`,
      view: () => (
        <Tiles columns={3} gap="sm">
          {VARIANTS.map(variant => (
            <Alert variant={variant} title={variant}>
              A message
            </Alert>
          ))}
        </Tiles>
      ),
      height: 200,
    },
    {
      title: 'Tone, icon and radius',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Alert color="teal" title="Saved" icon={<CheckIcon color="teal" size={13} />}>Your changes are saved.</Alert>
      <Alert color="red" variant="outline" radius="lg" title="The upload stopped halfway">Check the form and try again.</Alert>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Alert color="teal" title="Saved" icon={<CheckIcon color="teal" size={13} />}>
            Your changes are saved.
          </Alert>
          <Alert color="red" variant="outline" radius="lg" title="The upload stopped halfway">
            Check the form and try again.
          </Alert>
        </Stack>
      ),
      height: 200,
    },
    {
      title: 'With a close button',
      code: `
function Demo() {
  const closed = $signal($active(), 0);
  return (
    <Stack gap="sm">
      <Alert color="orange" title="Heads up" closable onClose={() => $write(closed, $read(closed) + 1)}>
        Press the close button at the end.
      </Alert>
      <Text size="sm" fg="quiet">{() => \`closed \${$read(closed)} times\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const closed = $signal($active(), 0);
        return (
          <Stack gap="sm">
            <Alert color="orange" title="Heads up" closable onClose={() => $write(closed, $read(closed) + 1)}>
              Press the close button at the end.
            </Alert>
            <Text size="sm" fg="quiet">
              {() => `closed ${$read(closed)} times`}
            </Text>
          </Stack>
        );
      },
      height: 130,
    },
  ],
};
