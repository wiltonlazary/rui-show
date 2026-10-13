// Link: underlining, sizes and colors, navigation through a handler.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Link, Row, SegmentedControl, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'link',
  group: 'actions',
  title: 'Link',
  description: 'A link: text in the accent color, underlined by default. It navigates through `onPress`, or opens `href` through the platform’s navigation where there is one (inert elsewhere); nested in Text it is a run of the Text’s Label.',
  props: [
    { name: 'children', type: 'string | (() => string)', description: 'The link’s text.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The text color: a theme color, `name.shade` or hex (the `fg` style prop overrides it).' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", description: 'Font size; the inherited one by default.' },
    { name: 'underlined', type: "boolean | 'hover'", default: 'true', description: 'Whether the text is underlined: always (a link is not told apart by color alone), on hover, or never.' },
    { name: 'onPress', type: '(event) => void', description: 'Called on a press: where the application navigates; preventing the default keeps `href` closed.' },
    { name: 'href / target', type: 'string', description: 'Opened after `onPress` through the platform’s navigation, where there is one; it means a link to it. Only a relative address, `#…`, `http:`, `https:`, `mailto:` or `tel:` is shown or followed; any other scheme (`javascript:`, `data:`) is dropped, leaving an inert link.' },
    { name: 'label', type: 'string', description: 'The accessible name, when the text is not enough.' },
  ],
  demos: [
    {
      title: 'When the underline shows',
      code: `
function Demo() {
  const mode = $signal($active(), 'always');
  return (
    <Stack gap="sm" align="start">
      <SegmentedControl aria-label="Underline" size="xs" data={['always', 'hover', 'never']} value={mode} onChange={v => $write(mode, v)} />
      <Row gap={4} align="center">
        <Text size="sm">Read the</Text>
        <Link size="sm" underlined={() => ({ always: true, hover: 'hover', never: false })[$read(mode)]}>release notes</Link>
        <Text size="sm">first.</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const mode = $signal($active(), 'always');
        return (
          <Stack gap="sm" align="start">
            <SegmentedControl aria-label="Underline" size="xs" data={['always', 'hover', 'never']} value={mode} onChange={(/** @type {string} */ v) => $write(mode, v)} />
            <Row gap={4} align="center">
              <Text size="sm">Read the</Text>
              <Link size="sm" underlined={() => ({ always: true, hover: 'hover', never: false })[$read(mode)]}>
                release notes
              </Link>
              <Text size="sm">first.</Text>
            </Row>
          </Stack>
        );
      },
      height: 90,
    },
    {
      title: 'Sizes and colors',
      code: `
function Demo() {
  return (
    <Stack gap="xs" align="start">
      <Row gap="md" align="center">
        {['xs', 'sm', 'md', 'lg', 'xl'].map(size => <Link size={size}>{'Link ' + size}</Link>)}
      </Row>
      <Row gap="md">
        <Link color="teal">Teal link</Link>
        <Link color="purple.7">purple.7 link</Link>
        <Link fg="quiet">Quiet link</Link>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="xs" align="start">
          <Row gap="md" align="center">
            {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
              <Link size={size}>{'Link ' + size}</Link>
            ))}
          </Row>
          <Row gap="md">
            <Link color="teal">Teal link</Link>
            <Link color="purple.7">purple.7 link</Link>
            <Link fg="quiet">Quiet link</Link>
          </Row>
        </Stack>
      ),
      height: 80,
    },
    {
      title: 'Navigating through a handler',
      code: `
function Demo() {
  const at = $signal($active(), 'home');
  return (
    <Stack gap="sm" align="start">
      <Row gap="md">
        <Link onPress={() => $write(at, 'home')}>Home</Link>
        <Link onPress={() => $write(at, 'docs')}>Docs</Link>
        <Link onPress={() => $write(at, 'changelog')}>Changelog</Link>
      </Row>
      <Text fg="quiet">{() => 'at #' + $read(at)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const at = $signal($active(), 'home');
        return (
          <Stack gap="sm" align="start">
            <Row gap="md">
              <Link onPress={() => $write(at, 'home')}>Home</Link>
              <Link onPress={() => $write(at, 'docs')}>Docs</Link>
              <Link onPress={() => $write(at, 'changelog')}>Changelog</Link>
            </Row>
            <Text fg="quiet">{() => 'at #' + $read(at)}</Text>
          </Stack>
        );
      },
      height: 80,
    },
  ],
};
