import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { Post } from '@zoonk/models';
import { getPostImage } from '@zoonk/utils';

interface PostListItemProps {
  divider?: boolean;
  item: Post.Get;
}

/**
 * Display a single post as a list item.
 */
const PostListItem = ({ divider, item }: PostListItemProps) => {
  const { chapter, content, createdBy, path, title } = item;
  const image =
    getPostImage(content) || chapter?.photo || path?.photo || createdBy?.photo;

  return (
    <NextLink href="/posts/[id]" as={`/posts/${item.id}`} passHref>
      <ListItem
        alignItems="flex-start"
        button
        component="a"
        divider={divider}
        disableGutters
      >
        <ListItemAvatar>
          <Avatar src={image || undefined} />
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={content.slice(0, 200)}
          secondaryTypographyProps={{
            gutterBottom: false,
            noWrap: true,
          }}
        />
      </ListItem>
    </NextLink>
  );
};

export default PostListItem;
