import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { List } from '@material-ui/core';
import { Topic } from '@zoonk/models';
import NoItems from './NoItems';
import TopicListItem from './TopicListItem';

const TopicLoadMore = dynamic(() => import('./TopicLoadMore'), { ssr: false });

interface TopicListProps {
  data: Topic.Get[];
  last?: firebase.firestore.DocumentSnapshot;
  limit?: number;
  userId?: string;
}

const TopicList = ({ data, last, limit = 10, userId }: TopicListProps) => {
  const [items, setItems] = useState<Topic.Get[]>(data);

  if (items.length === 0) return <NoItems />;

  return (
    <Fragment>
      <List disablePadding>
        {items.map((item, index) => (
          <TopicListItem
            key={item.id}
            divider={index !== items.length - 1}
            item={item}
          />
        ))}
      </List>

      <TopicLoadMore
        lastItem={last || items[items.length - 1].id}
        length={items.length}
        limit={limit}
        userId={userId}
        onLoadMore={(res) => setItems([...items, ...res])}
      />
    </Fragment>
  );
};

export default TopicList;
