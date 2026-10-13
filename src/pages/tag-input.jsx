// TagInput: free tags typed and split, suggestions, a maximum, and
// repeats reported.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { TagInput, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'tag-input',
  group: 'choices',
  title: 'TagInput',
  description: 'Free tags as Tags: Enter (or a separator, a comma or a semicolon by default) ends a tag, a suggestion from `data` can be chosen, Backspace in the empty entry removes the last one. Duplicates are refused unless allowed.',
  props: [
    { name: 'value', type: 'string[] | (() => string[])', description: 'Controlled: the tags (with `onChange`).' },
    { name: 'defaultValue', type: 'string[]', default: '[]', description: 'Uncontrolled: the tags at first.' },
    { name: 'onChange', type: '(tags: string[]) => void', description: 'Called with the new tags.' },
    { name: 'data', type: 'string[] | { label, options }[]', default: '[]', description: 'Suggestions shown as you type.' },
    { name: 'separators', type: 'string[]', default: "[',', ';']", description: 'Typing one of these ends a tag.' },
    { name: 'max', type: 'number', description: 'At most this many tags.' },
    { name: 'duplicates', type: 'boolean', default: 'false', description: 'The same tag may be added twice.' },
    { name: 'onRepeat', type: '(tag: string) => void', description: 'Called with a tag refused as already there.' },
    { name: 'onPick', type: '(value: string, option) => void', description: 'Called when a suggestion is chosen, with its data item.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'A clear button while there are tags.' },
    { name: 'search / defaultSearch / onSearchChange', type: 'string', description: 'The text being typed: controlled, or uncontrolled.' },
    { name: 'placeholder', type: 'string', description: 'Shown while there are no tags.' },
    { name: 'match', type: '(option: Option, search: string) => boolean', description: 'Which suggestions show; by default those whose label holds the text, ignoring case.' },
    { name: 'panelHeight / renderOption', type: 'as Autocomplete', description: 'The suggestions’ panel (`sizes.box.panel`, 280) and each suggestion’s content.' },
    { name: 'label / description / error', type: 'string', description: 'The field’s texts; an error message gives the invalid look.' },
    { name: 'invalid / required / asterisk', type: 'boolean / boolean / boolean | string | node', description: 'The invalid look without a message; `aria-required` only; the mark after the label (none by default).' },
    { name: 'size / radius / variant / start / end', type: 'as Select', description: 'The field’s look.' },
    { name: 'popover / open / defaultOpen / onOpenChange', type: 'as Select', description: 'The panel’s placement and state.' },
    { name: 'disabled / readOnly', type: 'boolean', default: 'false', description: 'Locked: no typing, no remove buttons, and neither a press nor the keys open it or pick.' },
  ],
  demos: [
    {
      title: 'Tagging a recipe',
      code: `
function Demo() {
  return <TagInput w={360} label="Recipe tags" placeholder="Type a tag, then Enter" defaultValue={['vegan', 'quick']} clearable />;
}`,
      view: () => <TagInput w={360} label="Recipe tags" placeholder="Type a tag, then Enter" defaultValue={['vegan', 'quick']} clearable />,
      height: 100,
    },
    {
      title: 'Suggestions, separators, a maximum and repeats',
      code: `
function Demo() {
  const tags = $signal($active(), ['Basil']);
  const refused = $signal($active(), '');
  return (
    <Stack gap="xs">
      <TagInput
        w={360}
        label="At most four; comma or space ends a tag"
        placeholder="Pick or type"
        data={['Basil', 'Cumin', 'Paprika', 'Thyme']}
        separators={[',', ' ']}
        max={4}
        value={tags}
        onChange={v => $write(tags, v)}
        onRepeat={t => $write(refused, t)}
      />
      <Text size="sm" fg="quiet">{() => \`tags: \${$read(tags).join(', ')}\${$read(refused) ? \` (refused \${$read(refused)})\` : ''}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const tags = $signal($active(), /** @type {string[]} */ (['Basil']));
        const refused = $signal($active(), '');
        return (
          <Stack gap="xs">
            <TagInput
              w={360}
              label="At most four; comma or space ends a tag"
              placeholder="Pick or type"
              data={['Basil', 'Cumin', 'Paprika', 'Thyme']}
              separators={[',', ' ']}
              max={4}
              value={tags}
              onChange={(/** @type {string[]} */ v) => $write(tags, v)}
              onRepeat={(/** @type {string} */ t) => $write(refused, t)}
            />
            <Text size="sm" fg="quiet">
              {() => `tags: ${$read(tags).join(', ')}${$read(refused) ? ` (refused ${$read(refused)})` : ''}`}
            </Text>
          </Stack>
        );
      },
      height: 260,
    },
  ],
};
