// TimeInput (rui-core/dates): a time typed through a mask.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Row, Stack, Text } from 'rui-core';
import { TimeInput } from 'rui-core/dates';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'time-input',
  group: 'time',
  title: 'TimeInput',
  description: 'A time typed through a mask on the portable Edit (rui-core/dates): `HH:mm`, or `HH:mm:ss` with seconds. The value changes once the time is complete and valid; an incomplete or impossible one goes back to the value on blur.',
  props: [
    { name: 'value / defaultValue / onChange', type: "string ('HH:mm' or 'HH:mm:ss')", description: 'The time; `\'\'` once cleared.' },
    { name: 'seconds', type: 'boolean', default: 'false', description: 'Seconds in the mask.' },
    { name: 'min / max', type: 'string', description: 'The bounds, applied on blur.' },
    { name: 'placeholder', type: 'string', default: "'··:··' ('··:··:··' with seconds)", description: 'The hint while empty.' },
    { name: 'TextInput props', type: 'label, description, error, invalid, asterisk, size, radius, …', description: 'The field.' },
  ],
  demos: [
    {
      title: 'A time and its value',
      code: `
function Demo() {
  const time = $signal($active(), '09:30');
  return (
    <Row gap="md" align="end">
      <TimeInput w={160} label="Meeting at" value={time} onChange={t => $write(time, t)} />
      <Text size="sm" fg="quiet">{() => \`value: \${$read(time) || '(empty)'}\`}</Text>
    </Row>
  );
}`,
      view: () => {
        const time = $signal($active(), '09:30');
        return (
          <Row gap="md" align="end">
            <TimeInput w={160} label="Meeting at" value={time} onChange={(/** @type {string} */ t) => $write(time, t)} />
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(time) || '(empty)'}`}
            </Text>
          </Row>
        );
      },
      height: 90,
    },
    {
      title: 'Seconds, bounds and states',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="md" align="end">
        <TimeInput w={160} seconds label="With seconds" defaultValue="12:45:10" />
        <TimeInput w={200} label="Office hours" description="08:00 to 18:00" min="08:00" max="18:00" defaultValue="10:00" />
      </Row>
      <Row gap="md" align="end">
        <TimeInput w={160} label="Disabled" defaultValue="07:00" disabled />
        <TimeInput w={160} label="With error" error="Too early" defaultValue="05:00" />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="md" align="end">
            <TimeInput w={160} seconds label="With seconds" defaultValue="12:45:10" />
            <TimeInput w={200} label="Office hours" description="08:00 to 18:00" min="08:00" max="18:00" defaultValue="10:00" />
          </Row>
          <Row gap="md" align="end">
            <TimeInput w={160} label="Disabled" defaultValue="07:00" disabled />
            <TimeInput w={160} label="With error" error="Too early" defaultValue="05:00" />
          </Row>
        </Stack>
      ),
      height: 200,
    },
  ],
};
