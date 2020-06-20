import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useAuth from '@zoonk/components/useAuth';
import useTranslation from '@zoonk/components/useTranslation';

const FeedbackList = dynamic(() => import('@zoonk/components/FeedbackList'), {
  loading: () => <CircularProgress />,
  ssr: false,
});
const ReportsList = dynamic(() => import('@zoonk/components/ReportsList'), {
  loading: () => <CircularProgress />,
  ssr: false,
});
const Stats = dynamic(() => import('@zoonk/components/Stats'), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const AdminPage = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { push } = useRouter();

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user === null || user.role !== 'admin') {
    push('/');
    return null;
  }

  return (
    <Container component="main">
      <Meta title={translate('admin')} noIndex />
      <HomeBreadcrumb title={translate('admin')} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            component="h1"
            variant="h2"
            color="textPrimary"
            gutterBottom
          >
            {translate('stats')}
          </Typography>
          <Stats />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            component="h1"
            variant="h2"
            color="textPrimary"
            gutterBottom
          >
            {translate('feedback')}
          </Typography>
          <FeedbackList />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography
            component="h1"
            variant="h2"
            color="textPrimary"
            gutterBottom
          >
            {translate('reports')}
          </Typography>
          <ReportsList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPage;
