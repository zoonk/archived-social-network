import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Group } from '@zoonk/models';
import ItemActionsMenu from './ItemActionsMenu';
import useTranslation from './useTranslation';

const FollowButton = dynamic(() => import('./FollowButton'), { ssr: false });

interface GroupDetailsProps {
  group: Group.Get;
}

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    margin: theme.spacing(1, 0),
    '& > *': {
      marginRight: theme.spacing(0.5),
    },
  },
}));

const GroupDetails = ({ group }: GroupDetailsProps) => {
  const translate = useTranslation();
  const classes = useStyles();
  const { description, id, photo, title } = group;

  return (
    <Card variant="outlined">
      {photo && (
        <CardMedia style={{ height: 250 }} image={photo} title={title} />
      )}

      <CardContent>
        <div className={classes.header}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <ItemActionsMenu />
        </div>
        <div className={classes.actions}>
          <FollowButton category="groups" categoryId={id} />
          <NextLink
            href="/groups/[id]/members"
            as={`/groups/${id}/members`}
            passHref
          >
            <Button component="a" color="primary">
              {translate('members')}
            </Button>
          </NextLink>
        </div>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GroupDetails;
