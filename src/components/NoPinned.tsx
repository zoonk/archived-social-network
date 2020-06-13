import NextLink from 'next/link';
import { Button, makeStyles, Typography } from '@material-ui/core';
import useTranslation from './useTranslation';

interface NoPinnedProps {
  groupId: string;
}

const useStyles = makeStyles((theme) => ({
  root: { marginTop: theme.spacing(2) },
}));

const NoPinned = ({ groupId }: NoPinnedProps) => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="body1">
        {translate('post_pinned_desc')}
      </Typography>
      <NextLink href={`/posts/add?groupId=${groupId}&pinned=true`} passHref>
        <Button variant="outlined" color="primary" component="a">
          {translate('post_pinned_add')}
        </Button>
      </NextLink>
    </div>
  );
};

export default NoPinned;
