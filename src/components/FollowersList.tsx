import { Fragment, useContext, useEffect } from 'react';
import { Button, CircularProgress, Grid, makeStyles } from '@material-ui/core';
import { Follower } from '@zoonk/models';
import { getFollowers } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';
import FollowerListItem from './FollowerListItem';
import useLoadMore from './useLoadMore';

interface FollowersListProps {
  groupId: string;
  limit?: number;
}

const useStyles = makeStyles((theme) => ({
  loadMore: { margin: theme.spacing(3, 0, 2) },
}));

const FollowersList = ({ groupId, limit = 10 }: FollowersListProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const { get, items, lastVisible, loading } = useLoadMore<Follower.Snapshot>(
    limit,
  );

  const loadMore = () => {
    get({
      data: getFollowers('groups', groupId, lastVisible, limit),
    });
  };

  useEffect(() => {
    get({
      data: getFollowers('groups', groupId, undefined, limit),
      replace: true,
    });
  }, [get, groupId, limit]);

  return (
    <Fragment>
      <Grid container spacing={2}>
        {items.map((user) => (
          <Grid item key={user.username} xs={12} sm={6} md={4}>
            <FollowerListItem item={user} />
          </Grid>
        ))}
      </Grid>
      {loading && <CircularProgress />}
      {lastVisible && (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={loadMore}
          className={classes.loadMore}
        >
          {translate('load_more')}
        </Button>
      )}
    </Fragment>
  );
};

export default FollowersList;
