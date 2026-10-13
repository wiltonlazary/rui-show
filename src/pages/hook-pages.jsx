// $pages: the page items, for custom page controls.

import { $read } from 'rrx-core';
import { For } from 'ren-core';
import { $pages } from 'rui-core/hooks';
import { Button, Row, Stack, Text, Pagination } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'hook-pages',
  group: 'behavior',
  title: '$pages',
  description: 'The pages to show for the current page of a total, with `\'gap\'` where pages are left out: the logic of Pagination, for page controls of your own. The page is clamped to the total, and may be controlled.',
  props: [
    { name: 'root', type: 'Graph', description: 'Optional first argument: the root to run on.' },
    { name: 'options.total', type: 'number | (() => number) | Readable<number>', description: 'The page count.' },
    { name: 'options.defaultPage', type: 'number', default: '1', description: 'The page at first.' },
    { name: 'options.page', type: 'number | (() => number) | Readable<number>', description: 'A controlled page.' },
    { name: 'options.onChange', type: '(page: number) => void', description: 'Called with each new page: not for the page shown, nor for a step past the first or last.' },
    { name: 'options.around', type: 'number', default: '1', description: 'Pages shown on each side of the current one.' },
    { name: 'options.ends', type: 'number', default: '1', description: 'Pages shown at each end.' },
    { name: 'returns', type: '{ items, page, go, step }', description: '`items` is a node of the items (`number | \'gap\'`), `page` the current page; `go(page)` moves to a page (clamped), `step(1)` and `step(-1)` to the next and previous.' },
  ],
  demos: [
    {
      title: 'Page controls of your own',
      code: `
function Demo() {
  const pages = $pages({ total: 20, defaultPage: 7 });
  return (
    <Stack gap="sm">
      <Row gap={4}>
        <Button size="sm" dense variant="neutral" onPress={() => pages.go(1)}>First</Button>
        <Button size="sm" dense variant="neutral" onPress={() => pages.step(-1)}>Prev</Button>
        <For each={() => $read(pages.items).map((item, i) => (item === 'gap' ? \`gap-\${i}\` : item))}>
          {item => typeof item() === 'string'
            ? <Text size="sm" fg="quiet" px={4}>…</Text>
            : <Button size="sm" dense variant={() => ($read(pages.page) === item() ? 'solid' : 'ghost')} onPress={() => pages.go(item())}>{String(item())}</Button>}
        </For>
        <Button size="sm" dense variant="neutral" onPress={() => pages.step(1)}>Next</Button>
        <Button size="sm" dense variant="neutral" onPress={() => pages.go(20)}>Last</Button>
      </Row>
      <Text size="sm">{() => \`Page \${$read(pages.page)} of 20\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const pages = $pages({ total: 20, defaultPage: 7 });
        return (
          <Stack gap="sm">
            <Row gap={4}>
              <Button size="sm" dense variant="neutral" onPress={() => pages.go(1)}>
                First
              </Button>
              <Button size="sm" dense variant="neutral" onPress={() => pages.step(-1)}>
                Prev
              </Button>
              <For each={() => $read(pages.items).map((item, i) => (item === 'gap' ? `gap-${i}` : item))}>
                {(/** @type {() => number | string} */ item) =>
                  typeof item() === 'string' ? (
                    <Text size="sm" fg="quiet" px={4}>
                      …
                    </Text>
                  ) : (
                    <Button size="sm" dense variant={() => ($read(pages.page) === item() ? 'solid' : 'ghost')} onPress={() => pages.go(/** @type {number} */ (item()))}>
                      {String(item())}
                    </Button>
                  )
                }
              </For>
              <Button size="sm" dense variant="neutral" onPress={() => pages.step(1)}>
                Next
              </Button>
              <Button size="sm" dense variant="neutral" onPress={() => pages.go(20)}>
                Last
              </Button>
            </Row>
            <Text size="sm">{() => `Page ${$read(pages.page)} of 20`}</Text>
          </Stack>
        );
      },
      height: 110,
    },
    {
      title: 'Driving Pagination, two pages around the current one',
      code: `
function Demo() {
  const pages = $pages({ total: 30, around: 2, ends: 2 });
  return (
    <Stack gap="sm">
      <Pagination total={30} around={2} ends={2} value={pages.page} onChange={pages.go} />
      <Text size="sm" fg="quiet">{() => \`Items: \${$read(pages.items).join(' ')}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const pages = $pages({ total: 30, around: 2, ends: 2 });
        return (
          <Stack gap="sm">
            <Pagination total={30} around={2} ends={2} value={pages.page} onChange={pages.go} />
            <Text size="sm" fg="quiet">
              {() => `Items: ${$read(pages.items).join(' ')}`}
            </Text>
          </Stack>
        );
      },
      height: 90,
    },
  ],
};
