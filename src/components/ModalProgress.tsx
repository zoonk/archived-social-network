import { useContext } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';

interface ModalProgressProps {
  title?: string;
}

/**
 * Display a loading state for a modal component.
 */
const ModalProgress = ({ title }: ModalProgressProps) => {
  const { translate } = useContext(GlobalContext);

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
