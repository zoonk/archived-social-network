import { Fragment, useEffect } from 'react';
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
import { Report } from '@zoonk/models';
import { listReports } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import ListSkeleton from './ListSkeleton';
import useLoadMore from './useLoadMore';
import useTranslation from './useTranslation';

interface ReportsListProps {
  allowLoadMore?: boolean;
  limit?: number;
}

const ReportsList = ({ allowLoadMore, limit }: ReportsListProps) => {
  const translate = useTranslation();
  const { get, items, lastVisible, loading } = useLoadMore<Report.Snapshot>(
    limit,
  );

  useEffect(() => {
    get({ data: listReports(limit), replace: true });
  }, [get, limit]);

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

                <NextLink
                  href="/edits/[id]"
                  as={`/edits/${item.editId}`}
                  passHref
                >
                  <Button component="a" variant="outlined" color="primary">
                    {translate('view')}
                  </Button>
                </NextLink>
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
    </Fragment>
  );
};

export default ReportsList;
