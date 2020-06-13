import { ExpansionPanelSummary, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Activity } from '@zoonk/models';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface EditsHeaderProps {
  displayTitle?: boolean;
  item: Activity.Get;
}

const EditsHeader = ({ displayTitle, item }: EditsHeaderProps) => {
  const translate = useTranslation();

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
