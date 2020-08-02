import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsList from '@zoonk/components/PostsList';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { Post } from '@zoonk/models';
import { getPosts } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

interface ReferencesProps {
  data: Post.Get[];
}

const limit = 10;

export const getStaticProps: GetStaticProps<ReferencesProps> = async () => {
  const data = await getPosts({ category: ['references'], limit });
  return { props: { data }, revalidate: 1 };
};

const References = ({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('references_links')}
        description={translate('seo_refs_desc')}
        canonicalUrl={`${rootUrl}/references`}
      />
      <SidebarPage category="references" title={translate('teach_ref_title')}>
        <PostsList category={['references']} data={data} limit={limit} />
      </SidebarPage>
    </Container>
  );
};

export default References;
