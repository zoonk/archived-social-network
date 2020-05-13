import {
  Card,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Group } from '@zoonk/models';
import GroupJoin from './GroupJoin';
import ItemActionsMenu from './ItemActionsMenu';

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
  },
}));

const GroupDetails = ({ group }: GroupDetailsProps) => {
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
        <GroupJoin groupId={id} className={classes.actions} />
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GroupDetails;
