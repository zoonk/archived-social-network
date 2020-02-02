import { useContext } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';
import CategoryCardHeader from './CategoryCardHeader';
import PathsList from './PathsList';

interface PathsCardProps {
  allowAdd?: boolean;
  allowLoadMore?: boolean;
  createdById?: string;
  hideLink?: boolean;
  limit?: number;
  topicId?: string;
}

/**
 * Cards containing a small list of learning paths.
 */
const PathsCard = ({
  allowAdd,
  allowLoadMore,
  createdById,
  hideLink,
  limit = 3,
  topicId,
}: PathsCardProps) => {
  const { translate } = useContext(GlobalContext);
  const query = { topicId };
  const canAdd = allowAdd || topicId;

  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <CategoryCardHeader
          canAdd={Boolean(canAdd)}
          hideLink={hideLink}
          query={query}
          category="paths"
          title={translate('learningPaths')}
        />
        <PathsList
          allowLoadMore={allowLoadMore}
          createdById={createdById}
          topicId={topicId}
          limit={limit}
        />
      </CardContent>
    </Card>
  );
};

export default PathsCard;
