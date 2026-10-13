// Launcher (rui-core/launcher): the action center, opening from a button or
// Ctrl K; groups, a maximum and the search highlighted, one demo each.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Key, Stack, Text } from 'rui-core';
import { Launcher, $launcher, launcherStore } from 'rui-core/launcher';

const GROUPS = [
  {
    label: 'Garden',
    actions: [
      { id: 'water', label: 'Water the beds' },
      { id: 'prune', label: 'Prune the roses' },
      { id: 'harvest', label: 'Harvest the beans' },
    ],
  },
  {
    label: 'Shed',
    actions: [
      { id: 'tools', label: 'Sharpen the tools', tags: ['shears', 'blade'] },
      { id: 'seeds', label: 'Sort the seeds' },
    ],
  },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({ id: day, label: `Plan ${day}` }));

const HOME = [
  { id: 'lights', label: 'Turn the lights off' },
  { id: 'heating', label: 'Turn the heating down' },
  { id: 'blinds', label: 'Lower the blinds' },
  { id: 'alarm', label: 'Set the alarm' },
];

/** The button and the last action. @param {{ last: () => string }} props */
function Opener(props) {
  const launcher = $launcher();
  return (
    <Stack gap="xs">
      <Row gap="sm">
        <Button onPress={() => launcher.open()}>Open launcher</Button>
        <Text size="sm" fg="quiet">or press</Text>
        <Key>Ctrl</Key>
        <Key>K</Key>
        <Text size="sm" fg="quiet">anywhere in the app</Text>
      </Row>
      <Text size="sm" fg="quiet">{() => `last action: ${props.last()}`}</Text>
    </Stack>
  );
}

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'launcher',
  group: 'wayfinding',
  title: 'Launcher',
  description: 'The Ctrl+K action center (rui-core/launcher) on Modal and the combobox’s keyboard list: a search over actions or groups of them, walked with the arrows and run with Enter or a press. A store per root (`$launcher()`: `isOpen`, `open`, `close`, `toggle`, `search`, `setSearch`); the shortcut is heard anywhere in the application root, nothing focused too.',
  props: [
    { name: 'actions', type: '{ id, label, hint, tags, start, end, disabled, sticky, onPress }[] | { label, actions }[]', description: 'The actions, or groups of them under a label.' },
    { name: 'shortcut', type: 'string | string[] | null', default: "'primary+K'", description: 'The keys that open it (`primary` is Cmd on macOS, Ctrl elsewhere); null for none.' },
    { name: 'fields', type: 'boolean', default: 'false', description: 'Whether the shortcut is heard from a text field too.' },
    { name: 'match', type: '(action, search) => boolean', default: 'launcherMatch', description: 'Whether an action shows: by default every word of the search, ignoring case and in any order, is in the label, the hint or a tag (“file new” finds “New file”). A group keeps its matching actions.' },
    { name: 'loop', type: 'boolean', default: 'true', description: 'The arrow keys wrap from the last action to the first.' },
    { name: 'limit', type: 'number', description: 'The actions shown at most.' },
    { name: 'empty', type: 'string | any', default: "'No matches'", description: 'Shown when nothing matches.' },
    { name: 'highlight', type: 'boolean', default: 'false', description: 'Marks the search in the labels.' },
    { name: 'height', type: 'number', default: 'theme.sizes.box.launcher.list (360)', description: 'The list’s most height (eight rows), past which it scrolls.' },
    { name: 'search / onSearchChange', type: 'string / (search) => void', description: 'The search, held by you.' },
    { name: 'defaultSearch', type: 'string', description: 'The first search, when it holds its own.' },
    { name: 'keepSearch', type: 'boolean', default: 'false', description: '`false`: closing clears the search.' },
    { name: 'sticky', type: 'boolean', default: 'false', description: '`false`: running an action closes it (an action’s `sticky` wins).' },
    { name: 'placeholder', type: 'string', default: "'Find an action'", description: 'The search field’s placeholder.' },
    { name: 'start', type: 'any', description: 'Before the search field.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called as it opens and closes.' },
    { name: 'Modal look', type: 'size (sizes.box.launcherWidth, 640), offset (sizes.box.launcher.offset, 96), radius, shadow, layer, motion, backdrop, portal', description: 'As Modal.' },
    { name: 'store / children', type: 'LauncherStore / any', description: 'The store (`$launcher()` by default, or one made with `launcherStore(root?)`); inside, `$launcher()` finds it.' },
  ],
  demos: [
    {
      title: 'Actions behind a button or the shortcut',
      code: `
function Opener({ last }) {
  const launcher = $launcher();
  return (
    <Stack gap="xs">
      <Row gap="sm">
        <Button onPress={() => launcher.open()}>Open launcher</Button>
        <Text size="sm" fg="quiet">or press</Text> <Key>Ctrl</Key> <Key>K</Key>
        <Text size="sm" fg="quiet">anywhere in the app</Text>
      </Row>
      <Text size="sm" fg="quiet">{() => \`last action: \${last()}\`}</Text>
    </Stack>
  );
}

function Demo() {
  const last = $signal($active(), 'none');
  const run = label => () => $write(last, label);
  const actions = [
    { id: 'flights', label: 'Flights', hint: 'Compare fares between two cities', onPress: run('Flights') },
    { id: 'stays', label: 'Stays', hint: 'Rooms close to each stop of the trip', onPress: run('Stays') },
    { id: 'itinerary', label: 'Itinerary', hint: 'Every booking of this trip, day by day', tags: ['plan', 'schedule'], onPress: run('Itinerary') },
  ];
  return (
    <Launcher actions={actions} placeholder="Where to next?">
      <Opener last={() => $read(last)} />
    </Launcher>
  );
}`,
      view: () => {
        const last = $signal($active(), 'none');
        const run = (/** @type {string} */ label) => () => $write(last, label);
        const actions = [
          { id: 'flights', label: 'Flights', hint: 'Compare fares between two cities', onPress: run('Flights') },
          { id: 'stays', label: 'Stays', hint: 'Rooms close to each stop of the trip', onPress: run('Stays') },
          { id: 'itinerary', label: 'Itinerary', hint: 'Every booking of this trip, day by day', tags: ['plan', 'schedule'], onPress: run('Itinerary') },
        ];
        return (
          <Launcher actions={actions} placeholder="Where to next?">
            <Opener last={() => $read(last)} />
          </Launcher>
        );
      },
      height: 360,
    },
    {
      title: 'Actions in groups',
      code: `
const GROUPS = [
  { label: 'Garden', actions: [{ id: 'water', label: 'Water the beds' }, { id: 'prune', label: 'Prune the roses' }, { id: 'harvest', label: 'Harvest the beans' }] },
  { label: 'Shed', actions: [{ id: 'tools', label: 'Sharpen the tools', tags: ['shears', 'blade'] }, { id: 'seeds', label: 'Sort the seeds' }] },
];

function Demo() {
  const launcher = launcherStore();
  return (
    <Launcher store={launcher} actions={GROUPS} shortcut={null}>
      <Button variant="soft" onPress={() => launcher.open()}>Open by group</Button>
    </Launcher>
  );
}`,
      view: () => {
        const launcher = launcherStore();
        return (
          <Launcher store={launcher} actions={GROUPS} shortcut={null}>
            <Button variant="soft" onPress={() => launcher.open()}>
              Open by group
            </Button>
          </Launcher>
        );
      },
      height: 320,
    },
    {
      title: 'At most three shown',
      code: `
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({ id: day, label: \`Plan \${day}\` }));

function Demo() {
  const launcher = launcherStore();
  return (
    <Launcher store={launcher} actions={DAYS} limit={3} shortcut={null}>
      <Button variant="soft" onPress={() => launcher.open()}>Plan a day</Button>
    </Launcher>
  );
}`,
      view: () => {
        const launcher = launcherStore();
        return (
          <Launcher store={launcher} actions={DAYS} limit={3} shortcut={null}>
            <Button variant="soft" onPress={() => launcher.open()}>
              Plan a day
            </Button>
          </Launcher>
        );
      },
      height: 260,
    },
    {
      title: 'The search highlighted',
      code: `
const HOME = [
  { id: 'lights', label: 'Turn the lights off' },
  { id: 'heating', label: 'Turn the heating down' },
  { id: 'blinds', label: 'Lower the blinds' },
  { id: 'alarm', label: 'Set the alarm' },
];

function Demo() {
  const launcher = launcherStore();
  return (
    <Launcher store={launcher} actions={HOME} highlight shortcut={null}>
      <Button variant="soft" onPress={() => launcher.open()}>Home controls</Button>
    </Launcher>
  );
}`,
      view: () => {
        const launcher = launcherStore();
        return (
          <Launcher store={launcher} actions={HOME} highlight shortcut={null}>
            <Button variant="soft" onPress={() => launcher.open()}>
              Home controls
            </Button>
          </Launcher>
        );
      },
      height: 300,
    },
  ],
};
