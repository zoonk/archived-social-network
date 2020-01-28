import { Fragment, useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';
import { Feedback, SnackbarAction } from '@zoonk/models';
import { listFeedback } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';
import ListSkeleton from './ListSkeleton';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface FeedbackListProps {
  allowLoadMore?: boolean;
  limit?: number;
}

/**
 * Display a list containing user feedback messages.
 */
const FeedbackList = ({ allowLoadMore, limit }: FeedbackListProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Feedback.Snapshot
  >(limit);

  useEffect(() => {
    get(listFeedback(limit));
  }, [get, limit]);

  useEffect(() => {
    if (error) setSnackbar({ type: 'error', msg: error.message });
  }, [error]);

  const loadMore = () => {
    get(listFeedback(limit, lastVisible));
  };

  return (
    <Fragment>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card variant="outlined">
              <CardHeader title={item.name} subheader={item.createdAt} />
              <CardContent>
                <Typography component="p" variant="body1" gutterBottom>
                  {item.message}
                </Typography>
                <Typography component="p" variant="body2" color="textSecondary">
                  {item.email}
                </Typography>
              </CardContent>
            </Card>
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

      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default FeedbackList;
