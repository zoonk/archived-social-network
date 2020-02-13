import { Fragment, useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { Help } from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';

/**
 * Tips for formatting your text.
 */
const FormattingTips = () => {
  const { translate } = useContext(GlobalContext);
  const [open, setOpen] = useState<boolean>(false);
  const items = [
    'header',
    'bold',
    'italic',
    'link',
    'image',
    'youtube',
    'vimeo',
    'ul',
    'ol',
    'code_inline',
    'code_multiline',
    'pdf',
    'drive',
  ];

  return (
    <Fragment>
      <IconButton
        aria-label={translate('formatting_tips')}
        onClick={() => setOpen(true)}
      >
        <Help />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Table>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item}>
                  <TableCell>
                    {translate(`formatting_${item}` as any)}
                  </TableCell>
                  <TableCell>
                    {translate(`formatting_${item}_example` as any)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            {translate('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default FormattingTips;
