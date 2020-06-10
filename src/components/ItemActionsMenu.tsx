import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { SnackbarAction } from '@zoonk/models';
import { updatePost } from '@zoonk/services';
import { firebaseError, GlobalContext, timestamp } from '@zoonk/utils';
import Snackbar from './Snackbar';
import useAuth from './useAuth';

interface ItemActionsMenuProps {
  groupId?: string | null;
  hideEdits?: boolean;
  href?: string;
  isAuthor?: boolean;
  linkAs?: string;
  postId?: string;
}

const ItemActionsMenu = ({
  groupId,
  hideEdits,
  href,
  isAuthor,
  linkAs,
  postId,
}: ItemActionsMenuProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const { asPath, pathname, push } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  const handleClick = (action: 'edit' | 'edits') => {
    const url = href ? `${href}/${action}` : `${pathname}/${action}`;
    const as = linkAs ? `${linkAs}/${action}` : `${asPath}/${action}`;
    push(url, as);
  };

  const pinPost = () => {
    if (!profile || !user || !groupId || !postId) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    setSnackbar({ type: 'progress', msg: translate('saving') });

    updatePost(
      {
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
        pinned: true,
      },
      postId,
    )
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'pin_post')));
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="item-menu"
        aria-haspopup="true"
        edge="end"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="item-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {groupId && postId && (
          <MenuItem button onClick={pinPost}>
            {translate('post_pin')}
          </MenuItem>
        )}

        {(isAuthor || !hideEdits) && (
          <MenuItem button onClick={() => handleClick('edit')}>
            {translate('edit_page')}
          </MenuItem>
        )}

        {!hideEdits && (
          <MenuItem button onClick={() => handleClick('edits')}>
            {translate('see_all_edits')}
          </MenuItem>
        )}

        <MenuItem
          button
          onClick={() => {
            push(`/contact?action=report&path=${linkAs || asPath}`);
          }}
        >
          {translate('report_issue')}
        </MenuItem>
      </Menu>
      <Snackbar action={snackbar} />
    </div>
  );
};

export default ItemActionsMenu;
