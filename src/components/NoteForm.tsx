import { useContext, useState } from 'react';
import { Button, Grid, IconButton, TextField } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { UserNote } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';

interface NoteEditProps {
  note?: UserNote.Get;
  onCancel: () => void;
  onDelete?: () => void;
  onSubmit: (title: string, description: string) => void;
}

/**
 * Form for editing a user note.
 * @property `note` - current data.
 * @property `onCancel()` - fires an event when the editing is cancelled.
 * @property `onDelete()` - fires an event when the delete button is clicked.
 * @property `onSubmit()` - fires an event when the note is saved.
 */
const NoteEdit = ({ note, onCancel, onDelete, onSubmit }: NoteEditProps) => {
  const { translate } = useContext(GlobalContext);
  const [title, setTitle] = useState<string>(note?.title || '');
  const [description, setDescription] = useState<string>(
    note?.description || '',
  );

  return (
    <form
      style={{
        width: '100%',
        marginTop: theme.spacing(3),
      }}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(title, description);
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
            id="note-topic-title"
            label={translate('title')}
            name="title"
            type="text"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            id="note-topic-description"
            label={translate('description')}
            name="description"
          />
        </Grid>
      </Grid>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ margin: theme.spacing(3, 0, 0) }}
        >
          {translate('save')}
        </Button>

        <Button
          color="secondary"
          style={{ margin: theme.spacing(3, 2, 0) }}
          onClick={onCancel}
        >
          {translate('cancel')}
        </Button>

        <div style={{ flexGrow: 1 }} />

        {onDelete && (
          <IconButton
            color="secondary"
            edge="end"
            style={{ margin: theme.spacing(3, 2, 0) }}
            onClick={onDelete}
          >
            <Delete />
          </IconButton>
        )}
      </div>
    </form>
  );
};

export default NoteEdit;
