// Pin: content fixed to a corner of the viewport, shown on demand.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Dialog, Pin, Row, Stack, Text, Textarea, Transition } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'pin',
  group: 'layers',
  title: 'Pin',
  description: 'Content fixed to a corner of the viewport (`position: fixed`), over the page and its scroll: on the DOM the browser window’s corner, on a canvas the canvas’s.',
  props: [
    { name: 'at', type: '{ top?, right?, bottom?, left? }', default: "{ bottom: 'lg', right: 'lg' }", description: 'Its distances from the viewport’s edges: pixels or spacing steps.' },
    { name: 'layer', type: 'number', default: 'LAYERS.raised (10)', description: 'Its stacking order.' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'In the portal layer; false keeps it in place in the tree (still fixed).' },
    { name: 'children', type: 'any', description: 'What it holds.' },
    { name: 'style props', type: 'm, p, w, …', description: 'As Box.' },
  ],
  demos: [
    {
      title: 'A feedback button in the bottom-left corner',
      code: `
function Demo() {
  const shown = $signal($active(), false);
  const asking = $signal($active(), false);
  const sent = $signal($active(), 0);
  return (
    <>
      <Row gap="sm">
        <Button variant="neutral" onPress={() => ($write(shown, !$read(shown)), $write(asking, false))}>{() => ($read(shown) ? 'Hide the pin' : 'Show the pin')}</Button>
        <Text size="sm" fg="quiet">{() => \`It fades up in the window’s bottom-left corner. Sent: \${$read(sent)}\`}</Text>
      </Row>
      <Pin at={{ bottom: 'lg', left: 'lg' }}>
        <Transition shown={shown} effect="rise" duration="quick">
          <Button variant="soft" onPress={() => $write(asking, !$read(asking))}>Feedback</Button>
        </Transition>
      </Pin>
      <Dialog open={asking} onOpenChange={open => $write(asking, open)} at={{ bottom: 72, left: 'lg' }} size="sm" closable>
        <Stack gap="sm">
          <Text fontWeight={600}>How is this page working for you?</Text>
          <Textarea placeholder="What would you change?" rows={3} />
          <Button size="xs" onPress={() => ($write(sent, $read(sent) + 1), $write(asking, false))}>Send</Button>
        </Stack>
      </Dialog>
    </>
  );
}`,
      view: () => {
        const shown = $signal($active(), false);
        const asking = $signal($active(), false);
        const sent = $signal($active(), 0);
        return (
          <>
            <Row gap="sm">
              <Button variant="neutral" onPress={() => ($write(shown, !$read(shown)), $write(asking, false))}>
                {() => ($read(shown) ? 'Hide the pin' : 'Show the pin')}
              </Button>
              <Text size="sm" fg="quiet">
                {() => `It fades up in the window’s bottom-left corner. Sent: ${$read(sent)}`}
              </Text>
            </Row>
            <Pin at={{ bottom: 'lg', left: 'lg' }}>
              <Transition shown={shown} effect="rise" duration="quick">
                <Button variant="soft" onPress={() => $write(asking, !$read(asking))}>
                  Feedback
                </Button>
              </Transition>
            </Pin>
            <Dialog open={asking} onOpenChange={(/** @type {boolean} */ open) => $write(asking, open)} at={{ bottom: 72, left: 'lg' }} size="sm" closable>
              <Stack gap="sm">
                <Text fontWeight={600}>How is this page working for you?</Text>
                <Textarea placeholder="What would you change?" rows={3} />
                <Button size="xs" onPress={() => ($write(sent, $read(sent) + 1), $write(asking, false))}>
                  Send
                </Button>
              </Stack>
            </Dialog>
          </>
        );
      },
      height: 120,
    },
  ],
};
