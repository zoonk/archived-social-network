import { useContext, useEffect, useState } from 'react';
import { Button, Card, CardContent } from '@material-ui/core';
import { Post, SnackbarAction } from '@zoonk/models';
import { listPosts } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import CategoryCardHeader from './CategoryCardHeader';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import PostList from './PostList';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface PostsCardProps {
  allowAdd?: boolean;
  allowLoadMore?: boolean;
  category?: Post.Category;
  chapterId?: string;
  hideLink?: boolean;
  limit?: number;
  orderBy?: Post.OrderBy[];
  title: string;
  topicId?: string;
  userId?: string;
}

/**
 * Cards for display a list of posts.
 */
const PostsCard = ({
  allowAdd,
  allowLoadMore,
  category,
  chapterId,
  hideLink,
  limit,
  orderBy,
  title,
  topicId,
  userId,
}: PostsCardProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Post.Snapshot
  >(limit);
  const query = { category, chapterId, order: items.length + 1, topicId };
  const canAdd = allowAdd || Boolean(chapterId);

  const loadMore = () => {
    get(
      listPosts({
        category,
        chapterId,
        lastVisible,
        limit,
        orderBy,
        topicId,
        userId,
      }),
    );
  };

  useEffect(() => {
    get(
      listPosts({
        category,
        chapterId,
        limit,
        orderBy,
        topicId,
        userId,
      }),
    );
  }, [category, chapterId, get, limit, orderBy, topicId, userId]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'post_list'));
    }
  }, [error]);

  return (
    <Card variant="outlined">
      <CardContent style={{ paddingBottom: 0 }}>
        <CategoryCardHeader
          canAdd={canAdd}
          hideLink={hideLink}
          query={query}
          category="posts"
          list={category}
          title={title}
        />

        {items.length === 0 && loading === false && <NoItems />}
        {items.length > 0 && <PostList items={items} />}
        {loading && <ListSkeleton items={limit} />}

        {allowLoadMore && lastVisible && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={loadMore}
            style={{ margin: theme.spacing(3, 0, 2) }}
          >
            {translate('load_more')}
          </Button>
        )}

        <Snackbar action={snackbar} />
      </CardContent>
    </Card>
  );
};

export default PostsCard;
