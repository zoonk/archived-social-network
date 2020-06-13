import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import useTranslation from './useTranslation';

const PinPost = dynamic(() => import('./PinPost'), { ssr: false });

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
  const translate = useTranslation();
  const { asPath, pathname, push } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (action: 'edit' | 'edits') => {
    const url = href ? `${href}/${action}` : `${pathname}/${action}`;
    const as = linkAs ? `${linkAs}/${action}` : `${asPath}/${action}`;
    push(url, as);
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
        {groupId && postId && <PinPost postId={postId} />}

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
    </div>
  );
};

export default ItemActionsMenu;
