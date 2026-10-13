// Led (rui-core/more): status lights, on and off, pulsing and flashing.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Row, Stack, Switch } from 'rui-core';
import { Led } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'led',
  group: 'status',
  title: 'Led',
  description: 'A status light (rui-core/more) drawn with Shape: a lens with a halo and a highlight, on or off, pulsing or flashing on the Clock, with a label beside it.',
  props: [
    { name: 'value', type: 'boolean | () => boolean', default: 'true', description: 'On or off.' },
    { name: 'color / offColor', type: 'string', default: "'green' / the color, faded", description: 'Its colors.' },
    { name: 'size', type: "'xs' … 'xl' | number", default: "'md' (16)", description: 'Its size.' },
    { name: 'animate / effect / duration', type: "boolean / 'pulse' | 'flash' / number", default: "false / 'pulse' / 1000", description: 'A pulse or a flash, one period in ms.' },
    { name: 'label', type: 'string | any', description: 'Beside it.' },
  ],
  demos: [
    {
      title: 'Colors, sizes and animations',
      code: `
function Demo() {
  const on = $signal($active(), true);
  return (
    <Stack gap="md">
      <Row gap="xl">
        <Led label="Online" />
        <Led color="red" label="Recording" animate effect="flash" />
        <Led color="amber" label="Busy" animate />
        <Led color="blue" size="xl" value={false} label="Idle" />
      </Row>
      <Row gap="md">
        <Switch label="Power" checked={on} onChange={v => $write(on, v)} />
        <Led value={on} color="teal" size="lg" label={() => ($read(on) ? 'on' : 'off')} />
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const on = $signal($active(), true);
        return (
          <Stack gap="md">
            <Row gap="xl">
              <Led label="Online" />
              <Led color="red" label="Recording" animate effect="flash" />
              <Led color="amber" label="Busy" animate />
              <Led color="blue" size="xl" value={false} label="Idle" />
            </Row>
            <Row gap="md">
              <Switch label="Power" checked={on} onChange={(/** @type {boolean} */ v) => $write(on, v)} />
              <Led value={on} color="teal" size="lg" label={() => ($read(on) ? 'on' : 'off')} />
            </Row>
          </Stack>
        );
      },
      height: 110,
    },
  ],
};
