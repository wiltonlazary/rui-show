// Onboarding (rui-core/more): a tour over marked spots.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Stack, Text, TextInput, Switch } from 'rui-core';
import { Onboarding } from 'rui-core/more';

const STEPS = [
  { spot: 'start', title: 'Start here', content: 'This button starts the tour again.' },
  { spot: 'name', title: 'Display name', content: 'The name shown beside your comments.' },
  { spot: 'notify', title: 'Digest', content: 'A weekly summary, if you want one.' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'onboarding',
  group: 'wayfinding',
  title: 'Onboarding',
  description: 'A guided tour (rui-core/more): the page dims except for a hole around each step’s spot (an Onboarding.Spot), with a card of the step’s title and text, Back, Next, Skip and Finish. The tour covers its own box: put it around the page. Escape skips.',
  props: [
    { name: 'steps', type: '{ spot, title, content }[]', description: 'The steps, each naming its Onboarding.Spot’s `id` as `spot`.' },
    { name: 'started / defaultStarted / onStartedChange', type: 'boolean', default: 'false', description: 'Whether the tour shows: held by you with `started` and `onStartedChange(started)`, or its own from `defaultStarted`. Finish and Skip end it.' },
    { name: 'value / defaultValue / onChange', type: 'number', default: '0', description: 'The step shown. Finish on the last step sets it back to 0, so an uncontrolled tour started again begins at the first; Skip leaves it where it was.' },
    { name: 'onEnd / onSkip', type: '() => void', description: 'After the last step’s Finish; on Skip or Escape.' },
    { name: 'cutout', type: 'number', default: '8', description: 'The room around a spot in its hole.' },
    { name: 'backdrop', type: 'boolean | { color, opacity }', default: 'the theme’s black at opacity.disabled (.45)', description: 'The dimming (`{ color, opacity }`); `false` for none.' },
    { name: 'layer', type: 'number', default: 'LAYERS.float (30)', description: 'The stacking step: above sheets, so a tour covers an open Modal.' },
    { name: 'cardWidth', type: 'number', default: '280', description: 'The card’s width.' },
    { name: 'nextLabel / previousLabel / skipLabel / finishLabel', type: 'string', description: 'The buttons’ words.' },
    { name: 'Onboarding.Spot', type: '{ id, children }', description: 'A spot a step points at, anywhere inside.' },
  ],
  demos: [
    {
      title: 'A tour of a form',
      code: `
const STEPS = [
  { spot: 'start', title: 'Start here', content: 'This button starts the tour again.' },
  { spot: 'name', title: 'Display name', content: 'The name shown beside your comments.' },
  { spot: 'notify', title: 'Digest', content: 'A weekly summary, if you want one.' },
];

function Demo() {
  const started = $signal($active(), false);
  const step = $signal($active(), 0);
  const ended = $signal($active(), 'not taken');
  return (
    <Onboarding steps={STEPS} started={started} onStartedChange={v => $write(started, v)} value={step} onChange={s => $write(step, s)} onEnd={() => $write(ended, 'finished')} onSkip={() => $write(ended, 'skipped')}>
      <Stack gap="md" h={330}>
        <Row gap="sm">
          <Onboarding.Spot id="start"><Button onPress={() => ($write(step, 0), $write(started, true))}>Take the tour</Button></Onboarding.Spot>
          <Text size="sm" fg="quiet">{() => \`tour: \${$read(ended)}\`}</Text>
        </Row>
        <Onboarding.Spot id="name"><TextInput w={260} label="Display name" placeholder="e.g. Tomás Reyes" /></Onboarding.Spot>
        <Onboarding.Spot id="notify"><Switch label="Send me the weekly digest" /></Onboarding.Spot>
      </Stack>
    </Onboarding>
  );
}`,
      view: () => {
        const started = $signal($active(), false);
        const step = $signal($active(), 0);
        const ended = $signal($active(), 'not taken');
        return (
          <Onboarding steps={STEPS} started={started} onStartedChange={(/** @type {boolean} */ v) => $write(started, v)} value={step} onChange={(/** @type {number} */ s) => $write(step, s)} onEnd={() => $write(ended, 'finished')} onSkip={() => $write(ended, 'skipped')}>
            <Stack gap="md" h={330}>
              <Row gap="sm">
                <Onboarding.Spot id="start">
                  <Button onPress={() => ($write(step, 0), $write(started, true))}>Take the tour</Button>
                </Onboarding.Spot>
                <Text size="sm" fg="quiet">
                  {() => `tour: ${$read(ended)}`}
                </Text>
              </Row>
              <Onboarding.Spot id="name">
                <TextInput w={260} label="Display name" placeholder="e.g. Tomás Reyes" />
              </Onboarding.Spot>
              <Onboarding.Spot id="notify">
                <Switch label="Send me the weekly digest" />
              </Onboarding.Spot>
            </Stack>
          </Onboarding>
        );
      },
      height: 362,
    },
  ],
};
