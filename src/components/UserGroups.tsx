import { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Group } from '@zoonk/models';
import { getGroupsSnapshot } from '@zoonk/services';
import GroupList from './GroupList';

interface UserGroupsProps {
  id: string;
}

const UserGroups = ({ id }: UserGroupsProps) => {
  const [data, setData] = useState<Group.Snapshot[]>();

  useEffect(() => {
    getGroupsSnapshot({ userId: id }).then(setData);
  }, [id]);

  if (!data) return <CircularProgress />;

  return (
    <GroupList data={data} last={data[data.length - 1].snap} userId={id} />
  );
};

export default UserGroups;
