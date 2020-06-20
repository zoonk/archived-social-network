import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Avatar, Container, Typography } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';
import { rootUrl, theme } from '@zoonk/utils';

const SignUpForm = dynamic(() => import('@zoonk/components/SignUpForm'), {
  ssr: false,
});

const SignUp: NextPage = () => {
  const translate = useTranslation();

  return (
    <Container component="main" maxWidth="xs">
      <Meta
        title={translate('signup')}
        description={translate('seo_signup_desc')}
        canonicalUrl={`${rootUrl}/signup`}
      />

      <HomeBreadcrumb title={translate('signup')} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: theme.spacing(8),
        }}
      >
        <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
          <LockOutlined />
        </Avatar>

        <Typography component="h2" variant="h5">
          {translate('signup')}
        </Typography>

        <SignUpForm />
      </div>
    </Container>
  );
};

export default SignUp;
