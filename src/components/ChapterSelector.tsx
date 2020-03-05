import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { firebaseError, GlobalContext, theme, timestamp } from '@zoonk/utils';
import { addChapterToTopic } from '@zoonk/services';
import Snackbar from './Snackbar';

interface ChapterSelectorProps {
  chapters: ReadonlyArray<Chapter.Index>;
}

/**
 * Chapter list with an option to add it to the current topic.
 */
const ChapterSelector = ({ chapters }: ChapterSelectorProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { query, push } = useRouter();
  const topicId = String(query.id);

  if (chapters.length === 0 || !profile || !user) {
    return null;
  }

  const add = (id: string) => {
    setSnackbar({ type: 'progress', msg: translate('chapter_adding') });
    const metadata = {
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    };

    addChapterToTopic(id, topicId, metadata)
      .then(() =>
        push(
          '/topics/[topicId]/chapters/[chapterId]',
          `/topics/${topicId}/chapters/${id}`,
        ),
      )
      .catch((e) => setSnackbar(firebaseError(e, 'add_existing_chapter')));
  };

  return (
    <Card
      variant="outlined"
      style={{ width: '100%', margin: theme.spacing(1) }}
    >
      <CardHeader
        title={translate('chapter_select_title')}
        subheader={translate('chapter_select_desc')}
      />
      <List>
        {chapters.map((chapter, index) => (
          <ListItem
            key={chapter.objectID}
            divider={chapters.length > index + 1}
          >
            <ListItemText primary={chapter.title} />
            <ListItemSecondaryAction>
              <NextLink
                href="/topics/[id]/chapters/[chapterId]"
                as={`/topics/${topicId}/chapters/${chapter.objectID}`}
                passHref
              >
                <Button
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  {translate('view')}
                </Button>
              </NextLink>
              <Button color="secondary" onClick={() => add(chapter.objectID)}>
                {translate('add')}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Snackbar action={snackbar} />
    </Card>
  );
};

export default ChapterSelector;
