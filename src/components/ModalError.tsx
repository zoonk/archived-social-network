import { Button, Typography } from '@material-ui/core';
import { ErrorOutline } from '@material-ui/icons';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface ModalErrorProps {
  msg?: string | null;
  onReturn?: () => void;
}

const ModalError = ({ msg, onReturn }: ModalErrorProps) => {
  const translate = useTranslation();

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
