// A component's page: its group, title and description, the renderer switch
// for its demos, each demo live in a root of its own with its code under it,
// the props table, and the previous and next pages. Under a demo, its code,
// or on demand its data: the demo rendered once through ren-json's $json,
// what it means by ARIA role and microdata, as JSON.

import { $read, $signal, $write } from 'rrx-core';
import { $active, View, Show, Pending, Recover } from 'ren-core';
import { $json } from 'ren-json';
import { Surface, Box, Stack, Row, Heading, Text, Button, Table, Code, SegmentedControl, Divider, Rui, Clock, manualClock } from 'rui-core';
import { Snippet } from 'rui-core/snippet';
import { GROUPS, RENDERERS } from './site.js';
import { loading } from './env.js';
import { Stage } from './stage.jsx';

/** @typedef {import('./site.js').PageRecord} PageRecord */
/** @typedef {import('./site.js').Settings} Settings */
/** @typedef {import('./site.js').RendererId} RendererId */

/** A demo's width until its stage is measured (then the stage's, on every renderer), in CSS pixels. */
export const WIDTH = 680;
/** A demo's least height, on every renderer, when its record gives none. */
export const HEIGHT = 160;

/**
 * On a phone (`phone`), the props are a card each instead of a table's
 * rows, and previous and next stack.
 * @param {{ page: PageRecord, renderer: any, use: (id: RendererId) => void, settings: () => Settings, previous: () => PageRecord | null, next: () => PageRecord | null, go: (p: PageRecord | null) => void, phone?: () => boolean }} props
 */
export function PageView(props) {
  const phone = () => props.phone?.() ?? false;
  const { page, renderer } = props;
  const group = GROUPS.find(g => g.id === page.group)?.title ?? page.group;
  // The stages' width, measured: every renderer shows a demo as wide.
  const width = $signal($active(), WIDTH);
  return (
    <View role="article" data-page={page.id} data-demos={String(page.demos.length)}>
      <Stack gap="xl">
        <Stack gap="xs">
          <Text size="sm" fg="quiet" fontWeight={700}>
            {group}
          </Text>
          <Heading level={1}>{page.title}</Heading>
          <Text fg="quiet" size="lg">
            {inline(page.description)}
          </Text>
        </Stack>
        {page.demos.length === 0 ? null : (
          <Stack gap="xs">
            <Row gap="xs">
              <Text size="sm" fontWeight={700}>
                Render demos with
              </Text>
              <SegmentedControl aria-label="Renderer" size="xs" data={RENDERERS.map(r => ({ value: r.id, label: r.name }))} value={() => $read(renderer)} onChange={(/** @type {RendererId} */ v) => props.use(v)} />
            </Row>
            <Text size="xs" fg="quiet">
              {() => RENDERERS.find(r => r.id === $read(renderer))?.note ?? ''}
            </Text>
          </Stack>
        )}
        {page.demos.map((demo, i) => (
          <Surface bordered radius="md" style={{ overflow: 'hidden' }}>
            <Box px="md" py="xs">
              <Heading level={2} size="sm">
                {demo.title}
              </Heading>
            </Box>
            <Divider />
            <View data-demo={String(i)} data-renderer={() => $read(renderer)} onResize={e => e.width > 0 && $write(width, Math.floor(e.width))}>
              {() => <Stage view={demo.view} theme={demo.theme} name={`${page.id}-${i}`} renderer={$read(renderer)} width={() => $read(width)} height={demo.height ?? HEIGHT} settings={props.settings} />}
            </View>
            <Divider />
            <Under demo={demo} />
          </Surface>
        ))}
        {page.props.length === 0 ? null : (
          <Stack gap="sm">
            <Heading level={2}>Props</Heading>
            <Show when={phone} fallback={<PropsTable page={page} />}>
              {() => (
                <Stack gap="xs">
                  {page.props.map(row => (
                    <Surface bordered radius="md" p="sm">
                      <Stack gap={4}>
                        <Text size="sm" fontWeight={700}>
                          <Code>{row.name}</Code>
                        </Text>
                        <Text size="xs">
                          <Code>{row.type}</Code>
                        </Text>
                        {row.default === undefined ? null : (
                          <Text size="xs" fg="quiet">
                            default <Code>{row.default}</Code>
                          </Text>
                        )}
                        <Text size="sm">{inline(row.description)}</Text>
                      </Stack>
                    </Surface>
                  ))}
                </Stack>
              )}
            </Show>
          </Stack>
        )}
        {() => {
          const steps = [step(props.previous, 'Previous', props.go), step(props.next, 'Next', props.go)];
          return phone() ? (
            <Stack gap="sm" mt="xl">
              {steps}
            </Stack>
          ) : (
            <Row fill gap="md" mt="xl">
              {steps}
            </Row>
          );
        }}
      </Stack>
    </View>
  );
}

/**
 * Under a demo: its code, or its data (rendered only once asked for).
 * @param {{ demo: import('./site.js').DemoRecord }} props
 */
function Under(props) {
  const shown = $signal($active(), 'code');
  return (
    <>
      <Row px="md" py={6} gap="xs" justify="between">
        <Text size="xs" fg="quiet">
          {() => ($read(shown) === 'code' ? 'The demo’s code' : 'What the demo means, as ren-json gives it: nodes by ARIA role and microdata')}
        </Text>
        <SegmentedControl aria-label="Code or data" size="xs" data={[{ value: 'code', label: 'Code' }, { value: 'data', label: 'Data' }]} value={() => $read(shown)} onChange={(/** @type {string} */ v) => $write(shown, v)} />
      </Row>
      <Show when={() => $read(shown) === 'data'} fallback={<Snippet code={props.demo.code.trim()} language="jsx" />}>
        {() => <Data view={props.demo.view} />}
      </Show>
    </>
  );
}

/**
 * A demo's data: the view rendered once through ren-json in a root of its
 * own, on a clock that never moves (an animation holds its first frame),
 * after its tasks settle.
 * @param {() => any} view
 */
export const dataOf = view => {
  const Demo = view;
  const clock = manualClock();
  return $json(() => (
    <Clock value={clock}>
      <Rui>
        <Demo />
      </Rui>
    </Clock>
  ));
};

/** A demo's data as JSON, highlighted. @param {{ view: () => any }} props */
function Data(props) {
  const data = loading($active(), () => dataOf(props.view), 'ren-json');
  return (
    <Recover fallback={(/** @type {Error} */ error) => <Text fg="red" px="md" py="xs">{`The data is unavailable: ${error.message}`}</Text>}>
      <Pending fallback={<Text size="sm" fg="quiet" px="md" py="xs">Rendering the data…</Text>}>
        {() => <Snippet code={JSON.stringify($read(data), null, 2)} language="json" expandable defaultOpen={false} height={320} />}
      </Pending>
    </Recover>
  );
}

/** The props as a table of name, type, default and description. @param {{ page: PageRecord }} props */
function PropsTable(props) {
  // A type or a default wraps at its spaces: a column keeps its widest word ('solid' | 'soft' | … is one line
  // only where it fits), and the Description takes the rest.
  return (
    <Table density="tight">
      <Table.Head>
        <Table.Row>
          <Table.Heading>Name</Table.Heading>
          <Table.Heading>Type</Table.Heading>
          <Table.Heading>Default</Table.Heading>
          <Table.Heading>Description</Table.Heading>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {props.page.props.map(row => (
          <Table.Row>
            <Table.Cell>
              <Code>{row.name}</Code>
            </Table.Cell>
            <Table.Cell>
              <Code style={WRAP}>{row.type}</Code>
            </Table.Cell>
            <Table.Cell>{row.default === undefined ? '-' : <Code style={WRAP}>{row.default}</Code>}</Table.Cell>
            <Table.Cell>
              <Text size="sm">{inline(row.description)}</Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

/** A Code that wraps at its spaces. */
const WRAP = { wrap: true };

/** Text with `code` spans, as Text's inline Code runs. @param {string} text */
const inline = text => text.split('`').map((part, i) => (i % 2 === 1 ? <Code>{part}</Code> : part));

/** A previous or next link (First view before the first page). @param {() => PageRecord | null} target @param {string} word @param {(p: PageRecord | null) => void} go */
const step = (target, word, go) => {
  const to = target();
  if (to === null && word === 'Next') return <Box />;
  return (
    <Button variant="neutral" size="md" stretch onPress={() => go(to)}>
      {`${word}: ${to === null ? 'First view' : to.title}`}
    </Button>
  );
};
