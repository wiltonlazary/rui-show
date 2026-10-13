// AnalogClock (rui-core/more): a running clock, and a set time, drawn with
// Shape on the Clock.

import { Row } from 'rui-core';
import { AnalogClock } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'analog-clock',
  group: 'time',
  title: 'AnalogClock',
  description: 'An analog clock (rui-core/more) drawn with the portable Shape. It runs on rui-core’s Clock (a manual clock in tests holds it still), or shows a set time.',
  props: [
    { name: 'value', type: 'Date | number | string', description: 'Shows that time, following it when it changes; else it runs.' },
    { name: 'defaultValue', type: 'Date | number | string', default: 'now', description: 'Where a running clock starts.' },
    { name: 'running', type: 'boolean', default: 'true', description: 'Whether it moves: turned off it pauses where it is, turned on again it resumes from the time it had reached.' },
    { name: 'size', type: 'number', default: '200', description: 'Its diameter.' },
    { name: 'seconds / secondHand', type: "boolean / 'tick' | 'smooth'", default: "true / 'tick'", description: 'The second hand, and how it moves.' },
    { name: 'numerals', type: 'boolean', default: 'true', description: 'The hours on the dial.' },
    { name: 'utc', type: 'boolean', default: 'false', description: 'UTC instead of local time.' },
    { name: 'color / hourHandColor / minuteHandColor', type: 'string', default: "'red' / the text’s", description: 'The hands’ colors.' },
    { name: 'onChange', type: '(ms) => void', description: 'Hears each time shown: each second, or each frame when `secondHand` is `smooth`.' },
  ],
  demos: [
    {
      title: 'Running, and a set time',
      code: `
function Demo() {
  return (
    <Row gap="xl">
      <AnalogClock size={160} secondHand="smooth" />
      <AnalogClock size={160} value="2026-09-26T10:08:42" numerals={false} color="blue" />
      <AnalogClock size={100} value="2026-09-26T19:45:00" seconds={false} hourHandColor="purple" minuteHandColor="teal" />
    </Row>
  );
}`,
      view: () => (
        <Row gap="xl">
          <AnalogClock size={160} secondHand="smooth" />
          <AnalogClock size={160} value="2026-09-26T10:08:42" numerals={false} color="blue" />
          <AnalogClock size={100} value="2026-09-26T19:45:00" seconds={false} hourHandColor="purple" minuteHandColor="teal" />
        </Row>
      ),
      height: 192,
    },
  ],
};
