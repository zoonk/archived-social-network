/* eslint-disable no-param-reassign */
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export const withPDF = (editor: ReactEditor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return element.type === 'pdf' ? true : isVoid(element);
  };
  return editor;
};

export const removePDF = (editor: Editor) => {
  Transforms.removeNodes(editor, { match: (n) => n.type === 'pdf' });
};

export const insertPDF = (editor: Editor, url: string) => {
  const image = { type: 'pdf', url, children: [{ text: '' }] };
  const text = { type: 'paragraph', children: [{ text: '' }] };
  Transforms.insertNodes(editor, [image, text]);
};
