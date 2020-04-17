import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import SidebarPage from '@zoonk/components/SidebarPage';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const Questions: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('questions');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('questions')}
        description={translate('seo_questions_desc')}
        canonicalUrl={`${rootUrl}/questions`}
      />
      <SidebarPage category="questions" title={translate('ask_question')}>
        <PostsCard category={['questions']} limit={10} allowLoadMore listOnly />
      </SidebarPage>
    </Container>
  );
};

export default Questions;
