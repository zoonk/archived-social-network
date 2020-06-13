import { Card, CardContent, Typography } from '@material-ui/core';
import useTranslation from './useTranslation';

const EditNotAllowed = () => {
  const translate = useTranslation();

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
