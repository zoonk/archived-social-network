import NextLink from 'next/link';
import { Button } from '@material-ui/core';
import { Notification } from '@zoonk/models';
import useTranslation from './useTranslation';

interface NotificationViewProps {
  item: Notification.Get;
}

const NotificationView = ({ item }: NotificationViewProps) => {
  const translate = useTranslation();
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
