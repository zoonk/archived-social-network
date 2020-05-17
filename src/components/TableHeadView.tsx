import { TableHead } from '@material-ui/core';

interface TableHeadViewProps {
  children: React.ReactNode;
}

/**
 * Custom table head for the markdown preview.
 */
const TableHeadView = ({ children }: TableHeadViewProps) => {
  return <TableHead style={{ fontWeight: 700 }}>{children}</TableHead>;
};

export default TableHeadView;
