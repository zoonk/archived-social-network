import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import NotificationList from '@zoonk/components/NotificationList';
import { analytics, GlobalContext } from '@zoonk/utils';

const Notifications: NextPage = () => {
  const { translate, user } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('notifications');
  }, []);

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
