import { useEffect } from 'react';
import Quill from 'quill';
import Delta from 'quill-delta';
import { initQuill } from './helpers';
import QuillToolbar from './QuillToolbar';

interface EditorProps {
  editorRef: React.MutableRefObject<Quill | undefined>;
  initialData?: Delta | null;
  placeholder: string;
  id: string;
}

const Editor = ({ editorRef, initialData, placeholder, id }: EditorProps) => {
  useEffect(() => {
    if (!editorRef.current) {
      initQuill(editorRef, placeholder, initialData, id);
    }
  }, [initialData, id, editorRef, placeholder]);

  return (
    <div>
      <QuillToolbar id={id} />
      <div id={`editor-${id}`} />
    </div>
  );
};

export default Editor;
