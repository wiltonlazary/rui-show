// Pagination: a controlled page, pages around it and ends, edges, sizes,
// colors and states.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Pagination, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'pagination',
  group: 'wayfinding',
  title: 'Pagination',
  description: 'Page controls with gaps, the pages around the current one and the ends (the `$pages` items), previous and next controls, optional first and last, and the arrow keys, Home and End while a control has focus. The controls are ghosts, with no ground or edge until the pointer is over one, and the current page wears a soft wash of the color with a tone underline; the arrows are drawn chevrons, the same on every renderer.',
  props: [
    { name: 'total', type: 'number', description: 'The number of pages.' },
    { name: 'value', type: 'number | (() => number) | Signal<number>', description: 'The current page (a signal is written on change); its control says `aria-current="page"`.' },
    { name: 'defaultValue', type: 'number', default: '1', description: 'The current page when not controlled.' },
    { name: 'onChange', type: '(page: number) => void', description: 'Called with the new page.' },
    { name: 'around', type: 'number', default: '1', description: 'Pages shown on each side of the current one.' },
    { name: 'ends', type: 'number', default: '1', description: 'Pages shown at each end.' },
    { name: 'controls', type: 'boolean', default: 'true', description: 'The previous and next controls.' },
    { name: 'edges', type: 'boolean', default: 'false', description: 'The first and last page controls.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'A control’s side: `theme.sizes.pagination` (24, 28, 32, 40, 48 px), or pixels.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius of the controls.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The current page’s wash and underline.' },
    { name: 'gap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'half of spacing xs (4)', description: 'The space between controls.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Faded controls; presses and keys are ignored.' },
    { name: 'single', type: 'boolean', default: 'true', description: 'Shown with one page or none; `false` hides it then.' },
  ],
  demos: [
    {
      title: 'Twelve pages, starting at the third',
      code: `
function Demo() {
  const page = $signal($active(), 3);
  return (
    <Stack gap="sm">
      <Pagination total={12} value={page} />
      <Text fg="quiet">{() => 'page ' + $read(page) + ' of 12'}</Text>
    </Stack>
  );
}`,
      view: () => {
        const page = $signal($active(), 3);
        return (
          <Stack gap="sm">
            <Pagination total={12} value={page} />
            <Text fg="quiet">{() => 'page ' + $read(page) + ' of 12'}</Text>
          </Stack>
        );
      },
      height: 90,
    },
    {
      title: 'Pages around, ends and edges',
      code: `
function Demo() {
  const page = $signal($active(), 17);
  return (
    <Stack gap="sm">
      <Pagination total={30} value={page} edges />
      <Pagination total={30} value={page} around={2} ends={2} controls={false} />
      <Text fg="quiet">{() => 'page ' + $read(page) + ' of 30'}</Text>
    </Stack>
  );
}`,
      view: () => {
        const page = $signal($active(), 17);
        return (
          <Stack gap="sm">
            <Pagination total={30} value={page} edges />
            <Pagination total={30} value={page} around={2} ends={2} controls={false} />
            <Text fg="quiet">{() => 'page ' + $read(page) + ' of 30'}</Text>
          </Stack>
        );
      },
      height: 130,
    },
    {
      title: 'Sizes, colors and states',
      code: `
function Demo() {
  const heard = $signal($active(), 'no change yet');
  return (
    <Stack gap="sm">
      <Pagination total={5} size="xs" radius="xl" color="teal" onChange={p => $write(heard, 'onChange(' + p + ')')} />
      <Pagination total={5} size="lg" defaultValue={3} color="purple" gap="xs" />
      <Pagination total={5} disabled />
      <Pagination total={1} single={false} />
      <Text fg="quiet">{() => $read(heard)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const heard = $signal($active(), 'no change yet');
        return (
          <Stack gap="sm">
            <Pagination total={5} size="xs" radius="xl" color="teal" onChange={(/** @type {number} */ p) => $write(heard, 'onChange(' + p + ')')} />
            <Pagination total={5} size="lg" defaultValue={3} color="purple" gap="xs" />
            <Pagination total={5} disabled />
            <Pagination total={1} single={false} />
            <Text fg="quiet">{() => $read(heard)}</Text>
          </Stack>
        );
      },
      height: 170,
    },
  ],
};
