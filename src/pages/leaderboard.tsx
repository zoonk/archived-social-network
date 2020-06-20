import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { CircularProgress, Container } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';

const LeaderboardList = dynamic(
  () => import('@zoonk/components/LeaderboardList'),
  { loading: () => <CircularProgress />, ssr: false },
);

const Leaderboard: NextPage = () => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta title={translate('leaderboard')} noIndex />
      <HomeBreadcrumb title={translate('leaderboard')} />
      <LeaderboardList limit={10} />
    </Container>
  );
};

export default Leaderboard;
