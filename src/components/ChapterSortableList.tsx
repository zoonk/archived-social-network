import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { getTopic, updateChapterOrder } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import Snackbar from './Snackbar';
import SortableList from './SortableList';

interface ChapterSortableListProps {
  topicId: string;
}

/**
 * Sortable list of chapters.
 */
const ChapterSortableList = ({ topicId }: ChapterSortableListProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Chapter.Summary[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getTopic(topicId).then((res) => {
      if (active) {
        setItems(res.chapterData);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
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
