import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import LinkHome from './LinkHome';

interface HomeBreadcrumbProps {
  title: string;
}

/**
 * Breadcrumb for pages one level below the home page.
 */
const HomeBreadcrumb = ({ title }: HomeBreadcrumbProps) => {
  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        <Typography color="textPrimary">{title}</Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default HomeBreadcrumb;
