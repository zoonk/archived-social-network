import { useContext } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';
import CategoryCardHeader from './CategoryCardHeader';
import LeaderboardList from './LeaderboardList';

interface ExamplesCardProps {
  limit?: number;
  topicId?: string;
}

/**
 * Small leaderboard card.
 * @property `limit` - number of users to display.
 * @property `topicId` - filter by topic.
 */
const LeaderboardCard = ({ limit = 5, topicId }: ExamplesCardProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <CategoryCardHeader
          canAdd={false}
          category="leaderboard"
          title={translate('leaderboard')}
        />
        <LeaderboardList topicId={topicId} limit={limit} />
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
