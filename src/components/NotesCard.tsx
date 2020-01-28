import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { ContentCategory } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';
import NoteCreate from './NoteCreate';
import NotesList from './NotesList';

interface NotesCardProps {
  category: ContentCategory;
  id: string;
  itemPath: string;
}

/**
 * Display user notes for a specific item path.
 */
const NotesCard = ({ category, id, itemPath }: NotesCardProps) => {
  const { translate, user } = useContext(GlobalContext);
  const [displayForm, setForm] = useState<boolean>(false);

  return (
    <Card variant="outlined">
      <CardContent>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="h2">
            {translate('my_notes')}
          </Typography>

          <NextLink href={`/notes?itemPath=${itemPath}`} passHref>
            <Button component="a" size="small" color="primary">
              {translate('see_all')}
            </Button>
          </NextLink>
        </div>

        <NotesList itemPath={itemPath} limit={5} />

        {displayForm && user && (
          <NoteCreate
            id={id}
            category={category}
            itemPath={itemPath}
            onCancel={() => setForm(false)}
            onSave={() => setForm(false)}
          />
        )}

        {!displayForm && user && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setForm(true)}
            style={{ marginTop: theme.spacing(3) }}
          >
            {translate('notes_new')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesCard;
