// Tabs: the three variants on one value, vertical tabs, fill, start and end,
// disabled tabs and deselect.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Badge, Stack, Tabs, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'tabs',
  group: 'wayfinding',
  title: 'Tabs',
  description: 'Tabs.List of Tabs.Tab and a Tabs.Panel per value, sharing the active value. The list is one Tab stop, the active tab; the arrow keys (by orientation), Home and End move to the next enabled tab and activate it, looping by default. A tab is an option-high row with its text at the body size in the strong weight; the list (line and outline) stands on a hairline rule, the line variant marks the active tab with a round bar in the tone, and the outline variant raises the active tab (the raised ground, shadow xs) with a tone edge on its side away from the list and no side borders.',
  props: [
    { name: 'value', type: 'string | null | (() => string | null) | Signal<string | null>', description: 'The active tab’s value (a signal is written on change).' },
    { name: 'defaultValue', type: 'string | null', default: 'null', description: 'The active value at first, when it holds its own.' },
    { name: 'onChange', type: '(value: string | null) => void', description: 'Called with the new value.' },
    { name: 'variant', type: "'line' | 'outline' | 'pill'", default: "'line'", description: 'A round bar in the tone under the active tab (a Divider’s lg thickness, set in by the tab’s side padding), the active tab raised with a tone edge away from the list (a Divider’s md thickness), or a filled pill.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'The list above the panels, or beside them (the up and down keys move).' },
    { name: 'listAt', type: "'start' | 'end'", default: "'start'", description: 'Vertical tabs: the list at the start of the panels, or at the end.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The tone of the active tab’s bar, edge or pill.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'The tabs’ corner radius.' },
    { name: 'persistent', type: 'boolean', default: 'false', description: 'Hidden panels stay built (hidden) instead of being removed.' },
    { name: 'followFocus', type: 'boolean', default: 'true', description: 'The arrow keys activate the tab they move to; false: they only focus it, and the focused tab is the Tab stop until one is chosen.' },
    { name: 'loop', type: 'boolean', default: 'true', description: 'The arrow keys wrap around at the ends.' },
    { name: 'deselectable', type: 'boolean', default: 'false', description: 'A press on the active tab deselects it: the value clears.' },
    { name: 'Tabs.List aria-label', type: 'string', description: 'The tablist’s accessible name: what its tabs choose among.' },
    { name: 'Tabs.List fill', type: 'boolean', default: 'false', description: 'The tabs share the list’s width.' },
    { name: 'Tabs.List justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Where the tabs sit in the list.' },
    { name: 'Tabs.Tab value', type: 'string', description: 'The value it activates; the tab’s id comes from it (unique for any value), and the panel with the same value is labelled by that tab.' },
    { name: 'Tabs.Tab start', type: 'any', description: 'Content before its text.' },
    { name: 'Tabs.Tab end', type: 'any', description: 'Content after its text.' },
    { name: 'Tabs.Tab disabled', type: 'boolean', default: 'false', description: 'Faded, skipped by the keys; presses are ignored.' },
    { name: 'Tabs.Tab color', type: 'string', description: 'Its own active color.' },
    { name: 'Tabs.Tab onPress', type: '(event) => void', description: 'Called on a press.' },
    { name: 'Tabs.Tab children', type: 'string | any', description: 'Its text (or content), at the body size (md) in the strong weight, padded `theme.control.optionPad`’s height by `theme.control.pad.sm` (6 × 12).' },
    { name: 'Tabs.Panel value', type: 'string', description: 'The tab whose content it is; that tab names it.' },
    { name: 'Tabs.Panel children', type: 'string | any', description: 'The content.' },
  ],
  demos: [
    {
      title: 'Variants',
      code: `
function Demo() {
  const value = $signal($active(), 'today');
  return (
    <Stack gap="lg">
      {['line', 'outline', 'pill'].map(variant => (
        <Tabs value={value} variant={variant}>
          <Tabs.List aria-label="Forecast">
            <Tabs.Tab value="today">Today</Tabs.Tab>
            <Tabs.Tab value="week">This week</Tabs.Tab>
            <Tabs.Tab value="radar">Radar</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="today" pt="xs">{variant + ': 21° and clear'}</Tabs.Panel>
          <Tabs.Panel value="week" pt="xs">{variant + ': rain from Thursday'}</Tabs.Panel>
          <Tabs.Panel value="radar" pt="xs">{variant + ': a front moving east'}</Tabs.Panel>
        </Tabs>
      ))}
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), 'today');
        return (
          <Stack gap="lg">
            {['line', 'outline', 'pill'].map(variant => (
              <Tabs value={value} variant={variant}>
                <Tabs.List aria-label="Forecast">
                  <Tabs.Tab value="today">Today</Tabs.Tab>
                  <Tabs.Tab value="week">This week</Tabs.Tab>
                  <Tabs.Tab value="radar">Radar</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="today" pt="xs">
                  {variant + ': 21° and clear'}
                </Tabs.Panel>
                <Tabs.Panel value="week" pt="xs">
                  {variant + ': rain from Thursday'}
                </Tabs.Panel>
                <Tabs.Panel value="radar" pt="xs">
                  {variant + ': a front moving east'}
                </Tabs.Panel>
              </Tabs>
            ))}
          </Stack>
        );
      },
      height: 290,
    },
    {
      title: 'Vertical',
      code: `
function Demo() {
  const value = $signal($active(), 'profile');
  return (
    <Tabs value={value} orientation="vertical" color="teal">
      <Tabs.List aria-label="Settings">
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
        <Tabs.Tab value="team" disabled>Team</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="profile" pl="md">Name, photo and bio.</Tabs.Panel>
      <Tabs.Panel value="billing" pl="md">Plans and invoices.</Tabs.Panel>
      <Tabs.Panel value="security" pl="md">Passwords and sessions.</Tabs.Panel>
    </Tabs>
  );
}`,
      view: () => {
        const value = $signal($active(), 'profile');
        return (
          <Tabs value={value} orientation="vertical" color="teal">
            <Tabs.List aria-label="Settings">
              <Tabs.Tab value="profile">Profile</Tabs.Tab>
              <Tabs.Tab value="billing">Billing</Tabs.Tab>
              <Tabs.Tab value="team" disabled>
                Team
              </Tabs.Tab>
              <Tabs.Tab value="security">Security</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="profile" pl="md">
              Name, photo and bio.
            </Tabs.Panel>
            <Tabs.Panel value="billing" pl="md">
              Plans and invoices.
            </Tabs.Panel>
            <Tabs.Panel value="security" pl="md">
              Passwords and sessions.
            </Tabs.Panel>
          </Tabs>
        );
      },
      height: 180,
    },
    {
      title: 'Filling the width, an end and deselect',
      code: `
function Demo() {
  const value = $signal($active(), 'inbox');
  return (
    <Stack gap="sm">
      <Tabs value={value} variant="pill" deselectable>
        <Tabs.List aria-label="Mailbox" fill>
          <Tabs.Tab value="inbox" end={<Badge size="xs" round>3</Badge>}>Inbox</Tabs.Tab>
          <Tabs.Tab value="sent">Sent</Tabs.Tab>
          <Tabs.Tab value="drafts" color="orange">Drafts</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Text fg="quiet">{() => 'value: ' + String($read(value)) + ' (press the active tab to clear it)'}</Text>
    </Stack>
  );
}`,
      view: () => {
        const value = $signal($active(), 'inbox');
        return (
          <Stack gap="sm">
            <Tabs value={value} variant="pill" deselectable>
              <Tabs.List aria-label="Mailbox" fill>
                <Tabs.Tab
                  value="inbox"
                  end={
                    <Badge size="xs" round>
                      3
                    </Badge>
                  }
                >
                  Inbox
                </Tabs.Tab>
                <Tabs.Tab value="sent">Sent</Tabs.Tab>
                <Tabs.Tab value="drafts" color="orange">
                  Drafts
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Text fg="quiet">{() => 'value: ' + String($read(value)) + ' (press the active tab to clear it)'}</Text>
          </Stack>
        );
      },
      height: 100,
    },
  ],
};
