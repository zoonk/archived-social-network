import { useContext } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';
import CategoryCardHeader from './CategoryCardHeader';
import TopicList from './TopicList';

interface TopicsCardProps {
  allowAdd?: boolean;
  createdById?: string;
}

/**
 * Cards containing a small list of topics.
 */
const TopicsCard = ({ allowAdd, createdById }: TopicsCardProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <CategoryCardHeader
          canAdd={allowAdd}
          category="topics"
          title={translate('topics')}
        />
        <TopicList createdById={createdById} limit={3} />
      </CardContent>
    </Card>
  );
};

export default TopicsCard;
