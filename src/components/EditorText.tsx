import { makeStyles } from '@material-ui/core';

interface EditorTextProps {
  children: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
    fontSize: '1.25rem',
    lineHeight: '2rem',
  },
}));

const EditorText = ({ children }: EditorTextProps) => {
  const classes = useStyles();
  return <p className={classes.root}>{children}</p>;
};

export default EditorText;
