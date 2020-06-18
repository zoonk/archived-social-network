import { forwardRef } from 'react';
import { TableCell } from '@material-ui/core';

const TableCellView = forwardRef((props, ref) => {
  const { children } = props;
  return (
    <TableCell
      ref={ref}
      align="left"
      padding="default"
      size="medium"
      style={{ fontFamily: "'Raleway', sans-serif" }}
    >
      {children}
    </TableCell>
  );
});

export default TableCellView;
