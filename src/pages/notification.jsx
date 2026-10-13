// Notification: a tone dot or icon, content of one's own, a loading rule, a close button.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, CheckIcon, Notification, Progress, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'notification',
  group: 'status',
  title: 'Notification',
  description: 'A toast-like card on a raised surface with a 1 px edge and a medium shadow: a tone dot (or an icon) in its color beside the first line, a strong title over a message in the text color dimmed under it, a close button, and while loading a thin rule sweeping along the bottom edge; the same card on every renderer (showing and stacking them is the application’s). It means a status, an alert in red.',
  props: [
    { name: 'title', type: 'string | (() => string) | any', description: 'The first line: strong, in the text color.' },
    { name: 'children', type: 'string | number | (() => string) | any', description: 'The message: text becomes a Label a type step below the title, in the text color dimmed to `opacity.muted` under a title (the text color alone); other children show as they are.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The tone: the dot’s, the icon’s and the loading rule’s color.' },
    { name: 'icon', type: 'any', description: 'Shown in place of the dot, at ratios.icon (.62) of the first line, with no circle behind; a drawn icon or Text takes its own `color`.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'A 2 px rule along the bottom edge with a segment sweeping across (still, in the middle, under reduced motion), and `aria-busy`; the dot or icon stays.' },
    { name: 'closable', type: 'boolean | CloseButton props | any', default: 'true', description: 'The close button at the end, a CloseButton at size xs: its options (`{ label }`, the accessible label, “Close” by default), or a node of your own.' },
    { name: 'onClose', type: '(event) => void', description: 'Called when the close button is pressed.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius: a scale step or pixels.' },
  ],
  demos: [
    {
      title: 'A finished backup',
      code: `
function Demo() {
  const closed = $signal($active(), 0);
  return (
    <Stack gap="sm">
      <Notification title="Backup finished" onClose={() => $write(closed, $read(closed) + 1)}>
        Your photos were copied to the archive drive
      </Notification>
      <Text size="sm" fg="quiet">{() => \`closed \${$read(closed)} times\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const closed = $signal($active(), 0);
        return (
          <Stack gap="sm">
            <Notification title="Backup finished" onClose={() => $write(closed, $read(closed) + 1)}>
              Your photos were copied to the archive drive
            </Notification>
            <Text size="sm" fg="quiet">
              {() => `closed ${$read(closed)} times`}
            </Text>
          </Stack>
        );
      },
      height: 120,
    },
    {
      title: 'Icons in the tone, and progress inside',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Notification color="indigo" title="New sign-in" icon={<Text size="sm" fg="indigo" fontWeight={700}>i</Text>}>A tablet in Porto signed in to your account</Notification>
      <Notification color="green" title="Invoice paid" icon={<CheckIcon size={13} color="green" />}>March hosting, 24.00 EUR</Notification>
      <Notification color="orange" title="Storage almost full" icon={<Text size="sm" fg="orange" fontWeight={700}>!</Text>}>9.6 of 10 GB used; old drafts can go</Notification>
      <Notification color="teal" title="Syncing 3 folders">
        <Stack gap={6}>
          <Text size="sm" fg="quiet">2 of 3 done: Invoices is next</Text>
          <Progress value={67} color="teal" size="sm" />
        </Stack>
      </Notification>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Notification
            color="indigo"
            title="New sign-in"
            icon={
              <Text size="sm" fg="indigo" fontWeight={700}>
                i
              </Text>
            }
          >
            A tablet in Porto signed in to your account
          </Notification>
          <Notification color="green" title="Invoice paid" icon={<CheckIcon size={13} color="green" />}>
            March hosting, 24.00 EUR
          </Notification>
          <Notification
            color="orange"
            title="Storage almost full"
            icon={
              <Text size="sm" fg="orange" fontWeight={700}>
                !
              </Text>
            }
          >
            9.6 of 10 GB used; old drafts can go
          </Notification>
          <Notification color="teal" title="Syncing 3 folders">
            <Stack gap={6}>
              <Text size="sm" fg="quiet">
                2 of 3 done: Invoices is next
              </Text>
              <Progress value={67} color="teal" size="sm" />
            </Stack>
          </Notification>
        </Stack>
      ),
      height: 340,
    },
    {
      title: 'Radius and a message only',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Notification radius="lg" color="purple">A round notification without a title</Notification>
      <Notification radius={0} color="orange" closable={false}>Square corners, no close button</Notification>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Notification radius="lg" color="purple">
            A round notification without a title
          </Notification>
          <Notification radius={0} color="orange" closable={false}>
            Square corners, no close button
          </Notification>
        </Stack>
      ),
      height: 120,
    },
    {
      title: 'Loading: a rule sweeps the bottom edge',
      code: `
function Demo() {
  const loading = $signal($active(), true);
  return (
    <Stack gap="sm">
      <Notification color="cyan" loading={loading} closable={false} title={() => ($read(loading) ? 'Uploading 12 photos' : 'Upload complete')}>
        {() => ($read(loading) ? 'Harbor trip, 8 of 12 sent' : 'Harbor trip, 12 photos in the album')}
      </Notification>
      <Row gap="xs">
        <Button size="xs" variant="neutral" onPress={() => $write(loading, !$read(loading))}>
          {() => ($read(loading) ? 'Finish' : 'Start again')}
        </Button>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const loading = $signal($active(), true);
        return (
          <Stack gap="sm">
            <Notification color="cyan" loading={loading} closable={false} title={() => ($read(loading) ? 'Uploading 12 photos' : 'Upload complete')}>
              {() => ($read(loading) ? 'Harbor trip, 8 of 12 sent' : 'Harbor trip, 12 photos in the album')}
            </Notification>
            <Row gap="xs">
              <Button size="xs" variant="neutral" onPress={() => $write(loading, !$read(loading))}>
                {() => ($read(loading) ? 'Finish' : 'Start again')}
              </Button>
            </Row>
          </Stack>
        );
      },
      height: 130,
    },
  ],
};
