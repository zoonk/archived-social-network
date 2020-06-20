import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { CircularProgress, Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import TopicsHeader from '@zoonk/components/TopicsHeader';
import useAuth from '@zoonk/components/useAuth';
import useTranslation from '@zoonk/components/useTranslation';

const LoginForm = dynamic(() => import('@zoonk/components/LoginForm'), {
  ssr: false,
});

const TopicsFollowing = dynamic(
  () => import('@zoonk/components/TopicsFollowing'),
  { loading: () => <CircularProgress />, ssr: false },
);

const TopicsFollowingPage: NextPage = () => {
  const translate = useTranslation();
  const { user } = useAuth();

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
        <TopicsFollowing userId={user.uid} />
      </SidebarPage>
    </Container>
  );
};

export default TopicsFollowingPage;
