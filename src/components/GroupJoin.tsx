import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, CircularProgress } from '@material-ui/core';
import { getGroupStatus, joinGroup, leaveGroup } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';

interface GroupJoinProps {
  groupId: string;
  className?: string;
}

const GroupJoin = ({ groupId, className }: GroupJoinProps) => {
  const { translate, user } = useContext(GlobalContext);
  const { push } = useRouter();
  const [joined, setJoined] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const color = joined ? 'secondary' : 'primary';

  useEffect(() => {
    let unsubscribe = () => {};
    if (user) {
      unsubscribe = getGroupStatus(groupId, user.uid, setJoined);
    }
    return () => unsubscribe();
  }, [groupId, user]);

  const toggleJoin = () => {
    if (!user) {
      push(`/login?redirect=/groups/${groupId}`);
      return;
    }

    setLoading(true);
    const fn = joined ? leaveGroup : joinGroup;
    fn(groupId, user.uid)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  return (
    <Button
      variant="outlined"
      size="small"
      color={color}
      onClick={toggleJoin}
      className={className}
      startIcon={
        loading ? <CircularProgress size={10} color={color} /> : undefined
      }
    >
      {joined ? translate('leave') : translate('join')}
    </Button>
  );
};

export default GroupJoin;
