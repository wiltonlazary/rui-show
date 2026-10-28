// Notifications (rui-core/notifications): a store per root, shown, updated
// and cleared, at every place, with a limit; the rest wait their turn.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, SegmentedControl, Stack, Text } from 'rui-core';
import { $timeout } from 'rui-core/hooks';
import { Notifications, $notifications, NOTIFICATION_PLACES } from 'rui-core/notifications';

/** The photos a backup saves, one by one. */
const PHOTOS = ['dock.jpg', 'gulls.jpg', 'ferry.jpg', 'pier.jpg', 'dusk.jpg'];

/** A backup on the nearest store: one loading notice whose text counts the photos, updated to a plain "Saved", or to "Backup stopped" by Stop. */
function Backup() {
  const notifications = $notifications();
  const saved = $signal($active(), 0);
  const job = $signal($active(), '');
  const step = $timeout((/** @type {string} */ id) => {
    $write(saved, $read(saved) + 1);
    if ($read(saved) < PHOTOS.length) {
      notifications.update({ id, text: `${$read(saved)} of ${PHOTOS.length}: ${PHOTOS[$read(saved)]}` });
      step.start(id);
    } else notifications.update({ id, loading: false, title: 'Saved', text: `${PHOTOS.length} photos in Harbor walk`, timeout: 4000 });
  }, 700);
  const start = () => {
    $write(saved, 0);
    /** @type {string} */
    const id = notifications.show({ loading: true, title: 'Backing up Harbor walk', timeout: false, text: `0 of ${PHOTOS.length}: ${PHOTOS[0]}` });
    $write(job, id);
    step.start(id);
  };
  const stop = () => {
    step.stop();
    notifications.update({ id: $read(job), loading: false, title: 'Backup stopped', text: `${$read(saved)} of ${PHOTOS.length} saved`, timeout: 4000 });
  };
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button onPress={start} disabled={() => $read(step.value)}>
          Back up
        </Button>
        <Button variant="neutral" onPress={stop} disabled={() => !$read(step.value)}>
          Stop
        </Button>
      </Row>
      <Text size="sm" fg="quiet">{() => `${notifications.shown().length} shown, ${notifications.waiting().length} waiting`}</Text>
    </Stack>
  );
}

/** A place picked with a SegmentedControl, then a notification there. */
function Places() {
  const notifications = $notifications();
  const at = $signal($active(), /** @type {string} */ ('top-end'));
  return (
    <Stack gap="sm" mt={100}>
      <SegmentedControl aria-label="Place" size="xs" data={[...NOTIFICATION_PLACES]} value={() => $read(at)} onChange={(/** @type {string} */ v) => $write(at, v)} />
      <Button w={140} onPress={() => notifications.show({ at: /** @type {any} */ ($read(at)), color: 'magenta', title: 'Heads up', text: `Shown at ${$read(at)}` })}>
        Notify
      </Button>
      <Text size="sm" fg="quiet">
        {() =>
          [...notifications.places()].map(([place, q]) => `${place}: ${q.shown.length} shown, ${q.waiting.length} waiting`).join('; ') || 'nothing shown'
        }
      </Text>
    </Stack>
  );
}

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'notifications',
  group: 'status',
  title: 'Notifications',
  description: 'Notifications in the portal layer (rui-core/notifications): a store per application root (never a global), reached with `$notifications()` for `show`, `hide`, `update`, `clear`, `clearWaiting` and `set`, and read by place with `places()`. Each closes itself after `timeout`; beyond `limit` per place they wait their turn. Each place’s stack stands an lg step in from its edge and both sides (a notification narrows to fit a narrower viewport), its notifications an sm step apart; one sinks in from a short step above at the top (rises from below at the bottom), fading, and leaves the same way. On a phone (a viewport narrower than the theme’s sm breakpoint) a Modal, Drawer or Dialog fills the screen, so the notices claim their edge’s room and an open sheet stands clear of it: a Modal’s scroller ends above the notices at the bottom (scrolling its content up, so its bottom action stays in view) or below those at the top; wider, nothing moves.',
  props: [
    { name: 'at', type: "'top-start' | 'top-end' | 'top-center' | 'bottom-start' | 'bottom-end' | 'bottom-center'", default: "'top-end'", description: 'Where notifications go unless their own says otherwise.' },
    { name: 'limit', type: 'number', default: '4', description: 'How many show per place; the rest wait their turn.' },
    { name: 'timeout', type: 'number | false', default: '5000', description: 'When they close themselves (a notification’s own wins).' },
    { name: 'duration', type: "'quick' | 'base' | 'calm' | 'hold' | number", default: "'base' (190 ms)", description: 'Their slide in and out: a MOTION preset or ms.' },
    { name: 'width', type: 'number', default: 'theme.sizes.box.toast (360)', description: 'Each notification’s width, narrowed to fit a narrower viewport.' },
    { name: 'layer', type: 'number', default: 'LAYERS.toast (40)', description: 'The stacks’ stacking order.' },
    { name: 'portal', type: 'boolean', default: 'true', description: 'In the portal layer (over the viewport).' },
    { name: 'store', type: 'NotificationsStore', default: '$notifications()', description: 'The store it shows: the nearest, or one made with `notificationsStore(root?)`.' },
    { name: 'children', type: 'any', description: 'Inside, `$notifications()` finds this store.' },
    { name: 'show(data)', type: '{ id, title, text, color, icon, loading, timeout, closable, radius, style, at, onShow, onHide }', description: 'Adds a notification (a Notification with that data); returns its id.' },
    { name: 'update(data) / hide(id) / clear() / clearWaiting()', type: 'store methods', description: 'Merges into one by id (its title, text, icon, close button and the rest change in place), removes one, removes all, removes the waiting ones.' },
    { name: 'set(list)', type: 'store method', description: 'Puts a whole new list in place of the current one.' },
    { name: 'all() / shown() / waiting()', type: 'store reads (tracked)', description: 'Every notification, those shown (per place, the first `limit`), those waiting their turn.' },
    { name: 'places()', type: 'Map<place, { shown, waiting }> (tracked)', description: 'Each place in use, with its shown and waiting notifications in order.' },
  ],
  demos: [
    {
      title: 'A backup that counts its photos',
      code: `
const PHOTOS = ['dock.jpg', 'gulls.jpg', 'ferry.jpg', 'pier.jpg', 'dusk.jpg'];

function Backup() {
  const notifications = $notifications();
  const saved = $signal($active(), 0);
  const job = $signal($active(), '');
  const step = $timeout(id => {
    $write(saved, $read(saved) + 1);
    if ($read(saved) < PHOTOS.length) {
      notifications.update({ id, text: \`\${$read(saved)} of \${PHOTOS.length}: \${PHOTOS[$read(saved)]}\` });
      step.start(id);
    } else notifications.update({ id, loading: false, title: 'Saved', text: \`\${PHOTOS.length} photos in Harbor walk\`, timeout: 4000 });
  }, 700);
  const start = () => {
    $write(saved, 0);
    const id = notifications.show({ loading: true, title: 'Backing up Harbor walk', timeout: false, text: \`0 of \${PHOTOS.length}: \${PHOTOS[0]}\` });
    $write(job, id);
    step.start(id);
  };
  const stop = () => {
    step.stop();
    notifications.update({ id: $read(job), loading: false, title: 'Backup stopped', text: \`\${$read(saved)} of \${PHOTOS.length} saved\`, timeout: 4000 });
  };
  return (
    <Stack gap="sm">
      <Row gap="xs">
        <Button onPress={start} disabled={() => $read(step.value)}>Back up</Button>
        <Button variant="neutral" onPress={stop} disabled={() => !$read(step.value)}>Stop</Button>
      </Row>
      <Text size="sm" fg="quiet">{() => \`\${notifications.shown().length} shown, \${notifications.waiting().length} waiting\`}</Text>
    </Stack>
  );
}

function Demo() {
  return (
    <Notifications limit={3} width={320}>
      <Backup />
    </Notifications>
  );
}`,
      view: () => (
        <Notifications limit={3} width={320}>
          <Backup />
        </Notifications>
      ),
      height: 330,
    },
    {
      title: 'Picking the place, read by place',
      code: `
// NOTIFICATION_PLACES: top-start, top-center, top-end, bottom-start, bottom-center, bottom-end
function Places() {
  const notifications = $notifications();
  const at = $signal($active(), 'top-end');
  return (
    <Stack gap="sm" mt={100}>
      <SegmentedControl aria-label="Place" size="xs" data={[...NOTIFICATION_PLACES]} value={() => $read(at)} onChange={v => $write(at, v)} />
      <Button w={140} onPress={() => notifications.show({ at: $read(at), color: 'magenta', title: 'Heads up', text: \`Shown at \${$read(at)}\` })}>Notify</Button>
      <Text size="sm" fg="quiet">
        {() => [...notifications.places()].map(([place, q]) => \`\${place}: \${q.shown.length} shown, \${q.waiting.length} waiting\`).join('; ') || 'nothing shown'}
      </Text>
    </Stack>
  );
}

function Demo() {
  return (
    <Notifications timeout={3000} width={300}>
      <Places />
    </Notifications>
  );
}`,
      view: () => (
        <Notifications timeout={3000} width={300}>
          <Places />
        </Notifications>
      ),
      height: 320,
    },
  ],
};
