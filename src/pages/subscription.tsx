import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import { analytics, GlobalContext, theme } from '@zoonk/utils';

const Subscription: NextPage = () => {
  const { translate, user } = useContext(GlobalContext);
  const { push } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('subscription');
  }, []);

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user === null || user?.subscription === 'free') {
    push('/upgrade');
    return null;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Meta title={translate('subscription')} noIndex />
      <HomeBreadcrumb title={translate('subscription')} />
      <div style={{ marginTop: theme.spacing(5) }} />
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        {translate('subscribe_success_title')}
      </Typography>

      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        component="p"
        gutterBottom
      >
        {translate('subscribe_success_desc')}
      </Typography>

      <div style={{ textAlign: 'center', marginTop: theme.spacing(2) }}>
        <NextLink href="/contact" passHref>
          <Button component="a" variant="contained" color="primary">
            {translate('contact_us')}
          </Button>
        </NextLink>
      </div>
    </Container>
  );
};

export default Subscription;
