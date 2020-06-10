import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Chapter, SnackbarAction } from '@zoonk/models';
import {
  deleteChapter,
  getTopicLive,
  updateChapterOrder,
} from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';
import SortableList from './SortableList';
import useAuth from './useAuth';

interface ChapterSortableListProps {
  topicId: string;
}

/**
 * Sortable list of chapters.
 */
const ChapterSortableList = ({ topicId }: ChapterSortableListProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Chapter.Summary[]>([]);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = getTopicLive(topicId, (snap) => {
      setItems(snap.chapterData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [topicId]);

  const handleMove = useCallback(
    (drag: number, hover: number) => {
      const dragValue = items[drag];
      const newOrder = [...items];
      newOrder.splice(drag, 1);
      newOrder.splice(hover, 0, dragValue);
      setItems(newOrder);
    },
    [items],
  );

  if (!user || !profile) {
    return null;
  }

  if (loading) {
    return <CircularProgress />;
  }

  const save = () => {
    setSnackbar({ type: 'progress', msg: translate('saving') });
    const chapters = items.map((item) => item.id);
    updateChapterOrder(chapters, topicId, profile, user.uid)
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'update_order')));
  };

  const remove = (id: string) => {
    if (window.confirm(translate('chapter_delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('chapter_removing') });

      deleteChapter(id, profile, user.uid)
        .then(() => {
          /**
           * Remove the deleted item from the chapters list.
           */
          setItems((previous) => {
            const newItems = previous.filter((chapter) => chapter.id !== id);
            return newItems;
          });
          setSnackbar({ type: 'success', msg: translate('chapter_removed') });
        })
        .catch((e) => setSnackbar(firebaseError(e, 'chapter_remove')));
    }
  };

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        <NextLink href={`/chapters/add?topicId=${topicId}`} passHref>
          <Button component="a" size="small" color="primary">
            <Add
              aria-label={translate('create')}
              style={{ marginRight: theme.spacing(0.5) }}
            />
            {translate('create')}
          </Button>
        </NextLink>
      </div>
      <SortableList
        category="chapters"
        items={items}
        saving={snackbar?.type === 'progress'}
        onMove={handleMove}
        onSave={save}
        onDelete={remove}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default ChapterSortableList;
