// $move: the pointer's position inside an element while held down.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $move } from 'rui-core/hooks';
import { Box, Image, Row, Stack, Text, Badge } from 'rui-core';
import { landscape } from '../pictures.js';

/** The picture's size, and the crop box's. */
const W = 300;
const H = 180;
const CW = 120;
const CH = 80;

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-move',
  group: 'behavior',
  title: '$move',
  description: 'The pointer’s position inside an element while it is held down there, as `{ x, y }` between 0 and 1: the base of sliders and color pickers. Portable: spread `props` on any component; the pointer is captured, so a drag follows outside the element until release, and a press the browser takes back (`onPointerCancel`) ends it where the last move left it. Its props carry `touchAction: \'none\'`, so a touch drags the element on every renderer instead of panning the page.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'onChange', type: '(position: { x: number, y: number }) => void', description: 'Called on press, on each move while held, and on release (not on a cancel).' },
    { name: 'options.onMoveStart', type: '() => void', description: 'Called when a drag starts.' },
    { name: 'options.onMoveEnd', type: '() => void', description: 'Called when it ends.' },
    { name: 'options.dir', type: "'ltr' | 'rtl'", default: "'ltr'", description: '`rtl` mirrors x.' },
    { name: 'returns', type: '{ value: Readable<boolean>, props: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, style } }', description: 'Whether it is held down (`value`), and the props to spread on the element (merge `style` into its own).' },
  ],
  demos: [
    {
      title: 'A crop box moved inside a picture',
      code: `
// landscape: a small PNG data: URI (src/pictures.js)
const W = 300;
const H = 180;
const CW = 120;
const CH = 80;

function Demo() {
  const R = $active();
  // The crop box's center, between 0 and 1 across the picture.
  const at = $signal(R, { x: 0.5, y: 0.5 });
  const drags = $signal(R, 0);
  const { value: held, props } = $move(position => $write(at, position), {
    onMoveEnd: () => $write(drags, $read(drags) + 1),
  });
  const left = () => Math.round(Math.min(W - CW, Math.max(0, $read(at).x * W - CW / 2)));
  const top = () => Math.round(Math.min(H - CH, Math.max(0, $read(at).y * H - CH / 2)));
  return (
    <Row gap="md" align="start">
      <Box {...props} w={W} h={H} style={{ position: 'relative', radius: 8, overflow: 'hidden', touchAction: 'none' }}>
        <Image source={landscape} w={W} h={H} label="A green valley" />
        <Box w={CW} h={CH} style={() => ({ position: 'absolute', left: left(), top: top(), border: 2, borderColor: '#ffffff', radius: 4, cursor: 'move' })} />
      </Box>
      <Stack gap="xs">
        <Text size="sm">{() => \`crop at \${left()}, \${top()} (\${CW} × \${CH})\`}</Text>
        <Badge color={() => ($read(held) ? 'teal' : 'gray')}>{() => ($read(held) ? 'dragging' : 'idle')}</Badge>
        <Text size="sm" fg="quiet">{() => \`\${$read(drags)} drags ended\`}</Text>
      </Stack>
    </Row>
  );
}`,
      view: () => {
        const R = $active();
        const at = $signal(R, { x: 0.5, y: 0.5 });
        const drags = $signal(R, 0);
        const { value: held, props } = $move((/** @type {{ x: number, y: number }} */ position) => $write(at, position), {
          onMoveEnd: () => $write(drags, $read(drags) + 1),
        });
        const left = () => Math.round(Math.min(W - CW, Math.max(0, $read(at).x * W - CW / 2)));
        const top = () => Math.round(Math.min(H - CH, Math.max(0, $read(at).y * H - CH / 2)));
        return (
          <Row gap="md" align="start">
            <Box {...props} w={W} h={H} style={{ position: 'relative', radius: 8, overflow: 'hidden', touchAction: 'none' }}>
              <Image source={landscape} w={W} h={H} label="A green valley" />
              <Box w={CW} h={CH} style={() => ({ position: 'absolute', left: left(), top: top(), border: 2, borderColor: '#ffffff', radius: 4, cursor: 'move' })} />
            </Box>
            <Stack gap="xs">
              <Text size="sm">{() => `crop at ${left()}, ${top()} (${CW} × ${CH})`}</Text>
              <Badge color={() => ($read(held) ? 'teal' : 'gray')}>{() => ($read(held) ? 'dragging' : 'idle')}</Badge>
              <Text size="sm" fg="quiet">
                {() => `${$read(drags)} drags ended`}
              </Text>
            </Stack>
          </Row>
        );
      },
      height: 200,
    },
  ],
};
