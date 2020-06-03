import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container, Grid } from '@material-ui/core';
import CredentialsUpdate from '@zoonk/components/CredentialsUpdate';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import { analytics, GlobalContext } from '@zoonk/utils';

const Settings: NextPage = () => {
  const { translate, profile, user } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('settings');
  }, []);

  if (user === null) {
    return <LoginForm />;
  }

  if (user === undefined || !profile) {
    return <CircularProgress />;
  }

  return (
    <Container component="main">
      <Meta title={translate('settings')} noIndex />

      <UserBreadcrumb user={profile} title={translate('settings')} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CredentialsUpdate />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
