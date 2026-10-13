// Compare (rui-core/more): two pictures and a slider between them.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Row, Stack, Text } from 'rui-core';
import { Compare } from 'rui-core/more';
import { landscape, sunset } from '../pictures.js';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'compare',
  group: 'data',
  title: 'Compare',
  description: 'Two pictures (or any content) one over the other with a slider between them (rui-core/more): dragged, moved by hovering, or only by the keys; across or up and down.',
  props: [
    { name: 'before / after', type: 'string | any', description: 'The two sides: a picture’s source, or any content.' },
    { name: 'beforeLabel / afterLabel', type: 'string', default: "'Before' / 'After'", description: 'The pictures’ names.' },
    { name: 'value / defaultValue / onChange', type: 'number', default: '50', description: 'The percent of the first shown.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Across or up and down.' },
    { name: 'mode', type: "'drag' | 'hover' | 'fixed'", default: "'drag'", description: 'What moves the slider (the keys too, while it has its `handle`).' },
    { name: 'handle / color', type: 'boolean / string', default: "true / 'white'", description: 'The slider’s grip and color: `handle` false drops the grip and its keys, so the pointer alone moves it (with `fixed`, nothing does).' },
    { name: 'step', type: 'number', default: '1', description: 'Percent a key moves (Shift: 10).' },
    { name: 'w / h / radius', type: 'number / number / …', default: '— / 200 / —', description: 'Its size and corners.' },
  ],
  demos: [
    {
      title: 'Dragged',
      code: `
// landscape, sunset: small PNG data: URIs (src/pictures.js)
function Demo() {
  const value = $signal($active(), 40);
  return (
    <Stack gap="xs">
      <Compare w={480} h={220} radius="md" before={landscape} after={sunset} value={value} onChange={v => $write(value, v)} />
      <Text size="sm" fg="quiet">{() => \`\${Math.round($read(value))}% of the landscape\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), 40);
        return (
          <Stack gap="xs">
            <Compare w={480} h={220} radius="md" before={landscape} after={sunset} value={value} onChange={(/** @type {number} */ v) => $write(value, v)} />
            <Text size="sm" fg="quiet">
              {() => `${Math.round($read(value))}% of the landscape`}
            </Text>
          </Stack>
        );
      },
      height: 270,
    },
    {
      title: 'Hover, up and down',
      code: `
function Demo() {
  return (
    <Row gap="lg">
      <Compare w={280} h={180} mode="hover" before={sunset} after={landscape} />
      <Compare w={280} h={180} orientation="vertical" color="night" before={landscape} after={sunset} defaultValue={30} />
    </Row>
  );
}`,
      view: () => (
        <Row gap="lg">
          <Compare w={280} h={180} mode="hover" before={sunset} after={landscape} />
          <Compare w={280} h={180} orientation="vertical" color="night" before={landscape} after={sunset} defaultValue={30} />
        </Row>
      ),
      height: 212,
    },
  ],
};
