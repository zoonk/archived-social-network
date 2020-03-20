import { Fragment, useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';
import { Report, SnackbarAction } from '@zoonk/models';
import { listReports } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';
import ListSkeleton from './ListSkeleton';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface ReportsListProps {
  allowLoadMore?: boolean;
  limit?: number;
}

/**
 * Display a list containing user reports.
 */
const ReportsList = ({ allowLoadMore, limit }: ReportsListProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Report.Snapshot
  >(limit);

  useEffect(() => {
    get({ data: listReports(limit) });
  }, [get, limit]);

  useEffect(() => {
    if (error) setSnackbar({ type: 'error', msg: error.message });
  }, [error]);

  const loadMore = () => {
    get({ data: listReports(limit, lastVisible) });
  };

  return (
    <Fragment>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card variant="outlined">
              {item.user && (
                <CardHeader
                  avatar={<Avatar src={item.user.photo || undefined} />}
                  title={item.user.name}
                  subheader={item.createdAt}
                  action={
                    <NextLink
                      href="/profile/[id]"
                      as={`/profile/${item.user.username}`}
                      passHref
                    >
                      <Button component="a" color="primary">
                        {translate('profile')}
                      </Button>
                    </NextLink>
                  }
                />
              )}
              <CardContent>
                <Typography component="p" variant="body1" gutterBottom>
                  {item.comments}
                </Typography>

                <Typography
                  component="p"
                  variant="caption"
                  color="textSecondary"
                >
                  {item.editId}
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

export default ReportsList;
