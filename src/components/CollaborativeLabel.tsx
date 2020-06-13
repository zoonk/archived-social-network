import { Chip } from '@material-ui/core';
import { GroupWork } from '@material-ui/icons';
import useTranslation from './useTranslation';

const CollaborativeLabel = () => {
  const translate = useTranslation();

  return (
    <Chip
      icon={<GroupWork />}
      color="primary"
      variant="outlined"
      label={translate('collaborative')}
      size="small"
    />
  );
};

export default CollaborativeLabel;
