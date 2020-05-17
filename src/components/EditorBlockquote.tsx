import { makeStyles } from '@material-ui/core';

interface EditorBlockquoteProps {
  children: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    margin: 0,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(5),
    boxShadow: theme.shadows[1],
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(10),
      padding: theme.spacing(4),
      boxShadow: theme.shadows[10],
    },
  },
}));

const EditorBlockquote = ({ children }: EditorBlockquoteProps) => {
  const classes = useStyles();
  return <blockquote className={classes.root}>{children}</blockquote>;
};

export default EditorBlockquote;
