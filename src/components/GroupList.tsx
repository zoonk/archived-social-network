import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { List } from '@material-ui/core';
import { Group } from '@zoonk/models';
import GroupListItem from './GroupListItem';
import NoItems from './NoItems';

const GroupLoadMore = dynamic(() => import('./GroupLoadMore'), {
  ssr: false,
});

interface GroupListProps {
  data: Group.Get[];
  last?: firebase.firestore.DocumentSnapshot;
  limit?: number;
  topicId?: string;
  userId?: string;
}

const GroupList = ({
  data,
  last,
  limit = 10,
  topicId,
  userId,
}: GroupListProps) => {
  const [items, setItems] = useState<Group.Get[]>(data);

  if (items.length === 0) return <NoItems />;

  return (
    <Fragment>
      <List disablePadding>
        {items.map((item, index) => (
          <GroupListItem
            key={item.id}
            divider={index !== items.length - 1}
            item={item}
          />
        ))}
      </List>

      <GroupLoadMore
        lastItem={last || items[items.length - 1].id}
        length={items.length}
        limit={limit}
        topicId={topicId}
        userId={userId}
        onLoadMore={(res) => setItems([...items, ...res])}
      />
    </Fragment>
  );
};

export default GroupList;
