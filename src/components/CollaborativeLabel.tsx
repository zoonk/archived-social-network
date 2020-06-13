import { useContext } from 'react';
import { Chip } from '@material-ui/core';
import { GroupWork } from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';

const CollaborativeLabel = () => {
  const { translate } = useContext(GlobalContext);

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
