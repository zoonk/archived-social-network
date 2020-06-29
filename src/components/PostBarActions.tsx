import NextLink from 'next/link';
import { Button, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import LikeButton from './LikeButton';
import useTranslation from './useTranslation';

interface PostBarActionsProps {
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
}));

const PostBarActions = ({ id, likes }: PostBarActionsProps) => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LikeButton likes={likes} itemPath={`posts/${id}`} />
      <NextLink href="/posts/[id]/edit" as={`/posts/${id}/edit`} passHref>
        <Button
          color="primary"
          variant="outlined"
          component="a"
          aria-label={translate('edit')}
          title={translate('edit')}
        >
          <Edit />
        </Button>
      </NextLink>
    </div>
  );
};

export default PostBarActions;
