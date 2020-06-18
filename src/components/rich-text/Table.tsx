import { forwardRef } from 'react';
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: { margin: theme.spacing(2, 0) },
  actions: { display: 'flex', alignItems: 'center' },
}));

const CustomTable = forwardRef((props, ref) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <TableContainer ref={ref} component={Paper} className={classes.root}>
      <Table>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
});

export default CustomTable;
