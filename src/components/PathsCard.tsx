import { useContext } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';
import CategoryCardHeader from './CategoryCardHeader';
import PathsList from './PathsList';

interface PathsCardProps {
  allowAdd?: boolean;
  createdById?: string;
  topicId?: string;
}

/**
 * Cards containing a small list of learning paths.
 */
const PathsCard = ({ allowAdd, createdById, topicId }: PathsCardProps) => {
  const { translate } = useContext(GlobalContext);
  const query = { topicId };
  const canAdd = allowAdd || topicId;

  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <CategoryCardHeader
          canAdd={Boolean(canAdd)}
          query={query}
          category="paths"
          title={translate('learningPaths')}
        />
        <PathsList createdById={createdById} topicId={topicId} limit={3} />
      </CardContent>
    </Card>
  );
};

export default PathsCard;
