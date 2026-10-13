// Tag: a small label, removable, in a group that wraps.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Row, Stack, Tag, Text } from 'rui-core';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const CITIES = ['Lisbon', 'Oslo', 'Kyoto', 'Lima', 'Accra', 'Perth'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'tag',
  group: 'choices',
  title: 'Tag',
  description: 'A small label, with a remove button when asked: MultiSelect and TagInput show their values as tags. Tag.Group lays them in a row that wraps.',
  props: [
    { name: 'children', type: 'string | (() => string)', description: 'Its text.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'xs'", description: 'Height and font size (`theme.sizes.tag`): 16 to 32 pixels high; its side padding .75 of its font size (`ratios.pad`). A removable tag ends in its remove button, inset as far from the end as from the top and bottom; a disabled one keeps its end padding.' },
    { name: 'radius', type: "'xs' … 'xl' | number", default: "'sm'", description: 'Corner radius.' },
    { name: 'removable', type: 'boolean', default: 'false', description: 'Shows an X that calls `onRemove`.' },
    { name: 'onRemove', type: '() => void', description: 'Called by the remove button.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Grayed out, without the remove button.' },
    { name: 'style props', type: 'bg, m, …', description: 'As Box: `bg` its color.' },
    { name: 'Tag.Group', type: '{ children }', description: 'Tags in a row that wraps, 3 px apart (half of `control.labelGap`).' },
  ],
  demos: [
    {
      title: 'Sizes and looks',
      code: `
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="xs" align="center">
        {SIZES.map(size => <Tag size={size}>{size}</Tag>)}
      </Row>
      <Row gap="xs" align="center">
        <Tag removable>Removable</Tag>
        <Tag radius="xl">Round</Tag>
        <Tag bg="blue.1">Blue</Tag>
        <Tag disabled removable>Disabled</Tag>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="xs" align="center">
            {SIZES.map(size => (
              <Tag size={size}>{size}</Tag>
            ))}
          </Row>
          <Row gap="xs" align="center">
            <Tag removable>Removable</Tag>
            <Tag radius="xl">Round</Tag>
            <Tag bg="blue.1">Blue</Tag>
            <Tag disabled removable>
              Disabled
            </Tag>
          </Row>
        </Stack>
      ),
      height: 100,
    },
    {
      title: 'A group of removable tags',
      code: `
const CITIES = ['Lisbon', 'Oslo', 'Kyoto', 'Lima', 'Accra', 'Perth'];

function Demo() {
  const left = $signal($active(), CITIES);
  return (
    <Stack gap="sm" w={300}>
      <Tag.Group>
        {() => $read(left).map(name => <Tag removable onRemove={() => $write(left, $read(left).filter(n => n !== name))}>{name}</Tag>)}
      </Tag.Group>
      <Text size="sm" fg="quiet">{() => \`\${$read(left).length} left\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const left = $signal($active(), CITIES);
        return (
          <Stack gap="sm" w={300}>
            <Tag.Group>
              {() =>
                $read(left).map(name => (
                  <Tag removable onRemove={() => $write(left, $read(left).filter(n => n !== name))}>
                    {name}
                  </Tag>
                ))
              }
            </Tag.Group>
            <Text size="sm" fg="quiet">
              {() => `${$read(left).length} left`}
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
  ],
};
