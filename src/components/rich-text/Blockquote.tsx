import { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    fontSize: '1.25rem',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2, 4),
    boxShadow: theme.shadows[1],
    border: 0,
  },
}));

const Blockquote = forwardRef<HTMLElement>((props, ref) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <blockquote ref={ref} className={classes.root}>
      {children}
    </blockquote>
  );
});

export default Blockquote;
