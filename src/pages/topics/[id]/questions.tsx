import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import PostsCard from '@zoonk/components/PostsCard';
import PostShare from '@zoonk/components/PostShare';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';
import { getPageTitle, preRender, rootUrl, theme } from '@zoonk/utils';

interface TopicQuestionsProps {
  topicId: string;
  title: string;
}

const TopicQuestions: NextPage<TopicQuestionsProps> = ({ title, topicId }) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_questions_title', { title })}
        description={translate('seo_topic_questions_desc', { title })}
        canonicalUrl={`${rootUrl}/topics/${topicId}/questions`}
      />
      <TopicsBreadcrumb topicId={topicId} title={translate('questions')} />
      <PostShare
        category="questions"
        title={translate('ask_question')}
        topicId={topicId}
      />
      <div style={{ margin: theme.spacing(1, 0) }} />
      <PostsCard category={['questions']} topicId={topicId} limit={10} />
    </Container>
  );
};

TopicQuestions.getInitialProps = ({ query }) => {
  const topicId = String(query.id);
  const title = getPageTitle(topicId);
  preRender();

  return { title, topicId };
};

export default TopicQuestions;
