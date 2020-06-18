import NextLink from 'next/link';
import { Button, makeStyles, Paper, Typography } from '@material-ui/core';
import useTranslation from './useTranslation';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2), marginBottom: theme.spacing(2) },
}));

const EditorDisabled = () => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.root}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {translate('editor_android')}
      </Typography>
      <NextLink href="/contact" passHref>
        <Button component="a" variant="outlined" color="primary">
          {translate('contact_us')}
        </Button>
      </NextLink>
    </Paper>
  );
};

export default EditorDisabled;
