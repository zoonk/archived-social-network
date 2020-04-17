import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import DiscussionList from '@zoonk/components/DiscussionList';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import { analytics, GlobalContext } from '@zoonk/utils';

const Courses: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('courses');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('comments')} noIndex />
      <SidebarPage title={translate('post_share')}>
        <DiscussionList allowLoadMore />
      </SidebarPage>
    </Container>
  );
};

export default Courses;
