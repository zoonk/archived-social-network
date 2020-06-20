import { Fragment, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import { Report } from '@zoonk/models';
import { listReports } from '@zoonk/services';
import LoadMore from './LoadMore';
import useTranslation from './useTranslation';

interface ReportsListProps {
  limit?: number;
}

const ReportsList = ({ limit = 10 }: ReportsListProps) => {
  const translate = useTranslation();
  const [items, setItems] = useState<Report.Snapshot[]>();

  useEffect(() => {
    listReports(limit).then(setItems);
  }, [limit]);

  if (!items) return <CircularProgress />;

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

      <LoadMore<Report.Snapshot>
        lastPath={items[items.length - 1].snap}
        length={items.length}
        limit={limit}
        request={(last) => listReports(limit, last)}
        onLoadMore={(newData) => setItems([...items, ...newData])}
      />
    </Fragment>
  );
};

export default ReportsList;
