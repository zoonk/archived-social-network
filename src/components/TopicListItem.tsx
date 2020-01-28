import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { Topic } from '@zoonk/models';

interface TopicListItemProps {
  divider?: boolean;
  item: Topic.Get;
}

/**
 * Display a single topic as a list item.
 * @property `divider` - enable a divider line between items.
 * @property `item` - topic data.
 */
const TopicListItem = ({ divider, item }: TopicListItemProps) => {
  const { description, id, photo, title } = item;

  return (
    <NextLink href="/topics/[id]" as={`/topics/${id}`} passHref>
      <ListItem
        alignItems="flex-start"
        button
        component="a"
        divider={divider}
        disableGutters
      >
        <ListItemAvatar>
          <Avatar src={photo || undefined} alt={title} />
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={description}
          secondaryTypographyProps={{
            gutterBottom: false,
            noWrap: true,
          }}
        />
      </ListItem>
    </NextLink>
  );
};

export default TopicListItem;
