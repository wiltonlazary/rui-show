// List: unordered, ordered, nested, markers and icons.

import { List, Tiles, CheckIcon, CloseIcon, DotsIcon } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'list',
  group: 'text',
  title: 'List',
  description: 'An unordered or ordered list of List.Item; a List inside an item nests. Markers are drawn Views (disc, circle, square) or numbers, the same on every renderer; any content can stand for them.',
  props: [
    { name: 'ordered', type: 'boolean', default: 'false', description: 'Numbers (1., 2., …) in place of drawn markers.' },
    { name: 'marker', type: "'disc' | 'circle' | 'square' | 'none'", default: "'disc'", description: 'The unordered marker, a 6 px mark centered in a `sizes.glyph.lg` (20 × 20) box; `none` hides markers, an ordered list’s numbers too.' },
    { name: 'indented', type: 'boolean', default: 'false', description: 'Indents the list by the `md` spacing.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Font size and line height from the theme.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: '0', description: 'The gap between items.' },
    { name: 'icon', type: 'any', description: 'Every item’s marker.' },
    { name: 'center', type: 'boolean', default: 'false', description: 'Markers centered on their item (at the top by default).' },
    { name: 'List.Item', type: 'component', description: 'An item: text or content, and a nested List; `icon` sets its own marker.' },
  ],
  demos: [
    {
      title: 'Unordered and ordered',
      code: `
function Demo() {
  return (
    <Tiles columns={2}>
      <List>
        <List.Item>Soak the beans overnight</List.Item>
        <List.Item>Simmer with bay leaves</List.Item>
        <List.Item>Season just before serving</List.Item>
      </List>
      <List ordered gap="xs" size="sm">
        <List.Item>Soak the beans overnight</List.Item>
        <List.Item>Simmer with bay leaves</List.Item>
        <List.Item>Season just before serving</List.Item>
      </List>
    </Tiles>
  );
}`,
      view: () => (
        <Tiles columns={2}>
          <List>
            <List.Item>Soak the beans overnight</List.Item>
            <List.Item>Simmer with bay leaves</List.Item>
            <List.Item>Season just before serving</List.Item>
          </List>
          <List ordered gap="xs" size="sm">
            <List.Item>Soak the beans overnight</List.Item>
            <List.Item>Simmer with bay leaves</List.Item>
            <List.Item>Season just before serving</List.Item>
          </List>
        </Tiles>
      ),
      height: 90,
    },
    {
      title: 'Nested, with marker styles',
      code: `
function Demo() {
  return (
    <List indented>
      <List.Item>Planets
        <List marker="circle">
          <List.Item>Mars</List.Item>
          <List.Item>Venus</List.Item>
        </List>
      </List.Item>
      <List.Item>Moons
        <List marker="square">
          <List.Item>Titan</List.Item>
        </List>
      </List.Item>
    </List>
  );
}`,
      view: () => (
        <List indented>
          <List.Item>
            Planets
            <List marker="circle">
              <List.Item>Mars</List.Item>
              <List.Item>Venus</List.Item>
            </List>
          </List.Item>
          <List.Item>
            Moons
            <List marker="square">
              <List.Item>Titan</List.Item>
            </List>
          </List.Item>
        </List>
      ),
      height: 140,
    },
    {
      title: 'A checklist with state icons',
      code: `
// Each item's own icon says its state: done, under way, or blocked.
function Demo() {
  return (
    <List gap={6} center>
      <List.Item icon={<CheckIcon size={16} color="indigo" />}>Book the ferry</List.Item>
      <List.Item icon={<CheckIcon size={16} color="indigo" />}>Pack the rain jackets</List.Item>
      <List.Item icon={<DotsIcon size={16} color="quiet" />}>Pick up the rental keys</List.Item>
      <List.Item icon={<CloseIcon size={16} color="orange" />}>Renew the fishing permit</List.Item>
    </List>
  );
}`,
      view: () => (
        <List gap={6} center>
          <List.Item icon={<CheckIcon size={16} color="indigo" />}>Book the ferry</List.Item>
          <List.Item icon={<CheckIcon size={16} color="indigo" />}>Pack the rain jackets</List.Item>
          <List.Item icon={<DotsIcon size={16} color="quiet" />}>Pick up the rental keys</List.Item>
          <List.Item icon={<CloseIcon size={16} color="orange" />}>Renew the fishing permit</List.Item>
        </List>
      ),
      height: 120,
    },
  ],
};
