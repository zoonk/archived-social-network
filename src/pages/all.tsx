import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import CategoryTabs from '@zoonk/components/CategoryTabs';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import { analytics, GlobalContext, theme } from '@zoonk/utils';

const Examples: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('all');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('all')} noIndex />
      <HomeBreadcrumb title={translate('all')} />
      <CategoryTabs active="all" />
      <div style={{ margin: theme.spacing(1) }} />
      <PostsCard
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        title={translate('all')}
      />
    </Container>
  );
};

export default Examples;
