import { useContext } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@material-ui/core';
import { Profile } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

interface ItemCreditsProps {
  createdAt: string;
  createdBy?: Profile.Response;
  createdById?: string;
  updatedAt?: string;
  updatedBy?: Profile.Response;
  updatedById?: string;
}

/**
 * Display credits for an item (who created and updated it).
 * @property `createdAt` - when this item was created.
 * @property `createdBy` - who created this item.
 * @property `createdById` - the author's UID.
 * @property `updatedAt` - when this item was updated.
 * @property `updatedBy` - who updated this item.
 * @property `updatedById` - the editor's UID.
 */
const ItemCredits = ({
  createdAt,
  createdBy,
  updatedAt,
  updatedBy,
}: ItemCreditsProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper variant="outlined">
      <List disablePadding>
        <NextLink
          href="/profile/[id]"
          as={`/profile/${createdBy?.username}`}
          passHref
        >
          <ListItem alignItems="flex-start" button component="a">
            <ListItemAvatar>
              <Avatar
                src={createdBy?.photo || undefined}
                alt={createdBy?.name}
              />
            </ListItemAvatar>
            <ListItemText
              primary={createdBy?.name}
              secondary={translate('created_on', { date: createdAt })}
            />
          </ListItem>
        </NextLink>

        {updatedAt && (
          <NextLink
            href="/profile/[id]"
            as={`/profile/${updatedBy?.username}`}
            passHref
          >
            <ListItem button component="a">
              <ListItemAvatar>
                <Avatar
                  src={updatedBy?.photo || undefined}
                  alt={updatedBy?.name}
                />
              </ListItemAvatar>
              <ListItemText
                primary={updatedBy?.name}
                secondary={translate('edited_on', { date: updatedAt })}
              />
            </ListItem>
          </NextLink>
        )}
      </List>
    </Paper>
  );
};

export default ItemCredits;
