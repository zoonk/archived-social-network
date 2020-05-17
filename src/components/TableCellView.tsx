import { TableCell } from '@material-ui/core';

interface TableCellViewProps {
  children: React.ReactNode;
}

/**
 * Custom table cell for the markdown preview.
 */
const TableCellView = ({ children }: TableCellViewProps) => {
  return (
    <TableCell
      align="left"
      padding="default"
      size="medium"
      style={{ fontFamily: "'Raleway', sans-serif" }}
    >
      {children}
    </TableCell>
  );
};

export default TableCellView;
