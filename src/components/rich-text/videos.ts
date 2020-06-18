/* eslint-disable no-param-reassign */
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

export const withVideos = (editor: ReactEditor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) => {
    return element.type === 'video' ? true : isVoid(element);
  };
  return editor;
};

export const removeVideo = (editor: Editor) => {
  Transforms.removeNodes(editor, { match: (n) => n.type === 'video' });
};

export const insertVideo = (editor: Editor, url: string) => {
  const video = { type: 'video', url, children: [{ text: '' }] };
  const text = { type: 'paragraph', children: [{ text: '' }] };
  Transforms.insertNodes(editor, [video, text]);
};
