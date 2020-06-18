/* eslint-disable no-param-reassign */
import { Editor, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { isBlockActive } from './blocks';

/**
 * Remove the link formatting from a text node.
 */
export const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === 'link' });
};

export const insertLink = (editor: Editor, title: string) => {
  const { selection } = editor;

  if (!selection) return;

  // Remove an existing link.
  if (isBlockActive(editor, 'link')) {
    unwrapLink(editor);
    return;
  }

  const url = window.prompt(title);
  if (!url) return;

  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export const withLinks = (editor: ReactEditor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  return editor;
};
