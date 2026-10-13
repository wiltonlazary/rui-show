// TagBox: a field holding tags and an entry, to build one's own
// multi-value input.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { TagBox, Tag, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'tag-box',
  group: 'choices',
  title: 'TagBox',
  description: 'A field that grows with the tags it holds (its Tag children) and builds its own text entry after them: the base of MultiSelect and TagInput, for inputs of your own. The entry is named by the label.',
  props: [
    { name: 'label / description / error', type: 'string', description: 'The field’s texts; an error message gives the invalid look.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'The invalid look without a message.' },
    { name: 'asterisk', type: 'boolean | string | node', description: 'The mark after the label: `true` a red `*`; none by default.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The field’s least height and its text size.' },
    { name: 'radius / variant', type: 'as Select', description: 'The field’s look.' },
    { name: 'start / end', type: 'any', description: 'Content at the field’s sides.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Dimmed (opacity .45); no entry.' },
    { name: 'children', type: 'Tag[]', description: 'The tags, before the entry.' },
    { name: 'search / defaultSearch', type: 'string | (() => string)', default: "''", description: 'The text typed in the entry: held by `search` (with `onSearchChange`), or at first.' },
    { name: 'onSearchChange', type: '(search: string) => void', description: 'Called with the entry’s new text.' },
    { name: 'placeholder', type: 'string', description: 'Shown in the empty entry, which is at least twice the control’s height wide and wraps to a new line when the tags leave less room.' },
    { name: 'onKey', type: '(event) => void', description: 'Keys in the entry (Enter to add, Backspace to remove).' },
    { name: 'onPointerDown', type: '(event) => void', description: 'A press on the field (to open a panel).' },
  ],
  demos: [
    {
      title: 'Emails, added with Enter',
      code: `
function Demo() {
  const emails = $signal($active(), ['ann@example.com']);
  const typed = $signal($active(), '');
  const add = () => {
    const text = $read(typed).trim();
    if (text !== '' && !$read(emails).includes(text)) $write(emails, [...$read(emails), text]);
    $write(typed, '');
  };
  return (
    <Stack gap="xs" w={420}>
      <TagBox
        label="Send to"
        description="Enter adds an address, Backspace removes the last"
        placeholder="Type an address"
        search={typed}
        onSearchChange={v => $write(typed, v)}
        onKey={e => {
          if (e.key === 'Enter') add();
          else if (e.key === 'Backspace' && $read(typed) === '') $write(emails, $read(emails).slice(0, -1));
        }}
      >
        {() => $read(emails).map(email => <Tag removable onRemove={() => $write(emails, $read(emails).filter(e => e !== email))}>{email}</Tag>)}
      </TagBox>
      <Text size="sm" fg="quiet">{() => \`\${$read(emails).length} recipients\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const emails = $signal($active(), /** @type {string[]} */ (['ann@example.com']));
        const typed = $signal($active(), '');
        const add = () => {
          const text = $read(typed).trim();
          if (text !== '' && !$read(emails).includes(text)) $write(emails, [...$read(emails), text]);
          $write(typed, '');
        };
        return (
          <Stack gap="xs" w={420}>
            <TagBox
              label="Send to"
              description="Enter adds an address, Backspace removes the last"
              placeholder="Type an address"
              search={typed}
              onSearchChange={(/** @type {string} */ v) => $write(typed, v)}
              onKey={(/** @type {any} */ e) => {
                if (e.key === 'Enter') add();
                else if (e.key === 'Backspace' && $read(typed) === '') $write(emails, $read(emails).slice(0, -1));
              }}
            >
              {() =>
                $read(emails).map(email => (
                  <Tag removable onRemove={() => $write(emails, $read(emails).filter(e => e !== email))}>
                    {email}
                  </Tag>
                ))
              }
            </TagBox>
            <Text size="sm" fg="quiet">
              {() => `${$read(emails).length} recipients`}
            </Text>
          </Stack>
        );
      },
      height: 140,
    },
    {
      title: 'Sizes and states',
      code: `
function Demo() {
  return (
    <Stack gap="sm" w={420}>
      <TagBox size="xs" label="Extra small" placeholder="More">
        <Tag size="xs">One</Tag>
      </TagBox>
      <TagBox variant="soft" label="Soft, with an error" error="Add one more" placeholder="More">
        <Tag>Two</Tag>
      </TagBox>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm" w={420}>
          <TagBox size="xs" label="Extra small" placeholder="More">
            <Tag size="xs">One</Tag>
          </TagBox>
          <TagBox variant="soft" label="Soft, with an error" error="Add one more" placeholder="More">
            <Tag>Two</Tag>
          </TagBox>
        </Stack>
      ),
      height: 160,
    },
  ],
};
