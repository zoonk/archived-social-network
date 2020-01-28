import { Fragment, useContext, useState } from 'react';
import { ContentCategory, SnackbarAction } from '@zoonk/models';
import { createNote } from '@zoonk/services';
import { firebaseError, GlobalContext, timestamp } from '@zoonk/utils';
import Snackbar from './Snackbar';
import NoteForm from './NoteForm';

interface NoteCreateProps {
  category: ContentCategory;
  id: string;
  itemPath: string;
  onCancel: () => void;
  onSave: () => void;
}

/**
 * Component for creating a user note.
 * @property `category` - category this note belongs to (e.g. topics, examples, etc.).
 * @property `id` - category ID.
 * @property `itemPath` - database path this note belongs to (e.g. `topics/Physics_en`).
 * @property `onCancel()` - fires an event if the user cancels this action.
 * @property `onSave()` - fires an event when this note is saved.
 */
const NoteCreate = ({
  category,
  id,
  itemPath,
  onCancel,
  onSave,
}: NoteCreateProps) => {
  const { translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  if (!user) {
    return null;
  }

  const handleSubmit = (title: string, description: string) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    if (title.length === 0 && description.length === 0) {
      setSnackbar({ type: 'error', msg: translate('notes_required_fields') });
      return;
    }

    createNote(
      {
        category,
        categoryId: id,
        description,
        itemPath,
        title,
        updatedAt: timestamp,
      },
      user.uid,
    )
      .then(() => {
        setSnackbar({ type: 'success', msg: translate('created') });
        onSave();
      })
      .catch((e) => setSnackbar(firebaseError(e, 'note_create')));
  };

  return (
    <Fragment>
      <NoteForm onCancel={onCancel} onSubmit={handleSubmit} />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default NoteCreate;
