import { useContext, useEffect, useState } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { Post, SnackbarAction } from '@zoonk/models';
import { listPosts } from '@zoonk/services';
import { firebaseError, GlobalContext, maxLessons } from '@zoonk/utils';
import CategoryCardHeader from './CategoryCardHeader';
import LessonList from './LessonList';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface LessonsCardProps {
  chapterId?: string;
}

/**
 * Cards for display a list of lessons.
 */
const LessonsCard = ({ chapterId }: LessonsCardProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, loading } = useLoadMore<Post.Snapshot>(maxLessons);
  const query = {
    category: 'lessons',
    chapterId,
    order: items.length + 1,
  };

  useEffect(() => {
    get(
      listPosts({
        category: 'lessons',
        chapterId,
        limit: maxLessons,
      }),
    );
  }, [chapterId, get]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'lessons_list'));
    }
  }, [error]);

  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <CategoryCardHeader
          canAdd
          edit="lessons"
          hideLink
          query={query}
          category="posts"
          list="lessons"
          title={translate('lessons')}
        />

        {items.length === 0 && loading === false && <NoItems />}
        {items.length > 0 && <LessonList items={items} />}
        {loading && <ListSkeleton items={maxLessons} />}
        <Snackbar action={snackbar} />
      </CardContent>
    </Card>
  );
};

export default LessonsCard;
