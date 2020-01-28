/* eslint-disable react/no-array-index-key */
import { Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { theme } from '@zoonk/utils';

interface ListSkeletonProps {
  items?: number;
}

/**
 * Skeleton to be displayed while waiting for a list of items to load.
 */
const ListSkeleton = ({ items = 3 }: ListSkeletonProps) => {
  return (
    <Grid container spacing={2} style={{ marginBottom: theme.spacing(1) }}>
      {Array.from(new Array(items)).map((_, index) => (
        <Grid item xs={12} key={`skeleton-${index}`}>
          <Skeleton width="60%" />
          <Skeleton />
          <Skeleton />
        </Grid>
      ))}
    </Grid>
  );
};

export default ListSkeleton;
