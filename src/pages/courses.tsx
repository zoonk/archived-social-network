import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const PostsCard = dynamic(() => import('@zoonk/components/PostsCard'), {
  ssr: false,
});

const Courses: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container component="main">
      <Meta
        title={translate('courses')}
        description={translate('seo_courses_desc')}
        canonicalUrl={`${rootUrl}/courses`}
      />
      <SidebarPage category="courses" title={translate('teach_course_title')}>
        <PostsCard category={['courses']} limit={10} />
      </SidebarPage>
    </Container>
  );
};

export default Courses;
