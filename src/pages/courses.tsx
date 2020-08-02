import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsList from '@zoonk/components/PostsList';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { Post } from '@zoonk/models';
import { getPosts } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

interface CoursesProps {
  data: Post.Get[];
}

const limit = 10;

export const getStaticProps: GetStaticProps<CoursesProps> = async () => {
  const data = await getPosts({ category: ['courses'], limit });
  return { props: { data }, revalidate: 1 };
};

const Courses = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('courses')}
        description={translate('seo_courses_desc')}
        canonicalUrl={`${rootUrl}/courses`}
      />
      <SidebarPage category="courses" title={translate('teach_course_title')}>
        <PostsList data={data} limit={limit} category={['courses']} />
      </SidebarPage>
    </Container>
  );
};

export default Courses;
