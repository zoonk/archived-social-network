import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { CircularProgress, Container } from '@material-ui/core';
import GroupListHeader from '@zoonk/components/GroupListHeader';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import useAuth from '@zoonk/components/useAuth';
import { GlobalContext } from '@zoonk/utils';

const GroupList = dynamic(() => import('@zoonk/components/GroupList'), {
  ssr: false,
});

const LoginForm = dynamic(() => import('@zoonk/components/LoginForm'), {
  ssr: false,
});

const MyGroups: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user === null) {
    return <LoginForm />;
  }

  return (
    <Container component="main">
      <Meta title={translate('groups_my')} noIndex />
      <SidebarPage title={translate('post_share')}>
        <GroupListHeader active="myGroups" />
        <GroupList allowLoadMore userId={user.uid} />
      </SidebarPage>
    </Container>
  );
};

export default MyGroups;
