import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { differenceWith, isEqual } from 'lodash';
import { CircularProgress } from '@material-ui/core';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { listChapters, updateChapterOrder } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import Snackbar from './Snackbar';
import SortableList from './SortableList';

interface ChapterSortableListProps {
  pathId: string;
}

/**
 * Sortable list of chapters.
 */
const ChapterSortableList = ({ pathId }: ChapterSortableListProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Chapter.Get[]>([]);
  const [original, setOriginal] = useState<Chapter.Get[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    listChapters(pathId).then((res) => {
      if (active) {
        setItems(res);
        setOriginal(res);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [pathId]);

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
    updateChapterOrder(changes, profile, user.uid)
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'update_order')));
  };

  return (
    <Fragment>
      <SortableList
        category="chapters"
        items={items}
        saving={snackbar?.type === 'progress'}
        onMove={handleMove}
        onSave={save}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default ChapterSortableList;
