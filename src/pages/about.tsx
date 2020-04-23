import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container, Typography } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import { analytics, appLanguage, GlobalContext, theme } from '@zoonk/utils';

const English = dynamic(() => import('../components/About/en'));
const Portuguese = dynamic(() => import('../components/About/pt'));

const About: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('about');
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Meta title={translate('about_us')} />
      <HomeBreadcrumb title={translate('about_us')} />
      <div style={{ margin: theme.spacing(5, 0) }}>
        <Typography
          component="h1"
          variant="h2"
          color="textPrimary"
          gutterBottom
        >
          {translate('about_us')}
        </Typography>

        {appLanguage === 'en' && <English />}
        {appLanguage === 'pt' && <Portuguese />}
      </div>
    </Container>
  );
};

export default About;
