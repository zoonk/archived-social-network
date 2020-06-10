import { Fragment, useContext } from 'react';
import { NextPage } from 'next';
import { CircularProgress } from '@material-ui/core';
import AlreadyLoggedin from '@zoonk/components/AlreadyLoggedin';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import useAuth from '@zoonk/components/useAuth';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const Login: NextPage = () => {
  const { translate } = useContext(GlobalContext);
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
      <LoginForm />
    </Fragment>
  );
};

export default Login;
