import { Paper, Table, TableContainer } from '@material-ui/core';
import { theme } from '@zoonk/utils';

interface TableViewProps {
  children: React.ReactNode;
}

/**
 * Custom table for the markdown preview.
 */
const TableView = ({ children }: TableViewProps) => {
  return (
    <TableContainer component={Paper} style={{ margin: theme.spacing(2, 0) }}>
      <Table>{children}</Table>
    </TableContainer>
  );
};

export default TableView;
