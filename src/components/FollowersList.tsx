import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { Grid } from '@material-ui/core';
import { Follower } from '@zoonk/models';
import FollowerListItem from './FollowerListItem';
import NoItems from './NoItems';

const FollowersLoadMore = dynamic(() => import('./FollowersLoadMore'), {
  ssr: false,
});

interface DiscussionListProps {
  collection: Follower.Collections;
  data: Follower.Get[];
  doc: string;
  limit?: number;
  userId?: string;
}

const FollowersList = ({
  collection,
  data,
  doc,
  limit = 10,
}: DiscussionListProps) => {
  const [items, setItems] = useState<Follower.Get[]>(data);

  if (items.length === 0) return <NoItems />;

  return (
    <Fragment>
      <Grid container spacing={2}>
        {items.map((user) => (
          <Grid item key={user.username} xs={12} sm={6}>
            <FollowerListItem item={user} />
          </Grid>
        ))}
      </Grid>

      <FollowersLoadMore
        collection={collection}
        doc={doc}
        lastItem={items[items.length - 1].id}
        length={items.length}
        limit={limit}
        onLoadMore={(res) => setItems([...items, ...res])}
      />
    </Fragment>
  );
};

export default FollowersList;
