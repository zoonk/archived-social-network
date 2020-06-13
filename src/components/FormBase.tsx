import { useRouter } from 'next/router';
import { Button, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface FormBaseProps {
  children: React.ReactNode;
  saving: boolean;
  valid: boolean;
  onBlur?: () => void;
  onDelete?: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const FormBase = ({
  children,
  valid,
  saving,
  onBlur,
  onDelete,
  onSubmit,
}: FormBaseProps) => {
  const translate = useTranslation();
  const { back } = useRouter();

  return (
    <form
      style={{
        width: '100%',
        margin: theme.spacing(3, 0),
      }}
      noValidate
      onBlur={onBlur}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      {children}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          disabled={!valid || saving}
          type="submit"
          variant="contained"
          color="primary"
          style={{ margin: theme.spacing(3, 0, 0) }}
        >
          {translate('save')}
        </Button>

        <Button
          type="reset"
          color="secondary"
          disabled={saving}
          style={{ margin: theme.spacing(3, 2, 0) }}
          onClick={back}
        >
          {translate('cancel')}
        </Button>

        <div style={{ flexGrow: 1 }} />

        {onDelete && (
          <IconButton
            color="secondary"
            edge="end"
            style={{ margin: theme.spacing(3, 2, 0) }}
            title={translate('delete')}
            aria-label={translate('delete')}
            onClick={onDelete}
          >
            <Delete />
          </IconButton>
        )}
      </div>
    </form>
  );
};

export default FormBase;
