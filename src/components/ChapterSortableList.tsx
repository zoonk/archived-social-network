import { Fragment, useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Chapter } from '@zoonk/models';
import {
  deleteChapter,
  getTopicLive,
  updateChapterOrder,
} from '@zoonk/services';
import { theme } from '@zoonk/utils';
import SortableList from './SortableList';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

interface ChapterSortableListProps {
  topicId: string;
}

const ChapterSortableList = ({ topicId }: ChapterSortableListProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const { action, snackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Chapter.Summary[]>([]);

  useEffect(() => {
    const unsubscribe = getTopicLive(topicId, (snap) => {
      setLoading(false);
      setItems(snap?.chapterData || []);
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
    snackbar('progress');
    const chapters = items.map((item) => item.id);
    updateChapterOrder(chapters, topicId, profile, user.uid)
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
  };

  const remove = (id: string) => {
    if (window.confirm(translate('chapter_delete_confirmation'))) {
      snackbar('progress', translate('chapter_removing'));

      deleteChapter(id, profile, user.uid)
        .then(() => {
          /**
           * Remove the deleted item from the chapters list.
           */
          setItems((previous) => {
            const newItems = previous.filter((chapter) => chapter.id !== id);
            return newItems;
          });
          snackbar('success', translate('chapter_removed'));
        })
        .catch((e) => snackbar('error', e.message));
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
        saving={action === 'progress'}
        onMove={handleMove}
        onSave={save}
        onDelete={remove}
      />
    </Fragment>
  );
};

export default ChapterSortableList;
