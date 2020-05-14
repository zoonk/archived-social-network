import { Fragment } from 'react';
import { Group } from '@zoonk/models';
import NoPinned from './NoPinned';
import PinnedHeader from './PinnedHeader';
import PinnedList from './PinnedList';

interface GroupPinnedProps {
  group: Group.Get;
}

const GroupPinned = ({ group }: GroupPinnedProps) => {
  const { id, pinnedPosts } = group;
  const noPosts = pinnedPosts.length === 0;

  return (
    <Fragment>
      <PinnedHeader groupId={id} hideButtons={noPosts} />
      {noPosts && <NoPinned groupId={id} />}
      <PinnedList items={pinnedPosts} />
    </Fragment>
  );
};

export default GroupPinned;
