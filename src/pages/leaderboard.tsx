import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import CategoryTabs from '@zoonk/components/CategoryTabs';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import LeaderboardList from '@zoonk/components/LeaderboardList';
import Meta from '@zoonk/components/Meta';
import { analytics, GlobalContext, theme } from '@zoonk/utils';

const Leaderboard: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('leaderboard');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('leaderboard')} noIndex />
      <HomeBreadcrumb title={translate('leaderboard')} />
      <CategoryTabs active="leaderboard" />
      <div style={{ margin: theme.spacing(1) }} />
      <LeaderboardList allowLoadMore limit={10} />
    </Container>
  );
};

export default Leaderboard;
