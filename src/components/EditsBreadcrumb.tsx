import { useContext } from 'react';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';
import LinkEdits from './LinkEdits';
import LinkHome from './LinkHome';

interface EditsBreadcrumbProps {
  title?: string;
}

const EditsBreadcrumb = ({ title }: EditsBreadcrumbProps) => {
  const { translate } = useContext(GlobalContext);

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
