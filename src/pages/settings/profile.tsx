import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container, Grid } from '@material-ui/core';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import SocialMediaUpdate from '@zoonk/components/SocialMediaUpdate';
import ProfileUpdate from '@zoonk/components/ProfileUpdate';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import UsernameUpdate from '@zoonk/components/UsernameUpdate';
import useAuth from '@zoonk/components/useAuth';
import { analytics, GlobalContext, theme } from '@zoonk/utils';

const Settings: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();

  useEffect(() => {
    analytics().setCurrentScreen('settings_profile');
  }, []);

  if (user === null) {
    return <LoginForm />;
  }

  if (user === undefined || !profile) {
    return <CircularProgress />;
  }

  return (
    <Container component="main">
      <Meta title={translate('edit_profile')} noIndex />

      <UserBreadcrumb user={profile} title={translate('edit_profile')} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ProfileUpdate />
          <div style={{ marginTop: theme.spacing(2) }} />
          <UsernameUpdate />
        </Grid>

        <Grid item xs={12} sm={6}>
          <SocialMediaUpdate />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
