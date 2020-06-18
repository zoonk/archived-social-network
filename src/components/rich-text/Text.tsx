import { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
    fontSize: '1.25rem',
    lineHeight: '2rem',
  },
}));

const Text = forwardRef<HTMLParagraphElement>((props, ref) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <p ref={ref} className={classes.root}>
      {children}
    </p>
  );
});

export default Text;
