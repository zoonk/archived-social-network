import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';

interface ItemActionsMenuProps {
  hideEdits?: boolean;
  href?: string;
  isAuthor?: boolean;
  linkAs?: string;
}

/**
 * Menu for displaying some meta user actions (e.g. reporting, editing, etc.).
 * @property `hideEdits` - doesn't display a link to edit history.
 * @property `href` - routing path.
 * @property `isAuthor` - set if the current user created this item.
 * @property `linkAs` - routing `as` property.
 */
const ItemActionsMenu = ({
  hideEdits,
  href,
  isAuthor,
  linkAs,
}: ItemActionsMenuProps) => {
  const { translate } = useContext(GlobalContext);
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
        {(isAuthor || !hideEdits) && (
          <MenuItem button onClick={() => handleClick('edit')}>
            {translate('improve_page')}
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
