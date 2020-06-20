import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Avatar, Container, Typography } from '@material-ui/core';
import { MailOutline } from '@material-ui/icons';
import AlreadyLoggedin from '@zoonk/components/AlreadyLoggedin';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useAuth from '@zoonk/components/useAuth';
import useTranslation from '@zoonk/components/useTranslation';
import { rootUrl, theme } from '@zoonk/utils';

const ResetForm = dynamic(() => import('@zoonk/components/ResetForm'), {
  ssr: false,
});

const ResetPassword: NextPage = () => {
  const translate = useTranslation();
  const { user } = useAuth();

  if (user === undefined) {
    return null;
  }

  if (user) {
    return <AlreadyLoggedin />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Meta
        title={translate('reset_password')}
        description={translate('seo_reset_password_desc')}
        canonicalUrl={`${rootUrl}/reset-password`}
      />

      <HomeBreadcrumb title={translate('reset_password')} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: theme.spacing(8),
        }}
      >
        <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
          <MailOutline />
        </Avatar>

        <Typography component="h2" variant="h5">
          {translate('reset_password')}
        </Typography>

        <ResetForm />
      </div>
    </Container>
  );
};

export default ResetPassword;
