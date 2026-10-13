// Button.Group and Button.Addon: attached buttons, vertical, and a
// zoom control with an addon showing the level.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'button-group',
  group: 'actions',
  title: 'Button.Group',
  description: 'Buttons joined in one frame, side by side (or stacked): the frame draws the edge, a line between each pair of children and the corners in the page’s border color, and clips its children to its corners; the children draw no border and no radius, the same on every renderer. Button.Addon is a non-pressable part in a button’s box.',
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Side by side, or stacked.' },
    { name: 'divider', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'xs' (1 px)", description: 'The thickness of the frame’s edge and of the lines between its children: a `theme.sizes.divider` step or pixels; 0 for none.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'The frame’s corners; a child’s own radius is ignored.' },
    { name: 'children', type: 'Button | Button.Addon | any', description: 'The attached parts.' },
    { name: 'Button.Addon variant', type: "'solid' | 'soft' | 'outline' | 'ghost' | 'neutral' | 'plain' | 'inverse'", default: "'neutral'", description: 'How the addon’s color is applied.' },
    { name: 'Button.Addon color', type: 'string', default: 'theme.accent', description: 'A theme color name, `name.shade` or hex.' },
    { name: 'Button.Addon size', type: "'xs' … 'xl'", default: "'sm'", description: 'Height, side padding and font size, as a Button’s.' },
    { name: 'Button.Addon dense', type: 'boolean', default: 'false', description: 'Lower and tighter at that size, as a dense Button.' },
    { name: 'Button.Addon radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'theme.corner', description: 'Corner radius, outside a group (in one, the group’s corners).' },
    { name: 'Button.Addon children', type: 'string | (() => string) | any', description: 'Its text (an accessor updates it) or content.' },
  ],
  demos: [
    {
      title: 'Attached buttons',
      code: `
function Demo() {
  return (
    <Row gap="xl" align="start">
      <Button.Group>
        <Button variant="neutral">Day</Button>
        <Button variant="neutral">Week</Button>
        <Button variant="neutral">Month</Button>
      </Button.Group>
      <Button.Group orientation="vertical">
        <Button variant="soft">Inbox</Button>
        <Button variant="soft">Drafts</Button>
        <Button variant="soft">Sent</Button>
      </Button.Group>
    </Row>
  );
}`,
      view: () => (
        <Row gap="xl" align="start">
          <Button.Group>
            <Button variant="neutral">Day</Button>
            <Button variant="neutral">Week</Button>
            <Button variant="neutral">Month</Button>
          </Button.Group>
          <Button.Group orientation="vertical">
            <Button variant="soft">Inbox</Button>
            <Button variant="soft">Drafts</Button>
            <Button variant="soft">Sent</Button>
          </Button.Group>
        </Row>
      ),
      height: 130,
    },
    {
      title: 'A zoom control with the level as an addon',
      code: `
function Demo() {
  const zoom = $signal($active(), 100);
  const step = by => $write(zoom, Math.min(200, Math.max(50, $read(zoom) + by)));
  return (
    <Button.Group>
      <Button variant="neutral" label="Zoom out" onPress={() => step(-25)}>−</Button>
      <Button.Addon>{() => \`\${$read(zoom)} %\`}</Button.Addon>
      <Button variant="neutral" label="Zoom in" onPress={() => step(25)}>+</Button>
    </Button.Group>
  );
}`,
      view: () => {
        const zoom = $signal($active(), 100);
        const step = (/** @type {number} */ by) => $write(zoom, Math.min(200, Math.max(50, $read(zoom) + by)));
        return (
          <Button.Group>
            <Button variant="neutral" label="Zoom out" onPress={() => step(-25)}>
              −
            </Button>
            <Button.Addon>{() => `${$read(zoom)} %`}</Button.Addon>
            <Button variant="neutral" label="Zoom in" onPress={() => step(25)}>
              +
            </Button>
          </Button.Group>
        );
      },
      height: 60,
    },
    {
      title: 'Colors, radius and no divider',
      code: `
function Demo() {
  return (
    <Row gap="xl" align="center">
      <Button.Group radius="xl">
        <Button>Save</Button>
        <Button.Addon variant="solid">or</Button.Addon>
        <Button color="teal">Publish</Button>
      </Button.Group>
      <Button.Group divider={0}>
        <Button variant="soft" color="purple">Undo</Button>
        <Button variant="soft" color="purple">Redo</Button>
      </Button.Group>
    </Row>
  );
}`,
      view: () => (
        <Row gap="xl" align="center">
          <Button.Group radius="xl">
            <Button>Save</Button>
            <Button.Addon variant="solid">
              or
            </Button.Addon>
            <Button color="teal">
              Publish
            </Button>
          </Button.Group>
          <Button.Group divider={0}>
            <Button variant="soft" color="purple">
              Undo
            </Button>
            <Button variant="soft" color="purple">
              Redo
            </Button>
          </Button.Group>
        </Row>
      ),
      height: 60,
    },
  ],
};
