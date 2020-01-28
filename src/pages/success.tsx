import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { Button, Container, Typography } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import { analytics, appLanguage, GlobalContext, theme } from '@zoonk/utils';

const Success: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('success');
  }, []);

  useEffect(() => {
    analytics().logEvent('purchase', {
      transaction_id: '',
      items: [{ location_id: appLanguage, name: 'premium' }],
    });
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Meta title={translate('confirmation')} noIndex />
      <HomeBreadcrumb title={translate('confirmation')} />
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

export default Success;
