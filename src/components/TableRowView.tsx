import { TableRow } from '@material-ui/core';

interface TableRowViewProps {
  children: React.ReactNode;
}

/**
 * Custom table row for the markdown preview.
 */
const TableRowView = ({ children }: TableRowViewProps) => {
  return <TableRow>{children}</TableRow>;
};

export default TableRowView;
