import { useEffect } from 'react';
import Quill from 'quill';
import Delta from 'quill-delta';
import { initQuill } from './helpers';
import Toolbar from './Toolbar';

interface EditorProps {
  initialData?: Delta | null;
  editorRef: React.MutableRefObject<Quill | undefined>;
  valid: boolean;
  saving: boolean;
  placeholder: string;
  onSave: () => void;
}

const EditorFixed = ({
  initialData,
  editorRef,
  placeholder,
  saving,
  valid,
  onSave,
}: EditorProps) => {
  useEffect(() => {
    if (!editorRef.current) {
      initQuill(editorRef, placeholder, initialData);
    }
  }, [initialData, editorRef, placeholder]);

  return (
    <div style={{ marginTop: '20px', marginBottom: '70px' }}>
      <Toolbar valid={valid} saving={saving} onSave={onSave} />
      <div id="editor" />
    </div>
  );
};

export default EditorFixed;
