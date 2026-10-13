// TextAnimate (rui-core/more): text coming in or going out by segment.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Stack } from 'rui-core';
import { TextAnimate } from 'rui-core/more';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'text-animate',
  group: 'text',
  title: 'TextAnimate',
  description: 'Text that animates in or out by segment (rui-core/more): by word, character, line or all of it, with any Transition effect, one segment after another on the Clock.',
  props: [
    { name: 'children / text', type: 'string', description: 'The text.' },
    { name: 'play', type: "'in' | 'out' | false", default: "'in'", description: 'Which way, or false for the text as it is; a change replays it.' },
    { name: 'split', type: "'words' | 'chars' | 'lines' | false", default: "'words'", description: 'The segments; false animates the whole text at once. Words sit 5 px apart (`ratios.mark` of the body size).' },
    { name: 'effect', type: "'fade' | 'rise' | 'slide-bottom' | 'grow' | … (a name of EFFECTS)", default: "'fade'", description: 'How a segment comes in: any Transition effect, always faded as well.' },
    { name: 'duration / stagger / delay', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'calm' (300) / 50 / 0", description: 'A segment’s time (ms or a motion preset), the time between segments and the wait before the first (ms).' },
    { name: 'easing', type: "'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'settle' | ((t: number) => number)", default: "'ease-out'", description: 'The easing.' },
    { name: 'onStart / onEnd', type: '() => void', description: 'Called as it starts and ends.' },
    { name: 'style props', type: 'fontSize, fontWeight, fg, …', description: 'As Text.' },
  ],
  demos: [
    {
      title: 'In and out, by word and by character',
      code: `
function Demo() {
  const shown = $signal($active(), true);
  return (
    <Stack gap="md">
      <Row>
        <Button size="xs" onPress={() => $write(shown, !$read(shown))}>{() => ($read(shown) ? 'Let it go' : 'Bring it back')}</Button>
      </Row>
      <TextAnimate play={() => ($read(shown) ? 'in' : 'out')} split="words" effect="slide-bottom" fontSize="xl" fontWeight={700}>
        The tide comes in at dawn
      </TextAnimate>
      <TextAnimate play={() => ($read(shown) ? 'in' : 'out')} split="chars" effect="fade" stagger={20} fg="quiet">
        and leaves the shore by noon
      </TextAnimate>
    </Stack>
  );
}`,
      view: () => {
        const shown = $signal($active(), true);
        return (
          <Stack gap="md">
            <Row>
              <Button size="xs" onPress={() => $write(shown, !$read(shown))}>
                {() => ($read(shown) ? 'Let it go' : 'Bring it back')}
              </Button>
            </Row>
            <TextAnimate play={() => ($read(shown) ? 'in' : 'out')} split="words" effect="slide-bottom" fontSize="xl" fontWeight={700}>
              The tide comes in at dawn
            </TextAnimate>
            <TextAnimate play={() => ($read(shown) ? 'in' : 'out')} split="chars" effect="fade" stagger={20} fg="quiet">
              and leaves the shore by noon
            </TextAnimate>
          </Stack>
        );
      },
      height: 140,
    },
  ],
};
