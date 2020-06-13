import { Fragment, useContext, useEffect } from 'react';
import { Button, List } from '@material-ui/core';
import { Leaderboard } from '@zoonk/models';
import { getLeaderboard } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';
import LeaderboardListItem from './LeaderboardListItem';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import useLoadMore from './useLoadMore';

interface LeaderboardListProps {
  allowLoadMore?: boolean;
  limit?: number;
  topicId?: string;
}

const LeaderboardList = ({
  allowLoadMore,
  limit = 5,
  topicId,
}: LeaderboardListProps) => {
  const { translate } = useContext(GlobalContext);
  const { get, items, lastVisible, loading } = useLoadMore<
    Leaderboard.Snapshot
  >(limit);

  const loadMore = () => {
    get({ data: getLeaderboard(topicId, lastVisible, limit) });
  };

  useEffect(() => {
    get({ data: getLeaderboard(topicId, undefined, limit) });
  }, [get, limit, topicId]);

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
    </Fragment>
  );
};

export default LeaderboardList;
