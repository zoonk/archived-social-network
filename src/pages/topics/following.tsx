import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container } from '@material-ui/core';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import TopicsFollowing from '@zoonk/components/TopicsFollowing';
import TopicsHeader from '@zoonk/components/TopicsHeader';
import useAuth from '@zoonk/components/useAuth';
import { analytics, GlobalContext } from '@zoonk/utils';

const TopicsFollowingPage: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();

  useEffect(() => {
    analytics().setCurrentScreen('topics_following');
  }, []);

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user === null) {
    return <LoginForm />;
  }

  return (
    <Container component="main">
      <Meta title={translate('topics')} noIndex />
      <SidebarPage title={translate('post_share')}>
        <TopicsHeader active="following" />
        <TopicsFollowing allowLoadMore limit={10} userId={user.uid} />
      </SidebarPage>
    </Container>
  );
};

export default TopicsFollowingPage;
