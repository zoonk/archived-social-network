import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import CategoryTabs from '@zoonk/components/CategoryTabs';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import { analytics, GlobalContext, rootUrl, theme } from '@zoonk/utils';

const Courses: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('courses');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('courses_books')}
        description={translate('seo_courses_desc')}
        canonicalUrl={`${rootUrl}/courses`}
      />
      <HomeBreadcrumb title={translate('courses_books')} />
      <CategoryTabs active="courses" />
      <div style={{ margin: theme.spacing(1) }} />
      <PostsCard
        category={['courses']}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        orderBy={['likes']}
        title={translate('courses_books')}
      />
    </Container>
  );
};

export default Courses;
