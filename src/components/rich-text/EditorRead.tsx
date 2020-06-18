import { useCallback, useMemo } from 'react';
import { Node } from 'slate';
import { Editable, Slate } from 'slate-react';
import Element from './Element';
import Leaf from './Leaf';
import { editorStyles, withEditor } from './utils';

interface EditorReadProps {
  content: Node[];
}

const EditorRead = ({ content }: EditorReadProps) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withEditor(), []);

  return (
    <Slate editor={editor} value={content} onChange={() => null}>
      <Editable
        readOnly
        renderElement={renderElement}
        autoFocus={false}
        renderLeaf={renderLeaf}
        style={editorStyles}
      />
    </Slate>
  );
};

export default EditorRead;
