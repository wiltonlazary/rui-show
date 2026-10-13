// The home page: what rui is, the renderer idea (one component, three
// renderers, live side by side) and the groups of pages.

import { $signal, $read, $write } from 'rrx-core';
import { $active, View } from 'ren-core';
import { Surface, Stack, Row, Tiles, Heading, Text, Button, Pressable } from 'rui-core';
import { GROUPS } from './site.js';
import { Stage } from './stage.jsx';

/** @typedef {import('./site.js').PageRecord} PageRecord */
/** @typedef {import('./site.js').Settings} Settings */

/** The sample shown on every renderer: one card written once with rui-core. */
export function Sample() {
  const count = $signal($active(), 0);
  return (
    <Stack gap="xs">
      <Heading level={4}>One component</Heading>
      <Text size="sm" fg="quiet">
        written once with rui-core
      </Text>
      <Row gap="xs">
        <Button size="xs" onPress={() => $write(count, $read(count) + 1)}>
          {() => `Pressed ${$read(count)}`}
        </Button>
        <Button size="xs" variant="soft" onPress={() => $write(count, 0)}>
          Reset
        </Button>
      </Row>
    </Stack>
  );
}

/** The sample's width and height on each renderer. */
const SIZE = { width: 280, height: 150 };

/** @param {{ pages: PageRecord[], go: (p: PageRecord | null) => void, settings: () => Settings }} props */
export function Home(props) {
  return (
    <View role="article" data-page="home" data-demos="3">
      <Stack gap="xl">
        <Stack gap="sm">
          <Heading level={1}>rui</Heading>
          <Text size="lg" fg="quiet">
            rui-core is a set of components, hooks and extensions built on ren-core's portable primitives. It never touches the DOM: the same component renders on ren-dom (the browser lays it out), on a Skia canvas (ren-skia) and in a three.js scene (ren-three), where ren-canv lays it out with Taffy and paints it.
          </Text>
          <Text size="sm" fg="quiet">
            Every page here shows a component with its props and live demos. Switch the demos between renderers on a page, and restyle them all with the color scheme and accent color in the header.
          </Text>
        </Stack>
        <Stack gap="sm">
          <Heading level={2}>One component, three renderers</Heading>
          <Tiles columns={{ base: 1, sm: 2, md: 3 }} gap="md">
            {/** @type {const} */ (['dom', 'skia', 'three']).map((id, i) => (
              <Stack gap={6}>
                <Text size="sm" fontWeight={700}>
                  {id === 'dom' ? 'ren-dom' : id === 'skia' ? 'ren-skia' : 'ren-three'}
                </Text>
                <Surface bordered radius="md" style={{ overflow: 'hidden' }}>
                  <View data-demo={String(i)} data-renderer={id}>
                    <Stage view={Sample} name={`home-${i}`} renderer={id} width={() => SIZE.width} height={SIZE.height} settings={props.settings} />
                  </View>
                </Surface>
              </Stack>
            ))}
          </Tiles>
        </Stack>
        <Stack gap="sm">
          <Heading level={2}>By task</Heading>
          <Tiles columns={{ base: 1, sm: 2, md: 3 }} gap="md">
            {GROUPS.map(group => {
              const members = props.pages.filter(p => p.group === group.id);
              return (
                <Pressable label={group.title} textAlign="start" style={{ align: 'stretch' }} onPress={() => members.length > 0 && props.go(members[0])}>
                  <Surface bordered radius="md" p="md" w="100%" h="100%" style={{ gap: 4 }}>
                    <Text fontWeight={700}>{group.title}</Text>
                    <Text size="sm" fg="quiet">
                      {members.length === 0 ? 'coming soon' : members.map(p => p.title).join(', ')}
                    </Text>
                  </Surface>
                </Pressable>
              );
            })}
          </Tiles>
        </Stack>
      </Stack>
    </View>
  );
}
