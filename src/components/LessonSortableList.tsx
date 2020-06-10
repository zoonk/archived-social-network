import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Post, SnackbarAction } from '@zoonk/models';
import { getChapterLive, updatePost, updatePostOrder } from '@zoonk/services';
import { firebaseError, GlobalContext, timestamp, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';
import SortableList from './SortableList';
import useAuth from './useAuth';

interface LessonSortableListProps {
  category: 'examples' | 'lessons';
  chapterId: string;
}

/**
 * Sortable list of lessons.
 */
const LessonSortableList = ({
  category,
  chapterId,
}: LessonSortableListProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Post.Summary[]>([]);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = getChapterLive(chapterId, (snap) => {
      setItems(category === 'lessons' ? snap.lessonData : snap.exampleData);
      setLoading(false);
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
    setSnackbar({ type: 'progress', msg: translate('saving') });
    const changes = items.map((item) => item.id);
    updatePostOrder(changes, category, chapterId, profile, user.uid)
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'update_order')));
  };

  const remove = (id: string) => {
    if (window.confirm(translate('post_delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('post_removing') });

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
          setSnackbar({ type: 'success', msg: translate('post_removed') });
        })
        .catch((e) => setSnackbar(firebaseError(e, 'post_remove')));
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
        saving={snackbar?.type === 'progress'}
        onCancel={() => push('/chapters/[id]', `/chapters/${chapterId}`)}
        onDelete={remove}
        onMove={handleMove}
        onSave={save}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default LessonSortableList;
