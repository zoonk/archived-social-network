import { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { deleteComment } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';
import useSnackbar from './useSnackbar';

interface CommentRemoveProps {
  id: string;
}

const CommentRemove = ({ id }: CommentRemoveProps) => {
  const { translate } = useContext(GlobalContext);
  const { snackbar } = useSnackbar();

  const remove = () => {
    if (window.confirm(translate('delete_confirmation'))) {
      snackbar('progress', translate('deleting'));
      deleteComment(id)
        .then(() => snackbar('success', translate('deleted')))
        .catch((e) => snackbar('error', e.message));
    }
  };

  return (
    <IconButton onClick={remove}>
      <Delete />
    </IconButton>
  );
};

export default CommentRemove;
