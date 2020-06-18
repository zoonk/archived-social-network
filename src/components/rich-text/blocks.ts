import { Editor, Transforms } from 'slate';

export const editorHotkeys = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

const listTypes = ['ol', 'ul'];
const multiline = ['code', 'blockquote'];
const nestedBlocks = [...listTypes, ...multiline];

export const isBlockActive = (editor: Editor, format: string): boolean => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });

  return Boolean(match);
};

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = listTypes.includes(format);
  const isBlock = nestedBlocks.includes(format);
  const isMultiline = multiline.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => nestedBlocks.includes(n.type as string),
    split: true,
  });

  let type: string = isActive || isMultiline ? 'paragraph' : format;
  if (isList) type = 'li';
  // Remove the paragraph formatting for code blocks. Use unformatted new lines instead.
  if (format === 'code') type = 'new-line';

  Transforms.setNodes(editor, { type });

  if (!isActive && isBlock) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
