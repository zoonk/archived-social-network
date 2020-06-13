import { Fragment, useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { timestamp } from '@zoonk/firebase/db';
import { Post } from '@zoonk/models';
import { getChapterLive, updatePost, updatePostOrder } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import SortableList from './SortableList';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

interface LessonSortableListProps {
  category: 'examples' | 'lessons';
  chapterId: string;
}

const LessonSortableList = ({
  category,
  chapterId,
}: LessonSortableListProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const { action, snackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Post.Summary[]>([]);

  useEffect(() => {
    const unsubscribe = getChapterLive(chapterId, (snap) => {
      setLoading(false);
      if (!snap) return;
      setItems(category === 'lessons' ? snap.lessonData : snap.exampleData);
    });

    return () => unsubscribe();
  }, [category, chapterId]);

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
    const changes = items.map((item) => item.id);
    updatePostOrder(changes, category, chapterId, profile, user.uid)
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
  };

  const remove = (id: string) => {
    if (window.confirm(translate('post_delete_confirmation'))) {
      snackbar('progress', translate('post_removing'));

      const changes = {
        chapterId: null,
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
      };

      updatePost(changes, id)
        .then(() => {
          /**
           * Remove this lesson from the component state when it's deleted.
           */
          setItems((previous) => {
            const newItems = previous.filter((post) => post.id !== id);
            return newItems;
          });
          snackbar('success', translate('post_removed'));
        })
        .catch((e) => snackbar('error', e.message));
    }
  };

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        <NextLink
          href={`/posts/add?category=${category}&chapterId=${chapterId}`}
          passHref
        >
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
        category="posts"
        items={items}
        saving={action === 'progress'}
        onCancel={() => push('/chapters/[id]', `/chapters/${chapterId}`)}
        onDelete={remove}
        onMove={handleMove}
        onSave={save}
      />
    </Fragment>
  );
};

export default LessonSortableList;
