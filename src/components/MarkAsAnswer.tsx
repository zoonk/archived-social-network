import { useContext, useState } from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { CheckCircle, CheckCircleOutline } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import { pinComment, unpinComment } from '@zoonk/services';
import { PostContext } from '@zoonk/utils';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

interface CommentActionsProps {
  commentId: string;
}

const useStyles = makeStyles(() => ({
  pin: { color: green[600] },
}));

const MarkAsAnswer = ({ commentId }: CommentActionsProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const { id, pinnedComment } = useContext(PostContext);
  const [saving, setSaving] = useState<boolean>(false);
  const [pinned, setPinned] = useState<boolean>(pinnedComment === commentId);
  const classes = useStyles();
  const pinnedLabel = pinnedComment
    ? translate('answer_unmark')
    : translate('answer_mark');

  const pin = () => {
    if (!profile || !user) return;

    setSaving(true);
    const fn = pinned
      ? unpinComment(id, profile, user.uid)
      : pinComment(commentId, id, profile, user.uid);

    fn.then(() => {
      setPinned(!pinned);
      setSaving(false);
    });
  };

  return (
    <IconButton
      edge="end"
      aria-label={pinnedLabel}
      onClick={pin}
      className={pinned ? classes.pin : undefined}
      title={pinnedLabel}
      disabled={saving}
    >
      {pinned ? <CheckCircle /> : <CheckCircleOutline />}
    </IconButton>
  );
};

export default MarkAsAnswer;
