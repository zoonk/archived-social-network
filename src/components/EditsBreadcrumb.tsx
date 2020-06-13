import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import LinkEdits from './LinkEdits';
import LinkHome from './LinkHome';
import useTranslation from './useTranslation';

interface EditsBreadcrumbProps {
  title?: string;
}

const EditsBreadcrumb = ({ title }: EditsBreadcrumbProps) => {
  const translate = useTranslation();

  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        <LinkEdits />
        <Typography color="textPrimary">
          {title || translate('page_edits')}
        </Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default EditsBreadcrumb;
