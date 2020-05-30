import { useContext } from 'react';
import { Typography } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

/**
 * Display a message when no items are found for a request.
 */
const NoItems = () => {
  const { translate } = useContext(GlobalContext);
  return (
    <Typography gutterBottom variant="body2" color="textSecondary">
      {translate('items_empty')}
    </Typography>
  );
};

export default NoItems;
