// FileButton: the file dialog from any button; an image named once chosen,
// several documents, disabled.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { FileButton, Row, Stack, Text } from 'rui-core';
import { imageTypes } from 'rui-core/dropzone';

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'file-button',
  group: 'actions',
  title: 'FileButton',
  description: 'A Button that opens the platform’s file dialog: its children are the button’s content, `onFiles` hears the files picked as a list (one file is a list of one; a cancel calls nothing), and every other Button prop passes through. The dialog is the browser’s `<input type="file">`, where a DOM document is on the thread (ren-dom, or a canvas in the page); in a worker or on a server it is inert.',
  props: [
    { name: 'children', type: 'string | (() => string) | any', description: 'The button’s content.' },
    { name: 'onFiles', type: '(files: File[]) => void', description: 'The files picked, always a list; a cancel calls nothing.' },
    { name: 'accept', type: 'string | string[]', description: 'MIME types and extensions, as an input’s attribute (`image/png,.pdf`) or a list.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Several files at once.' },
    { name: 'capture', type: "boolean | 'user' | 'environment'", description: 'A camera instead of the files, where the platform has one.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'A press opens nothing.' },
    { name: 'document', type: 'Document', description: 'The document the dialog opens in: the pressed node’s by default, else the page’s.' },
    { name: 'others', type: 'Button props', description: '`variant`, `color`, `size`, `radius`, `start`, `end`, … pass to the Button; the press is its own.' },
  ],
  demos: [
    {
      title: 'A photo that names itself, and several documents',
      code: `
// imageTypes: the image MIME types (rui-core/dropzone)
function Demo() {
  const photo = $signal($active(), '');
  const papers = $signal($active(), 'none');
  return (
    <Stack gap="sm">
      <Row gap="sm">
        <FileButton accept={imageTypes} onFiles={files => $write(photo, files[0].name)}>
          {() => $read(photo) || 'Choose a photo'}
        </FileButton>
        <FileButton variant="neutral" multiple onFiles={files => $write(papers, files.map(f => f.name).join(', '))}>
          Add documents
        </FileButton>
        <FileButton variant="neutral" disabled onFiles={() => {}}>
          Disabled
        </FileButton>
      </Row>
      <Text size="sm" fg="quiet">{() => \`documents: \${$read(papers)}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const photo = $signal($active(), '');
        const papers = $signal($active(), 'none');
        return (
          <Stack gap="sm">
            <Row gap="sm">
              <FileButton accept={imageTypes} onFiles={(/** @type {File[]} */ files) => $write(photo, files[0].name)}>
                {() => $read(photo) || 'Choose a photo'}
              </FileButton>
              <FileButton variant="neutral" multiple onFiles={(/** @type {File[]} */ files) => $write(papers, files.map(f => f.name).join(', '))}>
                Add documents
              </FileButton>
              <FileButton variant="neutral" disabled onFiles={() => {}}>
                Disabled
              </FileButton>
            </Row>
            <Text size="sm" fg="quiet">
              {() => `documents: ${$read(papers)}`}
            </Text>
          </Stack>
        );
      },
      height: 100,
    },
  ],
};
