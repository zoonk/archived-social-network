import { useContext } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

/**
 * Display a message when there are no saved items.
 */
const SavedNoItems = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Card>
      <CardContent>
        <Typography component="p" variant="body1">
          {translate('saved_no_items')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SavedNoItems;
