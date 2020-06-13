import NextLink from 'next/link';
import { Link, Paper, makeStyles, Typography } from '@material-ui/core';
import useTranslation from './useTranslation';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2) },
}));

const NoFollowing = () => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.root}>
      <Typography variant="body1" color="textSecondary">
        {translate('following_empty')}{' '}
        <NextLink href="/topics" passHref>
          <Link>{translate('following_find')}</Link>
        </NextLink>
      </Typography>
    </Paper>
  );
};

export default NoFollowing;
