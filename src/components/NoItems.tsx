import { Typography } from '@material-ui/core';
import useTranslation from './useTranslation';

const NoItems = () => {
  const translate = useTranslation();
  return (
    <Typography gutterBottom variant="body2" color="textSecondary">
      {translate('items_empty')}
    </Typography>
  );
};

export default NoItems;
