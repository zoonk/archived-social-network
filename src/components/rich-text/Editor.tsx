import { useCallback } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, useSlate } from 'slate-react';
import Element from './Element';
import Leaf from './Leaf';
import { editorHotkeys } from './blocks';
import { insertLink } from './links';
import { toggleMark } from './marks';
import useTranslation from '../useTranslation';

interface EditorProps {
  placeholder?: string;
  fixed?: boolean;
}

const Editor = ({ placeholder, fixed }: EditorProps) => {
  const editor = useSlate();
  const translate = useTranslation();
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    Object.entries(editorHotkeys).forEach(([key, value]) => {
      if (isHotkey(key, event as any)) {
        event.preventDefault();
        toggleMark(editor, value as string);
      }
    });

    if (isHotkey('mod+k', event as any)) {
      event.preventDefault();
      insertLink(editor, translate('link_add'));
    }
  };

  return (
    <Editable
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder={placeholder || translate('post_share')}
      spellCheck
      onKeyDown={handleKeyDown}
      style={{ marginBottom: fixed ? '68px' : 0 }}
    />
  );
};

export default Editor;
