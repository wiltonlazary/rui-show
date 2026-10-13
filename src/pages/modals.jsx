// Modals (rui-core/modals): a question, plain modals stacked, and a
// named modal.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Stack, Text, TextInput } from 'rui-core';
import { Modals, $modals } from 'rui-core/modals';

/** A button that asks a question, and the answer. */
function Confirm() {
  const modals = $modals();
  const answer = $signal($active(), 'not asked yet');
  const ask = () =>
    modals
      .ask({
        title: 'Archive this project?',
        text: 'Its boards turn read-only; you can restore it within 30 days.',
        labels: { yes: 'Archive', no: 'Keep it' },
        tone: 'orange',
      })
      .then(yes => $write(answer, yes ? 'archived' : 'kept'));
  return (
    <Row gap="md">
      <Button onPress={ask}>Archive project</Button>
      <Text size="sm" fg="quiet">{() => `answer: ${$read(answer)}`}</Text>
    </Row>
  );
}

/** A plain modal showing another over it. */
function Stacked() {
  const modals = $modals();
  const second = () => modals.show({ title: 'Their role', size: 'sm', children: <Button onPress={() => modals.clear()}>Done, close both</Button> });
  return (
    <Button
      variant="soft"
      onPress={() =>
        modals.show({
          title: 'Invite a teammate',
          children: (
            <Stack gap="sm">
              <TextInput label="Teammate email" placeholder="sam@studio.example" />
              <Button stretch onPress={second}>
                Choose their role
              </Button>
            </Stack>
          ),
        })
      }
    >
      Invite a teammate
    </Button>
  );
}

/** A named modal: a component its Modals host knows by name. @param {{ id: string, data: { body: string }, hide: () => void }} props */
function Greeting(props) {
  return (
    <Stack gap="sm">
      <Text size="sm">{props.data.body}</Text>
      <Button stretch onPress={props.hide}>
        Close
      </Button>
    </Stack>
  );
}

/** Opens the named modal. */
function ByName() {
  const modals = $modals();
  return (
    <Button variant="neutral" onPress={() => modals.showNamed('greeting', { body: 'This modal is a component registered by name on its Modals host.' }, { title: 'A named modal' })}>
      Open by name
    </Button>
  );
}

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'modals',
  group: 'layers',
  title: 'Modals',
  description: 'Modals shown from code (rui-core/modals): `Modals` keeps the shown ones of its part of the view and renders each as a Modal, stacked; `$modals()` shows a plain modal, asks a yes-or-no question (a promise of the answer) or shows a named modal, and updates and hides them.',
  props: [
    { name: 'named', type: 'Record<string, Component>', description: 'Named modals by name, given `{ id, data, hide }`.' },
    { name: 'defaults', type: 'Modal props', description: 'Every modal’s defaults.' },
    { name: 'labels', type: '{ yes, no }', default: "{ yes: 'Yes', no: 'No' }", description: 'The question’s buttons.' },
    { name: 'children', type: 'any', description: 'Inside, `$modals()` finds this host (the `ModalHost` context).' },
    { name: 'show(props)', type: 'Modal props & { id? }', description: 'A plain modal; returns its id.' },
    { name: 'ask(props)', type: '{ title, text, labels: { yes, no }, tone, yesButton, noButton, … } → Promise<boolean>', description: 'A question with its answers stacked as wide as the modal, yes (solid) over no (ghost) (`tone` colors yes; `yesButton` and `noButton` are their Button’s props): true on yes; false on no, Escape, the backdrop, the close button or a hide.' },
    { name: 'showNamed(name, data, props?)', type: '(string, any, Modal props?) → string', description: 'The host’s `named[name]`, given `{ id, data, hide }`; returns its id.' },
    { name: 'hide(id) / clear()', type: 'api methods', description: 'Hide one, or every one.' },
    { name: 'update(id, props)', type: '(string, Modal props) → void', description: 'Merge props into a shown modal.' },
    { name: 'modals()', type: '() => ModalRecord[]', description: 'The shown modals, oldest first (tracked): each `{ id, kind, props, modal, closing }`, its `kind` what opened it (`ask`, `plain` from show, or `named`) and `modal` the named modal’s name.' },
  ],
  demos: [
    {
      title: 'A question: yes or no',
      code: `
function Confirm() {
  const modals = $modals();
  const answer = $signal($active(), 'not asked yet');
  const ask = () =>
    modals
      .ask({
        title: 'Archive this project?',
        text: 'Its boards turn read-only; you can restore it within 30 days.',
        labels: { yes: 'Archive', no: 'Keep it' },
        tone: 'orange',
      })
      .then(yes => $write(answer, yes ? 'archived' : 'kept'));
  return (
    <Row gap="md">
      <Button onPress={ask}>Archive project</Button>
      <Text size="sm" fg="quiet">{() => \`answer: \${$read(answer)}\`}</Text>
    </Row>
  );
}

function Demo() {
  return <Modals><Confirm /></Modals>;
}`,
      view: () => (
        <Modals>
          <Confirm />
        </Modals>
      ),
      height: 280,
    },
    {
      title: 'Plain modals, stacked, and a named modal',
      code: `
function Stacked() {
  const modals = $modals();
  const second = () => modals.show({ title: 'Their role', size: 'sm', children: <Button onPress={() => modals.clear()}>Done, close both</Button> });
  return (
    <Button variant="soft" onPress={() => modals.show({
      title: 'Invite a teammate',
      children: (
        <Stack gap="sm">
          <TextInput label="Teammate email" placeholder="sam@studio.example" />
          <Button stretch onPress={second}>Choose their role</Button>
        </Stack>
      ),
    })}>Invite a teammate</Button>
  );
}

function Greeting({ data, hide }) {
  return (
    <Stack gap="sm">
      <Text size="sm">{data.body}</Text>
      <Button stretch onPress={hide}>Close</Button>
    </Stack>
  );
}

function ByName() {
  const modals = $modals();
  return <Button variant="neutral" onPress={() => modals.showNamed('greeting', { body: 'This modal is a component registered by name on its Modals host.' }, { title: 'A named modal' })}>Open by name</Button>;
}

function Demo() {
  return (
    <Modals named={{ greeting: Greeting }}>
      <Row gap="sm">
        <Stacked />
        <ByName />
      </Row>
    </Modals>
  );
}`,
      view: () => (
        <Modals named={{ greeting: Greeting }}>
          <Row gap="sm">
            <Stacked />
            <ByName />
          </Row>
        </Modals>
      ),
      height: 300,
    },
  ],
};
