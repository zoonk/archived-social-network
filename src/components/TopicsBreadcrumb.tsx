import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import LinkHome from './LinkHome';
import LinkTopic from './LinkTopic';
import LinkTopics from './LinkTopics';
import useTranslation from './useTranslation';

interface TopicListBreadcrumbProps {
  children?: React.ReactNode;
  title?: string;
  topicId?: string;
}

const TopicsBreadcrumb = ({
  children,
  title,
  topicId,
}: TopicListBreadcrumbProps) => {
  const translate = useTranslation();

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
