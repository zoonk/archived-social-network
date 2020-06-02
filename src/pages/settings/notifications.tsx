import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container, Grid } from '@material-ui/core';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import NotificationSettings from '@zoonk/components/NotificationSettings';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import { analytics, GlobalContext } from '@zoonk/utils';

const Settings: NextPage = () => {
  const { translate, profile, user } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('settings');
  }, []);

  if (user === null || !profile) {
    return <LoginForm />;
  }

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Container component="main">
      <Meta title={translate('notifications')} noIndex />

      <UserBreadcrumb user={profile} title={translate('notifications')} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NotificationSettings />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
