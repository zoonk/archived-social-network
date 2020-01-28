import { useContext } from 'react';
import NextLink from 'next/link';
import { Button } from '@material-ui/core';
import { Notification } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';

interface NotificationViewProps {
  item: Notification.Get;
}

/**
 * View a notification item
 */
const NotificationView = ({ item }: NotificationViewProps) => {
  const { translate } = useContext(GlobalContext);
  const { category, itemPath } = item;

  return (
    <NextLink href={`/${category}/[id]`} as={`/${itemPath}`} passHref>
      <Button component="a" color="primary">
        {translate('view')}
      </Button>
    </NextLink>
  );
};

export default NotificationView;
