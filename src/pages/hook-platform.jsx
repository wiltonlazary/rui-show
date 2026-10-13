// The platform hooks: each asks the platform and keeps an inert default
// where there is none (node, a worker).

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { $os, $clipboard, $fits, $scheme, $reducedMotion, $online, $title, $fullscreen } from 'rui-core/hooks';
import { Button, Row, Stack, Text, Badge, TextInput } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-platform',
  group: 'behavior',
  title: 'Platform hooks',
  description: 'The operating system, the clipboard, media queries, the viewport’s size, the network, the document’s title, fullscreen and the eye dropper. Each checks for its platform object and keeps an inert default where there is none (a worker, node, a server render), so one component runs everywhere; what they show depends on where this page runs, the same on every renderer.',
  props: [
    { name: '$os(agent?)', type: "{ value: 'unknown' | 'macos' | 'ios' | 'windows' | 'android' | 'linux' | 'chromeos' }", description: 'The OS the platform reports, else the user agent’s; `unknown` where neither tells. It does not change, so `value` is the name itself.' },
    { name: '$clipboard({ hold? })', type: '{ value, error, copy(text), reset() }', description: '`navigator.clipboard`: `value` is true for `hold` after a copy (a MOTION name or ms, read at each copy; MOTION.hold, 1500 ms, by default); `copy(text)` resolves to whether it copied; where there is no clipboard a copy fails into `error`.' },
    { name: '$fits(query, initial?)', type: '{ value: Readable<boolean> }', description: 'Whether a media query matches, following changes; `initial` (false) without `matchMedia`.' },
    { name: '$scheme(initial?)', type: "{ value: Readable<'light' | 'dark'> }", description: 'The system’s color scheme; `initial` (light) without `matchMedia`.' },
    { name: '$reducedMotion(initial?)', type: '{ value: Readable<boolean> }', description: 'Whether reduced motion is asked for; `initial` (false) without `matchMedia`.' },
    { name: '$viewportSize()', type: '{ value: Readable<{ width, height }> }', description: 'The viewport’s size in CSS pixels, following resizes: in a component the application root’s viewport (every renderer and a worker), elsewhere the window’s inner size; 0 × 0 without a window.' },
    { name: '$online()', type: '{ value: Readable<{ online, downlink?, downlinkMax?, effectiveType?, rtt?, saveData?, type? }> }', description: 'The network, following `online`/`offline` and connection changes; online where there is no navigator.' },
    { name: '$title(title)', type: 'void', description: 'Sets the document’s title to a value, accessor or node and follows it; an empty title, or no document, is left alone.' },
    { name: '$fullscreen()', type: '{ value: Readable<boolean>, ref, toggle() }', description: 'Fullscreen for the element given to `ref`, or the document; without the Fullscreen API `toggle` does nothing.' },
    { name: '$eyedropper()', type: '{ value: Readable<string | null>, available, pick({ signal? }) }', description: 'The platform’s color picker from the screen (ColorInput’s `eyedropper`): `pick` resolves to the hex picked, or null when canceled, aborted or unavailable; `value` keeps the last one. `available` is false where there is none (node, a worker, every browser but Chromium’s).' },
  ],
  demos: [
    {
      title: '$os, $online and media queries',
      code: `
function Demo() {
  const network = $online();
  const wide = $fits('(min-width: 900px)');
  const scheme = $scheme();
  const reduced = $reducedMotion();
  return (
    <Stack gap={6}>
      <Row gap="xs"><Text size="sm" w={220}>Operating system</Text><Badge variant="soft">{$os().value}</Badge></Row>
      <Row gap="xs">
        <Text size="sm" w={220}>Network</Text>
        <Badge color={() => ($read(network.value).online ? 'green' : 'red')}>{() => ($read(network.value).online ? 'online' : 'offline')}</Badge>
        <Text size="sm" fg="quiet">{() => \`connection: \${$read(network.value).effectiveType ?? 'unknown'}\`}</Text>
      </Row>
      <Row gap="xs"><Text size="sm" w={220}>(min-width: 900px)</Text><Badge variant="soft">{() => String($read(wide.value))}</Badge></Row>
      <Row gap="xs"><Text size="sm" w={220}>System color scheme</Text><Badge variant="soft">{() => $read(scheme.value)}</Badge></Row>
      <Row gap="xs"><Text size="sm" w={220}>Reduced motion</Text><Badge variant="soft">{() => String($read(reduced.value))}</Badge></Row>
    </Stack>
  );
}`,
      view: () => {
        const network = $online();
        const wide = $fits('(min-width: 900px)');
        const scheme = $scheme();
        const reduced = $reducedMotion();
        return (
          <Stack gap={6}>
            <Row gap="xs">
              <Text size="sm" w={220}>
                Operating system
              </Text>
              <Badge variant="soft">{$os().value}</Badge>
            </Row>
            <Row gap="xs">
              <Text size="sm" w={220}>
                Network
              </Text>
              <Badge color={() => ($read(network.value).online ? 'green' : 'red')}>{() => ($read(network.value).online ? 'online' : 'offline')}</Badge>
              <Text size="sm" fg="quiet">
                {() => `connection: ${$read(network.value).effectiveType ?? 'unknown'}`}
              </Text>
            </Row>
            <Row gap="xs">
              <Text size="sm" w={220}>
                (min-width: 900px)
              </Text>
              <Badge variant="soft">{() => String($read(wide.value))}</Badge>
            </Row>
            <Row gap="xs">
              <Text size="sm" w={220}>
                System color scheme
              </Text>
              <Badge variant="soft">{() => $read(scheme.value)}</Badge>
            </Row>
            <Row gap="xs">
              <Text size="sm" w={220}>
                Reduced motion
              </Text>
              <Badge variant="soft">{() => String($read(reduced.value))}</Badge>
            </Row>
          </Stack>
        );
      },
      height: 150,
    },
    {
      title: '$clipboard: copying what was typed, and reset',
      code: `
function Demo() {
  const note = $signal($active(), 'Meet at dock 4 at 7:30');
  const clipboard = $clipboard({ hold: 6000 });
  const said = () => {
    const error = $read(clipboard.error);
    if (error) return \`Not copied: \${error.message}\`;
    return $read(clipboard.value) ? \`\${$read(note).length} characters copied; Clear forgets it here\` : 'Nothing copied lately';
  };
  return (
    <Stack gap="xs">
      <Row gap="sm" align="end">
        <TextInput label="A note for the crew" value={note} onChange={v => $write(note, v)} w={240} />
        <Button size="sm" variant="soft" onPress={() => clipboard.copy($read(note))}>Copy the note</Button>
        <Button size="sm" variant="plain" onPress={() => clipboard.reset()}>Clear</Button>
      </Row>
      <Text size="sm" fg="quiet">{said}</Text>
    </Stack>
  );
}`,
      view: () => {
        const note = $signal($active(), 'Meet at dock 4 at 7:30');
        const clipboard = $clipboard({ hold: 6000 });
        const said = () => {
          const error = $read(clipboard.error);
          if (error) return `Not copied: ${error.message}`;
          return $read(clipboard.value) ? `${$read(note).length} characters copied; Clear forgets it here` : 'Nothing copied lately';
        };
        return (
          <Stack gap="xs">
            <Row gap="sm" align="end">
              <TextInput label="A note for the crew" value={note} onChange={(/** @type {string} */ v) => $write(note, v)} w={240} />
              <Button size="sm" variant="soft" onPress={() => clipboard.copy($read(note))}>
                Copy the note
              </Button>
              <Button size="sm" variant="plain" onPress={() => clipboard.reset()}>
                Clear
              </Button>
            </Row>
            <Text size="sm" fg="quiet">
              {said}
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: '$title and $fullscreen',
      code: `
function Demo() {
  const R = $active();
  const title = $signal(R, '');
  const draft = $signal(R, 'rui-show: hooks');
  $title(title);
  const screen = $fullscreen();
  return (
    <Stack gap="xs">
      <Row gap="sm" align="end">
        <TextInput label="Document title" value={draft} onChange={v => $write(draft, v)} w={260} />
        <Button size="sm" onPress={() => $write(title, $read(draft))}>Set the title</Button>
      </Row>
      <Row gap="sm" ref={screen.ref}>
        <Button size="xs" variant="soft" onPress={() => screen.toggle()}>{() => ($read(screen.value) ? 'Exit fullscreen' : 'Go fullscreen')}</Button>
        <Text size="sm" fg="quiet">{() => \`Title set: \${$read(title) || '(not yet)'}\`}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const R = $active();
        const title = $signal(R, '');
        const draft = $signal(R, 'rui-show: hooks');
        $title(title);
        const screen = $fullscreen();
        return (
          <Stack gap="xs">
            <Row gap="sm" align="end">
              <TextInput label="Document title" value={draft} onChange={(/** @type {string} */ v) => $write(draft, v)} w={260} />
              <Button size="sm" onPress={() => $write(title, $read(draft))}>
                Set the title
              </Button>
            </Row>
            <Row gap="sm" ref={screen.ref}>
              <Button size="xs" variant="soft" onPress={() => screen.toggle()}>
                {() => ($read(screen.value) ? 'Exit fullscreen' : 'Go fullscreen')}
              </Button>
              <Text size="sm" fg="quiet">
                {() => `Title set: ${$read(title) || '(not yet)'}`}
              </Text>
            </Row>
          </Stack>
        );
      },
      height: 110,
    },
  ],
};
