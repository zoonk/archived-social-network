import { CircularProgress, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface ModalProgressProps {
  title?: string;
}

const ModalProgress = ({ title }: ModalProgressProps) => {
  const translate = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: theme.spacing(4),
      }}
    >
      <CircularProgress />
      <div style={{ marginTop: theme.spacing(1) }} />
      <Typography>{title || translate('report_progress')}</Typography>
    </div>
  );
};

export default ModalProgress;
