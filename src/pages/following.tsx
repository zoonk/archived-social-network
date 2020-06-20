import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { CircularProgress, Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import TimelineHeader from '@zoonk/components/TimelineHeader';
import useAuth from '@zoonk/components/useAuth';
import useTranslation from '@zoonk/components/useTranslation';

const LoginForm = dynamic(() => import('@zoonk/components/LoginForm'), {
  ssr: false,
});

const TimelineCard = dynamic(() => import('@zoonk/components/TimelineCard'), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const Following: NextPage = () => {
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
      <Meta title={translate('seo_home_title')} noAppName noIndex />
      <SidebarPage title={translate('post_share')}>
        <TimelineHeader active="following" />
        <TimelineCard limit={10} userId={user.uid} />
      </SidebarPage>
    </Container>
  );
};

export default Following;
