import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { differenceWith, isEqual } from 'lodash';
import { Button, CircularProgress, List } from '@material-ui/core';
import { Post, SnackbarAction } from '@zoonk/models';
import { listPosts, updateOrder } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import LessonSortableItem from './LessonSortableItem';
import Snackbar from './Snackbar';

interface LessonSortableListProps {
  chapterId: string;
}

/**
 * Sortable list of lessons.
 */
const LessonSortableList = ({ chapterId }: LessonSortableListProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const { back } = useRouter();
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
        order: { ...item.order, [chapterId]: index + 1 },
      }));
      setItems(newOrder);
    },
    [chapterId, items],
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
    updateOrder(changes, chapterId, profile, user.uid)
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'update_order')));
  };

  return (
    <DndProvider backend={Backend}>
      <List disablePadding>
        {items.map((item, index) => (
          <LessonSortableItem
            key={item.id}
            index={index}
            divider={index !== items.length - 1}
            item={item}
            moveItem={handleMove}
          />
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        style={{ margin: theme.spacing(3, 0, 0) }}
        disabled={snackbar?.type === 'progress'}
        onClick={save}
      >
        {translate('save_changes')}
      </Button>

      <Button
        type="reset"
        color="secondary"
        style={{ margin: theme.spacing(3, 2, 0) }}
        disabled={snackbar?.type === 'progress'}
        onClick={back}
      >
        {translate('cancel')}
      </Button>

      <Snackbar action={snackbar} />
    </DndProvider>
  );
};

export default LessonSortableList;
