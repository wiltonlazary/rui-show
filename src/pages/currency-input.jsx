// CurrencyInput: an amount of money in a currency's display, as a locale writes it.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { CurrencyInput, Row, Stack, Text } from 'rui-core';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'currency-input',
  group: 'entry',
  title: 'CurrencyInput',
  description:
    'A NumberInput for an amount of money: the currency shown as its symbol, narrow symbol, code, name or not at all, on the side and with the spacing the locale writes money with (R$ 12,50; 12,50 €; ¥1,250), and the currency’s decimals. The value is a number, or `\'\'` when empty.',
  props: [
    { name: 'currency', type: 'string', description: 'An ISO 4217 code: `BRL`, `USD`, `EUR`, `JPY`, …' },
    { name: 'display', type: "'symbol' | 'narrowSymbol' | 'code' | 'name' | 'none'", default: "'symbol'", description: 'How the currency shows: R$, $, BRL, reais brasileiros, or nothing. A name follows the amount (1 real, 2 reais).' },
    { name: 'locale', type: 'string', default: 'the platform’s', description: 'A BCP 47 tag (`pt-BR`): the currency’s side and spacing, and the group and decimal marks.' },
    { name: 'decimals', type: 'number', default: 'the currency’s', description: 'The most decimal digits: 2 for BRL, USD and EUR, 0 for JPY.' },
    { name: 'fixedDecimals', type: 'boolean', default: 'true', description: 'The decimals always written out (R$ 12,50); false: as the number is (R$ 12,5).' },
    { name: 'NumberInput props', type: 'value, onChange, min, max, step, groupMark, …', description: 'As NumberInput; the currency sets `prefix` and `suffix`.' },
    { name: 'currencyAffixes(currency, locale, display, amount?)', type: '{ prefix, suffix }', description: 'The text the locale writes before and after an amount (`amount`, 2 by default, picks a name’s plural), its spaces included.' },
    { name: 'currencyDecimals(currency)', type: 'number', description: 'How many decimals the currency takes.' },
  ],
  demos: [
    {
      title: 'One currency, every display',
      code: `
function Demo() {
  return (
    <Stack gap="sm">
      <Row fill align="start">
        <CurrencyInput label="Symbol" currency="BRL" locale="pt-BR" groupMark defaultValue={1249.9} />
        <CurrencyInput label="Code" currency="BRL" locale="pt-BR" display="code" groupMark defaultValue={1249.9} />
        <CurrencyInput label="None" currency="BRL" locale="pt-BR" display="none" groupMark defaultValue={1249.9} />
      </Row>
      <Row fill align="start">
        <CurrencyInput label="Narrow symbol" currency="USD" locale="pt-BR" display="narrowSymbol" defaultValue={12.5} />
        <CurrencyInput label="Name" currency="BRL" locale="pt-BR" display="name" defaultValue={2} />
      </Row>
    </Stack>
  );
}`,
      view: () => (
        <Stack gap="sm">
          <Row fill align="start">
            <CurrencyInput label="Symbol" currency="BRL" locale="pt-BR" groupMark defaultValue={1249.9} />
            <CurrencyInput label="Code" currency="BRL" locale="pt-BR" display="code" groupMark defaultValue={1249.9} />
            <CurrencyInput label="None" currency="BRL" locale="pt-BR" display="none" groupMark defaultValue={1249.9} />
          </Row>
          <Row fill align="start">
            <CurrencyInput label="Narrow symbol" currency="USD" locale="pt-BR" display="narrowSymbol" defaultValue={12.5} />
            <CurrencyInput label="Name" currency="BRL" locale="pt-BR" display="name" defaultValue={2} />
          </Row>
        </Stack>
      ),
      height: 170,
    },
    {
      title: 'Locales and decimals, held by a signal',
      code: `
function Demo() {
  const price = $signal($active(), 1250);
  return (
    <Stack gap="sm">
      <Row fill align="start">
        <CurrencyInput label="en-US" currency="USD" locale="en-US" groupMark value={price} onChange={v => $write(price, v)} />
        <CurrencyInput label="de-DE" currency="EUR" locale="de-DE" groupMark value={price} onChange={v => $write(price, v)} />
        <CurrencyInput label="ja-JP, no decimals" currency="JPY" locale="ja-JP" groupMark value={price} onChange={v => $write(price, v)} />
      </Row>
      <Text size="sm" fg="quiet">{() => \`value: \${JSON.stringify($read(price))}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const price = $signal($active(), /** @type {number | ''} */ (1250));
        const set = (/** @type {number | ''} */ v) => $write(price, v);
        return (
          <Stack gap="sm">
            <Row fill align="start">
              <CurrencyInput label="en-US" currency="USD" locale="en-US" groupMark value={price} onChange={set} />
              <CurrencyInput label="de-DE" currency="EUR" locale="de-DE" groupMark value={price} onChange={set} />
              <CurrencyInput label="ja-JP, no decimals" currency="JPY" locale="ja-JP" groupMark value={price} onChange={set} />
            </Row>
            <Text size="sm" fg="quiet">
              {() => `value: ${JSON.stringify($read(price))}`}
            </Text>
          </Stack>
        );
      },
      height: 110,
    },
  ],
};
