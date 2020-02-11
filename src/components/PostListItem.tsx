import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { Post } from '@zoonk/models';
import { theme } from '@zoonk/utils';

interface PostListItemProps {
  category?: Post.Category;
  divider?: boolean;
  index: number;
  item: Post.Get;
}

/**
 * Display a single post as a list item.
 */
const PostListItem = ({
  category,
  divider,
  index,
  item,
}: PostListItemProps) => {
  const { content, createdBy, title } = item;

  return (
    <NextLink href="/posts/[id]" as={`/posts/${item.id}`} passHref>
      <ListItem
        alignItems="flex-start"
        button
        component="a"
        divider={divider}
        disableGutters
      >
        {category !== 'lessons' && (
          <ListItemAvatar>
            <Avatar src={createdBy.photo || undefined} />
          </ListItemAvatar>
        )}

        {category === 'lessons' && (
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
              {index + 1}
            </Avatar>
          </ListItemAvatar>
        )}

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
