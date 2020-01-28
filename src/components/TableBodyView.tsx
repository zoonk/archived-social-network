import { TableBody } from '@material-ui/core';

interface TableBodyViewProps {
  children: React.ReactNode;
}

/**
 * Custom table body for the markdown preview.
 */
const TableBodyView = ({ children }: TableBodyViewProps) => {
  return <TableBody>{children}</TableBody>;
};

export default TableBodyView;
