// DateSelect, MonthSelect and YearSelect (rui-core/dates):
// a picker in a field's panel.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Row, Stack, Text } from 'rui-core';
import { DateSelect, MonthSelect, YearSelect } from 'rui-core/dates';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'date-select',
  group: 'time',
  title: 'DateSelect',
  description: 'A date panel in a field’s popover (rui-core/dates): DateSelect, and MonthSelect and YearSelect alike (with MonthPanel and YearPanel). The field shows the value formatted; a press opens the picker, a complete pick closes it.',
  props: [
    { name: 'mode', type: "'single' | 'multiple' | 'range'", default: "'single'", description: 'One value, several, or a range.' },
    { name: 'value / defaultValue / onChange', type: "string | null | string[] | [start, end]", description: 'The value, as the picker’s.' },
    { name: 'format', type: 'string', default: "'D MMM YYYY' ('MMM YYYY', 'YYYY')", description: 'formatDate’s tokens for the field’s text.' },
    { name: 'separator', type: 'string', default: "' → '", description: 'Between a range’s ends, its spaces included.' },
    { name: 'placeholder', type: 'string', description: 'Shown while empty.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button while there is a value.' },
    { name: 'sticky', type: 'boolean', default: 'false', description: 'A complete pick keeps the panel open.' },
    { name: 'popover', type: 'Popover props', default: "{ at: 'bottom-start', shadow: 'md' }", description: 'The panel’s placement.' },
    { name: 'popup / modal', type: "'popover' | 'modal' / Modal props", default: "'popover'", description: 'The picker in a Popover, or in a Modal.' },
    { name: 'label / description / error / size / radius / variant / disabled', type: 'as TextInput', description: 'The field’s texts and its box; `error` is the message under it.' },
    { name: 'invalid / required / asterisk', type: 'boolean / boolean / boolean | string | node', description: 'The invalid look (`aria-invalid`, as a message in `error` sets too); `required` sets `aria-required` only, `asterisk` draws the mark by the label.' },
    { name: 'panel props', type: 'DatePanel, MonthPanel, YearPanel', description: '`defaultPeriod`, `min`, `max`, `months`, `presets`, `deselectable`, …' },
  ],
  demos: [
    {
      title: 'A date, and a range',
      code: `
function Demo() {
  const date = $signal($active(), '2026-09-26');
  return (
    <Stack gap="sm">
      <Row gap="md" align="end">
        <DateSelect w={220} label="Delivery day" placeholder="Choose a day" value={date} onChange={d => $write(date, d)} clearable />
        <Text size="sm" fg="quiet">{() => \`value: \${$read(date) ?? 'null'}\`}</Text>
      </Row>
      <DateSelect w={300} mode="range" label="Holiday" placeholder="First and last night" defaultValue={['2026-09-21', '2026-09-27']} format="MMM D, YYYY" />
    </Stack>
  );
}`,
      view: () => {
        const date = $signal($active(), /** @type {string | null} */ ('2026-09-26'));
        return (
          <Stack gap="sm">
            <Row gap="md" align="end">
              <DateSelect w={220} label="Delivery day" placeholder="Choose a day" value={date} onChange={(/** @type {string | null} */ d) => $write(date, d)} clearable />
              <Text size="sm" fg="quiet">
                {() => `value: ${$read(date) ?? 'null'}`}
              </Text>
            </Row>
            <DateSelect w={300} mode="range" label="Holiday" placeholder="First and last night" defaultValue={['2026-09-21', '2026-09-27']} format="MMM D, YYYY" />
          </Stack>
        );
      },
      height: 460,
    },
    {
      title: 'A month, several years',
      code: `
function Demo() {
  return (
    <Row gap="md" align="end">
      <MonthSelect w={200} label="Billing month" placeholder="Choose a month" defaultValue="2026-09-01" />
      <YearSelect w={260} mode="multiple" label="Harvest years" placeholder="Choose seasons" defaultValue={['2025-01-01', '2026-01-01']} />
    </Row>
  );
}`,
      view: () => (
        <Row gap="md" align="end">
          <MonthSelect w={200} label="Billing month" placeholder="Choose a month" defaultValue="2026-09-01" />
          <YearSelect w={260} mode="multiple" label="Harvest years" placeholder="Choose seasons" defaultValue={['2025-01-01', '2026-01-01']} />
        </Row>
      ),
      height: 300,
    },
  ],
};
