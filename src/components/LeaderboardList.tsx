import { Fragment, useContext, useEffect, useState } from 'react';
import { Button, List } from '@material-ui/core';
import { Leaderboard, SnackbarAction } from '@zoonk/models';
import { getLeaderboard } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import LeaderboardListItem from './LeaderboardListItem';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface LeaderboardListProps {
  allowLoadMore?: boolean;
  limit?: number;
  topicId?: string;
}

/**
 * Display a list of leaderboard users.
 * @property `allowLoadMore` - display a "load more" button.
 * @property `limit` - # of users to show.
 * @property `topicId` - filter by topic.
 */
const LeaderboardList = ({
  allowLoadMore,
  limit = 5,
  topicId,
}: LeaderboardListProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Leaderboard.Snapshot
  >(limit);

  const loadMore = () => {
    get(getLeaderboard(topicId, lastVisible, limit));
  };

  useEffect(() => {
    get(getLeaderboard(topicId, undefined, limit));
  }, [get, limit, topicId]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'leaderboard_list'));
    }
  }, [error]);

  if (items.length === 0 && loading === false) {
    return <NoItems />;
  }

  return (
    <Fragment>
      <List disablePadding>
        {items.map((item, index) => (
          <LeaderboardListItem
            key={item.id}
            divider={index !== items.length - 1}
            item={item}
          />
        ))}
      </List>

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

      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default LeaderboardList;
