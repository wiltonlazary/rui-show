// NavItem: a settings sidebar: label and description, start and end,
// the active link, variants, nested links.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Badge, Box, NavItem, SegmentedControl, Stack, Text } from 'rui-core';

const SETTINGS = [
  { label: 'Profile', description: 'Name, photo and time zone' },
  { label: 'Notifications', description: 'Email, push and a daily digest' },
  { label: 'Privacy', description: 'Who sees your activity' },
  { label: 'Billing', description: 'Plan, invoices and card' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'nav-item',
  group: 'wayfinding',
  title: 'NavItem',
  description: 'A navigation row (an option row: `theme.control.optionPad`, its label at the body size and a quiet description a font step below) with `start` and `end`; `active` marks the current one with a tone edge on its start side and the variant’s colors (ghost by default: the label in the tone on the page). With children (nested NavItems) it opens and closes on press, its chevron turning, and says `aria-expanded`.',
  props: [
    { name: 'label', type: 'string | (() => string) | any', description: 'The main text (or content).' },
    { name: 'description', type: 'string | (() => string) | any', description: 'Quiet text a font step below the label, under it.' },
    { name: 'start', type: 'any', description: 'Content before the label (an icon).' },
    { name: 'end', type: 'any', description: 'Content after the label; it replaces the chevron of a nested link.' },
    { name: 'active', type: 'boolean | (() => boolean)', default: 'false', description: 'Marks the link current: a tone edge on its start side (a Divider’s md thickness), the variant’s colors, and `aria-current="page"`.' },
    { name: 'variant', type: "'ghost' | 'soft' | 'solid'", default: "'ghost'", description: 'How an active link is colored: ghost (its label in the tone, on the page), soft (on a wash) or solid (on the fill).' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The active colors: a theme color, `name.shade` or hex.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Faded; presses are ignored.' },
    { name: 'wrap', type: 'boolean', default: 'true', description: 'The label wraps; `false` keeps it on one line.' },
    { name: 'href', type: 'string', description: 'Where the link goes (its `href` on the DOM); only a relative address, `#…`, `http:`, `https:`, `mailto:` or `tel:` is shown or followed; any other scheme (`javascript:`, `data:`) is dropped, leaving an inert link.' },
    { name: 'onPress', type: '(event) => void', description: 'Called on a press.' },
    { name: 'children', type: 'NavItem[]', description: 'Nested links, shown while it is open.' },
    { name: 'open', type: 'boolean | (() => boolean) | Signal<boolean>', description: 'Whether the nested links show (a signal is written on toggle).' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'The open state when not controlled.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the nested links open or close.' },
    { name: 'indent', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'The indent of the nested links.' },
    { name: 'aria-label', type: 'string', description: 'The accessible name, when the label is not text.' },
  ],
  demos: [
    {
      title: 'A settings sidebar',
      code: `
const SETTINGS = [
  { label: 'Profile', description: 'Name, photo and time zone' },
  { label: 'Notifications', description: 'Email, push and a daily digest' },
  { label: 'Privacy', description: 'Who sees your activity' },
  { label: 'Billing', description: 'Plan, invoices and card' },
];

function Demo() {
  const at = $signal($active(), 1);
  return (
    <Box w={300}>
      {SETTINGS.map((item, i) => (
        <NavItem
          label={item.label}
          description={item.description}
          active={() => $read(at) === i}
          onPress={() => $write(at, i)}
        />
      ))}
      <Text size="sm" fg="quiet" p="sm">{() => 'Showing: ' + SETTINGS[$read(at)].label}</Text>
    </Box>
  );
}`,
      view: () => {
        const at = $signal($active(), 1);
        return (
          <Box w={300}>
            {SETTINGS.map((item, i) => (
              <NavItem label={item.label} description={item.description} active={() => $read(at) === i} onPress={() => $write(at, i)} />
            ))}
            <Text size="sm" fg="quiet" p="sm">
              {() => 'Showing: ' + SETTINGS[$read(at)].label}
            </Text>
          </Box>
        );
      },
      height: 280,
    },
    {
      title: 'A mail folder list: end, variants and states',
      code: `
function Demo() {
  const variant = $signal($active(), 'ghost');
  const folder = $signal($active(), 'Inbox');
  const link = (name, props) => (
    <NavItem label={name} variant={variant} active={() => $read(folder) === name} onPress={() => $write(folder, name)} {...props} />
  );
  return (
    <Stack gap="xs" w={300}>
      <SegmentedControl aria-label="Variant" size="xs" data={['ghost', 'soft', 'solid']} value={variant} onChange={v => $write(variant, v)} />
      <Box>
        {link('Inbox', { end: <Badge size="xs" variant="soft">12</Badge> })}
        {link('Drafts')}
        <NavItem label="Archive">
          {link('This year')}
          {link('Older')}
        </NavItem>
        <NavItem label="Spam" description="Filtered for you" disabled />
      </Box>
    </Stack>
  );
}`,
      view: () => {
        const variant = $signal($active(), 'ghost');
        const folder = $signal($active(), 'Inbox');
        const link = (/** @type {string} */ name, /** @type {Record<string, any>} */ props = {}) => (
          <NavItem label={name} variant={variant} active={() => $read(folder) === name} onPress={() => $write(folder, name)} {...props} />
        );
        return (
          <Stack gap="xs" w={300}>
            <SegmentedControl aria-label="Variant" size="xs" data={['ghost', 'soft', 'solid']} value={variant} onChange={(/** @type {string} */ v) => $write(variant, v)} />
            <Box>
              {link('Inbox', {
                end: (
                  <Badge size="xs" variant="soft">
                    12
                  </Badge>
                ),
              })}
              {link('Drafts')}
              <NavItem label="Archive">
                {link('This year')}
                {link('Older')}
              </NavItem>
              <NavItem label="Spam" description="Filtered for you" disabled />
            </Box>
          </Stack>
        );
      },
      height: 290,
    },
    {
      title: 'Nested groups',
      code: `
function Demo() {
  const picked = $signal($active(), 'Members');
  const link = name => <NavItem label={name} active={() => $read(picked) === name} onPress={() => $write(picked, name)} />;
  return (
    <Stack gap={0} w={300}>
      <NavItem label="Workspace" defaultOpen>
        {link('Members')}
        {link('Integrations')}
      </NavItem>
      <NavItem label="Personal" indent="lg">
        {link('Profile')}
        {link('Appearance')}
      </NavItem>
      <Text size="sm" fg="quiet" p="sm">{() => 'Open: ' + $read(picked)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const picked = $signal($active(), 'Members');
        const link = (/** @type {string} */ name) => <NavItem label={name} active={() => $read(picked) === name} onPress={() => $write(picked, name)} />;
        return (
          <Stack gap={0} w={300}>
            <NavItem label="Workspace" defaultOpen>
              {link('Members')}
              {link('Integrations')}
            </NavItem>
            <NavItem label="Personal" indent="lg">
              {link('Profile')}
              {link('Appearance')}
            </NavItem>
            <Text size="sm" fg="quiet" p="sm">
              {() => 'Open: ' + $read(picked)}
            </Text>
          </Stack>
        );
      },
      height: 290,
    },
  ],
};
