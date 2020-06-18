import { forwardRef } from 'react';
import { TableRow } from '@material-ui/core';

const TableRowView = forwardRef<HTMLTableRowElement>((props, ref) => {
  const { children } = props;
  return <TableRow ref={ref}>{children}</TableRow>;
});

export default TableRowView;
