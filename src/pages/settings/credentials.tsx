import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { CircularProgress, Container, Grid } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import useAuth from '@zoonk/components/useAuth';
import useTranslation from '@zoonk/components/useTranslation';

const CredentialsUpdate = dynamic(
  () => import('@zoonk/components/CredentialsUpdate'),
  { ssr: false },
);

const LoginForm = dynamic(() => import('@zoonk/components/LoginForm'), {
  ssr: false,
});

const Settings: NextPage = () => {
  const translate = useTranslation();
  const { profile, user } = useAuth();

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
