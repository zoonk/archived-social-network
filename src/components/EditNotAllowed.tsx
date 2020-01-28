import { useContext } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';

/**
 * Display a message when the user does not have permissions to edit something.
 */
const EditNotAllowed = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Card>
      <CardContent>
        <Typography component="p" variant="body1">
          {translate('edit_not_allowed')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EditNotAllowed;
