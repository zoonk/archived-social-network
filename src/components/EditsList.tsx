import { Fragment, useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Activity, SnackbarAction } from '@zoonk/models';
import { listActivities } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import EditsItem from './EditsItem';
import EditsSkeleton from './EditsSkeleton';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface EditsListProps {
  displayTitle?: boolean;
  itemPath?: string;
  limit?: number;
}

/**
 * List all changes made to an item.
 * @property `itemPath` - document path in the database.
 * @property `limit` - # of items to be displayed.
 */
const EditsList = ({ displayTitle, itemPath, limit = 10 }: EditsListProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Activity.Snapshot
  >(limit);

  const loadMore = () => {
    get(listActivities(itemPath, lastVisible, limit));
  };

  useEffect(() => {
    get(listActivities(itemPath, undefined, limit));
  }, [get, itemPath, limit]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'edits_list'));
    }
  }, [error]);

  return (
    <Fragment>
      {items.map((item) => (
        <EditsItem displayTitle={displayTitle} edits={item} key={item.id} />
      ))}

      {loading && <EditsSkeleton />}

      {lastVisible && (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={loadMore}
          style={{ margin: theme.spacing(3, 0, 2) }}
        >
          {translate('load_more')}
        </Button>
      )}

      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default EditsList;
