import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Post, SnackbarAction } from '@zoonk/models';
import { getChapter, updatePostOrder } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';
import SortableList from './SortableList';

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
  const { profile, translate, user } = useContext(GlobalContext);
  const { push, query } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Post.Summary[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getChapter(chapterId).then((res) => {
      if (active) {
        setItems(category === 'lessons' ? res.lessonData : res.exampleData);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
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

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        <NextLink
          href="/topics/[id]/chapters/[chapterId]/add"
          as={`/topics/${query.id}/chapters/${query.chapterId}/add?category=${category}`}
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
        onCancel={() =>
          push(
            '/topics/[id]/chapters/[chapterId]',
            `/topics/${query.id}/chapters/${chapterId}`,
          )
        }
        onMove={handleMove}
        onSave={save}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default LessonSortableList;
