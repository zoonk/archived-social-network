import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';

const BackButton = () => {
  const { translate } = useContext(GlobalContext);
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
