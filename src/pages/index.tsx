import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsList from '@zoonk/components/PostsList';
import SidebarPage from '@zoonk/components/SidebarPage';
import TimelineHeader from '@zoonk/components/TimelineHeader';
import useTranslation from '@zoonk/components/useTranslation';
import { Post } from '@zoonk/models';
import { getPosts } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

interface HomeProps {
  posts: Post.Get[];
}

const limit = 10;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = await getPosts({ limit });
  return { props: { posts }, revalidate: 1 };
};

const Home = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('seo_home_title')}
        description={translate('seo_home_desc')}
        canonicalUrl={rootUrl}
        noAppName
      />
      <SidebarPage title={translate('post_share')}>
        <TimelineHeader active="all" />
        <PostsList data={posts} limit={limit} />
      </SidebarPage>
    </Container>
  );
};

export default Home;
