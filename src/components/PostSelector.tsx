import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Post, SnackbarAction } from '@zoonk/models';
import { firebaseError, GlobalContext, timestamp } from '@zoonk/utils';
import { addPostToChapter } from '@zoonk/services';
import Snackbar from './Snackbar';

interface PostSelectorProps {
  posts: ReadonlyArray<Post.Index>;
}

/**
 * Post list with an option to add it to the current chapter.
 */
const PostSelector = ({ posts }: PostSelectorProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { query, push } = useRouter();
  const topicId = String(query.id);
  const chapterId = String(query.chapterId);
  const category = String(query.category) as Post.Category;

  if (posts.length === 0 || !profile || !user) {
    return null;
  }

  const add = (id: string) => {
    setSnackbar({ type: 'progress', msg: translate('post_adding') });
    const metadata = {
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    };

    addPostToChapter(id, chapterId, category, metadata)
      .then(() =>
        push(
          `/topics/[topicId]/chapters/[chapterId]/${category}`,
          `/topics/${topicId}/chapters/${chapterId}/${category}`,
        ),
      )
      .catch((e) => setSnackbar(firebaseError(e, 'add_existing_post')));
  };

  return (
    <Card variant="outlined">
      <CardHeader
        title={translate('post_select_title')}
        subheader={translate('post_select_desc')}
      />
      <List>
        {posts.map((post, index) => (
          <ListItem key={post.objectID} divider={posts.length > index + 1}>
            <ListItemText primary={post.title} style={{ maxWidth: '75%' }} />
            <ListItemSecondaryAction>
              <NextLink
                href="/posts/[id]"
                as={`/posts/${post.objectID}`}
                passHref
              >
                <Button
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  {translate('view')}
                </Button>
              </NextLink>
              <Button color="secondary" onClick={() => add(post.objectID)}>
                {translate('add')}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Snackbar action={snackbar} />
    </Card>
  );
};

export default PostSelector;
