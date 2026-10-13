// Shell: an application's frame (header, nav, main, side, footer).

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Heading, Row, Shell, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'shell',
  group: 'structure',
  title: 'Shell',
  description:
    'An application’s frame on the portable grid: a header and footer across, a nav and side column at the sides and the main content between, filling its parent’s height. The same on every renderer; below `fold` (against the root’s viewport) a nav or side lies over Main at the whole width, and `hide` hides either one when narrow, when wide, or always.',
  props: [
    { name: 'header', type: 'number | true | responsive', description: 'The top bar’s height (56 for `true`); none for no header.' },
    { name: 'footer', type: 'number | true | responsive', description: 'The bottom bar’s height (56 for `true`); none for no footer.' },
    { name: 'nav', type: 'number | true | responsive', description: 'The start column’s width (280 for `true`); none for no nav.' },
    { name: 'side', type: 'number | true | responsive', description: 'The end column’s width (280 for `true`); none for no side.' },
    { name: 'fold', type: 'string | number', description: 'A theme breakpoint name or a length: below it the shell is narrow, and a nav or side lies over Main at the whole width. None: never narrow.' },
    { name: 'hide', type: "{ nav?, side? }: 'narrow' | 'wide' | boolean", description: 'When to hide the nav or side: while narrow, while wide, always (`true`) or never; an accessor hides and shows it.' },
    { name: 'padding', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: '0', description: 'Shell.Main’s padding.' },
    { name: 'bordered', type: 'boolean', default: 'true', description: 'A line along each part’s inner edge.' },
    { name: 'children', type: 'Shell.Header | Nav | Main | Side | Footer', description: 'The parts; each takes style props.' },
    { name: 'Shell.Section fill', type: 'boolean', default: 'false', description: 'A part of a Nav or Side; `fill` takes the space left.' },
    { name: 'style props', type: 'h, w, …', description: 'As Box: give it a height outside a full page.' },
  ],
  demos: [
    {
      title: 'Header, nav and main, the nav toggled',
      code: `
function Demo() {
  const open = $signal($active(), true);
  return (
    <Shell h={240} header={48} nav={160} hide={{ nav: () => !$read(open) }} padding="md">
      <Shell.Header>
        <Row gap="sm" px="md" py={11}>
          <Button size="sm" dense variant="neutral" onPress={() => $write(open, !$read(open))}>{() => ($read(open) ? 'Hide nav' : 'Show nav')}</Button>
          <Heading level={5}>My application</Heading>
        </Row>
      </Shell.Header>
      <Shell.Nav>
        <Shell.Section fill p="sm">
          <Stack gap="xs">
            <Text size="sm">Dashboard</Text>
            <Text size="sm">Orders</Text>
            <Text size="sm">Customers</Text>
          </Stack>
        </Shell.Section>
        <Shell.Section p="sm">
          <Text size="xs" fg="quiet">Signed in</Text>
        </Shell.Section>
      </Shell.Nav>
      <Shell.Main>
        <Text>{() => ($read(open) ? 'Main content, beside the nav' : 'Main content, the full width')}</Text>
      </Shell.Main>
    </Shell>
  );
}`,
      view: () => {
        const open = $signal($active(), true);
        return (
          <Shell h={240} header={48} nav={160} hide={{ nav: () => !$read(open) }} padding="md">
            <Shell.Header>
              <Row gap="sm" px="md" py={11}>
                <Button size="sm" dense variant="neutral" onPress={() => $write(open, !$read(open))}>
                  {() => ($read(open) ? 'Hide nav' : 'Show nav')}
                </Button>
                <Heading level={5}>My application</Heading>
              </Row>
            </Shell.Header>
            <Shell.Nav>
              <Shell.Section fill p="sm">
                <Stack gap="xs">
                  <Text size="sm">Dashboard</Text>
                  <Text size="sm">Orders</Text>
                  <Text size="sm">Customers</Text>
                </Stack>
              </Shell.Section>
              <Shell.Section p="sm">
                <Text size="xs" fg="quiet">
                  Signed in
                </Text>
              </Shell.Section>
            </Shell.Nav>
            <Shell.Main>
              <Text>{() => ($read(open) ? 'Main content, beside the nav' : 'Main content, the full width')}</Text>
            </Shell.Main>
          </Shell>
        );
      },
      height: 240,
    },
    {
      title: 'Every part, without borders',
      code: `
function Demo() {
  return (
    <Shell h={200} header={40} footer={32} nav={120} side={120} padding="sm" bordered={false}>
      <Shell.Header bg="blue.1" px="sm" py={10}><Text size="sm">Header</Text></Shell.Header>
      <Shell.Nav bg="gray.1" p="sm"><Text size="sm">Nav</Text></Shell.Nav>
      <Shell.Main><Text size="sm">Main</Text></Shell.Main>
      <Shell.Side bg="gray.1" p="sm"><Text size="sm">Side</Text></Shell.Side>
      <Shell.Footer bg="blue.1" px="sm" py={6}><Text size="sm">Footer</Text></Shell.Footer>
    </Shell>
  );
}`,
      view: () => (
        <Shell h={200} header={40} footer={32} nav={120} side={120} padding="sm" bordered={false}>
          <Shell.Header bg="blue.1" px="sm" py={10}>
            <Text size="sm">Header</Text>
          </Shell.Header>
          <Shell.Nav bg="gray.1" p="sm">
            <Text size="sm">Nav</Text>
          </Shell.Nav>
          <Shell.Main>
            <Text size="sm">Main</Text>
          </Shell.Main>
          <Shell.Side bg="gray.1" p="sm">
            <Text size="sm">Side</Text>
          </Shell.Side>
          <Shell.Footer bg="blue.1" px="sm" py={6}>
            <Text size="sm">Footer</Text>
          </Shell.Footer>
        </Shell>
      ),
      height: 200,
    },
  ],
};
