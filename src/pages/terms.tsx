import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container, Typography } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';
import { appLanguage, theme } from '@zoonk/utils';

const English = dynamic(() => import('../components/Terms/en'));
const Portuguese = dynamic(() => import('../components/Terms/pt'));

const Privacy: NextPage = () => {
  const translate = useTranslation();

  return (
    <Container component="main" maxWidth="sm">
      <Meta title={translate('terms_service')} />
      <HomeBreadcrumb title={translate('terms_service')} />
      <div style={{ margin: theme.spacing(5, 0) }}>
        <Typography
          component="h1"
          variant="h2"
          color="textPrimary"
          gutterBottom
        >
          {translate('terms_service')}
        </Typography>

        {appLanguage === 'en' && <English />}
        {appLanguage === 'pt' && <Portuguese />}
      </div>
    </Container>
  );
};

export default Privacy;
