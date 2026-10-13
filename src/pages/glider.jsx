// Glider: a box moving over the chosen element; here a tab underline
// that follows the hovered link in a nav bar.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Glider, Box, Pressable, Row, Stack, Text } from 'rui-core';

const LINKS = ['Overview', 'Pricing', 'Docs', 'Changelog'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'glider',
  group: 'layers',
  title: 'Glider',
  description: 'A box that moves over the element `to` inside the element `within`, animated on the Clock: the moving highlight of a segmented control or tabs built by hand. It measures both boxes once laid out, when `to` changes and as either changes size.',
  props: [
    { name: 'to', type: 'node | (() => node)', description: 'The element to cover: a ref kept in a signal.' },
    { name: 'within', type: 'node | (() => node)', description: 'The element it is placed in (against its padding box); put the Glider inside it.' },
    { name: 'duration', type: "number | 'quick' | 'base' | 'calm' | 'hold'", default: "'quick' (110 ms)", description: 'The move’s duration: milliseconds or a preset’s name.' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: 'theme.corner', description: 'Corner radius.' },
    { name: 'style props', type: 'bg, m, …', description: 'As Box: `bg` is its color.' },
  ],
  demos: [
    {
      title: 'An underline that follows the hovered link',
      code: `
const LINKS = ['Overview', 'Pricing', 'Docs', 'Changelog'];

function Demo() {
  const within = $signal($active(), null);
  const to = $signal($active(), null);
  const lines = {};
  const page = $signal($active(), 'Overview');
  const back = () => $write(to, lines[$read(page)]);
  return (
    <Stack gap="sm">
      <Row gap="md" ref={n => $write(within, n)} onPointerLeave={back} style={{ self: 'start' }}>
        <Glider to={to} within={within} bg="indigo.6" radius={0} duration="base" />
        {LINKS.map(name => (
          <Stack gap={4} onPointerEnter={() => $write(to, lines[name])}>
            <Pressable px="xs" py={4} fontSize="sm" onPress={() => ($write(page, name), back())}>{name}</Pressable>
            <Box h={2} ref={n => (lines[name] = n, name === 'Overview' && $write(to, n))} />
          </Stack>
        ))}
      </Row>
      <Text size="sm" fg="quiet">{() => \`page: \${$read(page)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const within = $signal($active(), /** @type {any} */ (null));
        const to = $signal($active(), /** @type {any} */ (null));
        /** @type {Record<string, any>} */
        const lines = {};
        const page = $signal($active(), 'Overview');
        const back = () => $write(to, lines[$read(page)]);
        return (
          <Stack gap="sm">
            <Row gap="md" ref={(/** @type {any} */ n) => $write(within, n)} onPointerLeave={back} style={{ self: 'start' }}>
              <Glider to={to} within={within} bg="indigo.6" radius={0} duration="base" />
              {LINKS.map(name => (
                <Stack gap={4} onPointerEnter={() => $write(to, lines[name])}>
                  <Pressable px="xs" py={4} fontSize="sm" onPress={() => ($write(page, name), back())}>
                    {name}
                  </Pressable>
                  <Box h={2} ref={(/** @type {any} */ n) => ((lines[name] = n), name === 'Overview' && $write(to, n))} />
                </Stack>
              ))}
            </Row>
            <Text size="sm" fg="quiet">
              {() => `page: ${$read(page)}`}
            </Text>
          </Stack>
        );
      },
      height: 100,
    },
  ],
};
