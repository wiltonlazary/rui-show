// Icons: rui-core's drawn icons, the same on every renderer.

import {
  CloseIcon,
  CheckIcon,
  ChevronIcon,
  BackIcon,
  ForwardIcon,
  DotsIcon,
  CopyIcon,
  ShareIcon,
  CameraIcon,
  TagIcon,
  TrashIcon,
  EditIcon,
  EyeIcon,
  ImageIcon,
  BanIcon,
  UndoIcon,
  MergeIcon,
  MailIcon,
  ExitIcon,
  ShieldIcon,
  SettingsIcon,
  IconButton,
  Row,
  Stack,
  Text,
} from 'rui-core';

const ICONS = { CloseIcon, CheckIcon, ChevronIcon, BackIcon, ForwardIcon, DotsIcon, CopyIcon, ShareIcon, CameraIcon, TagIcon, TrashIcon, EditIcon, EyeIcon, ImageIcon, BanIcon, UndoIcon, MergeIcon, MailIcon, ExitIcon, ShieldIcon, SettingsIcon };

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'icons',
  group: 'foundations',
  title: 'Icons',
  description:
    'Icons drawn with the portable Shape (lines, paths and ovals), so each one looks the same on the DOM, Skia and three.js: no icon font, no SVG. Each is a component taking a size, a color and a stroke; the components use them for their chevrons, checks and closes.',
  props: [
    { name: 'size', type: 'number', default: 'theme.sizes.glyph.md (16)', description: 'The square’s side, in pixels.' },
    { name: 'color', type: 'string', default: 'the scheme’s text color', description: 'A theme color name, `name.shade`, hex, or `quiet`. A Shape does not take the text color around it, so a component passes the color it paints text in.' },
    { name: 'stroke', type: 'number', default: 'size ÷ 8, at least 1.5', description: 'The width of its lines, in pixels.' },
    { name: 'rotate', type: 'number', default: '0', description: 'ChevronIcon: degrees clockwise from pointing down (90 points left, 180 up).' },
    { name: 'edge', type: 'boolean', default: 'false', description: 'ChevronIcon: a bar where it points.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'BackIcon and ForwardIcon: along the row, or up and down.' },
  ],
  demos: [
    {
      title: 'Every icon',
      code: `
const ICONS = { CloseIcon, CheckIcon, ChevronIcon, BackIcon, ForwardIcon, DotsIcon, CopyIcon, ShareIcon, CameraIcon, TagIcon, TrashIcon, EditIcon, EyeIcon, ImageIcon, BanIcon, UndoIcon, MergeIcon, MailIcon, ExitIcon, ShieldIcon, SettingsIcon };

function Demo() {
  return (
    <Row gap="md">
      {Object.entries(ICONS).map(([name, Icon]) => (
        <Stack gap="xs" align="center" w={96}>
          <Icon size={24} />
          <Text size="xs" fg="quiet">{name}</Text>
        </Stack>
      ))}
    </Row>
  );
}`,
      view: () => (
        <Row gap="md">
          {Object.entries(ICONS).map(([name, Icon]) => (
            <Stack gap="xs" align="center" w={96}>
              <Icon size={24} />
              <Text size="xs" fg="quiet">
                {name}
              </Text>
            </Stack>
          ))}
        </Row>
      ),
      height: 300,
    },
    {
      title: 'Sizes, colors, strokes and turns, in buttons',
      code: `
function Demo() {
  return (
    <Stack gap="md">
      <Row gap="md" align="center">
        <CheckIcon size={12} />
        <CheckIcon size={16} />
        <CheckIcon size={24} />
        <CheckIcon size={32} color="green" />
        <ShieldIcon size={32} stroke={1} color="indigo" />
        <ImageIcon size={32} stroke={3} color="orange" />
        <ChevronIcon size={24} rotate={90} />
        <ChevronIcon size={24} rotate={180} edge />
        <ForwardIcon size={24} orientation="vertical" />
      </Row>
      <Row gap="xs">
        <IconButton variant="soft" label="Edit"><EditIcon /></IconButton>
        <IconButton variant="soft" label="Show"><EyeIcon /></IconButton>
        <IconButton variant="soft" color="red" label="Delete"><TrashIcon /></IconButton>
        <IconButton variant="ghost" label="Undo"><UndoIcon /></IconButton>
        <IconButton variant="ghost" label="Undo, disabled" disabled><UndoIcon /></IconButton>
        <IconButton variant="plain" label="Invite, disabled" disabled><MailIcon /></IconButton>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <Row gap="md" align="center">
            <CheckIcon size={12} />
            <CheckIcon size={16} />
            <CheckIcon size={24} />
            <CheckIcon size={32} color="green" />
            <ShieldIcon size={32} stroke={1} color="indigo" />
            <ImageIcon size={32} stroke={3} color="orange" />
            <ChevronIcon size={24} rotate={90} />
            <ChevronIcon size={24} rotate={180} edge />
            <ForwardIcon size={24} orientation="vertical" />
          </Row>
          <Row gap="xs">
            <IconButton variant="soft" label="Edit">
              <EditIcon />
            </IconButton>
            <IconButton variant="soft" label="Show">
              <EyeIcon />
            </IconButton>
            <IconButton variant="soft" color="red" label="Delete">
              <TrashIcon />
            </IconButton>
            <IconButton variant="ghost" label="Undo">
              <UndoIcon />
            </IconButton>
            <IconButton variant="ghost" label="Undo, disabled" disabled>
              <UndoIcon />
            </IconButton>
            <IconButton variant="plain" label="Invite, disabled" disabled>
              <MailIcon />
            </IconButton>
          </Row>
        </Stack>
      ),
      height: 110,
    },
  ],
};
