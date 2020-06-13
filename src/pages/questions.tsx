import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import useTranslation from '@zoonk/components/useTranslation';
import { rootUrl } from '@zoonk/utils';

const PostsCard = dynamic(() => import('@zoonk/components/PostsCard'), {
  ssr: false,
});

const Questions: NextPage = () => {
  const translate = useTranslation();

  return (
    <Container component="main">
      <Meta
        title={translate('questions')}
        description={translate('seo_questions_desc')}
        canonicalUrl={`${rootUrl}/questions`}
      />
      <SidebarPage category="questions" title={translate('ask_question')}>
        <PostsCard category={['questions']} limit={10} />
      </SidebarPage>
    </Container>
  );
};

export default Questions;
