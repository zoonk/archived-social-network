import { Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, CircularProgress } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { listPosts } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import NoPosts from './NoPosts';
import PostList from './PostList';
import useLoadMore from './useLoadMore';
import useTranslation from './useTranslation';

const CategoryFilter = dynamic(() => import('./CategoryFilter'));

type Filter = Post.Category | 'timeline';

interface PostsCardProps {
  category?: Post.Category[];
  displayFilter?: boolean;
  groupId?: string;
  limit?: number;
  topicId?: string;
  userId?: string;
}

const PostsCard = ({
  category,
  displayFilter,
  groupId,
  limit,
  topicId,
  userId,
}: PostsCardProps) => {
  const translate = useTranslation();
  const [filter, setFilter] = useState<Filter>(category?.[0] || 'timeline');
  const { get, items, lastVisible, loading } = useLoadMore<Post.Snapshot>(
    limit,
  );
  const listSlug = filter === 'timeline' ? undefined : filter;

  // useEffect doesn't compare arrays, so we need to stringify it.
  const rawCategory = category ? JSON.stringify(category) : undefined;

  const loadMore = () => {
    get({
      data: listPosts({
        category: listSlug && displayFilter ? [listSlug] : category,
        groupId,
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
        groupId,
        limit,
        topicId,
        userId,
      }),
      replace: true,
    });
  }, [
    displayFilter,
    get,
    groupId,
    limit,
    listSlug,
    rawCategory,
    topicId,
    userId,
  ]);

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
          category={groupId ? 'groups' : 'topics'}
          postCategory={filter === 'timeline' ? 'references' : filter}
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
    </Fragment>
  );
};

export default PostsCard;
