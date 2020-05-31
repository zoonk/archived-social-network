import Quill from 'quill';
import Delta from 'quill-delta';
import BlotFormatter from 'quill-blot-formatter';
import { upload } from '@zoonk/services';
import Image from './Image';
import ImageUploader from './ImageUploader';
import Video from './Video';

Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register('modules/imageUploader', ImageUploader);
Quill.register(Image, true);
Quill.register(Video);

export const initQuill = (
  ref: React.MutableRefObject<Quill | undefined>,
  placeholder: string,
  initialData?: Delta | null,
  id?: string,
): void => {
  const editorId = id ? `#editor-${id}` : '#editor';
  const toolbarId = id ? `#toolbar-${id}` : '#toolbar';
  // eslint-disable-next-line no-param-reassign
  ref.current = new Quill(editorId, {
    modules: {
      toolbar: toolbarId,
      blotFormatter: {},
      imageUploader: {
        // Upload images to Firebase when adding them to the editor.
        upload: (file: File) => upload(file, 'posts'),
      },
    },
    placeholder,
    theme: 'snow',
  });

  // Set the initial content when it exists.
  if (initialData) {
    ref.current.setContents(initialData);
  }
};
