import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { Grid } from '@material-ui/core';
import { Comment } from '@zoonk/models';
import DiscussionListItem from './DiscussionListItem';
import NoItems from './NoItems';

const DiscussionLoadMore = dynamic(() => import('./DiscussionLoadMore'), {
  ssr: false,
});

interface DiscussionListProps {
  data: Comment.Get[];
  limit?: number;
  userId?: string;
}

const DiscussionList = ({ data, limit = 10, userId }: DiscussionListProps) => {
  const [items, setItems] = useState<Comment.Get[]>(data);

  if (items.length === 0) return <NoItems />;

  return (
    <Fragment>
      <Grid container spacing={1}>
        {items.map((item) => (
          <Grid item xs={12} key={item.id}>
            <DiscussionListItem comment={item} />
          </Grid>
        ))}
      </Grid>

      <DiscussionLoadMore
        lastItem={items[items.length - 1].id}
        length={items.length}
        limit={limit}
        userId={userId}
        onLoadMore={(res) => setItems([...items, ...res])}
      />
    </Fragment>
  );
};

export default DiscussionList;
