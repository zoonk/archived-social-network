import { Fragment, useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import { Comment } from '@zoonk/models';
import { listComments } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import DiscussionListItem from './DiscussionListItem';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import useLoadMore from './useLoadMore';
import useTranslation from './useTranslation';

interface DiscussionListProps {
  allowLoadMore?: boolean;
  createdById?: string;
  limit?: number;
}

const DiscussionList = ({
  allowLoadMore,
  createdById,
  limit = 10,
}: DiscussionListProps) => {
  const translate = useTranslation();
  const { get, items, lastVisible, loading } = useLoadMore<Comment.Snapshot>(
    limit,
  );

  const loadMore = () => {
    get({ data: listComments(lastVisible, createdById, limit) });
  };

  useEffect(() => {
    get({ data: listComments(undefined, createdById, limit) });
  }, [get, createdById, limit]);

  if (items.length === 0 && loading === false) {
    return <NoItems />;
  }

  return (
    <Fragment>
      <Grid container spacing={1}>
        {items.map((item) => (
          <Grid item xs={12} key={item.id}>
            <DiscussionListItem comment={item} />
          </Grid>
        ))}
      </Grid>

      {loading && <ListSkeleton items={limit} />}

      {allowLoadMore && lastVisible && (
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

export default DiscussionList;
