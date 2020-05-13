import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import FollowersList from '@zoonk/components/FollowersList';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import Meta from '@zoonk/components/Meta';
import { analytics, GlobalContext } from '@zoonk/utils';

const GroupMembers: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const groupId = String(query.id);

  useEffect(() => {
    analytics().setCurrentScreen('group_members');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('members')} noIndex />
      <GroupsBreadcrumb groupId={groupId} title={translate('members')} />
      {query.id && <FollowersList groupId={groupId} />}
    </Container>
  );
};

export default GroupMembers;
