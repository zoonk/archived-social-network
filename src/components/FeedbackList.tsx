import { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import { Feedback } from '@zoonk/models';
import { listFeedback } from '@zoonk/services';
import LoadMore from './LoadMore';
import useTranslation from './useTranslation';

interface FeedbackListProps {
  limit?: number;
}

const FeedbackList = ({ limit = 10 }: FeedbackListProps) => {
  const translate = useTranslation();
  const [items, setItems] = useState<Feedback.Snapshot[]>();

  useEffect(() => {
    listFeedback(limit).then(setItems);
  }, [limit]);

  if (!items) return <CircularProgress />;

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
                <Typography
                  component="p"
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                >
                  {item.email}
                </Typography>

                {item.query.path && (
                  <Button
                    component="a"
                    variant="outlined"
                    color="primary"
                    href={item.query.path}
                  >
                    {translate('view')}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <LoadMore<Feedback.Snapshot>
        lastPath={items[items.length - 1].snap}
        length={items.length}
        limit={limit}
        request={(last) => listFeedback(limit, last)}
        onLoadMore={(newData) => setItems([...items, ...newData])}
      />
    </Fragment>
  );
};

export default FeedbackList;
