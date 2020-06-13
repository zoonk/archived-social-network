import { Fragment, useContext, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { Activity } from '@zoonk/models';
import { listActivities } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';
import EditsItem from './EditsItem';
import EditsSkeleton from './EditsSkeleton';
import useLoadMore from './useLoadMore';

interface EditsListProps {
  displayTitle?: boolean;
  itemPath?: string;
  limit?: number;
}

const EditsList = ({ displayTitle, itemPath, limit = 10 }: EditsListProps) => {
  const { translate } = useContext(GlobalContext);
  const { get, items, lastVisible, loading } = useLoadMore<Activity.Snapshot>(
    limit,
  );

  const loadMore = () => {
    get({ data: listActivities(itemPath, lastVisible, limit) });
  };

  useEffect(() => {
    get({ data: listActivities(itemPath, undefined, limit), replace: true });
  }, [get, itemPath, limit]);

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
    </Fragment>
  );
};

export default EditsList;
