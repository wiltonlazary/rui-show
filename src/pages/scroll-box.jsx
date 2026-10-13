// ScrollBox: a bounded region that scrolls its content.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { ScrollBox, Surface, Row, Button, Stack, Text, TextInput } from 'rui-core';

/** A team thread, one short line a message. */
const THREAD = [
  'Standup moved to 9:30',
  'Build 412 is green',
  'Who has the release notes?',
  'I do, draft by noon',
  'Design review at 14:00',
  'The new icons are in',
  'Staging is updated',
  'QA starts after lunch',
  'Two bugs left on the board',
  'Both have owners now',
  'Release branch is cut',
  'Ship it on Thursday',
];

/** A message row's height, so the readout knows what is below. */
const ROW = 30;
/** The thread's viewport. */
const VIEW = 120;

/** The short notes the bars' demo scrolls. */
const NOTES = Array.from({ length: 12 }, (_, i) => `Note ${i + 1}`);

/** The bars' looks the second demo shows: its name and its `bars`. @type {[string, any][]} */
const LOOKS = [
  ['Default', true],
  ['Thin', { thin: true }],
  ['None', false],
  ['Teal', { thin: true, color: 'teal', track: 'teal.1' }],
];

/** What is under the viewport, from the scroll position. @param {number} y */
const below = y => {
  const n = THREAD.length - Math.floor((y + VIEW) / ROW + 0.01);
  return n <= 0 ? 'at the bottom' : n === 1 ? '1 new message below' : `${n} new messages below`;
};

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'scroll-box',
  group: 'structure',
  title: 'ScrollBox',
  description:
    'A scrolling region bounded by `h` or `maxHeight`, reporting its position. Its bars are drawn by the renderer (the browser on the DOM, ren-canv on the canvases) as `bars` says: the theme’s width or half of it, none, and colors from the theme.',
  props: [
    { name: 'h', type: 'number | string', description: 'Its height: the content scrolls within it.' },
    { name: 'maxHeight', type: 'number | string', description: 'Its greatest height (ScrollBox.Fit: as high as its content up to this).' },
    { name: 'axis', type: "'y' | 'x' | 'both'", default: "'y'", description: 'The way it scrolls: down, across, or both.' },
    { name: 'onScroll', type: '(position: { x: number, y: number }) => void', description: 'Hears the scroll position: the offsets across and down.' },
    { name: 'ref', type: '((node) => void) | Signal', description: 'Gets the Scroll primitive (its `scrollTop` and `scrollLeft` read and set the position).' },
    { name: 'gutter', type: 'boolean', default: 'false', description: 'Keeps room for a scrollbar (spacing xs), so it does not cover content.' },
    {
      name: 'bars',
      type: 'boolean | { thin, color, track }',
      default: 'true',
      description: 'Its bars: as wide as the theme’s bar, the thumb in the page’s `border` on its `track`; `false` none and no room kept for them (the wheel, touch and `scrollTop` still scroll it); options: `thin` (half as wide), `color` (the thumb’s) and `track`, theme colors.',
    },
    { name: 'tabIndex', type: 'number', description: 'Its place in the focus: -1 is focusable from code (its ref’s `focus()`), out of the Tab order, as a skip link’s target.' },
    { name: 'children', type: 'any', description: 'The content.' },
    { name: 'style props', type: 'm, p, w, …', description: 'As Box.' },
  ],
  demos: [
    {
      title: 'A fixed height, and what is below',
      code: `
// THREAD: twelve messages, ['Standup moved to 9:30', 'Build 412 is green', …]
const ROW = 30;
const VIEW = 120;

const below = y => {
  const n = THREAD.length - Math.floor((y + VIEW) / ROW + 0.01);
  return n <= 0 ? 'at the bottom' : n === 1 ? '1 new message below' : \`\${n} new messages below\`;
};

function Demo() {
  const y = $signal($active(), 0);
  return (
    <Stack gap="xs">
      <Surface bordered>
        <ScrollBox h={VIEW} onScroll={p => $write(y, p.y)}>
          <Stack gap={0}>
            {THREAD.map(text => <Row h={ROW} px="sm" align="center"><Text size="sm" truncate="end">{text}</Text></Row>)}
          </Stack>
        </ScrollBox>
      </Surface>
      <Text size="sm" fg="quiet">{() => below($read(y))}</Text>
    </Stack>
  );
}`,
      view: () => {
        const y = $signal($active(), 0);
        return (
          <Stack gap="xs">
            <Surface bordered>
              <ScrollBox h={VIEW} onScroll={(/** @type {{ y: number }} */ p) => $write(y, p.y)}>
                <Stack gap={0}>
                  {THREAD.map(text => (
                    <Row h={ROW} px="sm" align="center">
                      <Text size="sm" truncate="end">
                        {text}
                      </Text>
                    </Row>
                  ))}
                </Stack>
              </ScrollBox>
            </Surface>
            <Text size="sm" fg="quiet">
              {() => below($read(y))}
            </Text>
          </Stack>
        );
      },
      height: 170,
      clipped: true,
    },
    {
      title: 'Bars: the theme’s, thin, none, and colors of their own',
      code: `
const ROW = 30;
const VIEW = 120;
const NOTES = Array.from({ length: 12 }, (_, i) => \`Note \${i + 1}\`);
const LOOKS = [
  ['Default', true],
  ['Thin', { thin: true }],
  ['None', false],
  ['Teal', { thin: true, color: 'teal', track: 'teal.1' }],
];

function Demo() {
  return (
    <Row gap="sm" align="start">
      {LOOKS.map(([name, bars]) => (
        <Stack gap={4} w={150}>
          <Text size="sm" fg="quiet">{name}</Text>
          <Surface bordered>
            <ScrollBox h={VIEW} bars={bars}>
              <Stack gap={0}>
                {NOTES.map(text => <Row h={ROW} px="sm" align="center"><Text size="sm">{text}</Text></Row>)}
              </Stack>
            </ScrollBox>
          </Surface>
        </Stack>
      ))}
    </Row>
  );
}`,
      view: () => (
        <Row gap="sm" align="start">
          {LOOKS.map(([name, bars]) => (
            <Stack gap={4} w={150}>
              <Text size="sm" fg="quiet">
                {name}
              </Text>
              <Surface bordered>
                <ScrollBox h={VIEW} bars={bars}>
                  <Stack gap={0}>
                    {NOTES.map(text => (
                      <Row h={ROW} px="sm" align="center">
                        <Text size="sm">{text}</Text>
                      </Row>
                    ))}
                  </Stack>
                </ScrollBox>
              </Surface>
            </Stack>
          ))}
        </Row>
      ),
      height: 170,
      clipped: true,
    },
    {
      title: 'A composer whose messages grow up to a height',
      code: `
function Demo() {
  const messages = $signal($active(), ['Is the demo room free at four?', 'Yes, I booked it.']);
  const draft = $signal($active(), '');
  const send = () => {
    const text = $read(draft).trim();
    if (text === '') return;
    $write(messages, [...$read(messages), text]);
    $write(draft, '');
  };
  return (
    <Stack gap="sm">
      <Surface bordered>
        <ScrollBox.Fit maxHeight={240} p="xs">
          <Stack gap={6}>
            {() => $read(messages).map(text => <Text size="sm">{text}</Text>)}
          </Stack>
        </ScrollBox.Fit>
      </Surface>
      <Row gap="xs" align="end">
        <TextInput w={260} placeholder="Write a message" value={draft} onChange={v => $write(draft, v)} onSubmit={send} />
        <Button onPress={send}>Send</Button>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const messages = $signal($active(), ['Is the demo room free at four?', 'Yes, I booked it.']);
        const draft = $signal($active(), '');
        const send = () => {
          const text = $read(draft).trim();
          if (text === '') return;
          $write(messages, [...$read(messages), text]);
          $write(draft, '');
        };
        return (
          <Stack gap="sm">
            <Surface bordered>
              <ScrollBox.Fit maxHeight={240} p="xs">
                <Stack gap={6}>
                  {() =>
                    $read(messages).map(text => (
                      <Text size="sm">{text}</Text>
                    ))
                  }
                </Stack>
              </ScrollBox.Fit>
            </Surface>
            <Row gap="xs" align="end">
              <TextInput w={260} placeholder="Write a message" value={draft} onChange={(/** @type {string} */ v) => $write(draft, v)} onSubmit={send} />
              <Button onPress={send}>Send</Button>
            </Row>
          </Stack>
        );
      },
      height: 330,
      clipped: true,
    },
  ],
};
