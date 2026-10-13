// DataList: label and value pairs, side by side or stacked.

import { Badge, DataList, NumberText } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'data-list',
  group: 'data',
  title: 'DataList',
  description: 'Terms and their details: side by side on a one-to-two grid, or the term above its detail, with optional lines between the pairs. Details may be any content; the list means a `list` of `term` and `definition` pairs.',
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Side by side (a grid of one part label to two parts value), or the label above its value.' },
    { name: 'divided', type: 'boolean', default: 'false', description: 'A hairline (a Divider’s xs thickness, the page’s edge color) between pairs only, half the gap from each; the pairs’ sides inset by `control.panelPad` so the line runs past their text.' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'sm'", description: 'The font size and the gap between pairs (that spacing step).' },
    { name: 'DataList.Item', type: 'component', description: 'One pair.' },
    { name: 'DataList.Term', type: 'component', description: 'The term (what the detail describes): quiet and bold; text wraps. It means a `term`.' },
    { name: 'DataList.Detail', type: 'component', description: 'The term’s value: text wraps; other content passes as it is. It means a `definition`.' },
  ],
  demos: [
    {
      title: 'A package at a glance',
      code: `
function Demo() {
  return (
    <DataList>
      <DataList.Item>
        <DataList.Term>Name</DataList.Term>
        <DataList.Detail>rui-core</DataList.Detail>
      </DataList.Item>
      <DataList.Item>
        <DataList.Term>Status</DataList.Term>
        <DataList.Detail><Badge color="teal" variant="soft">Active</Badge></DataList.Detail>
      </DataList.Item>
      <DataList.Item>
        <DataList.Term>Renderers</DataList.Term>
        <DataList.Detail>DOM, Skia and three.js, from one view</DataList.Detail>
      </DataList.Item>
    </DataList>
  );
}`,
      view: () => (
        <DataList>
          <DataList.Item>
            <DataList.Term>Name</DataList.Term>
            <DataList.Detail>rui-core</DataList.Detail>
          </DataList.Item>
          <DataList.Item>
            <DataList.Term>Status</DataList.Term>
            <DataList.Detail>
              <Badge color="teal" variant="soft">
                Active
              </Badge>
            </DataList.Detail>
          </DataList.Item>
          <DataList.Item>
            <DataList.Term>Renderers</DataList.Term>
            <DataList.Detail>DOM, Skia and three.js, from one view</DataList.Detail>
          </DataList.Item>
        </DataList>
      ),
      height: 100,
    },
    {
      title: 'An order summary in euros',
      code: `
function Demo() {
  return (
    <DataList divided size="md">
      <DataList.Item>
        <DataList.Term>Subtotal</DataList.Term>
        <DataList.Detail><NumberText value={1249.9} locale="fr-FR" groupMark decimals={2} fixedDecimals suffix=" €" /></DataList.Detail>
      </DataList.Item>
      <DataList.Item>
        <DataList.Term>Shipping</DataList.Term>
        <DataList.Detail><NumberText value={12.5} locale="fr-FR" groupMark decimals={2} fixedDecimals suffix=" €" /></DataList.Detail>
      </DataList.Item>
      <DataList.Item>
        <DataList.Term>Discount</DataList.Term>
        <DataList.Detail><NumberText value={-50} locale="fr-FR" groupMark decimals={2} fixedDecimals suffix=" €" /></DataList.Detail>
      </DataList.Item>
      <DataList.Item>
        <DataList.Term>Total</DataList.Term>
        <DataList.Detail><NumberText value={1212.4} locale="fr-FR" groupMark decimals={2} fixedDecimals suffix=" €" fontWeight="bold" /></DataList.Detail>
      </DataList.Item>
    </DataList>
  );
}`,
      view: () => (
        <DataList divided size="md">
          <DataList.Item>
            <DataList.Term>Subtotal</DataList.Term>
            <DataList.Detail>
              <NumberText value={1249.9} locale="fr-FR" groupMark decimals={2} fixedDecimals suffix=" €" />
            </DataList.Detail>
          </DataList.Item>
          <DataList.Item>
            <DataList.Term>Shipping</DataList.Term>
            <DataList.Detail>
              <NumberText value={12.5} locale="fr-FR" groupMark decimals={2} fixedDecimals suffix=" €" />
            </DataList.Detail>
          </DataList.Item>
          <DataList.Item>
            <DataList.Term>Discount</DataList.Term>
            <DataList.Detail>
              <NumberText value={-50} locale="fr-FR" groupMark decimals={2} fixedDecimals suffix=" €" />
            </DataList.Detail>
          </DataList.Item>
          <DataList.Item>
            <DataList.Term>Total</DataList.Term>
            <DataList.Detail>
              <NumberText value={1212.4} locale="fr-FR" groupMark decimals={2} fixedDecimals suffix=" €" fontWeight="bold" />
            </DataList.Detail>
          </DataList.Item>
        </DataList>
      ),
      height: 210,
    },
    {
      title: 'Vertical',
      code: `
function Demo() {
  return (
    <DataList orientation="vertical" size="xs">
      <DataList.Item>
        <DataList.Term>Created</DataList.Term>
        <DataList.Detail>26 September 2026</DataList.Detail>
      </DataList.Item>
      <DataList.Item>
        <DataList.Term>Owner</DataList.Term>
        <DataList.Detail>The rui workspace</DataList.Detail>
      </DataList.Item>
    </DataList>
  );
}`,
      view: () => (
        <DataList orientation="vertical" size="xs">
          <DataList.Item>
            <DataList.Term>Created</DataList.Term>
            <DataList.Detail>26 September 2026</DataList.Detail>
          </DataList.Item>
          <DataList.Item>
            <DataList.Term>Owner</DataList.Term>
            <DataList.Detail>The rui workspace</DataList.Detail>
          </DataList.Item>
        </DataList>
      ),
      height: 100,
    },
  ],
};
