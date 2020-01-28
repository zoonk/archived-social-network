import { Fragment, useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { UserNote } from '@zoonk/models';
import { liveNotes } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';
import NoteEdit from './NoteEdit';
import LoginRequired from './LoginRequired';

interface NotesListProps {
  itemPath?: string;
  limit?: number;
}

/**
 * Display a list of notes.
 * @property `itemPath` - database path.
 * @property `limit` - # of notes to be displayed.
 */
const NotesList = ({ itemPath, limit = 50 }: NotesListProps) => {
  const { translate, user } = useContext(GlobalContext);
  const [notes, setNotes] = useState<UserNote.Get[]>([]);
  const [edit, setEdit] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = liveNotes(user.uid, itemPath || null, limit, (snap) => {
      setLoading(false);
      setNotes(snap);
    });

    return () => {
      unsubscribe();
    };
  }, [itemPath, limit, user]);

  if (user === null) {
    return <LoginRequired />;
  }

  if (loading || user === undefined) {
    return <CircularProgress />;
  }

  if (notes.length === 0 && !loading) {
    return <Typography variant="body2">{translate('notes_first')}</Typography>;
  }

  return (
    <Fragment>
      <List>
        {notes.map((note) => (
          <div key={note.id}>
            {edit !== note.id && (
              <ListItem button divider onClick={() => setEdit(note.id)}>
                <ListItemText
                  primary={note.title}
                  secondary={note.description}
                />
              </ListItem>
            )}

            {edit === note.id && (
              <ListItem>
                <NoteEdit
                  data={note}
                  onSave={() => setEdit(undefined)}
                  onCancel={() => setEdit(undefined)}
                />
              </ListItem>
            )}
          </div>
        ))}
      </List>
    </Fragment>
  );
};

export default NotesList;
