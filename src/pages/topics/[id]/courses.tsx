import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import PostsCard from '@zoonk/components/PostsCard';
import PostShare from '@zoonk/components/PostShare';
import Meta from '@zoonk/components/Meta';
import TopicsBreadcrumb from '@zoonk/components/TopicsBreadcrumb';
import {
  analytics,
  getPageTitle,
  GlobalContext,
  preRender,
  rootUrl,
  theme,
} from '@zoonk/utils';

interface TopicCoursesProps {
  topicId: string;
  title: string;
}

const TopicCourses: NextPage<TopicCoursesProps> = ({ title, topicId }) => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('topic_courses');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_topic_courses_title', { title })}
        description={translate('seo_topic_courses_desc', { title })}
        canonicalUrl={`${rootUrl}/topics/${topicId}/courses`}
      />
      <TopicsBreadcrumb topicId={topicId} title={translate('courses')} />
      <PostShare
        category="courses"
        title={translate('teach_course_title')}
        topicId={topicId}
      />
      <div style={{ margin: theme.spacing(1, 0) }} />
      <PostsCard category={['courses']} topicId={topicId} limit={10} />
    </Container>
  );
};

TopicCourses.getInitialProps = ({ query }) => {
  const topicId = String(query.id);
  const title = getPageTitle(topicId);
  preRender();

  return { title, topicId };
};

export default TopicCourses;
