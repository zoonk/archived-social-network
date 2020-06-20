import { Activity } from '@zoonk/models';
import { getActivitiesSnapshot } from '@zoonk/services';
import LoadMore from './LoadMore';

interface EditsLoadMoreProps {
  itemPath?: string;
  lastItem: string | firebase.firestore.DocumentSnapshot;
  length: number;
  limit: number;
  onLoadMore: (edits: Activity.Get[]) => void;
}

const EditsLoadMore = ({
  itemPath,
  lastItem,
  length,
  limit,
  onLoadMore,
}: EditsLoadMoreProps) => {
  const lastPath =
    typeof lastItem === 'string' ? `activity/${lastItem}` : lastItem;

  return (
    <LoadMore<Activity.Snapshot>
      lastPath={lastPath}
      length={length}
      limit={limit}
      onLoadMore={onLoadMore}
      request={(last) => getActivitiesSnapshot(limit, last, itemPath)}
    />
  );
};

export default EditsLoadMore;
