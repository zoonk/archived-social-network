import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { Leaderboard } from '@zoonk/models';

interface LeaderboardListItemProps {
  divider?: boolean;
  item: Leaderboard.Get;
}

/**
 * Display a leaderboard in a list format.
 * @property `divider` - display a divider line between items.
 * @property `item` - leaderboard data.
 */
const LeaderboardListItem = ({ divider, item }: LeaderboardListItemProps) => {
  const { name, photo, username, xp } = item;

  return (
    <NextLink href="/profile/[id]" as={`/profile/${username}`} passHref>
      <ListItem
        alignItems="flex-start"
        button
        component="a"
        divider={divider}
        disableGutters
      >
        <ListItemAvatar>
          <Avatar src={photo || undefined} alt={name} />
        </ListItemAvatar>

        <ListItemText
          primary={name}
          secondary={`${xp} XP`}
          secondaryTypographyProps={{ color: 'primary' }}
        />
      </ListItem>
    </NextLink>
  );
};

export default LeaderboardListItem;
