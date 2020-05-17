import { makeStyles } from '@material-ui/core';

interface EditorListProps {
  children: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    fontSize: '1.25rem',
    lineHeight: '2rem',
  },
}));

const EditorList = ({ children }: EditorListProps) => {
  const classes = useStyles();
  return <li className={classes.root}>{children}</li>;
};

export default EditorList;
