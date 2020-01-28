import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { Path } from '@zoonk/models';

interface PathListItemProps {
  divider?: boolean;
  item: Path.Get;
}

/**
 * Display a single learning path as a list item.
 * @property `divider` - enable a divider line between items.
 * @property `item` - learning path data.
 */
const PathListItem = ({ divider, item }: PathListItemProps) => {
  const { description, id, photo, title } = item;

  return (
    <NextLink href="/paths/[id]" as={`/paths/${id}`} passHref>
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

export default PathListItem;
