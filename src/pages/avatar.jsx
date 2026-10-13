// Avatar: a picture, initials, text or a silhouette; Avatar.Group.

import { Avatar, Row, ShareIcon, Stack, Surface, Text } from 'rui-core';
import { portraits } from '../pictures.js';

/** @param {{ avatar: any, who: string, fill: string, says: string }} props */
const Comment = props => (
  <Row gap="sm" align="start" wrap={false}>
    {props.avatar}
    <Stack gap={2}>
      <Row gap="xs" align="center">
        <Text size="sm">{props.who}</Text>
        <Text size="xs" fg="quiet">
          {props.fill}
        </Text>
      </Row>
      <Text size="sm" fg="quiet">
        {props.says}
      </Text>
    </Stack>
  </Row>
);
/** @type {[string, string[]][]} */
const ROSTER = [
  ['Mon', ['Ana Luisa Prado', 'Kenji']],
  ['Tue', ['Oskar Brandt', 'Ana Luisa Prado']],
  ['Wed', ['Kenji', 'Wren Adeyemi']],
  ['Thu', ['Oskar Brandt', 'Wren Adeyemi']],
];
const EDITORS = ['Hana Sato', 'Oskar Brandt', 'Wren Adeyemi', 'Dara Quinn'];
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const VARIANTS = ['solid', 'soft', 'outline', 'neutral', 'plain'];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'avatar',
  group: 'data',
  title: 'Avatar',
  description: 'A person’s picture, else the initials of their `name` (the first letters of its first and last words, upper case; colored by an FNV-1a hash of the name with `color="auto"`), else its children, else a drawn silhouette; `Avatar.Group` overlaps several, each set apart from the one before by a small shadow. The picture is the portable Image, so it draws on the canvases too.',
  props: [
    { name: 'source', type: 'string', description: 'The picture; it fills the avatar. Wins over `name` and children.' },
    { name: 'name', type: 'string', description: 'A name: the avatar shows the first letters of its first and last words (‘Ana Luisa Prado’ → AP; one word, one letter), upper case.' },
    { name: 'color', type: "string | 'auto'", default: 'the accent', description: 'A theme color, `name.shade` or hex; `auto` picks one from the name by its FNV-1a hash (the same name, the same color).' },
    { name: 'colors', type: 'string[]', default: 'amber, green, cyan, indigo, magenta, orange, teal, violet', description: 'The hues `color="auto"` picks from, each about 135° round the wheel from the one before, so neighbors differ.' },
    { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'ghost' | 'neutral' | 'plain' | 'inverse'", default: "'soft'", description: 'How the color is applied.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: "'md'", description: 'Width and height: 20, 28, 40, 56 or 80 pixels, or a number.' },
    { name: 'radius', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: 'round', description: 'Corner radius; round by default.' },
    { name: 'label', type: 'string', description: 'The avatar’s accessible label.' },
    { name: 'children', type: 'any', description: 'Shown when there is no `source` and no `name`: text or other content.' },
    { name: 'Avatar.Group overlap', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", default: '`ratios.mark` of the side (12 px at md)', description: 'How far each avatar lies over the one before (a spacing step or pixels); each casts the theme’s sm shadow on it, no ring.' },
  ],
  demos: [
    {
      title: 'What fills an avatar, down a comment thread',
      code: `
// portraits: small PNG data: URIs (src/pictures.js)
const Comment = props => (
  <Row gap="sm" align="start" wrap={false}>
    {props.avatar}
    <Stack gap={2}>
      <Row gap="xs" align="center">
        <Text size="sm">{props.who}</Text>
        <Text size="xs" fg="quiet">{props.fill}</Text>
      </Row>
      <Text size="sm" fg="quiet">{props.says}</Text>
    </Stack>
  </Row>
);

function Demo() {
  return (
    <Stack gap="sm">
      <Comment who="Hana Sato" fill="source" says="Moved the catalog review to Thursday."
        avatar={<Avatar source={portraits[0]} label="Hana Sato" />} />
      <Comment who="Oskar Brandt" fill="name, no picture" says="Thursday works for the print run."
        avatar={<Avatar name="Oskar Brandt" color="auto" />} />
      <Comment who="Dara Quinn" fill="empty source, so the name" says="Can we see the cover first?"
        avatar={<Avatar source="" name="Dara Quinn" color="auto" />} />
      <Comment who="Shared link" fill="children" says="catalog-cover-v3.pdf"
        avatar={<Avatar variant="neutral" label="Shared link"><ShareIcon size={16} /></Avatar>} />
      <Comment who="A guest" fill="nothing: the silhouette" says="Looks good from here."
        avatar={<Avatar label="A guest" />} />
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Comment who="Hana Sato" fill="source" says="Moved the catalog review to Thursday." avatar={<Avatar source={portraits[0]} label="Hana Sato" />} />
          <Comment who="Oskar Brandt" fill="name, no picture" says="Thursday works for the print run." avatar={<Avatar name="Oskar Brandt" color="auto" />} />
          <Comment who="Dara Quinn" fill="empty source, so the name" says="Can we see the cover first?" avatar={<Avatar source="" name="Dara Quinn" color="auto" />} />
          <Comment
            who="Shared link"
            fill="children"
            says="catalog-cover-v3.pdf"
            avatar={
              <Avatar variant="neutral" label="Shared link">
                <ShareIcon size={16} />
              </Avatar>
            }
          />
          <Comment who="A guest" fill="nothing: the silhouette" says="Looks good from here." avatar={<Avatar label="A guest" />} />
        </Stack>
      ),
      height: 290,
    },
    {
      title: 'A shift roster: initials of the first and last words, one color per name',
      code: `
const ROSTER = [
  ['Mon', ['Ana Luisa Prado', 'Kenji']],
  ['Tue', ['Oskar Brandt', 'Ana Luisa Prado']],
  ['Wed', ['Kenji', 'Wren Adeyemi']],
  ['Thu', ['Oskar Brandt', 'Wren Adeyemi']],
];

function Demo() {
  return (
    <Stack gap="sm">
      <Row gap="lg">
        {ROSTER.map(([day, people]) => (
          <Stack gap={6} align="center">
            <Text size="xs" fg="quiet">{day}</Text>
            {people.map(name => <Avatar name={name} label={name} color="auto" size="sm" />)}
          </Stack>
        ))}
      </Row>
      <Text size="sm" fg="quiet">Ana Luisa Prado is AP, Kenji is K; each name keeps its color all week.</Text>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row gap="lg">
            {ROSTER.map(([day, people]) => (
              <Stack gap={6} align="center">
                <Text size="xs" fg="quiet">
                  {day}
                </Text>
                {people.map(name => (
                  <Avatar name={name} label={name} color="auto" size="sm" />
                ))}
              </Stack>
            ))}
          </Row>
          <Text size="sm" fg="quiet">
            Ana Luisa Prado is AP, Kenji is K; each name keeps its color all week.
          </Text>
        </Stack>
      ),
      height: 130,
    },
    {
      title: 'Sizes, radius and variants',
      code: `
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const VARIANTS = ['solid', 'soft', 'outline', 'neutral', 'plain'];

function Demo() {
  return (
    <Stack gap="md">
      <Row align="center">
        {SIZES.map(size => <Avatar size={size} source={portraits[1]} />)}
        <Avatar size={64} radius="md" source={portraits[2]} />
        <Avatar size="lg" radius="sm" color="purple">SQ</Avatar>
      </Row>
      <Row>
        {VARIANTS.map(variant => <Avatar variant={variant} color="indigo" />)}
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md">
          <Row align="center">
            {SIZES.map(size => (
              <Avatar size={size} source={portraits[1]} />
            ))}
            <Avatar size={64} radius="md" source={portraits[2]} />
            <Avatar size="lg" radius="sm" color="purple">
              SQ
            </Avatar>
          </Row>
          <Row>
            {VARIANTS.map(variant => (
              <Avatar variant={variant} color="indigo" />
            ))}
          </Row>
        </Stack>
      ),
      height: 160,
    },
    {
      title: 'Avatar.Group in a card footer, and a wider overlap',
      code: `
// portraits: small PNG data: URIs (src/pictures.js)
const EDITORS = ['Hana Sato', 'Oskar Brandt', 'Wren Adeyemi', 'Dara Quinn'];

function Demo() {
  return (
    <Stack gap="md" align="start">
      <Surface bordered radius="md" p="sm" w={300}>
        <Stack gap="xs">
          <Text size="sm">Spring catalog</Text>
          <Text size="xs" fg="quiet">Edited twelve minutes ago</Text>
          <Row justify="between" align="center">
            <Avatar.Group>
              {portraits.map((src, i) => <Avatar source={src} label={EDITORS[i]} size="sm" />)}
              <Avatar name={EDITORS[3]} label={EDITORS[3]} color="auto" size="sm" />
            </Avatar.Group>
            <Text size="xs" fg="quiet">{\`\${EDITORS.length} editors\`}</Text>
          </Row>
        </Stack>
      </Surface>
      <Row gap="sm" align="center">
        <Avatar.Group overlap="md">
          {EDITORS.slice(1).map(name => <Avatar name={name} label={name} color="auto" variant="solid" size="lg" />)}
        </Avatar.Group>
        <Text size="sm" fg="quiet">overlap="md", each set apart by a shadow</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="md" align="start">
          <Surface bordered radius="md" p="sm" w={300}>
            <Stack gap="xs">
              <Text size="sm">Spring catalog</Text>
              <Text size="xs" fg="quiet">
                Edited twelve minutes ago
              </Text>
              <Row justify="between" align="center">
                <Avatar.Group>
                  {portraits.map((src, i) => (
                    <Avatar source={src} label={EDITORS[i]} size="sm" />
                  ))}
                  <Avatar name={EDITORS[3]} label={EDITORS[3]} color="auto" size="sm" />
                </Avatar.Group>
                <Text size="xs" fg="quiet">
                  {`${EDITORS.length} editors`}
                </Text>
              </Row>
            </Stack>
          </Surface>
          <Row gap="sm" align="center">
            <Avatar.Group overlap="md">
              {EDITORS.slice(1).map(name => (
                <Avatar name={name} label={name} color="auto" variant="solid" size="lg" />
              ))}
            </Avatar.Group>
            <Text size="sm" fg="quiet">
              overlap="md", each set apart by a shadow
            </Text>
          </Row>
        </Stack>
      ),
      height: 210,
    },
  ],
};
