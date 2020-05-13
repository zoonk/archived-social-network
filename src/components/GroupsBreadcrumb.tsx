import { useContext } from 'react';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';
import LinkGroup from './LinkGroup';
import LinkGroups from './LinkGroups';
import LinkHome from './LinkHome';
import LinkTopic from './LinkTopic';

interface GroupsBreadcrumbProps {
  children?: React.ReactNode;
  groupId?: string;
  groupName?: string;
  title?: string;
  topicId?: string;
}

const GroupsBreadcrumb = ({
  children,
  groupId,
  groupName,
  title,
  topicId,
}: GroupsBreadcrumbProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        {topicId && <LinkTopic id={topicId} />}
        <LinkGroups topicId={topicId} />
        {groupId && <LinkGroup id={groupId} title={groupName} />}
        {children}
        <Typography color="textPrimary">
          {title || translate('see_all')}
        </Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default GroupsBreadcrumb;
