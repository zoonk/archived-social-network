import { useContext } from 'react';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';
import LinkHome from './LinkHome';
import LinkPaths from './LinkPaths';

interface PathsBreadcrumbProps {
  children?: React.ReactNode;
  title?: string;
}

/**
 * Breadcrumb for learning paths.
 */
const PathsBreadcrumb = ({ children, title }: PathsBreadcrumbProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        <LinkPaths />
        {children}
        <Typography color="textPrimary">
          {title || translate('see_all')}
        </Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default PathsBreadcrumb;
