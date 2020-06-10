import { useContext } from 'react';
import NextLink from 'next/link';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';
import { Leaderboard } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';
import ProfileSocial from './ProfileSocial';
import UserReputation from './UserReputation';
import useAuth from './useAuth';

interface ProfileCardProps {
  data: Leaderboard.Get;
}

/**
 * Card for displaying a user's profile.
 */
const ProfileCard = ({ data }: ProfileCardProps) => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();
  const { bio, id, name, photo, xp } = data;

  return (
    <Card variant="outlined">
      {photo && (
        <CardMedia style={{ height: 250 }} image={photo} title={name} />
      )}

      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h5"
            component="h2"
            style={{ marginRight: theme.spacing(1) }}
          >
            {name}
          </Typography>
          <UserReputation xp={xp} />
        </div>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          {bio}
        </Typography>

        <ProfileSocial data={data} />
      </CardContent>

      {user?.uid === id && (
        <CardActions>
          <NextLink href="/settings" passHref>
            <Button component="a" size="small" color="primary">
              {translate('edit_profile')}
            </Button>
          </NextLink>
        </CardActions>
      )}
    </Card>
  );
};

export default ProfileCard;
