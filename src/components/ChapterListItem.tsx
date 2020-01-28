import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { Chapter } from '@zoonk/models';

interface ChapterListItemProps {
  divider?: boolean;
  item: Chapter.Get;
}

/**
 * Display a single chapter as a list item.
 * @property `divider` - enable a divider line between items.
 * @property `item` - item data.
 */
const ChapterListItem = ({ divider, item }: ChapterListItemProps) => {
  const { description, photo, title } = item;

  return (
    <NextLink href="/chapters/[id]" as={`/chapters/${item.id}`} passHref>
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

export default ChapterListItem;
