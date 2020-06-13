import NextLink from 'next/link';
import { Button, makeStyles } from '@material-ui/core';
import { History, ReportProblem } from '@material-ui/icons';
import useTranslation from './useTranslation';

interface PostFooterProps {
  id: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(5, 0),
    '& > *': {
      marginLeft: theme.spacing(0.5),
    },
  },
}));

const PostFooter = ({ id }: PostFooterProps) => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <NextLink href={`/contact?action=report&path=/posts/${id}`} passHref>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ReportProblem />}
          component="a"
        >
          {translate('report')}
        </Button>
      </NextLink>

      <NextLink href="/posts/[id]/edits" as={`/posts/${id}/edits`} passHref>
        <Button
          variant="outlined"
          color="primary"
          component="a"
          startIcon={<History />}
        >
          {translate('history')}
        </Button>
      </NextLink>
    </footer>
  );
};

export default PostFooter;
