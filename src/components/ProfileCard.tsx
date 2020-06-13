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
import { theme } from '@zoonk/utils';
import ProfileSocial from './ProfileSocial';
import UserReputation from './UserReputation';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

interface ProfileCardProps {
  data: Leaderboard.Get;
}

const ProfileCard = ({ data }: ProfileCardProps) => {
  const translate = useTranslation();
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
