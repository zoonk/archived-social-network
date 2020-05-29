import { useContext, useEffect, useRef } from 'react';
import Quill from 'quill';
import Delta from 'quill-delta';
import BlotFormatter from 'quill-blot-formatter';
import { upload } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';
import Image from './Image';
import ImageUploader from './ImageUploader';
import QuillToolbar from './QuillToolbar';
import Toolbar from './Toolbar';
import Video from './Video';

Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register('modules/imageUploader', ImageUploader);
Quill.register(Image, true);
Quill.register(Video);

interface EditorProps {
  content?: Delta | null;
  valid: boolean;
  saving: boolean;
  placeholder?: string;
  /**
   * A `contained` toolbar is displayed on top of the editor.
   * A `bottom` toolbar is fixed at the bottom of the page.
   */
  toolbarPosition?: 'contained' | 'bottom';
  /**
   * Get both the Delta and the HTML content when saving a form.
   */
  onSave: (delta: Delta, html: string) => void;
}

const Editor = ({
  content,
  placeholder,
  saving,
  toolbarPosition = 'contained',
  valid,
  onSave,
}: EditorProps) => {
  const { translate } = useContext(GlobalContext);
  const editorRef = useRef<Quill>();

  useEffect(() => {
    editorRef.current = new Quill('#editor', {
      modules: {
        toolbar: '#toolbar',
        blotFormatter: {},
        imageUploader: {
          // Upload images to Firebase when adding them to the editor.
          upload: (file: File) => upload(file, 'posts'),
        },
      },
      placeholder: placeholder || translate('post_share'),
      theme: 'snow',
    });

    // Set the initial content when it exists.
    if (content) {
      editorRef.current.setContents(content);
    }
  }, [content, placeholder, translate]);

  const save = () => {
    const delta = editorRef.current?.getContents();
    const html = editorRef.current?.root.innerHTML;

    if (delta && html) {
      onSave(delta, html);
    }
  };

  return (
    <div
      style={{
        marginTop: '20px',
        marginBottom: toolbarPosition === 'contained' ? '0' : '70px',
      }}
    >
      {toolbarPosition === 'contained' && <QuillToolbar />}
      {toolbarPosition === 'bottom' && (
        <Toolbar valid={valid} saving={saving} onSave={save} />
      )}
      <div id="editor" />
    </div>
  );
};

export default Editor;
