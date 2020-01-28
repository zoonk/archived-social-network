import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container, Typography } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import Pricing from '@zoonk/components/Pricing';
import { analytics, GlobalContext } from '@zoonk/utils';

const Upgrade: NextPage = () => {
  const { translate, user } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('upgrade');
  }, []);

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user === null) {
    return <LoginForm />;
  }

  return (
    <Container component="main" maxWidth="md">
      <Meta title={translate('upgrade_premium')} noIndex>
        {typeof Stripe === 'undefined' && (
          <script async src="https://js.stripe.com/v3" />
        )}
      </Meta>
      <HomeBreadcrumb title={translate('upgrade_premium')} />
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        {translate('upgrade_title')}
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        component="p"
        gutterBottom
      >
        {translate('upgrade_desc')}
      </Typography>
      <Pricing />
    </Container>
  );
};

export default Upgrade;
