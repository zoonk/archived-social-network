import { useContext } from 'react';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';
import LinkHome from './LinkHome';
import LinkTopic from './LinkTopic';
import LinkTopics from './LinkTopics';

interface TopicListBreadcrumbProps {
  children?: React.ReactNode;
  title?: string;
  topicId?: string;
}

/**
 * Breadcrumb for topics.
 */
const TopicsBreadcrumb = ({
  children,
  title,
  topicId,
}: TopicListBreadcrumbProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        <LinkTopics />
        {topicId && <LinkTopic id={topicId} />}
        {children}
        <Typography color="textPrimary">
          {title || translate('see_all')}
        </Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default TopicsBreadcrumb;
