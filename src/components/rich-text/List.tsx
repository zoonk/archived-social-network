import { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    fontSize: '1.25rem',
    lineHeight: '2rem',
  },
}));

const List = forwardRef<HTMLLIElement>((props, ref) => {
  const { children } = props;
  const classes = useStyles();
  return (
    <li ref={ref} className={classes.root}>
      {children}
    </li>
  );
});

export default List;
