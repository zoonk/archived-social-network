import { useContext } from 'react';
import { Button, Typography } from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import { GlobalContext, theme } from '@zoonk/utils';

interface ModalErrorProps {
  msg?: string | null;
  onReturn?: () => void;
}

/**
 * Display an error message for a modal component.
 */
const ModalError = ({ msg, onReturn }: ModalErrorProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: theme.spacing(2),
      }}
    >
      <ErrorOutline fontSize="large" color="error" />
      <Typography
        color="textSecondary"
        style={{ padding: theme.spacing(4, 0) }}
      >
        {msg || translate('error_action')}
      </Typography>

      {onReturn && (
        <Button
          variant="contained"
          color="secondary"
          onClick={onReturn}
          fullWidth
        >
          {translate('go_back')}
        </Button>
      )}
    </div>
  );
};

export default ModalError;
