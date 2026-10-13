// Grid: a 12-column grid with spans, offsets, order and gaps.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Grid, Surface, Stack, Row, Button, Text } from 'rui-core';

/** @param {{ children?: any, h?: number }} props */
const Cell = props => (
  <Surface bordered p="xs" bg="blue.0" h={props.h}>
    <Text size="sm">{props.children}</Text>
  </Surface>
);

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'grid',
  group: 'structure',
  title: 'Grid',
  description:
    'A grid of 12 (or `columns`) columns as a wrapping row of percent widths: column spans, offsets, order, gaps and growing rows, each by breakpoint too. The same on every renderer.',
  props: [
    { name: 'columns', type: 'number', default: '12', description: 'The number of columns a row divides into.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number | { base, xs, … }", default: "'lg'", description: 'Space between columns and rows: a scale step or pixels, or one per breakpoint.' },
    { name: 'fill', type: 'boolean', default: 'false', description: 'The columns of a row that is not full grow to fill it.' },
    { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", default: "'start'", description: 'Where the columns of a row sit.' },
    { name: 'align', type: "'stretch' | 'start' | 'center' | 'end'", default: "'stretch'", description: 'How the columns of a row line up across.' },
    { name: 'Grid.Col span', type: "number | 'auto'", default: '12', description: 'Columns taken; `auto` is as wide as its content (the Grid’s `fill` fills a row).' },
    { name: 'Grid.Col offset', type: 'number', default: '0', description: 'Columns left empty before it.' },
    { name: 'Grid.Col order', type: 'number', default: '0', description: 'Its place in the row (lower first; ties keep their order).' },
    { name: 'style props', type: 'm, p, w, bg, …', description: 'As Box, on the Grid and on each Grid.Col.' },
  ],
  demos: [
    {
      title: 'A dashboard',
      code: `
const Cell = props => <Surface bordered p="xs" bg="blue.0" h={props.h}><Text size="sm">{props.children}</Text></Surface>;

function Demo() {
  return (
    <Grid>
      <Grid.Col span={8}><Cell h={120}>Revenue chart: span 8</Cell></Grid.Col>
      <Grid.Col span={4}><Cell h={120}>Top products: span 4</Cell></Grid.Col>
      <Grid.Col span={4}><Cell>Orders: 1,284</Cell></Grid.Col>
      <Grid.Col span={4}><Cell>Returns: 37</Cell></Grid.Col>
      <Grid.Col span={4}><Cell>New customers: 212</Cell></Grid.Col>
    </Grid>
  );
}`,
      view: () => (
        <Grid>
          <Grid.Col span={8}>
            <Cell h={120}>Revenue chart: span 8</Cell>
          </Grid.Col>
          <Grid.Col span={4}>
            <Cell h={120}>Top products: span 4</Cell>
          </Grid.Col>
          <Grid.Col span={4}>
            <Cell>Orders: 1,284</Cell>
          </Grid.Col>
          <Grid.Col span={4}>
            <Cell>Returns: 37</Cell>
          </Grid.Col>
          <Grid.Col span={4}>
            <Cell>New customers: 212</Cell>
          </Grid.Col>
        </Grid>
      ),
      height: 230,
    },
    {
      title: 'Offsets and order',
      code: `
function Demo() {
  return (
    <Grid>
      <Grid.Col span={5}><Cell>span 5</Cell></Grid.Col>
      <Grid.Col span={5} offset={2}><Cell>span 5, offset 2</Cell></Grid.Col>
      <Grid.Col span={8} offset={2}><Cell>centered: span 8, offset 2</Cell></Grid.Col>
      <Grid.Col span={4} order={3}><Cell>written 1st, order 3</Cell></Grid.Col>
      <Grid.Col span={4} order={1}><Cell>written 2nd, order 1</Cell></Grid.Col>
      <Grid.Col span={4} order={2}><Cell>written 3rd, order 2</Cell></Grid.Col>
    </Grid>
  );
}`,
      view: () => (
        <Grid>
          <Grid.Col span={5}>
            <Cell>span 5</Cell>
          </Grid.Col>
          <Grid.Col span={5} offset={2}>
            <Cell>span 5, offset 2</Cell>
          </Grid.Col>
          <Grid.Col span={8} offset={2}>
            <Cell>centered: span 8, offset 2</Cell>
          </Grid.Col>
          <Grid.Col span={4} order={3}>
            <Cell>written 1st, order 3</Cell>
          </Grid.Col>
          <Grid.Col span={4} order={1}>
            <Cell>written 2nd, order 1</Cell>
          </Grid.Col>
          <Grid.Col span={4} order={2}>
            <Cell>written 3rd, order 2</Cell>
          </Grid.Col>
        </Grid>
      ),
      height: 160,
    },
    {
      title: 'Gaps, growing rows, content-wide columns',
      code: `
const GAPS = [0, 'xs', 'lg', 'xl'];

function Demo() {
  const gap = $signal($active(), 'lg');
  return (
    <Stack gap="sm">
      <Row gap="xs">
        {GAPS.map(g => <Button size="sm" dense variant="neutral" onPress={() => $write(gap, g)}>{\`gap \${g}\`}</Button>)}
        <Text size="sm" fg="quiet">{() => \`now: \${$read(gap)}\`}</Text>
      </Row>
      <Grid gap={gap} fill columns={10}>
        <Grid.Col span={3}><Cell>3 of 10</Cell></Grid.Col>
        <Grid.Col span={3}><Cell>3 of 10</Cell></Grid.Col>
        <Grid.Col span={3}><Cell>3 of 10</Cell></Grid.Col>
        <Grid.Col span={3}><Cell>grows to the row</Cell></Grid.Col>
        <Grid.Col span="auto"><Cell>auto: as wide as this text</Cell></Grid.Col>
      </Grid>
    </Stack>
  );
}`,
      view: () => {
        const GAPS = [0, 'xs', 'lg', 'xl'];
        const gap = $signal($active(), /** @type {string | number} */ ('lg'));
        return (
          <Stack gap="sm">
            <Row gap="xs">
              {GAPS.map(g => (
                <Button size="sm" dense variant="neutral" onPress={() => $write(gap, g)}>
                  {`gap ${g}`}
                </Button>
              ))}
              <Text size="sm" fg="quiet">
                {() => `now: ${$read(gap)}`}
              </Text>
            </Row>
            <Grid gap={gap} fill columns={10}>
              <Grid.Col span={3}>
                <Cell>3 of 10</Cell>
              </Grid.Col>
              <Grid.Col span={3}>
                <Cell>3 of 10</Cell>
              </Grid.Col>
              <Grid.Col span={3}>
                <Cell>3 of 10</Cell>
              </Grid.Col>
              <Grid.Col span={3}>
                <Cell>grows to the row</Cell>
              </Grid.Col>
              <Grid.Col span="auto">
                <Cell>auto: as wide as this text</Cell>
              </Grid.Col>
            </Grid>
          </Stack>
        );
      },
      height: 150,
    },
  ],
};
