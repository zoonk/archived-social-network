import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { Group } from '@zoonk/models';

interface GroupListItemProps {
  divider?: boolean;
  item: Group.Get;
}

const GroupListItem = ({ divider, item }: GroupListItemProps) => {
  const { description, id, photo, title } = item;

  return (
    <NextLink href="/groups/[id]" as={`/groups/${id}`} passHref>
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

export default GroupListItem;
