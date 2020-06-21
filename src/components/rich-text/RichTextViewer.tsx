import { useCallback, useMemo } from 'react';
import { Node } from 'slate';
import { Editable, Slate } from 'slate-react';
import Element from './Element';
import Leaf from './Leaf';
import { withEditor } from './utils';

interface RichTextViewerProps {
  content: Node[];
}

const RichTextViewer = ({ content }: RichTextViewerProps) => {
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
      />
    </Slate>
  );
};

export default RichTextViewer;
