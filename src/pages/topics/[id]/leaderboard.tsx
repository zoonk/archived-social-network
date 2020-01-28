import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import LeaderboardList from '@zoonk/components/LeaderboardList';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import { analytics, GlobalContext } from '@zoonk/utils';

const TopicLeaderboard: NextPage = () => {
  const { query } = useRouter();
  const { translate } = useContext(GlobalContext);
  const id = String(query.id);

  useEffect(() => {
    analytics().setCurrentScreen('topic_leaderboard');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('leaderboard')} noIndex />
      <TopicsBreadcrumb topicId={id} title={translate('leaderboard')} />
      {query.id && <LeaderboardList allowLoadMore limit={10} topicId={id} />}
    </Container>
  );
};

export default TopicLeaderboard;
