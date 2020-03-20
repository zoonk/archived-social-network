import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import CategoryTabs from '@zoonk/components/CategoryTabs';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import { analytics, GlobalContext, rootUrl, theme } from '@zoonk/utils';

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
      <HomeBreadcrumb title={translate('questions')} />
      <CategoryTabs active="questions" />
      <div style={{ margin: theme.spacing(1) }} />
      <PostsCard
        category={['questions']}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        title={translate('questions')}
      />
    </Container>
  );
};

export default Questions;
