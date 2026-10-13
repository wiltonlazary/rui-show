// JsonTree (rui-core/more): JSON as a tree that opens and closes.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Stack, Text } from 'rui-core';
import { JsonTree } from 'rui-core/more';

const DATA = {
  name: 'rui-core',
  version: '0.1.0',
  private: true,
  exports: { '.': './src/index.js', './dates': './src/ext/dates/index.js' },
  keywords: ['ui', 'components', 'portable'],
  size: null,
  deps: 2,
};

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'json-tree',
  group: 'data',
  title: 'JsonTree',
  description: 'A JSON value as a tree (rui-core/more) whose objects and arrays open and close, colored by type; pressing a value copies it (a string as its text, anything else as JSON) where the platform has a clipboard.',
  props: [
    { name: 'data', type: 'any', description: 'The JSON value.' },
    { name: 'expanded', type: 'string[]', description: 'The open nodes, held by you: their ids, a node’s path joined by dots (\'exports\', \'meta.ok\'; \'\' the root).' },
    { name: 'defaultExpanded', type: 'boolean | number | string[]', default: '1', description: 'Open at first when not held: all (true), none (false), the levels above a depth (the root’s by default), or a list of node ids.' },
    { name: 'maxDepth', type: 'number', description: 'Deeper nodes start collapsed.' },
    { name: 'title', type: 'string', default: "'root'", description: 'The root’s key.' },
    { name: 'counts', type: 'boolean', default: 'true', description: '“3 items” beside a collapsed node.' },
    { name: 'copyable', type: 'boolean', default: 'true', description: 'Pressing a value copies it as its text: a string or a BigInt as written, anything else as JSON.' },
    { name: 'onCopy', type: '(text, path) => void', description: 'Called with what was copied.' },
    { name: 'onExpandedChange', type: '(ids, { path, open }) => void', description: 'Called as a node opens or closes: every open node’s id after the toggle, and the toggled node’s path (a key list) and state.' },
    { name: 'stringColor / numberColor / booleanColor / nullColor / otherColor / keyColor', type: 'string', default: "'green' / 'blue' / 'orange' / the quiet text color / 'purple' / 'violet'", description: 'The colors by type, and the keys’.' },
    { name: 'fontSize', type: "'xs' … 'xl'", default: "'sm'", description: 'The text size.' },
    { name: 'aria-label', type: 'string', description: 'The tree’s accessible name: what it holds.' },
  ],
  demos: [
    {
      title: 'A package manifest',
      code: `
const DATA = {
  name: 'rui-core',
  version: '0.1.0',
  private: true,
  exports: { '.': './src/index.js', './dates': './src/ext/dates/index.js' },
  keywords: ['ui', 'components', 'portable'],
  size: null,
  deps: 2,
};

function Demo() {
  return <JsonTree aria-label="package.json" data={DATA} title="package" />;
}`,
      view: () => <JsonTree aria-label="package.json" data={DATA} title="package" />,
      height: 230,
    },
    {
      title: 'All open, and what was copied',
      code: `
function Demo() {
  const copied = $signal($active(), 'nothing yet');
  return (
    <Stack gap="xs">
      <JsonTree aria-label="package.json" data={DATA} defaultExpanded fontSize="xs" onCopy={(text, path) => $write(copied, \`\${path.join('.') || 'root'} = \${text}\`)} />
      <Text size="sm" fg="quiet">{() => \`copied: \${$read(copied)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const copied = $signal($active(), 'nothing yet');
        return (
          <Stack gap="xs">
            <JsonTree aria-label="package.json" data={DATA} defaultExpanded fontSize="xs" onCopy={(/** @type {string} */ text, /** @type {string[]} */ path) => $write(copied, `${path.join('.') || 'root'} = ${text}`)} />
            <Text size="sm" fg="quiet">
              {() => `copied: ${$read(copied)}`}
            </Text>
          </Stack>
        );
      },
      height: 390,
    },
    {
      title: 'Open nodes held by ids',
      code: `
function Demo() {
  const open = $signal($active(), ['', 'exports']);
  const last = $signal($active(), 'nothing yet');
  return (
    <Stack gap="xs">
      <Row gap="xs">
        <Button size="xs" variant="soft" onPress={() => $write(open, ['', 'exports', 'keywords'])}>Open all</Button>
        <Button size="xs" variant="soft" onPress={() => $write(open, [''])}>Close all</Button>
      </Row>
      <JsonTree
        aria-label="package.json"
        data={DATA}
        expanded={open}
        onExpandedChange={(ids, { path, open: now }) => {
          $write(open, ids);
          $write(last, \`\${path.join('.') || 'root'} \${now ? 'opened' : 'closed'}\`);
        }}
      />
      <Text size="sm" fg="quiet">{() => \`open: [\${$read(open).map(id => \`'\${id}'\`).join(', ')}]; last: \${$read(last)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const open = $signal($active(), /** @type {string[]} */ (['', 'exports']));
        const last = $signal($active(), 'nothing yet');
        return (
          <Stack gap="xs">
            <Row gap="xs">
              <Button size="xs" variant="soft" onPress={() => $write(open, ['', 'exports', 'keywords'])}>
                Open all
              </Button>
              <Button size="xs" variant="soft" onPress={() => $write(open, [''])}>
                Close all
              </Button>
            </Row>
            <JsonTree
              aria-label="package.json"
              data={DATA}
              expanded={open}
              onExpandedChange={(/** @type {string[]} */ ids, /** @type {{ path: any[], open: boolean }} */ { path, open: now }) => {
                $write(open, ids);
                $write(last, `${path.join('.') || 'root'} ${now ? 'opened' : 'closed'}`);
              }}
            />
            <Text size="sm" fg="quiet">
              {() => `open: [${/** @type {string[]} */ ($read(open)).map(id => `'${id}'`).join(', ')}]; last: ${$read(last)}`}
            </Text>
          </Stack>
        );
      },
      height: 360,
    },
  ],
};
