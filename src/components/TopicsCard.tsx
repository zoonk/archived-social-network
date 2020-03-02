import { useContext } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';
import CategoryCardHeader from './CategoryCardHeader';
import TopicList from './TopicList';

interface TopicsCardProps {
  allowAdd?: boolean;
  allowLoadMore?: boolean;
  createdById?: string;
  hideHeader?: boolean;
  hideLink?: boolean;
  limit?: number;
}

/**
 * Cards containing a small list of topics.
 */
const TopicsCard = ({
  allowAdd,
  allowLoadMore,
  createdById,
  hideHeader,
  hideLink,
  limit = 3,
}: TopicsCardProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        {!hideHeader && (
          <CategoryCardHeader
            canAdd={allowAdd}
            category="topics"
            hideLink={hideLink}
            title={translate('topics')}
          />
        )}
        <TopicList
          allowLoadMore={allowLoadMore}
          createdById={createdById}
          limit={limit}
        />
      </CardContent>
    </Card>
  );
};

export default TopicsCard;
