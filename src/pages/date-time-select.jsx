// DateTimeSelect (rui-core/dates): a day and a time in one panel.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Stack, Text } from 'rui-core';
import { DateTimeSelect } from 'rui-core/dates';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'date-time-select',
  group: 'time',
  title: 'DateTimeSelect',
  description: 'A day and a time (rui-core/dates): a DatePanel over a time row in the field’s panel: a TimeInput and a “Done” button that closes it. A picked day keeps the time (midnight at first). Values are `YYYY-MM-DD HH:mm:ss`.',
  props: [
    { name: 'value / defaultValue / onChange', type: "string | null ('YYYY-MM-DD HH:mm:ss')", description: 'The date and time.' },
    { name: 'format', type: 'string', default: "'YYYY-MM-DD HH:mm'", description: 'The field’s text, ISO 8601 order (with seconds `YYYY-MM-DD HH:mm:ss`).' },
    { name: 'seconds', type: 'boolean', default: 'false', description: 'Seconds in the time.' },
    { name: 'timeInput', type: 'TimeInput props', description: 'The time field’s props.' },
    { name: 'done', type: 'Button props', description: 'The “Done” button’s props (`children` replaces its text).' },
    { name: 'placeholder / clearable / popup / label / …', type: 'as DateSelect', description: 'The field and its parts (`popup="modal"`: the panel in a Modal titled by the label).' },
    { name: 'DatePanel props', type: 'see DatePanel', description: '`defaultPeriod`, `min`, `max`, …' },
  ],
  demos: [
    {
      title: 'A departure time',
      code: `
function Demo() {
  const at = $signal($active(), '2026-09-26 14:30:00');
  return (
    <Stack gap="xs">
      <DateTimeSelect w={260} label="Departure" placeholder="Choose a day and time" value={at} onChange={v => $write(at, v)} />
      <Text size="sm" fg="quiet">{() => \`value: \${$read(at) ?? 'null'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const at = $signal($active(), /** @type {string | null} */ ('2026-09-26 14:30:00'));
        return (
          <Stack gap="xs">
            <DateTimeSelect w={260} label="Departure" placeholder="Choose a day and time" value={at} onChange={(/** @type {string | null} */ v) => $write(at, v)} />
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(at) ?? 'null'}`}
            </Text>
          </Stack>
        );
      },
      height: 460,
    },
    {
      title: 'With seconds, clearable',
      code: `
function Demo() {
  return <DateTimeSelect w={260} seconds clearable label="Race start" placeholder="Choose the start" defaultValue="2026-09-26 08:15:30" />;
}`,
      view: () => <DateTimeSelect w={260} seconds clearable label="Race start" placeholder="Choose the start" defaultValue="2026-09-26 08:15:30" />,
      height: 100,
    },
  ],
};
