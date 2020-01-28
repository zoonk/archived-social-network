import { useContext } from 'react';
import { ExpansionPanelSummary, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Activity } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';

interface EditsHeaderProps {
  displayTitle?: boolean;
  item: Activity.Get;
}

/**
 * Display a header containing the metadata for content changes.
 * E.g. `Mona Lisa: created by Leonardo da Vinci`
 *
 * @property `displayTitle` - `true` if this item's title should be displayed.
 * @property `item` - this item changes returned from the backend.
 */
const EditsHeader = ({ displayTitle, item }: EditsHeaderProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <ExpansionPanelSummary
      expandIcon={<ExpandMore />}
      id={`panel-${item.id}-header`}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>
          <strong>{displayTitle ? `${item.title}: ` : ''}</strong>
          <span style={{ textTransform: 'capitalize' }}>
            {translate(item.action)}
          </span>{' '}
          {translate('by')}{' '}
          <span style={{ color: theme.palette.primary.main }}>
            {item.user.name}
          </span>
        </Typography>

        <Typography color="textSecondary" variant="caption" display="block">
          {item.updatedAt}
        </Typography>
      </div>
    </ExpansionPanelSummary>
  );
};

export default EditsHeader;
