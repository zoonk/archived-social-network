import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { CircularProgress, Container } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useAuth from '@zoonk/components/useAuth';
import { GlobalContext } from '@zoonk/utils';

const LoginForm = dynamic(() => import('@zoonk/components/LoginForm'), {
  ssr: false,
});

const NotificationList = dynamic(
  () => import('@zoonk/components/NotificationList'),
  { ssr: false },
);

const Notifications: NextPage = () => {
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
      <Meta title={translate('notifications')} noIndex />
      <HomeBreadcrumb title={translate('notifications')} />
      <NotificationList
        allowLoadMore
        limit={20}
        uid={user.uid}
        settings={user.notificationSettings}
      />
    </Container>
  );
};

export default Notifications;
