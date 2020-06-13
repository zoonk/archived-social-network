import NextLink from 'next/link';
import { Button, Hidden, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import LikeButton from './LikeButton';
import useTranslation from './useTranslation';

interface PostBarActionsProps {
  canEdit: boolean;
  id: string;
  likes: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  button: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(0.5),
    },
  },
}));

const PostBarActions = ({ canEdit, id, likes }: PostBarActionsProps) => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LikeButton likes={likes} itemPath={`posts/${id}`} />
      {canEdit && (
        <NextLink href="/posts/[id]/edit" as={`/posts/${id}/edit`} passHref>
          <Button color="primary" variant="outlined" component="a">
            <Edit className={classes.button} />
            <Hidden xsDown>{translate('edit')}</Hidden>
          </Button>
        </NextLink>
      )}
    </div>
  );
};

export default PostBarActions;
