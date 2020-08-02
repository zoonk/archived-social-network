import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsList from '@zoonk/components/PostsList';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { Post } from '@zoonk/models';
import { getPosts } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

interface PostsProps {
  data: Post.Get[];
}

const limit = 10;

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
  const data = await getPosts({ category: ['posts', 'lessons'], limit });
  return { props: { data }, revalidate: 1 };
};

const Posts = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('posts')}
        description={translate('seo_posts_desc')}
        canonicalUrl={`${rootUrl}/posts`}
      />
      <SidebarPage category="posts" title={translate('teach_article_title')}>
        <PostsList data={data} limit={limit} category={['posts', 'lessons']} />
      </SidebarPage>
    </Container>
  );
};

export default Posts;
