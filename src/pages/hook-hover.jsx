// $hover: whether the pointer is over an element.

import { $read } from 'rrx-core';
import { $hover } from 'rui-core/hooks';
import { Row, Surface, Text, Badge } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-hover',
  group: 'behavior',
  title: '$hover',
  description: 'Whether the pointer is over an element. Portable: it returns `props` (`onPointerEnter`, `onPointerLeave`) to spread on any rui-core component or primitive, which every renderer delivers the same way.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'returns', type: '{ value: Readable<boolean>, props: { onPointerEnter, onPointerLeave } }', description: 'The state, and the props to spread on the element.' },
  ],
  demos: [
    {
      title: 'Hover the cards',
      code: `
function Card({ name }) {
  const { value: hovered, props } = $hover();
  return (
    <Surface {...props} bordered p="md" w={200} bg={() => ($read(hovered) ? 'blue.0' : undefined)}>
      <Text fontWeight={700}>{name}</Text>
      <Text size="sm" fg={() => ($read(hovered) ? 'blue' : 'quiet')}>{() => ($read(hovered) ? 'On while you hover' : 'Hover to switch it on')}</Text>
    </Surface>
  );
}

function Demo() {
  const first = $hover();
  return (
    <Row gap="md">
      <Card name="Desk lamp" />
      <Card name="Ceiling fan" />
      <Badge {...first.props} size="lg" color={() => ($read(first.value) ? 'teal' : 'gray')}>
        {() => ($read(first.value) ? 'hovered' : 'badge')}
      </Badge>
    </Row>
  );
}`,
      view: () => {
        /** @param {{ name: string }} props */
        const Card = ({ name }) => {
          const { value: hovered, props } = $hover();
          return (
            <Surface {...props} bordered p="md" w={200} bg={() => ($read(hovered) ? 'blue.0' : undefined)}>
              <Text fontWeight={700}>{name}</Text>
              <Text size="sm" fg={() => ($read(hovered) ? 'blue' : 'quiet')}>
                {() => ($read(hovered) ? 'On while you hover' : 'Hover to switch it on')}
              </Text>
            </Surface>
          );
        };
        const first = $hover();
        return (
          <Row gap="md">
            <Card name="Desk lamp" />
            <Card name="Ceiling fan" />
            <Badge {...first.props} size="lg" color={() => ($read(first.value) ? 'teal' : 'gray')}>
              {() => ($read(first.value) ? 'hovered' : 'badge')}
            </Badge>
          </Row>
        );
      },
      height: 100,
    },
  ],
};
