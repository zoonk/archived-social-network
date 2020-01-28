import { Fragment, useContext, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { SnackbarAction, UserNote } from '@zoonk/models';
import { deleteNote, updateNote } from '@zoonk/services';
import { firebaseError, GlobalContext, timestamp } from '@zoonk/utils';
import Snackbar from './Snackbar';
import NoteForm from './NoteForm';

interface NoteEditProps {
  data: UserNote.Get;
  onCancel: () => void;
  onSave: () => void;
}

/**
 * Component for editing a user note.
 * @property `data` - note data to edit.
 * @property `onCancel()` - fires an event when the editing is cancelled.
 * @property `onSave()` - fires an event when the note is saved.
 */
const NoteEdit = ({ data, onCancel, onSave }: NoteEditProps) => {
  const { translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  if (!user) {
    return <CircularProgress />;
  }

  const handleDelete = () => {
    if (window.confirm(translate('delete_confirmation')) && user) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });

      deleteNote(data.id, user.uid)
        .then(() => {
          setSnackbar({ type: 'success', msg: translate('response_deleted') });
          onCancel();
        })
        .catch((e) => setSnackbar(firebaseError(e, 'note_delete')));
    }
  };

  const handleSubmit = (title: string, description: string) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    if (title.length === 0 && description.length === 0) {
      setSnackbar({ type: 'error', msg: translate('notes_required_fields') });
      return;
    }

    const changes: UserNote.Update = {
      description,
      title,
      updatedAt: timestamp,
    };

    updateNote(changes, data.id, user.uid)
      .then(() => {
        setSnackbar({ type: 'success', msg: translate('saved') });
        onSave();
      })
      .catch((e) => setSnackbar(firebaseError(e, 'note_update')));
  };

  return (
    <Fragment>
      <NoteForm
        note={data}
        onCancel={onCancel}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />

      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default NoteEdit;
