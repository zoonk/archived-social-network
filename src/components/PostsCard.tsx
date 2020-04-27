import { Fragment, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, CircularProgress } from '@material-ui/core';
import { Post, SnackbarAction } from '@zoonk/models';
import { listPosts } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import NoPosts from './NoPosts';
import PostList from './PostList';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

const CategoryFilter = dynamic(() => import('./CategoryFilter'));

type Filter = Post.Category | 'timeline';

interface PostsCardProps {
  category?: Post.Category[];
  displayFilter?: boolean;
  limit?: number;
  topicId?: string;
  userId?: string;
}

/**
 * Cards for display a list of posts.
 */
const PostsCard = ({
  category,
  displayFilter,
  limit,
  topicId,
  userId,
}: PostsCardProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [filter, setFilter] = useState<Filter>(category?.[0] || 'timeline');
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Post.Snapshot
  >(limit);
  const listSlug = filter === 'timeline' ? undefined : filter;

  // useEffect doesn't compare arrays, so we need to stringify it.
  const rawCategory = category ? JSON.stringify(category) : undefined;

  const loadMore = () => {
    get({
      data: listPosts({
        category: listSlug && displayFilter ? [listSlug] : category,
        lastVisible,
        limit,
        topicId,
        userId,
      }),
    });
  };

  useEffect(() => {
    const categories: Post.Category[] = rawCategory
      ? JSON.parse(rawCategory)
      : undefined;

    get({
      data: listPosts({
        category: listSlug && displayFilter ? [listSlug] : categories,
        limit,
        topicId,
        userId,
      }),
      replace: true,
    });
  }, [displayFilter, get, limit, listSlug, rawCategory, topicId, userId]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'post_list'));
    }
  }, [error]);

  return (
    <Fragment>
      {displayFilter && (
        <CategoryFilter
          filterBy={filter}
          onSelect={(_, newFilter) => setFilter(newFilter)}
        />
      )}
      {items.length === 0 && loading === false && (
        <NoPosts
          category={filter === 'timeline' ? 'references' : filter}
          isUser={Boolean(userId)}
        />
      )}
      {items.length > 0 && <PostList items={items} />}
      {loading && <CircularProgress />}
      {lastVisible && (
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
    </Fragment>
  );
};

export default PostsCard;
