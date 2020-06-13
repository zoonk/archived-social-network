import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

const BackButton = () => {
  const translate = useTranslation();
  const { back } = useRouter();

  return (
    <Button
      color="primary"
      onClick={back}
      style={{ margin: theme.spacing(2, 0) }}
    >
      {translate('go_back')}
    </Button>
  );
};

export default BackButton;
