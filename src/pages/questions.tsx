import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsList from '@zoonk/components/PostsList';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { Post } from '@zoonk/models';
import { getPosts } from '@zoonk/services';
import { rootUrl } from '@zoonk/utils';

interface QuestionsProps {
  data: Post.Get[];
}

const limit = 10;

export const getStaticProps: GetStaticProps<QuestionsProps> = async () => {
  const data = await getPosts({ category: ['questions'], limit });
  return { props: { data }, revalidate: 1 };
};

const Questions = ({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('questions')}
        description={translate('seo_questions_desc')}
        canonicalUrl={`${rootUrl}/questions`}
      />
      <SidebarPage category="questions" title={translate('ask_question')}>
        <PostsList category={['questions']} data={data} limit={limit} />
      </SidebarPage>
    </Container>
  );
};

export default Questions;
