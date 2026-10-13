// Prose: a block of content in the theme's text styles.

import { Prose, Heading, Text, List, Code, Quote } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'prose',
  group: 'text',
  title: 'Prose',
  description: 'A column of content in the theme’s text styles: its children `md` apart, at the body font size and line height, in the scheme’s text color. Put rui-core’s Heading, Text, List, Code and Quote in it; it styles no DOM tags.',
  props: [
    { name: 'children', type: 'any', description: 'The content, in a column the `md` spacing apart.' },
  ],
  demos: [
    {
      title: 'A short article',
      code: `
function Demo() {
  return (
    <Prose>
      <Heading level={3}>Portable typography</Heading>
      <Text>The same Heading, Text and List on the DOM, on Skia and in three.js.</Text>
      <List>
        <List.Item>Theme font sizes and line heights</List.Item>
        <List.Item>Colors from the theme only</List.Item>
      </List>
      <Code block>{'npm install rui-core'}</Code>
      <Quote source="the README">One component set, every renderer.</Quote>
    </Prose>
  );
}`,
      view: () => (
        <Prose>
          <Heading level={3}>Portable typography</Heading>
          <Text>The same Heading, Text and List on the DOM, on Skia and in three.js.</Text>
          <List>
            <List.Item>Theme font sizes and line heights</List.Item>
            <List.Item>Colors from the theme only</List.Item>
          </List>
          <Code block>{'npm install rui-core'}</Code>
          <Quote source="the README">One component set, every renderer.</Quote>
        </Prose>
      ),
      height: 360,
    },
  ],
};
