import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container } from '@material-ui/core';
import GroupList from '@zoonk/components/GroupList';
import GroupListHeader from '@zoonk/components/GroupListHeader';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import { analytics, GlobalContext } from '@zoonk/utils';

const MyGroups: NextPage = () => {
  const { translate, user } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('my_groups');
  }, []);

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
