import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { deleteComment } from '@zoonk/services';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

interface CommentRemoveProps {
  id: string;
}

const CommentRemove = ({ id }: CommentRemoveProps) => {
  const translate = useTranslation();
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
