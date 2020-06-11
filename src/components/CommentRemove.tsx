import { Fragment, useContext, useState } from 'react';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { SnackbarAction } from '@zoonk/models';
import { deleteComment } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import Snackbar from './Snackbar';

interface CommentRemoveProps {
  id: string;
}

const CommentRemove = ({ id }: CommentRemoveProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  const remove = () => {
    if (window.confirm(translate('delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });
      deleteComment(id)
        .then(() => setSnackbar({ type: 'success', msg: translate('deleted') }))
        .catch((err) => setSnackbar(firebaseError(err, 'comment_delete')));
    }
  };

  return (
    <Fragment>
      <IconButton onClick={remove}>
        <Delete />
      </IconButton>
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default CommentRemove;
