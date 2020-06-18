/* eslint-disable no-param-reassign */
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export const insertImage = (editor: Editor, src: string) => {
  const image = { type: 'image', src, children: [{ text: '' }] };
  const text = { type: 'paragraph', children: [{ text: '' }] };
  Transforms.insertNodes(editor, [image, text]);
};

export const withImages = (editor: ReactEditor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  return editor;
};
