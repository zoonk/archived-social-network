import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsList from '@zoonk/components/PostsList';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { Post } from '@zoonk/models';
import { getPosts } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

interface ExamplesProps {
  data: Post.Get[];
}

const limit = 10;

export const getStaticProps: GetStaticProps<ExamplesProps> = async () => {
  const data = await getPosts({ category: ['examples'], limit });
  return { props: { data }, revalidate: 1 };
};

const Examples = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('real_life_examples')}
        description={translate('seo_examples_desc')}
        canonicalUrl={`${rootUrl}/examples`}
      />
      <SidebarPage category="examples" title={translate('teach_example_title')}>
        <PostsList category={['examples']} data={data} limit={limit} />
      </SidebarPage>
    </Container>
  );
};

export default Examples;
