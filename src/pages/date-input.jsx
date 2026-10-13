// DateInput (rui-core/dates): a date typed, with a calendar below.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Stack, Text } from 'rui-core';
import { DateInput } from 'rui-core/dates';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'date-input',
  group: 'time',
  title: 'DateInput',
  description: 'A date typed in a field, with a calendar under it while focused (rui-core/dates). The text is read as `format` and then as `YYYY-MM-DD`; on blur it goes back to the value’s text. A pick closes the calendar, as do Escape and a press outside.',
  props: [
    { name: 'value / defaultValue / onChange', type: "string | null ('YYYY-MM-DD')", description: 'The date.' },
    { name: 'format', type: 'string', default: "'D MMM YYYY'", description: 'How the date is shown and read.' },
    { name: 'parse', type: '(text: string) => string | null', description: 'Reads the typed text instead.' },
    { name: 'min / max', type: 'string', description: 'The dates allowed.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button while there is a value.' },
    { name: 'deselectable', type: 'boolean', default: 'false', description: 'Picking the date again clears it.' },
    { name: 'revert', type: 'boolean', default: 'true', description: 'On blur the text goes back to the value’s.' },
    { name: 'popover', type: 'Popover props', description: 'The calendar’s Popover options.' },
    { name: 'Calendar props', type: 'see Calendar', description: '`weekStart`, `exclude`, `weekend`, …; not `size`, which sizes the field.' },
    { name: 'TextInput props', type: 'label, description, error, invalid, required, asterisk, placeholder, …', description: 'The field: `error` is the message, `invalid` the look alone; `required` sets `aria-required`, `asterisk` the mark.' },
  ],
  demos: [
    {
      title: 'A departure day',
      code: `
function Demo() {
  const date = $signal($active(), null);
  return (
    <Stack gap="xs">
      <DateInput w={260} label="Departure" placeholder="Type or pick a day" value={date} onChange={d => $write(date, d)} clearable />
      <Text size="sm" fg="quiet">{() => \`value: \${$read(date) ?? 'null'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const date = $signal($active(), /** @type {string | null} */ (null));
        return (
          <Stack gap="xs">
            <DateInput w={260} label="Departure" placeholder="Type or pick a day" value={date} onChange={(/** @type {string | null} */ d) => $write(date, d)} clearable />
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(date) ?? 'null'}`}
            </Text>
          </Stack>
        );
      },
      height: 400,
    },
    {
      title: 'Another format, bounded',
      code: `
function Demo() {
  return <DateInput w={260} label="Check-in (DD/MM/YYYY)" format="DD/MM/YYYY" defaultValue="2026-09-26" min="2026-09-01" max="2026-12-31" />;
}`,
      view: () => <DateInput w={260} label="Check-in (DD/MM/YYYY)" format="DD/MM/YYYY" defaultValue="2026-09-26" min="2026-09-01" max="2026-12-31" />,
      height: 400,
    },
  ],
};
