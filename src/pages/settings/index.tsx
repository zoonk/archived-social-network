import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { CircularProgress, Container, Grid } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import useAuth from '@zoonk/components/useAuth';
import useTranslation from '@zoonk/components/useTranslation';
import { rootUrl, theme } from '@zoonk/utils';

const CredentialsUpdate = dynamic(
  () => import('@zoonk/components/CredentialsUpdate'),
  { ssr: false },
);

const LoginForm = dynamic(() => import('@zoonk/components/LoginForm'), {
  ssr: false,
});

const NotificationSettings = dynamic(
  () => import('@zoonk/components/NotificationSettings'),
  { ssr: false },
);

const SocialMediaUpdate = dynamic(
  () => import('@zoonk/components/SocialMediaUpdate'),
  { ssr: false },
);

const ProfileUpdate = dynamic(() => import('@zoonk/components/ProfileUpdate'), {
  ssr: false,
});

const UsernameUpdate = dynamic(
  () => import('@zoonk/components/UsernameUpdate'),
  { ssr: false },
);

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
      <Meta
        title={translate('edit_profile')}
        description={translate('seo_settings_desc')}
        canonicalUrl={`${rootUrl}/settings`}
      />

      <UserBreadcrumb user={profile} title={translate('edit_profile')} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ProfileUpdate />
          <div style={{ marginTop: theme.spacing(2) }} />
          <SocialMediaUpdate />
        </Grid>

        <Grid item xs={12} sm={6}>
          <UsernameUpdate />
          <div style={{ marginTop: theme.spacing(2) }} />
          <CredentialsUpdate />
          <div style={{ marginTop: theme.spacing(2) }} />
          <NotificationSettings />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
