import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Card, CardContent } from '@material-ui/core';
import { Post, SnackbarAction } from '@zoonk/models';
import { listPosts } from '@zoonk/services';
import {
  firebaseError,
  GlobalContext,
  removeTrailingSlash,
  theme,
} from '@zoonk/utils';
import CategoryCardHeader from './CategoryCardHeader';
import ListSkeleton from './ListSkeleton';
import NoPosts from './NoPosts';
import PostList from './PostList';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface PostsCardProps {
  allowAdd?: boolean;
  allowLoadMore?: boolean;
  category?: Post.Category[];
  chapterId?: string;
  hideLink?: boolean;
  limit?: number;
  list?: Post.Category;
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
  list,
  orderBy,
  title,
  topicId,
  userId,
}: PostsCardProps) => {
  const { translate } = useContext(GlobalContext);
  const { asPath, pathname } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Post.Snapshot
  >(limit);
  const query = { category: list || category?.[0], chapterId, topicId };
  const canAdd = allowAdd || Boolean(chapterId);
  const href = removeTrailingSlash(pathname) || '';
  const as = removeTrailingSlash(asPath) || '';
  const listSlug = list || category;

  /**
   * React runs a shallow comparison only, so we're converting
   * these arrays into strings to make sure our effect isn't called
   * multiple times.
   */
  const rawCategory = JSON.stringify(category) as string | undefined;
  const rawOrderBy = JSON.stringify(orderBy) as string | undefined;

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
        category: rawCategory ? JSON.parse(rawCategory) : undefined,
        chapterId,
        limit,
        orderBy: rawOrderBy ? JSON.parse(rawOrderBy) : undefined,
        topicId,
        userId,
      }),
    );
  }, [rawCategory, chapterId, get, limit, rawOrderBy, topicId, userId]);

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
          list={list || category?.[0]}
          title={title}
        />

        {items.length === 0 && loading === false && (
          <NoPosts category={category?.[0]} isUser={Boolean(userId)} />
        )}
        {items.length > 0 && <PostList items={items} />}
        {loading && <ListSkeleton items={limit} />}

        {!hideLink && !allowLoadMore && (
          <NextLink
            href={`${href}/${listSlug}`}
            as={`${as}/${listSlug}`}
            passHref
          >
            <Button
              color="primary"
              component="a"
              style={{ margin: theme.spacing(2, 0) }}
            >
              {translate('see_all')}
            </Button>
          </NextLink>
        )}

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
