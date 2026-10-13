// Gantt (rui-core/more): tasks over days, moved and resized by dragging.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Stack, Text } from 'rui-core';
import { Gantt } from 'rui-core/more';

const TASKS = [
  { id: 'design', name: 'Design', start: '2026-09-01', end: '2026-09-04', progress: 100, color: 'purple' },
  { id: 'build', name: 'Build', start: '2026-09-05', end: '2026-09-10', progress: 60, dependencies: ['design'] },
  { id: 'test', name: 'Test', start: '2026-09-09', end: '2026-09-12', progress: 20, color: 'teal', dependencies: ['build'] },
  { id: 'ship', name: 'Ship', start: '2026-09-13', end: '2026-09-13', color: 'orange', dependencies: ['test'] },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'gantt',
  group: 'time',
  title: 'Gantt',
  description: 'A Gantt chart (rui-core/more): tasks as bars over days with their progress and dependencies; a drag on a bar moves it, on its ends resizes it, in whole days. A timeline wider than the chart scrolls across under the task names, which stay.',
  props: [
    { name: 'tasks', type: '{ id, name, start, end, progress?, color?, dependencies? }[]', description: 'The tasks (days as Dates, ms or `YYYY-MM-DD`; UTC).' },
    { name: 'onTaskChange', type: '(task) => void', description: 'The task with its new `start` and `end`, after a drag.' },
    { name: 'onTaskPress', type: '(task) => void', description: 'A bar pressed.' },
    { name: 'from / to', type: 'Date | number | string', default: 'the tasks’ first day less one, last day plus one', description: 'The timeline.' },
    { name: 'dayWidth / rowHeight / labelWidth / headerHeight', type: 'number', default: '32 / 36 / 160 / 40', description: 'The grid.' },
    { name: 'editable', type: 'boolean', default: 'true', description: 'Bars can be dragged.' },
    { name: 'color', type: 'string', default: 'theme.accent', description: 'The bars’ default color.' },
    { name: 'taskLabel', type: 'string', default: "'Task'", description: 'The names column’s header.' },
    { name: 'aria-label', type: 'string', description: 'The grid’s accessible name: the plan it shows.' },
  ],
  demos: [
    {
      title: 'A small project',
      code: `
const TASKS = [
  { id: 'design', name: 'Design', start: '2026-09-01', end: '2026-09-04', progress: 100, color: 'purple' },
  { id: 'build', name: 'Build', start: '2026-09-05', end: '2026-09-10', progress: 60, dependencies: ['design'] },
  { id: 'test', name: 'Test', start: '2026-09-09', end: '2026-09-12', progress: 20, color: 'teal', dependencies: ['build'] },
  { id: 'ship', name: 'Ship', start: '2026-09-13', end: '2026-09-13', color: 'orange', dependencies: ['test'] },
];

function Demo() {
  const tasks = $signal($active(), TASKS);
  const last = $signal($active(), 'drag a bar or its ends');
  return (
    <Stack gap="xs">
      <Gantt
        aria-label="Project plan"
        tasks={tasks}
        from="2026-09-01"
        to="2026-09-14"
        dayWidth={32}
        labelWidth={100}
        onTaskChange={t => ($write(tasks, $read(tasks).map(x => (x.id === t.id ? t : x))), $write(last, \`\${t.name}: \${t.start} to \${t.end}\`))}
      />
      <Text size="sm" fg="quiet">{() => $read(last)}</Text>
    </Stack>
  );
}`,
      view: () => {
        const tasks = $signal($active(), TASKS);
        const last = $signal($active(), 'drag a bar or its ends');
        return (
          <Stack gap="xs">
            <Gantt
              aria-label="Project plan"
              tasks={tasks}
              from="2026-09-01"
              to="2026-09-14"
              dayWidth={32}
              labelWidth={100}
              onTaskChange={(/** @type {any} */ t) => ($write(tasks, $read(tasks).map(x => (x.id === t.id ? t : x))), $write(last, `${t.name}: ${t.start} to ${t.end}`))}
            />
            <Text size="sm" fg="quiet">
              {() => $read(last)}
            </Text>
          </Stack>
        );
      },
      height: 250,
      unordered: true,
    },
  ],
};
