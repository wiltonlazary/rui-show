// TimePicker (rui-core/dates): a time in segments, 12 or 24 hours, with a
// panel of columns and presets.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Stack, Text } from 'rui-core';
import { TimePicker } from 'rui-core/dates';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'time-picker',
  group: 'time',
  title: 'TimePicker',
  description: 'A time picked in segments (rui-core/dates): each segment is a control that the arrows step, digits type and Backspace clears (an empty one reads ··); ArrowLeft and ArrowRight move between them, A and P set AM and PM. `panel` adds columns of hours, minutes and seconds, and `presets`. The panel is a Popover below the field’s start: Escape or a press outside closes it. The segments sit in a `group` named by the Field’s label.',
  props: [
    { name: 'value / defaultValue / onChange', type: "string ('HH:mm:ss' or 'HH:mm')", description: 'The time; `\'\'` while a segment is empty.' },
    { name: 'format', type: "'24h' | '12h'", default: "'24h'", description: 'The hours shown.' },
    { name: 'seconds', type: 'boolean', default: 'false', description: 'A seconds segment.' },
    { name: 'min / max', type: 'string', description: 'The bounds.' },
    { name: 'hourStep / minuteStep / secondStep', type: 'number', default: '1', description: 'The arrows’ and the columns’ steps.' },
    { name: 'periods', type: '{ am, pm }', default: "{ am: 'AM', pm: 'PM' }", description: 'The 12-hour labels.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button.' },
    { name: 'panel', type: 'boolean', default: 'false', description: 'Columns to pick from; a press on a segment opens them.' },
    { name: 'presets', type: 'string[] | { label, times }[]', description: 'Times offered in the panel, or groups of them.' },
    { name: 'sticky', type: 'boolean', default: 'true', description: '`false`: a preset closes the panel.' },
    { name: 'popover', type: 'Popover props', description: 'The panel’s Popover options.' },
    { name: 'kind / hourDigits', type: "'time' | 'duration' / number", default: "'time' / 2", description: '`duration`: hours past 23 (at least `hourDigits` shown), digits typed into the hours without moving on, no panel.' },
    { name: 'label / description / error / size / radius / disabled', type: 'as TextInput', description: 'The field’s label, texts and look; `error` is the message under it.' },
    { name: 'invalid / asterisk', type: 'boolean / boolean | string | node', description: 'The invalid look alone; `asterisk` draws the mark by the label.' },
  ],
  demos: [
    {
      title: '24 and 12 hours',
      code: `
function Demo() {
  const time = $signal($active(), '14:05:00');
  return (
    <Stack gap="sm">
      <Row gap="md" align="end">
        <TimePicker label="Alarm (24 h)" value={time} onChange={t => $write(time, t)} seconds />
        <TimePicker label="Alarm (12 h)" value={time} onChange={t => $write(time, t)} format="12h" />
      </Row>
      <Text size="sm" fg="quiet">{() => \`value: \${$read(time) || '(incomplete)'}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const time = $signal($active(), '14:05:00');
        return (
          <Stack gap="sm">
            <Row gap="md" align="end">
              <TimePicker label="Alarm (24 h)" value={time} onChange={(/** @type {string} */ t) => $write(time, t)} seconds />
              <TimePicker label="Alarm (12 h)" value={time} onChange={(/** @type {string} */ t) => $write(time, t)} format="12h" />
            </Row>
            <Text size="sm" fg="quiet">
              {() => `value: ${$read(time) || '(incomplete)'}`}
            </Text>
          </Stack>
        );
      },
      height: 120,
    },
    {
      title: 'A panel with steps, presets and a Now button',
      code: `
const pad = n => String(n).padStart(2, '0');

function Demo() {
  const time = $signal($active(), '10:30');
  const now = () => {
    const d = new Date();
    $write(time, \`\${pad(d.getHours())}:\${pad(d.getMinutes())}\`);
  };
  return (
    <Row gap="sm" align="end">
      <TimePicker
        label="Meeting"
        panel
        clearable
        minuteStep={15}
        value={time}
        onChange={t => $write(time, t)}
        presets={[{ label: 'Meeting slots', times: ['09:30', '10:00', '10:30', '11:00'] }]}
        sticky={false}
      />
      <Button size="sm" variant="neutral" onPress={now}>Now</Button>
    </Row>
  );
}`,
      view: () => {
        const time = $signal($active(), '10:30');
        const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
        const now = () => {
          const d = new Date();
          $write(time, `${pad(d.getHours())}:${pad(d.getMinutes())}`);
        };
        return (
          <Row gap="sm" align="end">
            <TimePicker
              label="Meeting"
              panel
              clearable
              minuteStep={15}
              value={time}
              onChange={(/** @type {string} */ t) => $write(time, t)}
              presets={[{ label: 'Meeting slots', times: ['09:30', '10:00', '10:30', '11:00'] }]}
              sticky={false}
            />
            <Button size="sm" variant="neutral" onPress={now}>
              Now
            </Button>
          </Row>
        );
      },
      height: 330,
    },
  ],
};
