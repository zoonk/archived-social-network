import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { differenceWith, isEqual } from 'lodash';
import { CircularProgress } from '@material-ui/core';
import { Post, SnackbarAction } from '@zoonk/models';
import { listPosts, updatePostOrder } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import AddButton from './AddButton';
import Snackbar from './Snackbar';
import SortableList from './SortableList';

interface LessonSortableListProps {
  chapterId: string;
}

/**
 * Sortable list of lessons.
 */
const LessonSortableList = ({ chapterId }: LessonSortableListProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Post.Get[]>([]);
  const [original, setOriginal] = useState<Post.Get[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    listPosts({ category: 'lessons', chapterId, limit: 20 }).then((res) => {
      if (active) {
        setItems(res);
        setOriginal(res);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [chapterId]);

  const handleMove = useCallback(
    (drag: number, hover: number) => {
      const dragValue = items[drag];
      let newOrder = [...items];
      newOrder.splice(drag, 1);
      newOrder.splice(hover, 0, dragValue);
      newOrder = newOrder.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
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
    const changes = differenceWith(items, original, isEqual);
    setSnackbar({ type: 'progress', msg: translate('saving') });
    updatePostOrder(changes, profile, user.uid)
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'update_order')));
  };

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        <AddButton
          category="posts"
          query={{ chapterId, category: 'lessons', order: items.length + 1 }}
        />
      </div>
      <SortableList
        category="posts"
        items={items}
        saving={snackbar?.type === 'progress'}
        onMove={handleMove}
        onSave={save}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default LessonSortableList;
