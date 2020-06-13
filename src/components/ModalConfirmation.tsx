import { Button, Typography } from '@material-ui/core';
import { CheckCircleOutline } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface ModalConfirmationProps {
  msg?: string;
  onReturn?: () => void;
}

const ModalConfirmation = ({ msg, onReturn }: ModalConfirmationProps) => {
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
      <CheckCircleOutline fontSize="large" style={{ color: green[600] }} />
      <Typography
        color="textSecondary"
        style={{ padding: theme.spacing(4, 0) }}
      >
        {msg || translate('done')}
      </Typography>

      {onReturn && (
        <Button
          variant="contained"
          color="primary"
          onClick={onReturn}
          fullWidth
        >
          {translate('go_back')}
        </Button>
      )}
    </div>
  );
};

export default ModalConfirmation;
