import { useSlate } from 'slate-react';
import { Button, Divider, makeStyles } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import {
  addColumn,
  addRow,
  deleteColumn,
  deleteRow,
  deleteTable,
} from './tables';
import useTranslation from '../useTranslation';

const useStyles = makeStyles((theme) => ({
  root: { margin: theme.spacing(2, 0) },
  actions: { display: 'flex', alignItems: 'center' },
  divider: { margin: theme.spacing(1, 0.5) },
}));

const TableToolbar = () => {
  const translate = useTranslation();
  const editor = useSlate();
  const classes = useStyles();

  return (
    <div className={classes.actions}>
      <Button
        color="primary"
        startIcon={<Add aria-label={translate('add')} />}
        onMouseDown={(e) => {
          e.preventDefault();
          addRow(editor);
        }}
      >
        {translate('row')}
      </Button>
      <Button
        color="primary"
        startIcon={<Add aria-label={translate('add')} />}
        onMouseDown={(e) => {
          e.preventDefault();
          addColumn(editor);
        }}
      >
        {translate('column')}
      </Button>
      <Button
        color="secondary"
        startIcon={<Remove aria-label={translate('delete')} />}
        onMouseDown={(e) => {
          e.preventDefault();
          deleteColumn(editor);
        }}
      >
        {translate('column')}
      </Button>
      <Button
        color="secondary"
        startIcon={<Remove aria-label={translate('delete')} />}
        onMouseDown={(e) => {
          e.preventDefault();
          deleteRow(editor);
        }}
      >
        {translate('row')}
      </Button>

      <Divider flexItem orientation="vertical" className={classes.divider} />

      <Button
        color="secondary"
        startIcon={<Remove aria-label={translate('delete')} />}
        onMouseDown={(e) => {
          e.preventDefault();
          deleteTable(editor);
        }}
      >
        {translate('formatting_table')}
      </Button>
    </div>
  );
};

export default TableToolbar;
