import { Fragment } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@material-ui/core';
import AlreadyLoggedin from '@zoonk/components/AlreadyLoggedin';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useAuth from '@zoonk/components/useAuth';
import useTranslation from '@zoonk/components/useTranslation';
import { rootUrl } from '@zoonk/utils';

const LoginForm = dynamic(() => import('@zoonk/components/LoginForm'), {
  ssr: false,
});

const Login: NextPage = () => {
  const translate = useTranslation();
  const { user } = useAuth();

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user) {
    return <AlreadyLoggedin />;
  }

  return (
    <Fragment>
      <Meta
        title={translate('login')}
        description={translate('seo_login_desc')}
        canonicalUrl={`${rootUrl}/login`}
      />
      <HomeBreadcrumb title={translate('login')} />
      <LoginForm />
    </Fragment>
  );
};

export default Login;
